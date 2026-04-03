'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useState, useEffect } from 'react';

interface Course {
  id: number;
  kode: string;
  nama: string;
  sks: number;
  dosen_id: number;
  createdAt: string;
}

export function DosenDashboard() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    sks: 3,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('auth_token');
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch('/api/courses', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await fetch('/api/courses/[id]', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ kode: '', nama: '', sks: 3 });
        setShowForm(false);
        fetchCourses();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to add course');
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const token = getAuthToken();
      const response = await fetch('/api/courses/[id]', {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingId,
          ...formData,
        }),
      });

      if (response.ok) {
        setFormData({ kode: '', nama: '', sks: 3 });
        setEditingId(null);
        setShowForm(false);
        fetchCourses();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to update course');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      kode: course.kode,
      nama: course.nama,
      sks: course.sks,
    });
    setShowForm(true);
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch('/api/courses/[id]', {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: courseId }),
      });

      if (response.ok) {
        fetchCourses();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ kode: '', nama: '', sks: 3 });
  };

  const myCourses = courses.filter((course) => course.dosen_id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-white border-b-4 border-yellow-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-yellow-700">Manajemen Mata Kuliah</h1>
            <p className="text-gray-700 font-semibold mt-1">Selamat datang, <span className="text-yellow-700 font-black">{user?.nama}</span>!</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Course Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-black py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mb-8 uppercase tracking-wider"
          >
            Tambah Mata Kuliah Baru
          </button>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-4 border-yellow-300">
            <h2 className="text-2xl font-black text-yellow-700 mb-6">
              {editingId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
            </h2>
            <form onSubmit={editingId ? handleUpdateCourse : handleAddCourse} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                    Kode Mata Kuliah
                  </label>
                  <input
                    type="text"
                    value={formData.kode}
                    onChange={(e) =>
                      setFormData({ ...formData, kode: e.target.value })
                    }
                    placeholder="TIF101"
                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-medium placeholder-gray-500 bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                    Nama Mata Kuliah
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    placeholder="Algoritma dan Struktur Data"
                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-medium placeholder-gray-500 bg-white transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                  SKS (Satuan Kredit Semester)
                </label>
                <select
                  value={formData.sks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sks: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-medium bg-white transition-all duration-200"
                >
                  {[1, 2, 3, 4, 5, 6].map((sks) => (
                    <option key={sks} value={sks}>
                      {sks} SKS
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-black py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 uppercase tracking-wider"
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-black py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wider"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-300">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-white px-8 py-6 border-b-4 border-yellow-400">
            <h2 className="text-2xl font-black text-yellow-700">
              Mata Kuliah Saya ({myCourses.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin text-4xl">...</div>
              <p className="text-gray-600 font-semibold mt-3">Loading data...</p>
            </div>
          ) : myCourses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4 font-black text-yellow-400">-</div>
              <p className="text-gray-600 font-semibold">Belum ada mata kuliah. Silakan buat yang baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-yellow-200 to-yellow-100 border-b-2 border-yellow-400">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-black text-yellow-800 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-yellow-800 uppercase tracking-wider">
                      Nama Mata Kuliah
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-yellow-800 uppercase tracking-wider">
                      SKS
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-yellow-800 uppercase tracking-wider">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-yellow-800 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myCourses.map((course, index) => (
                    <tr
                      key={course.id}
                      className={`border-b-2 border-yellow-100 hover:bg-yellow-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-black text-yellow-700">
                        {course.kode}
                      </td>
                      <td className="px-6 py-4 text-black font-semibold">{course.nama}</td>
                      <td className="px-6 py-4 text-black font-bold text-center">
                        <span className="bg-yellow-200 px-3 py-1 rounded-full font-black text-yellow-700">
                          {course.sks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium text-sm">
                        {new Date(course.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-black transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-black transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
