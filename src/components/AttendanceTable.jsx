import React from 'react';

export default function AttendanceTable({ items }) {
  return (
    <div className="overflow-hidden border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">NISN</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Major</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Scanned At</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">No records yet</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id || item.scanned_at}>
                <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{item.nisn}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{item.major}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{new Date(item.scanned_at).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{item.source || 'qr'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
