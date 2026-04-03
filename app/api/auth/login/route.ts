import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      nama: user.nama,
    },
  });
}

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error) {
    return error;
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      nama: user.nama,
    },
  });
}
