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
import { SiteContent } from "@/data/defaultSiteContent";
import { mergeWithDefault } from "@/context/ContentContext";

// Firebase Client & Server Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
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
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

// Inisialisasi Firebase singleton yang aman di client maupun server
let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

if (typeof window !== "undefined" || isFirebaseConfigured()) {
  try {
    if (isFirebaseConfigured()) {
      firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      firestoreDb = getFirestore(firebaseApp);
    }
  } catch (err) {
    console.warn("[Firebase] Inisialisasi Firebase dilewati:", err);
  }
}

export { firebaseApp, firestoreDb };

const CONTENT_COLLECTION = "site_settings";
const CONTENT_DOC = "main";

/**
 * Mengambil konten website dari Firebase Firestore
 */
export async function getFirebaseContent(): Promise<SiteContent | null> {
  if (!firestoreDb) return null;
  try {
    const docRef = doc(firestoreDb, CONTENT_COLLECTION, CONTENT_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.content) {
        return mergeWithDefault(data.content);
      }
    }
  } catch (err) {
    console.warn("[Firebase] Gagal mengambil konten Firestore:", err);
  }
  return null;
}

/**
 * Menyimpan konten website ke Firebase Firestore
 */
export async function saveFirebaseContent(content: SiteContent): Promise<boolean> {
  if (!firestoreDb) return false;
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
    return true;
  } catch (err) {
    console.error("[Firebase] Gagal menyimpan konten ke Firestore:", err);
    throw err;
  }
}

/**
 * Berlangganan (realtime listener) ke dokumen konten di Firestore
 * Ketika data diubah di admin (lewat HP / PC), semua layar yang terbuka
 * akan langsung terupdate otomatis secara real-time tanpa refresh!
 */
export function subscribeToFirebaseContent(
  onUpdate: (content: SiteContent) => void
): () => void {
  if (!firestoreDb || typeof window === "undefined") {
    return () => {};
  }

  try {
    const docRef = doc(firestoreDb, CONTENT_COLLECTION, CONTENT_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.content) {
            onUpdate(mergeWithDefault(data.content));
          }
        }
      },
      (error) => {
        console.warn("[Firebase] Firestore realtime listener warning:", error.message);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("[Firebase] Subscribe gagal:", err);
    return () => {};
  }
}
