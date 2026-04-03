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

interface Dosen {
  id: number;
  nama: string;
}

const DOSENS: Dosen[] = [
  { id: 1, nama: 'Dr. Ahmad Susanto' },
  { id: 2, nama: 'Prof. Budi Hartanto' },
];

export function MahasiswaDashboard() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const getDosenName = (dosenId: number) => {
    return DOSENS.find((d) => d.id === dosenId)?.nama || 'Unknown';
  };

  const filteredCourses =
    filter === 'all'
      ? courses
      : courses.filter((c) => c.sks === parseInt(filter));

  const totalSKS = filteredCourses.reduce((sum, course) => sum + course.sks, 0);
  const uniqueDosens = new Set(filteredCourses.map((c) => c.dosen_id)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-white border-b-4 border-yellow-500 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-yellow-700">Daftar Mata Kuliah</h1>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-4 border-yellow-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Total Mata Kuliah</p>
                <p className="text-4xl font-black text-yellow-700 mt-2">{filteredCourses.length}</p>
              </div>
              <div className="text-6xl font-black text-yellow-400">K</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-4 border-yellow-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Total SKS</p>
                <p className="text-4xl font-black text-yellow-700 mt-2">{totalSKS}</p>
              </div>
              <div className="text-6xl font-black text-yellow-400">S</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-4 border-yellow-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Jumlah Dosen</p>
                <p className="text-4xl font-black text-yellow-700 mt-2">{uniqueDosens}</p>
              </div>
              <div className="text-6xl font-black text-yellow-400">D</div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-yellow-700 mb-4">Filter Mata Kuliah</h2>
          <div className="bg-white rounded-2xl shadow-lg border-4 border-yellow-300 p-6">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-3 rounded-xl font-black uppercase tracking-wider transition-all duration-200 transform hover:scale-105 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                    : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                Semua
              </button>
              {[1, 2, 3, 4, 5, 6].map((sks) => (
                <button
                  key={sks}
                  onClick={() => setFilter(sks.toString())}
                  className={`px-5 py-3 rounded-xl font-black uppercase tracking-wider transition-all duration-200 transform hover:scale-105 ${
                    filter === sks.toString()
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                      : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  {sks} SKS
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block text-6xl animate-bounce mb-4">...</div>
            <p className="text-gray-600 font-semibold text-lg">Loading mata kuliah...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-4 border-yellow-300 p-12 text-center">
            <div className="text-6xl mb-4 font-black text-yellow-400">-</div>
            <p className="text-gray-600 text-lg font-semibold">
              {filter === 'all'
                ? 'Belum ada mata kuliah tersedia'
                : `Belum ada mata kuliah dengan ${filter} SKS`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden border-4 border-yellow-300 transform hover:scale-105 hover:border-yellow-500"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 px-6 py-5 border-b-4 border-yellow-400">
                  <h3 className="text-yellow-900 font-black text-2xl tracking-wider">
                    {course.kode}
                  </h3>
                  <div className="mt-2 inline-block bg-yellow-600 px-3 py-1 rounded-full">
                    <p className="text-white font-black text-sm">{course.sks} SKS</p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-6 py-5">
                  <h4 className="text-lg font-black text-black mb-4">
                    {course.nama}
                  </h4>

                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <span className="text-xl font-black">D</span>
                      <div className="text-black">
                        <p className="font-bold">Dosen</p>
                        <p className="text-gray-700">{getDosenName(course.dosen_id)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <span className="text-xl font-black">T</span>
                      <div className="text-black">
                        <p className="font-bold">Tersedia sejak</p>
                        <p className="text-gray-700">
                          {new Date(course.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-3 rounded-xl transition-all duration-200 font-black shadow-md hover:shadow-lg transform hover:scale-105 uppercase tracking-wider">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
