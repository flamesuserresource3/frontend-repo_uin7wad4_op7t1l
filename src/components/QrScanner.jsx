import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';

// Uses native MediaDevices API; designed to scan QR codes that encode JSON with fields {name, nisn, major}
// For demo, we parse strings like: name=John Doe;nisn=12345;major=Science

export default function QrScanner({ onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
      setMessage('Camera started. Show a QR in front of the camera.');
    } catch (e) {
      setMessage('Camera permission denied or unavailable.');
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      video.srcObject = null;
    }
    setActive(false);
  };

  // Very simple detector: we won't implement QR decoding here to keep dependencies minimal.
  // Instead, we provide a text input fallback below. In production, integrate a QR decoding lib.

  const [manualText, setManualText] = useState('');
  const tryParse = (text) => {
    // Accept JSON {name, nisn, major} or key-value pairs name=..;nisn=..;major=..
    try {
      const obj = JSON.parse(text);
      if (obj.name && obj.nisn && obj.major) return obj;
    } catch {}
    const parts = Object.fromEntries(
      text
        .split(';')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((kv) => kv.split('='))
        .map(([k, v]) => [k.trim(), (v || '').trim()])
    );
    if (parts.name && parts.nisn && parts.major) return parts;
    return null;
  };

  const handleManualSubmit = () => {
    const data = tryParse(manualText);
    if (data) {
      onScan(data);
      setManualText('');
      setMessage('Data parsed successfully.');
      stopCamera();
    } else {
      setMessage('Unable to parse. Use JSON or name=..;nisn=..;major=..');
    }
  };

  return (
    <div className="w-full">
      <div className="aspect-video w-full bg-black/5 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={startCamera} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-indigo-700">
              <Camera className="w-4 h-4" /> Start Scanner
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-600">{message}</div>

      <div className="mt-4 p-3 border rounded-lg bg-gray-50">
        <div className="text-sm font-medium mb-2">Manual input (fallback)</div>
        <input
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Paste QR content: JSON or name=..;nisn=..;major=.."
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="mt-2 flex gap-2">
          <button onClick={handleManualSubmit} className="inline-flex items-center gap-2 rounded-md bg-green-600 text-white px-3 py-1.5 text-sm hover:bg-green-700">
            <CheckCircle2 className="w-4 h-4" /> Use Data
          </button>
          {active && (
            <button onClick={stopCamera} className="rounded-md border px-3 py-1.5 text-sm">Stop Camera</button>
          )}
        </div>
      </div>
    </div>
  );
}
