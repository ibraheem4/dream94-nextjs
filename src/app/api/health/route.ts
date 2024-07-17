import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
