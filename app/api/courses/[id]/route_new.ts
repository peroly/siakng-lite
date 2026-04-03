import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db/prisma';

// POST - Create new course (Dosen only)
export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  // Check if user is Dosen
  const roleError = requireRole(['dosen'])(user);
  if (roleError) {
    return roleError;
  }

  try {
    const body = await request.json();
    const { nama, kode, sks } = body;

    // Validate input
    if (!nama || !kode || !sks) {
      return NextResponse.json(
        { error: 'Missing required fields: nama, kode, sks' },
        { status: 400 }
      );
    }

    if (sks < 1 || sks > 6) {
      return NextResponse.json(
        { error: 'SKS must be between 1 and 6' },
        { status: 400 }
      );
    }

    // Check if kode already exists
    const existingCourse = await prisma.course.findUnique({
      where: { kode },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Kode mata kuliah sudah ada' },
        { status: 409 }
      );
    }

    const newCourse = await prisma.course.create({
      data: {
        kode,
        nama,
        sks: parseInt(sks),
        dosen_id: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Mata kuliah berhasil dibuat',
        data: newCourse,
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

// PUT - Update course (Dosen only)
export async function PUT(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  // Check if user is Dosen
  const roleError = requireRole(['dosen'])(user);
  if (roleError) {
    return roleError;
  }

  try {
    const body = await request.json();
    const { id, nama, kode, sks } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    if (sks < 1 || sks > 6) {
      return NextResponse.json(
        { error: 'SKS must be between 1 and 6' },
        { status: 400 }
      );
    }

    // Get the course
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Mata kuliah tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check ownership
    if (course.dosen_id !== user.id) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki hak untuk mengubah mata kuliah ini' },
        { status: 403 }
      );
    }

    // Check if new kode is unique (if changed)
    if (kode && kode !== course.kode) {
      const existingCourse = await prisma.course.findUnique({
        where: { kode },
      });
      if (existingCourse) {
        return NextResponse.json(
          { error: 'Kode mata kuliah sudah ada' },
          { status: 409 }
        );
      }
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        ...(nama && { nama }),
        ...(kode && { kode }),
        ...(sks && { sks: parseInt(sks) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mata kuliah berhasil diubah',
      data: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE - Delete course (Dosen only)
export async function DELETE(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  // Check if user is Dosen
  const roleError = requireRole(['dosen'])(user);
  if (roleError) {
    return roleError;
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get the course
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Mata kuliah tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check ownership
    if (course.dosen_id !== user.id) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki hak untuk menghapus mata kuliah ini' },
        { status: 403 }
      );
    }

    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Mata kuliah berhasil dihapus',
      data: { id: parseInt(id) },
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
