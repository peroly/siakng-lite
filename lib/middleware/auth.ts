import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number;
    username: string;
    role: 'dosen' | 'mahasiswa';
    nama: string;
  };
}

function parseBasicAuth(authHeader: string): { username: string; password: string } | null {
  try {
    const base64Credentials = authHeader.replace('Basic ', '');
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    return { username, password };
  } catch {
    return null;
  }
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: any; error: NextResponse | null }> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      ),
    };
  }

  const credentials = parseBasicAuth(authHeader);
  if (!credentials) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      ),
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: credentials.username },
    });

    if (!user) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        ),
      };
    }

    // For demo purposes, we're using plaintext password comparison
    // In production, use bcryptjs.compare(credentials.password, user.password)
    const isPasswordValid = credentials.password === user.password;

    if (!isPasswordValid) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        ),
      };
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        nama: user.nama,
      },
      error: null,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}

export function requireRole(allowedRoles: string[]) {
  return (user: any) => {
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    return null;
  };
}
