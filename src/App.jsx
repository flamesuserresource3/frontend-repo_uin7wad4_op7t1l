import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import QrScanner from './components/QrScanner';
import StudentForm from './components/StudentForm';
import AttendanceTable from './components/AttendanceTable';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function App() {
  const [records, setRecords] = useState([]);
  const [sheetsEnabled, setSheetsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadConfig = async () => {
    try {
      const r = await fetch(`${API_BASE}/config`);
      const j = await r.json();
      setSheetsEnabled(Boolean(j.sheets_webhook));
    } catch {}
  };

  const loadRecords = async () => {
    try {
      const r = await fetch(`${API_BASE}/attendance`);
      const j = await r.json();
      setRecords(j || []);
    } catch {
      setRecords([]);
    }
  };

  useEffect(() => {
    loadConfig();
    loadRecords();
  }, []);

  const submitAttendance = async ({ name, nisn, major }) => {
    setLoading(true);
    setError('');
    try {
      const r = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nisn, major, source: 'qr' }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error('Failed to save');
      await loadRecords();
      return j;
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (data) => {
    if (data && data.name && data.nisn && data.major) {
      await submitAttendance(data);
    } else {
      setError('Invalid QR content. It must include name, nisn, and major.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <Header sheetsEnabled={sheetsEnabled} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-white shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Scan QR</h2>
            <p className="text-sm text-gray-500 mb-4">Use your device camera or paste QR content manually.</p>
            <QrScanner onScan={handleScan} />
          </div>

          <div className="p-6 rounded-xl border bg-white shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Manual Entry</h2>
            <p className="text-sm text-gray-500 mb-4">Fill in the fields to record without a QR code.</p>
            <StudentForm onSubmit={submitAttendance} />
            {loading && <div className="mt-3 text-sm text-gray-600">Saving…</div>}
            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          </div>
        </section>

        <section className="p-6 rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent Attendance</h2>
              <p className="text-sm text-gray-500">Newest entries appear first</p>
            </div>
            <button onClick={loadRecords} className="text-sm px-3 py-1.5 rounded-md border">Refresh</button>
          </div>
          <AttendanceTable items={records} />
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">QR Attendance • Powered by FastAPI & Google Sheets</footer>
    </div>
  );
}
