import { useEffect, useRef, useState } from "react";

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showResult, setShowResult] = useState(true);

  const openCamera = async () => {
    try {
      setCapturedImage(null);
      setResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraOpen(true);
    } catch (error) {
      console.error("Gagal membuka kamera:", error);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  };

  const takePhotoAndUpload = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);

    closeCamera();

    canvas.toBlob(async (blob) => {
      await uploadToBackend(blob);
    }, "image/png");
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const uploadToBackend = async (blob) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", blob, "photo.png");

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
    setShowResult(true)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 space-y-6">
      <button
        onClick={isCameraOpen ? closeCamera : openCamera}
        className={`${isCameraOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white px-10 py-4 rounded-2xl font-bold transition transform active:scale-95 shadow-lg`}
      >
        {isCameraOpen ? "Tutup Kamera" : "Buka Kamera"}
      </button>

      {isCameraOpen && (
        <button
          onClick={takePhotoAndUpload}
          className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-green-700 transition transform active:scale-95 shadow-lg"
        >
          Ambil Foto & Analisis
        </button>
      )}

      {loading && <p>Analyzing...</p>}

      {capturedImage ? (
        <img
          src={capturedImage}
          alt="Captured"
          className="w-full max-w-md rounded-xl shadow-lg"
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full max-w-lg ${isCameraOpen ? `rounded-xl shadow-lg` : `shadow-none`}`}
        />
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {result?.success && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Hasil Identifikasi Sampah</h2>

            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {result.result.source}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500 font-medium">Nama Objek</h3>
              <p className="text-lg font-semibold">{result.result.nama}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 font-medium">Kategori</h3>
              <p className="text-lg">{result.result.kategori}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 font-medium">Deskripsi</h3>
              <p className="text-gray-700 leading-relaxed">
                {result.result.deskripsi}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraPage;