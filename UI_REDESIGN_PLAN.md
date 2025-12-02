# UI Redesign Plan - Dashboard Layout Improvement

**Created:** December 1, 2025
**Status:** Ready to implement
**Design Choice:** Option 1 - Classic Dashboard Layout

---

## Current Issues

1. **Linear, cluttered layout** - Everything stacked vertically
2. **Poor visual hierarchy** - No clear focal point
3. **Underutilized data** - Rich data available but not displayed
4. **Long scrolling** - Map, chart, and table all require scrolling
5. **No information density** - Lots of white space, not enough metrics

---

## Target Layout (Option 1 - Classic Dashboard)

```
┌───────────────────────────────────────────────────────────────┐
│  HEADER                                                       │
│  Influenza Surveillance Dashboard                            │
│  Last Updated: Nov 22, 2025                                  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  KEY METRICS (4-6 cards in a row)                           │
│  [Hospital  ] [New      ] [ICU     ] [% Beds  ] [RSV/COVID ] │
│  [Patients  ] [Admissions] [Patients] [Occupied] [Comparison] │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  GEOGRAPHIC HEAT MAP SECTION                                 │
│  ┌─────────────────────────────────┬──────────────────────┐ │
│  │                                 │  LEGEND & CONTROLS   │ │
│  │                                 │                      │ │
│  │        MAP                      │  • Activity Level    │ │
│  │      (2/3 width)                │  • Metric Selector   │ │
│  │                                 │  • State Info Panel  │ │
│  │                                 │                      │ │
│  └─────────────────────────────────┴──────────────────────┘ │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  TREND ANALYSIS SECTION                                      │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  National Trend Chart                                    ││
│  │  • Time range selector (4w, 8w, 12w, 24w, 52w)          ││
│  │  • Multiple metrics toggle (Admissions, Patients, ICU)   ││
│  │  • Trend indicators (↑ increasing, ↓ decreasing)        ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  DETAILED DATA SECTION                                       │
│  [Overview] [By State] [Age Groups] [Export]  ← Tabs        │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  Tab content changes based on selection                  ││
│  │  • Overview: National summary table                      ││
│  │  • By State: State-level breakdown                       ││
│  │  • Age Groups: Demographic analysis                      ││
│  │  • Export: Download options (CSV, PDF)                   ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Enhanced Metric Cards (New)

**Current:** 3 basic cards (Latest Update, Hospital Patients, New Admissions)

**Proposed:** 5-6 informative cards with trends

**New Cards to Add:**
1. **Total Flu Patients** (current)
   - Value: `totalconffluhosppats`
   - Trend: Compare to previous week
   - Icon: Hospital bed

2. **New Admissions** (current, enhanced)
   - Value: `totalconfflunewadm`
   - Trend: Week-over-week change %
   - Icon: Person with arrow up

3. **ICU Occupancy**
   - Value: `totalconffluicupats`
   - Secondary: `pcticubedsocc` (% occupied)
   - Icon: Medical monitor

4. **Bed Utilization**
   - Value: `pctinptbedsocc` (percentage)
   - Visual: Progress bar
   - Icon: Bed

5. **Age Group Alert** (new insight)
   - Show which age group has highest admissions
   - Breakdown: Pediatric vs Adult vs Senior
   - Icon: People group

6. **Multi-Virus Comparison** (new insight)
   - Compare: Flu vs COVID vs RSV
   - Show: Relative proportions
   - Icon: Virus

**Data Available:**
```javascript
// Hospital Capacity
totalconffluhosppats: "1769.0"    // Current flu patients
numinptbedsocc: "484411.0"        // Occupied beds
pctinptbedsocc: "0.7414"          // % beds occupied

// ICU
totalconffluicupats: "255.0"      // Flu ICU patients
pcticubedsocc: "0.7116"           // % ICU occupied

// Admissions
totalconfflunewadm: "2014.0"      // New admissions
totalconfflunewadmped: "583.0"    // Pediatric
totalconfflunewadmadult: "1431.0" // Adult

// Multi-virus
totalconffluhosppats: "1769.0"    // Flu
totalconfc19hosppats: "2771.0"    // COVID
totalconfrsvhosppats: "882.0"     // RSV

// Per capita rates
totalconfflunewadmper100k: "0.59" // Admissions per 100k
```

### Phase 2: Enhanced Map Section

**Current:** Basic map with legend on side

**Proposed:** Interactive map with rich controls

**Enhancements:**
1. **Metric Selector**
   - Toggle between:
     - New admissions per 100k (current)
     - Total hospitalized patients
     - ICU occupancy rate
     - Age-specific rates (pediatric, adult, senior)

2. **State Detail Panel**
   - Click state → Shows popup/panel with:
     - State name
     - All key metrics for that state
     - Week-over-week trend
     - Comparison to national average
     - Mini sparkline of last 4 weeks

3. **Legend Enhancement**
   - Add: "National Average" indicator
   - Add: Selected state highlight
   - Add: Timestamp of data

4. **Filter Options** (future)
   - Show only states above/below threshold
   - Highlight regions (Northeast, South, etc.)

### Phase 3: Enhanced Chart Section

**Current:** Single line chart for hospital patients

**Proposed:** Multi-metric trend chart with comparisons

**Enhancements:**
1. **Multiple Metrics Toggle**
   - Checkboxes to show/hide:
     - Total patients (current)
     - New admissions
     - ICU patients
     - % bed occupancy
   - Different colored lines for each

2. **Comparison Overlay**
   - Show COVID-19 trend (dashed line)
   - Show RSV trend (dotted line)
   - Compare flu vs other respiratory viruses

3. **Trend Indicators**
   - Display: "↑ 15% increase over 4 weeks"
   - Color code: Green (decreasing), Yellow (stable), Red (increasing)
   - Show: Moving average line

4. **Annotations**
   - Mark: Peak weeks
   - Mark: Holidays/events that affect data
   - Mark: Data quality notes

### Phase 4: Tabbed Data Section

**Current:** Single table with last 10 weeks

**Proposed:** Tabbed interface with multiple views

**Tabs:**

**1. Overview Tab**
- National summary table
- Last 12 weeks
- All key metrics
- Sortable columns

**2. By State Tab**
- Current week data for all states
- Sortable by any metric
- Highlight top 10 / bottom 10
- Search/filter states

**3. Age Groups Tab**
- Breakdown by age demographics
- Chart: Admissions by age group
- Table: Age-specific rates per 100k
- Comparison: Pediatric vs Adult vs Senior trends

**4. Export Tab**
- Download current view as CSV
- Generate PDF report
- Date range selector
- Select metrics to include

---

## Additional Data We Can Display

### From Existing CDC RESP-NET API

**Hospital Capacity Metrics:**
- `numinptbeds` - Total inpatient beds available
- `numinptbedsocc` - Occupied beds
- `pctinptbedsocc` - Percentage occupied
- Separate for adult vs pediatric

**ICU Metrics:**
- `numicubeds` - Total ICU beds
- `numicubedsocc` - Occupied ICU beds
- `pcticubedsocc` - ICU occupancy %
- Flu-specific ICU patients

**Age Breakdown:**
- Ages 0-4
- Ages 5-17
- Ages 18-49
- Ages 50-64
- Ages 65-74
- Ages 75+

**Multi-Virus Comparison:**
- Flu (current focus)
- COVID-19 (available in same dataset!)
- RSV (available in same dataset!)

**Per Capita Rates:**
- Admission rates per 100,000 population
- By age group
- By virus type

### Future Data Sources (Phase 2 from original plan)

**Wastewater Surveillance:**
- Viral RNA concentration
- Early warning indicator
- Geographic hotspots

**Mock/Simulated Data:**
- Pharmacy antiviral sales
- Hospital admission patterns
- Social media sentiment

---

## Component Structure

### New Components to Create

```
app/components/
├── ui/
│   ├── MetricCard.tsx           ← Enhanced card component
│   ├── TrendIndicator.tsx       ← Up/down arrows with %
│   ├── ProgressBar.tsx          ← For percentages
│   └── TabGroup.tsx             ← Reusable tabs
├── charts/
│   ├── MultiLineChart.tsx       ← Multiple metrics on one chart
│   ├── ComparisonChart.tsx      ← Flu vs COVID vs RSV
│   └── AgeGroupChart.tsx        ← Demographic breakdown
├── maps/
│   ├── FluMap.tsx               ← (existing, enhance)
│   ├── MapLegend.tsx            ← (existing, enhance)
│   ├── MapControls.tsx          ← NEW: Metric selector
│   └── StateDetailPanel.tsx     ← NEW: Click-to-show details
├── tables/
│   ├── DataTable.tsx            ← Sortable, searchable table
│   ├── StateTable.tsx           ← State-level data
│   └── AgeGroupTable.tsx        ← Demographic table
└── exports/
    ├── CSVExport.tsx            ← Download CSV
    └── PDFExport.tsx            ← Generate PDF report
```

### Helper Functions to Create

```
lib/
├── analytics/
│   ├── trends.ts                ← Calculate week-over-week changes
│   ├── comparisons.ts           ← Compare metrics, states, viruses
│   └── aggregations.ts          ← Sum by region, age group, etc.
└── utils/
    ├── calculations.ts          ← Percentage changes, rates
    └── dataProcessing.ts        ← Transform API data for display
```

---

## Color Palette & Design System

### Primary Colors
- **Flu (Focus):** Blue (`#3b82f6`)
- **COVID-19:** Purple (`#8b5cf6`)
- **RSV:** Orange (`#f97316`)
- **Success/Decrease:** Green (`#10b981`)
- **Warning/Increase:** Red (`#dc2626`)
- **Neutral:** Gray (`#6b7280`)

### Card Styling
- White background with shadow
- Rounded corners (8px)
- Hover effect: Slight elevation
- Icon: Colored circle background

### Typography
- **Headers:** Bold, 24px
- **Metric Values:** Bold, 36px
- **Labels:** Medium, 14px
- **Trends:** Italic, 12px

### Spacing
- Section gaps: 32px
- Card gaps: 20px
- Internal padding: 24px

---

## Responsive Design

### Desktop (>1024px)
- 6 metric cards per row
- Map 2/3 width, legend 1/3
- Chart full width
- Table full width with all columns

### Tablet (768-1024px)
- 4 metric cards per row
- Map full width, legend below
- Chart full width
- Table scrollable

### Mobile (<768px)
- 2 metric cards per row
- Map full width
- Legend collapsible
- Chart full width with pan/zoom
- Table: Card view instead of table

---

## Implementation Order

### Week 1: Foundation
1. ✅ Create enhanced MetricCard component
2. ✅ Add TrendIndicator component
3. ✅ Calculate week-over-week changes
4. ✅ Update dashboard with 6 cards

### Week 2: Map Enhancements
1. Add metric selector to map
2. Create StateDetailPanel
3. Add click handlers
4. Implement multi-metric map coloring

### Week 3: Chart Improvements
1. Create MultiLineChart component
2. Add metric toggles
3. Add trend indicators
4. Implement comparison overlay

### Week 4: Tabbed Data Section
1. Create TabGroup component
2. Build Overview tab
3. Build By State tab
4. Build Age Groups tab
5. Build Export tab

### Week 5: Polish & Testing
1. Responsive design testing
2. Performance optimization
3. Accessibility audit
4. User testing

---

## Success Metrics

**User Experience:**
- ✅ See all key metrics without scrolling
- ✅ Understand trends at a glance
- ✅ Explore state-level details easily
- ✅ Compare multiple metrics/viruses
- ✅ Export data for reports

**Technical:**
- Load time <2 seconds
- Smooth interactions (60fps)
- Works on mobile devices
- Accessible (WCAG 2.1 AA)

---

## Next Steps for Implementation

1. **Start with Phase 1** - Enhanced metric cards
   - Create `MetricCard` component
   - Create `TrendIndicator` component
   - Add calculation utilities
   - Update dashboard layout

2. **Then proceed to Phase 2** - Map enhancements

3. **Parallel work possible:**
   - One developer: UI components
   - Another developer: Data processing utilities
   - Third developer: Chart enhancements

---

## Notes & Considerations

### Data Freshness
- CDC data updates weekly
- Cache appropriately
- Show "last updated" timestamp clearly

### Performance
- Lazy load components below fold
- Virtualize long tables
- Optimize map rendering

### Accessibility
- Keyboard navigation for all controls
- Screen reader labels
- Color contrast ratios
- Focus indicators

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

---

**Document Version:** 1.0
**Last Updated:** December 1, 2025
**Ready for Implementation:** Yes
