import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function authMiddleware(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Add user info to request
    (request as any).user = decoded;

    return handler(request, context);
  };
}

export function getUserFromRequest(request: NextRequest): { userId: string; email: string } | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

