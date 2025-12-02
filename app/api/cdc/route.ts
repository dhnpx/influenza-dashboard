import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const jurisdiction = searchParams.get('jurisdiction');
  // Increased to 500 for ~7-8 weeks of historical data
  // 500 records ≈ 3.2MB (still under 4MB threshold)
  const limit = searchParams.get('limit') || '500';

  try {
    // CDC RESP-NET - Respiratory Virus Hospitalization Surveillance Network
    // Dataset: mpgq-jmmr - includes flu hospitalization data by state
    let cdcUrl = `https://data.cdc.gov/resource/mpgq-jmmr.json?$limit=${limit}&$order=weekendingdate DESC`;

    // Filter by state or jurisdiction if provided
    const filterValue = jurisdiction || state;
    if (filterValue) {
      cdcUrl += `&jurisdiction=${filterValue.toUpperCase()}`;
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
