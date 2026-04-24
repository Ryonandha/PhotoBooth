"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture({ frame }: { frame: any }) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // State untuk tombol loading

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setIsProcessing(true); 

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imgWebcam = new Image();
    imgWebcam.src = imageSrc;
    imgWebcam.onload = () => {
      canvas.width = imgWebcam.width;
      canvas.height = imgWebcam.height;
      ctx?.drawImage(imgWebcam, 0, 0, canvas.width, canvas.height);

      const imgFrame = new Image();
      
      // Jika URL frame dari internet (http/https), pakai anonymous. 
      // Jika dari folder public lokal (/...), tidak perlu anonymous.
      if (frame.imageUrl.startsWith("http")) {
        imgFrame.crossOrigin = "anonymous"; 
      }
      
      imgFrame.src = frame.imageUrl;

      // Jika berhasil dimuat
      imgFrame.onload = () => {
        ctx?.drawImage(imgFrame, 0, 0, canvas.width, canvas.height);
        const finalImage = canvas.toDataURL("image/jpeg", 0.9);
        setImgSrc(finalImage);
        setIsProcessing(false);
      };

      // JIKA GAGAL dimuat (Mencegah tombol stuck "Memproses...")
      imgFrame.onerror = () => {
        console.error("Gagal memuat gambar frame!");
        alert("Terjadi kesalahan memuat frame. Cek URL gambar di database.");
        setIsProcessing(false); // Kembalikan tombol ke semula
      };
    };
  }, [webcamRef, frame.imageUrl]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {!imgSrc ? (
        <>
          {/* Layar Kamera Saat Berpose */}
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-xl bg-black border-4 border-white">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Overlay: Menampilkan Frame setengah transparan sebagai panduan berpose */}
            <img
              src={frame.imageUrl}
              alt="Frame Overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10 opacity-70"
            />
          </div>
          
          <button 
            onClick={capture} 
            disabled={isProcessing}
            className="bg-black text-white px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-800 transition shadow-lg disabled:bg-gray-400"
          >
            {isProcessing ? "Memproses... ⏳" : "Ambil Foto 📸"}
          </button>
        </>
      ) : (
        <>
          {/* Layar Hasil Akhir (Sudah Digabung) */}
          <div className="relative w-full aspect-[3/4] rounded-xl shadow-xl overflow-hidden border-4 border-white">
            <img src={imgSrc} alt="Hasil Final" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setImgSrc(null)} 
              className="bg-gray-200 text-black px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition shadow-sm"
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