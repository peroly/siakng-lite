import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireRole } from '@/lib/middleware/auth';
import { findCourseById, findCourseByKode, updateCourse, deleteCourse } from '@/lib/db/json-db';

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

    if (sks && (sks < 1 || sks > 6)) {
      return NextResponse.json(
        { error: 'SKS must be between 1 and 6' },
        { status: 400 }
      );
    }

    // Get the course
    const course = await findCourseById(parseInt(id));

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
      const existingCourse = await findCourseByKode(kode);
      if (existingCourse) {
        return NextResponse.json(
          { error: 'Kode mata kuliah sudah ada' },
          { status: 409 }
        );
      }
    }

    const updatedCourse = await updateCourse(parseInt(id), {
      ...(nama && { nama }),
      ...(kode && { kode }),
      ...(sks && { sks: parseInt(sks) }),
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
    const course = await findCourseById(parseInt(id));

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

    await deleteCourse(parseInt(id));

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
