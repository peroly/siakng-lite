const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Buat users
  const dosen1 = await prisma.user.create({
    data: {
      username: 'dosen1',
      password: 'password123',
      role: 'dosen',
      nama: 'Dr. Ahmad Susanto',
    },
  });

  const dosen2 = await prisma.user.create({
    data: {
      username: 'dosen2',
      password: 'password123',
      role: 'dosen',
      nama: 'Prof. Budi Hartanto',
    },
  });

  const mahasiswa1 = await prisma.user.create({
    data: {
      username: 'mahasiswa1',
      password: 'password123',
      role: 'mahasiswa',
      nama: 'Budi Pratama',
    },
  });

  const mahasiswa2 = await prisma.user.create({
    data: {
      username: 'mahasiswa2',
      password: 'password123',
      role: 'mahasiswa',
      nama: 'Siti Nurhaliza',
    },
  });

  // Buat courses
  await prisma.course.create({
    data: {
      kode: 'TIF101',
      nama: 'Algoritma dan Struktur Data',
      sks: 3,
      dosen_id: dosen1.id,
    },
  });

  await prisma.course.create({
    data: {
      kode: 'TIF102',
      nama: 'Database Systems',
      sks: 4,
      dosen_id: dosen2.id,
    },
  });

  await prisma.course.create({
    data: {
      kode: 'TIF103',
      nama: 'Web Development',
      sks: 4,
      dosen_id: dosen2.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log('   - 2 Dosen accounts');
  console.log('   - 2 Mahasiswa accounts');
  console.log('   - 3 Courses');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
