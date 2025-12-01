import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // CDC FluView data endpoint - this is a public API
    const cdcUrl = 'https://data.cdc.gov/resource/3yf8-kanr4.json?$limit=1000';
    const response = await fetch(cdcUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch CDC data');
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
