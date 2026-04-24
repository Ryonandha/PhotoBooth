import prisma from "@/lib/prisma";
import WebcamCapture from "@/components/WebcamCapture";
import { notFound } from "next/navigation";

// Karena ini rute dinamis, kita harus menangkap params (frameId) dari URL
export default async function SessionPage(props: { params: Promise<{ frameId: string }> }) {
  // Tunggu params tersedia (Standar baru Next.js 15+)
  const params = await props.params;
  const frameId = params.frameId;

  // Cari data frame di database berdasarkan ID dari URL
  const frame = await prisma.frame.findUnique({
    where: { id: frameId }
  });

  // Jika user mengarang URL dan frame tidak ada, lempar ke halaman 404
  if (!frame) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mulai Berpose!</h1>
        <p className="text-gray-500">Desain: {frame.name}</p>
      </div>
      
      {/* Panggil komponen kamera client-side yang kita buat tadi */}
      <WebcamCapture frame={frame} />
    </main>
  );
}