import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDatabase,
  Database,
  ref as rtdbRef,
  get as rtdbGet,
  set as rtdbSet,
  onValue as rtdbOnValue,
} from "firebase/database";
import { SiteContent } from "@/data/defaultSiteContent";
import { mergeWithDefault } from "@/context/ContentContext";

// Firebase Client & Server Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Memeriksa apakah kredensial Firebase sudah terkonfigurasi di environment variables
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL)
  );
}

// Inisialisasi Firebase singleton yang aman di client maupun server
let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let realtimeDb: Database | null = null;

if (typeof window !== "undefined" || isFirebaseConfigured()) {
  try {
    if (isFirebaseConfigured()) {
      firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      
      // Inisialisasi Realtime Database jika databaseURL ada
      if (firebaseConfig.databaseURL) {
        try {
          realtimeDb = getDatabase(firebaseApp, firebaseConfig.databaseURL);
        } catch (rtdbInitErr) {
          console.warn("[Firebase] RTDB init notice:", rtdbInitErr);
        }
      }

      // Inisialisasi Firestore Database
      try {
        firestoreDb = getFirestore(firebaseApp);
      } catch (fsInitErr) {
        console.warn("[Firebase] Firestore init notice:", fsInitErr);
      }
    }
  } catch (err) {
    console.warn("[Firebase] Inisialisasi Firebase dilewati:", err);
  }
}

export { firebaseApp, firestoreDb, realtimeDb };

const CONTENT_COLLECTION = "site_settings";
const CONTENT_DOC = "main";
const RTDB_CONTENT_PATH = "siteContent/main";

/**
 * Mengambil konten website dari Firebase (Realtime Database atau Firestore)
 */
export async function getFirebaseContent(): Promise<SiteContent | null> {
  // 1. Coba Realtime Database terlebih dahulu jika aktif
  if (realtimeDb) {
    try {
      const snap = await rtdbGet(rtdbRef(realtimeDb, RTDB_CONTENT_PATH));
      if (snap.exists()) {
        const val = snap.val();
        if (val && val.content) {
          return mergeWithDefault(val.content);
        } else if (val && val.brand) {
          return mergeWithDefault(val);
        }
      }
    } catch (rtdbErr: any) {
      console.warn("[Firebase] RTDB fetch notice (trying Firestore):", rtdbErr.message);
    }
  }

  // 2. Coba Firestore
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, CONTENT_COLLECTION, CONTENT_DOC);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.content) {
          return mergeWithDefault(data.content);
        } else if (data && data.brand) {
          return mergeWithDefault(data as any);
        }
      }
    } catch (fsErr: any) {
      console.warn("[Firebase] Firestore fetch notice:", fsErr.message);
    }
  }

  return null;
}

/**
 * Menyimpan konten website ke Firebase (Realtime Database & Firestore)
 */
export async function saveFirebaseContent(content: SiteContent): Promise<boolean> {
  let savedAny = false;

  // 1. Simpan ke Realtime Database
  if (realtimeDb) {
    try {
      await rtdbSet(rtdbRef(realtimeDb, RTDB_CONTENT_PATH), {
        content,
        updatedAt: Date.now(),
        lastSync: new Date().toISOString(),
      });
      savedAny = true;
    } catch (rtdbErr: any) {
      console.warn("[Firebase] RTDB save warning:", rtdbErr.message);
    }
  }

  // 2. Simpan ke Firestore
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, CONTENT_COLLECTION, CONTENT_DOC);
      await setDoc(
        docRef,
        {
          content,
          updatedAt: serverTimestamp(),
          lastSync: new Date().toISOString(),
        },
        { merge: true }
      );
      savedAny = true;
    } catch (fsErr: any) {
      console.warn("[Firebase] Firestore save warning:", fsErr.message);
    }
  }

  return savedAny;
}

/**
 * Berlangganan (realtime listener) ke dokumen konten di Firebase
 * Ketika data diubah di admin (lewat HP / PC), semua layar yang terbuka
 * akan langsung terupdate otomatis secara real-time tanpa refresh!
 */
export function subscribeToFirebaseContent(
  onUpdate: (content: SiteContent) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const unsubscribers: (() => void)[] = [];

  // 1. Subscribe Realtime Database jika ada
  if (realtimeDb) {
    try {
      const unsubRtdb = rtdbOnValue(
        rtdbRef(realtimeDb, RTDB_CONTENT_PATH),
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val && val.content) {
              onUpdate(mergeWithDefault(val.content));
            } else if (val && val.brand) {
              onUpdate(mergeWithDefault(val));
            }
          }
        },
        (error) => {
          console.warn("[Firebase] RTDB listener notice:", error.message);
        }
      );
      unsubscribers.push(unsubRtdb);
    } catch (rtdbSubErr) {
      console.warn("[Firebase] RTDB subscribe error:", rtdbSubErr);
    }
  }

  // 2. Subscribe Firestore
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, CONTENT_COLLECTION, CONTENT_DOC);
      const unsubFirestore = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data && data.content) {
              onUpdate(mergeWithDefault(data.content));
            } else if (data && data.brand) {
              onUpdate(mergeWithDefault(data as any));
            }
          }
        },
        (error) => {
          console.warn("[Firebase] Firestore listener notice:", error.message);
        }
      );
      unsubscribers.push(unsubFirestore);
    } catch (fsSubErr) {
      console.warn("[Firebase] Firestore subscribe error:", fsSubErr);
    }
  }

  return () => {
    unsubscribers.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  };
}
