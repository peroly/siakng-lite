import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/middleware/auth';
import { getAllCourses, getCoursesByDosenId, createCourse } from '@/lib/db/json-db';

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  try {
    const courses = await (user?.role === 'dosen' 
      ? getCoursesByDosenId(user.id)
      : getAllCourses());

    return NextResponse.json({
      success: true,
      data: courses,
      message: `${courses.length} mata kuliah ditemukan`,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  if (user?.role !== 'dosen') {
    return NextResponse.json(
      { error: 'Only dosen can create courses' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { kode, nama, sks } = body;

    if (!kode || !nama || !sks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCourse = await createCourse({
      kode,
      nama,
      sks: parseInt(sks),
      dosen_id: user.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: newCourse,
        message: 'Mata kuliah berhasil ditambahkan',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
