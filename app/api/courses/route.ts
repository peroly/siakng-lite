import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });

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
