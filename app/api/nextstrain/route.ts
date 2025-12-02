import { NextResponse } from 'next/server';

// This is a simplified example - you might need to adjust based on Nextstrain's actual API
export async function GET() {
  try {
    // Example Nextstrain API endpoint - you'll need to replace this with actual API endpoints
    const nextstrainUrl = 'https://data.nextstrain.org/ncov_global.json';
    const response = await fetch(nextstrainUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Nextstrain data');
    }
    
    const data = await response.json();
    
    // Process the data to extract relevant information
    const processedData = processNextstrainData(data);
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching Nextstrain data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Nextstrain data' },
      { status: 500 }
    );
  }
}

// Helper function to process Nextstrain data
function processNextstrainData(data: any) {
  // This is a simplified example - adjust based on actual Nextstrain data structure
  const clades: Record<string, number> = {};
  const locations: Record<string, number> = {};
  const dates: Record<string, number> = {};
  
  // Process each node in the tree
  const processNode = (node: any) => {
    // Count clades
    if (node.node_attrs?.clade) {
      const clade = node.node_attrs.clade.value;
      clades[clade] = (clades[clade] || 0) + 1;
    }
    
    // Count locations
    if (node.node_attrs?.country?.value) {
      const country = node.node_attrs.country.value;
      locations[country] = (locations[country] || 0) + 1;
    }
    
    // Count by date
    if (node.node_attrs?.date?.value) {
      const date = node.node_attrs.date.value.split('T')[0]; // Get just the date part
      dates[date] = (dates[date] || 0) + 1;
    }
    
    // Process children
    if (node.children) {
      node.children.forEach(processNode);
    }
  };
  
  // Start processing from the root
  processNode(data.tree);
  
  // Convert to arrays for charting
  const cladeData = Object.entries(clades)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 clades
    
  const locationData = Object.entries(locations)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 locations
    
  const dateData = Object.entries(dates)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
    
  return {
    clades: cladeData,
    locations: locationData,
    timeline: dateData,
    lastUpdated: new Date().toISOString(),
  };
}
