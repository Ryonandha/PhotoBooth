"use client"; // Wajib untuk mengakses fitur browser seperti state dan kamera

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

// Kita menerima data frame yang dilempar dari halaman server
export default function WebcamCapture({ frame }: { frame: any }) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  // Fungsi untuk mengambil jepretan kamera
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {!imgSrc ? (
        <>
          <div className="relative w-full overflow-hidden rounded-xl shadow-xl bg-black border-4 border-white">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }} // Gunakan kamera depan
              className="w-full h-auto"
            />
            {/* Nanti di sini kita akan meletakkan Frame PNG menumpuk di atas kamera */}
          </div>
          <button 
            onClick={capture} 
            className="bg-black text-white px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-800 transition shadow-lg"
          >
            Ambil Foto 📸
          </button>
        </>
      ) : (
        <>
          <div className="relative w-full rounded-xl shadow-xl overflow-hidden border-4 border-white">
            <img src={imgSrc} alt="Hasil Jepretan" className="w-full h-auto" />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setImgSrc(null)} 
              className="bg-gray-200 text-black px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition"
            >
              Ulangi 🔄
            </button>
            <button 
              className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition shadow-md"
            >
              Lanjut Bayar 💳
            </button>
          </div>
        </>
      )}
    </div>
  );
}