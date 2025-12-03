# Influenza Surveillance Dashboard

A real-time influenza monitoring dashboard built with Next.js, providing comprehensive public health surveillance across the United States.

## Overview

This dashboard integrates multiple data sources to track influenza activity, including CDC hospitalization data and wastewater surveillance. It provides interactive visualizations and analytics to help monitor flu trends and outbreaks.

## Features

- **Interactive Geographic Map**: State-level heat maps with multiple metrics (admissions per 100k, total admissions, hospital patients, wastewater surveillance)
- **Multi-Line Charts**: Toggleable visualization of hospital patients, new admissions, ICU patients, COVID-19, and RSV trends
- **Real-Time Data**: CDC RESP-NET hospitalization data and NWSS wastewater surveillance
- **Enhanced Tooltips**: Large data points and improved hover interactions for better readability
- **Responsive Design**: Optimized for desktop and mobile viewing

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js with react-chartjs-2
- **Maps**: Leaflet with react-leaflet
- **Data Fetching**: Native fetch with SWR for caching
- **Analytics**: simple-statistics for trend analysis

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CDC_API_URL=https://data.cdc.gov/resource
NEXT_PUBLIC_CDC_FLU_ENDPOINT=mpgq-jmmr.json
NEXT_PUBLIC_WASTEWATER_ENDPOINT=ymmh-divb.json
NEXT_PUBLIC_MAP_CENTER_LAT=37.8
NEXT_PUBLIC_MAP_CENTER_LNG=-96
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=4
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

Create a production build:

```bash
npm run build
npm start
```

## Data Sources

- **CDC RESP-NET**: Hospitalization surveillance data
- **CDC NWSS**: National Wastewater Surveillance System data
- **State-Level Data**: Geographic distribution of flu activity

## Project Structure

```
app/
├── components/
│   ├── charts/          # Chart components
│   ├── maps/            # Map components
│   └── ui/              # UI components
├── api/                 # API routes
│   ├── cdc/            # CDC data endpoint
│   └── wastewater/     # Wastewater data endpoint
└── page.tsx            # Main dashboard page

lib/
├── analytics/          # Statistical analysis functions
└── utils/              # Utility functions

types/                  # TypeScript type definitions
```

## License

This project is for educational and informational purposes only.
