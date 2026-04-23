import prisma from "@/lib/prisma";
import Image from "next/image";

// Ini adalah Server Component. Next.js akan mengambil data langsung dari database
export default async function Home() {
  // Mengambil semua data frame dari tabel Frame
  const frames = await prisma.frame.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Online Photobooth
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Pilih desain frame favoritmu dan abadikan momen sekarang!
        </p>

        {/* Grid untuk menampilkan daftar frame */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {frames.map((frame) => (
            <div 
              key={frame.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-80 bg-gray-200">
                {/* Kita gunakan tag img biasa dulu untuk kemudahan menggunakan external URL */}
                <img 
                  src={frame.imageUrl} 
                  alt={frame.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800">{frame.name}</h2>
                <p className="text-red-500 font-bold mt-2">
                  Rp {frame.price.toLocaleString('id-ID')}
                </p>
                <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Pilih Frame Ini
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}