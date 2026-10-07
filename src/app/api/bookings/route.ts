import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, whatsapp, businessName, service, budget, notes } = body;

    if (!name || !whatsapp) {
      return NextResponse.json(
        { success: false, error: "Nama dan nomor WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    let bookingId = `book_${Date.now()}`;

    if (process.env.DATABASE_URL) {
      const created = await prisma.booking.create({
        data: {
          name,
          whatsapp,
          businessName: businessName || null,
          service: service || "Konsultasi Umum",
          budget: budget || null,
          notes: notes || null,
          status: "PENDING",
        },
      });
      bookingId = created.id;
    }

    return NextResponse.json({
      success: true,
      message: "Pengajuan konsultasi berhasil direkam ke database!",
      bookingId,
    });
  } catch (err: any) {
    console.error("Booking POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal menyimpan booking" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    if (process.env.DATABASE_URL) {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status");

      const bookings = await prisma.booking.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return NextResponse.json({
        success: true,
        data: bookings,
      });
    }

    // Fallback data jika DB belum connect
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (err: any) {
    console.warn("Booking GET error:", err.message);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}
