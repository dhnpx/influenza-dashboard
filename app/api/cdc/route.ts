import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const limit = searchParams.get('limit') || '1000';

  try {
    // CDC RESP-NET - Respiratory Virus Hospitalization Surveillance Network
    // Dataset: mpgq-jmmr - includes flu hospitalization data by state
    let cdcUrl = `https://data.cdc.gov/resource/mpgq-jmmr.json?$limit=${limit}&$order=weekendingdate DESC`;

    // Filter by state (jurisdiction) if provided
    if (state) {
      cdcUrl += `&jurisdiction=${state.toUpperCase()}`;
    }

    const response = await fetch(cdcUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CDC data: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CDC data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CDC data' },
      { status: 500 }
    );
  }
}
