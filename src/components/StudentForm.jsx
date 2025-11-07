import React, { useState } from 'react';

export default function StudentForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', nisn: '', major: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setForm({ name: '', nisn: '', major: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Full name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="nisn"
          value={form.nisn}
          onChange={handleChange}
          required
          placeholder="NISN"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="major"
          value={form.major}
          onChange={handleChange}
          required
          placeholder="Major / Department"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Save Attendance'}
      </button>
    </form>
  );
}
