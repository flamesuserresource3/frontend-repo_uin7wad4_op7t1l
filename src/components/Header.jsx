import React from 'react';
import { QrCode, Camera } from 'lucide-react';

export default function Header({ sheetsEnabled }) {
  return (
    <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Student QR Attendance</h1>
            <p className="text-xs text-gray-500">Scan to record attendance instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full border ${sheetsEnabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            <Camera className="w-3.5 h-3.5" />
            {sheetsEnabled ? 'Google Sheets Connected' : 'Sheets Not Configured'}
          </span>
        </div>
      </div>
    </header>
  );
}
