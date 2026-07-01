import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> | { accountId: string } }
) {
  // Await the params object to support Next.js 15+ async params requirements
  const resolvedParams = await params;
  const accountId = resolvedParams.accountId;
  const backendBaseUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

  try {
    const res = await fetch(`${backendBaseUrl}/api/aws/accounts/${accountId}/status`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { detail: `Backend responded with status: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy AWS Account Status Error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}
