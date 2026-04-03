'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect jika sudah login
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card dengan border dan shadow modern */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-yellow-400">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-3 mb-4">
              <h1 className="text-4xl font-black text-white">𝒮</h1>
            </div>
            <h1 className="text-4xl font-black text-yellow-600">SIAKNG Lite</h1>
            <p className="text-gray-600 text-sm mt-2 font-semibold">
              Sistem Simulasi Akademik Sederhana
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                📧 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-medium placeholder-gray-500 bg-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                🔐 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-medium placeholder-gray-500 bg-white transition-all duration-200"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl font-semibold">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-black py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 uppercase tracking-wider"
            >
              {loading ? '⏳ Logging in...' : '✨ Login'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-yellow-300">
            <p className="text-xs text-gray-700 text-center mb-4 font-black uppercase tracking-widest">
              🎓 Demo Credentials
            </p>
            <div className="space-y-3 text-xs text-gray-700 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-500">
                <p className="font-black text-yellow-700 mb-1">👨‍🏫 DOSEN</p>
                <p className="font-mono text-black"><span className="font-bold">username:</span> dosen1</p>
                <p className="font-mono text-black"><span className="font-bold">password:</span> password123</p>
              </div>
              <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-500">
                <p className="font-black text-yellow-700 mb-1">👨‍🎓 MAHASISWA</p>
                <p className="font-mono text-black"><span className="font-bold">username:</span> mahasiswa1</p>
                <p className="font-mono text-black"><span className="font-bold">password:</span> password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
