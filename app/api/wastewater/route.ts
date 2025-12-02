import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const limit = searchParams.get('limit') || '500';

  try {
    // CDC National Wastewater Surveillance System (NWSS)
    // Dataset: ymmh-divb - Influenza A viral concentration in wastewater
    let wastewaterUrl = `https://data.cdc.gov/resource/ymmh-divb.json?$limit=${limit}&$order=sample_collect_date DESC`;

    // Filter for influenza A specifically
    wastewaterUrl += `&pcr_target=fluav`;

    // Filter by state if provided (use jurisdiction field)
    if (state) {
      wastewaterUrl += `&wwtp_jurisdiction=${state.toLowerCase()}`;
    }

    const response = await fetch(wastewaterUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch wastewater data: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching wastewater data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wastewater data' },
      { status: 500 }
    );
  }
}
