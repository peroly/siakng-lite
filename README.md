# SIAKNG Lite - Project Overview

## Technology Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Next.js API Routes
- Node.js Runtime
- Basic Authentication
- Prisma ORM

**Database:**
- PostgreSQL
- Prisma Client

## Database Setup

Sebelum menjalankan aplikasi, Anda perlu setup database PostgreSQL terlebih dahulu:

### Prasyarat
- PostgreSQL 12+ sudah terinstall dan berjalan
- Akses ke database dengan username dan password

### Langkah Setup

1. **Buat database baru** (opsional, atau gunakan default):
```bash
createdb siakng_lite
```

2. **Konfigurasi environment variable** di `.env.local`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/siakng_lite"
```
Ganti `username` dan `password` dengan kredensial PostgreSQL Anda.

3. **Generate Prisma Client**:
```bash
npx prisma generate
```

4. **Jalankan migrations** untuk membuat schema database:
```bash
npx prisma migrate deploy
```

5. **Populate database dengan test data** (opsional):
```bash
npm run prisma:seed
```

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Setup database (lihat Database Setup di atas)

# 3. Run development server
npm run dev

# 4. Open browser
http://localhost:3000
```

### 1. **Halaman Login** (`/login`)
- Form login sederhana dengan username dan password
- Validasi credentials melalui API backend
- Menyimpan token auth di localStorage

### 2. **Dashboard Dosen** (`/dashboard`)
- Menampilkan daftar mata kuliah yang dibuat
- Fitur CRUD mata kuliah:
  - **Create**: Tambah mata kuliah baru
  - **Read**: Lihat daftar mata kuliah
  - **Update**: Edit informasi mata kuliah
  - **Delete**: Hapus mata kuliah
- Tampilan tabel dengan aksi edit/hapus untuk setiap mata kuliah

### 3. **Dashboard Mahasiswa** (`/dashboard`)
- Menampilkan daftar semua mata kuliah (read-only)
- Filter mata kuliah berdasarkan jumlah SKS
- Tampilan kartu (card) yang menarik untuk setiap mata kuliah
- Statistik: Total mata kuliah, Total SKS, Jumlah Dosen Aktif


