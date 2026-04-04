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

Untuk database, setelah saya cek lagi, ternyata prisma dan postgre di kode ini bermasalah. Sehingga data dosen, mahasiswa, dan matkul saya letakkan di file ini dengan format JSON. 

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


---

**Version**: 1.0.0  
**Status**: Complete (FE-001 + BE-001 + Database Migration)


