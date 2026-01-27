# NetSuite Sales Target Dashboard - FY26 New Business

Executive dashboard for tracking FY26 New Business sales targets for Fusion5 NetSuite team (Tony Goh and Anthony Najafian).

## Overview

This dashboard provides real-time visibility into pipeline health, target attainment, and strategic activity planning for the NetSuite sales team. It visualizes pipeline coverage, margin tracking, and key motions required to achieve FY26 targets.

## Tech Stack

- **React 18** - UI framework with hooks
- **Vite 6.4** - Build tool and dev server with HMR
- **CSS3** - Custom styling with CSS variables
- **CSV** - Data source for pipeline deals

## Key Features

### 1. KPI Summary
- Total Margin tracking across NetSuite and Add-ons
- NetSuite Mix percentage monitoring
- Real-time calculations from pipeline data

### 2. Pipeline Coverage Analysis
- Dynamic win rate integration (configurable via Pipeline Assumptions)
- Required pipeline calculations: `Target ÷ Win Rate = Required Pipeline`
- Visual coverage indicators with circular progress graphs
- Individual metrics for Tony Goh, Anthony Najafian, and combined team
- Color-coded status: green (>100%), yellow (50-100%), red (<50%)

### 3. Pipeline vs Target Cards
- Current pipeline values vs $675K targets per rep
- Detailed deal tables with company names, stages, and values
- Progress bars showing attainment percentage
- Combined team view with $1.35M total target

### 4. Strategic Motion Tracking
- **BAU Verticals**: Software/SaaS + Construction with shared vertical context
- Collapsible sections with tactic badges
- High-level activity planning with tactical approach

### 5. Pipeline Assumptions (Configurable)
- Win rate adjustment (default: 30%)
- Average margin per win
- Dynamic recalculation of required pipeline
- Collapsible section for clean interface

### 6. Talk Track
- Key messaging and positioning guidance
- Executive-level conversation framework

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The dev server runs on `http://localhost:5173` (or next available port) with hot module replacement enabled.

## Project Structure

```
NetSuite-Sales-Target-New-Business/
├── public/
│   └── data/
│       └── pipeline.csv          # Pipeline deal data
├── src/
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Application styles
│   └── main.jsx                  # React entry point
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
└── package.json                  # Dependencies and scripts
```

## Data Format

### pipeline.csv

The dashboard expects a CSV file at `public/data/pipeline.csv` with the following columns:

```csv
BDM,Company Name,Stage,Total Price
Tony Goh,Company A,Discovery,$45000
Anthony Najafian,Company B,Proposal,$120000
```

**Required columns:**
- `BDM` - Business Development Manager (Tony Goh or Anthony Najafian)
- `Company Name` - Client company name
- `Stage` - Sales stage (Discovery, Proposal, Negotiation, etc.)
- `Total Price` - Deal value (formatted with $ and commas supported)

## Configuration

### Targets

Current targets are defined in the `DATA` object in [src/App.jsx](src/App.jsx):

```javascript
const DATA = {
  targets: {
    tonyTarget: 675000,
    anthonyTarget: 675000,
    combinedTarget: 1350000
  }
}
```

### Pipeline Assumptions

Default assumptions can be modified in the `pipelineDefaults` object:

```javascript
pipelineDefaults: {
  winRate: 30,  // Win rate percentage
  avgNetsuiteMarginPerWin: 125000  // Average margin per deal
}
```

These can also be adjusted live in the UI via the Pipeline Assumptions section.

## Key Calculations

### Pipeline Coverage
```
Required Pipeline = Target ÷ (Win Rate ÷ 100)
Coverage % = (Current Pipeline ÷ Required Pipeline) × 100
```

**Example:**
- Target: $675K
- Win Rate: 30%
- Required Pipeline: $675K ÷ 0.30 = $2.25M
- Current Pipeline: $505K
- Coverage: ($505K ÷ $2.25M) × 100 = 22%

### Margin Calculations
```
NetSuite Margin = Sum of all NetSuite deals
Add-ons Margin = (Assumed based on business rules)
Total Margin = NetSuite Margin + Add-ons Margin
NetSuite Mix = (NetSuite Margin ÷ Total Margin) × 100
```

## Features in Detail

### Circular Progress Indicators
- SVG-based with animated stroke-dasharray
- Dynamic color coding based on performance
- Center text shows percentage completion
- Responsive sizing for mobile/desktop

### Responsive Design
- 3-column grid on desktop (>1200px)
- 2-column grid on tablet (768px - 1200px)
- Single column on mobile (<768px)
- Touch-friendly collapsible sections

### Color Scheme (Fusion5 Brand)
- Primary Purple: `#8B5FBF`
- Charcoal: `#2C3E50`
- Success Green: `#28a745`
- Warning Yellow: `#ffc107`
- Danger Red: `#dc3545`

## CSV Parsing
The app includes BOM (Byte Order Mark) handling for Excel-exported CSV files:

```javascript
if (text.charCodeAt(0) === 0xFEFF) {
  text = text.substring(1)
}
```

This ensures compatibility with CSV files exported from Excel, NetSuite, or other tools.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

Potential features for consideration:
- Historical trend tracking
- Deal aging analysis
- Activity logging integration
- Export to PDF functionality
- Multi-quarter view
- Stage velocity metrics

## License

Internal Fusion5 tool - Not for external distribution

## Contact

For questions or feature requests, contact the Fusion5 NetSuite team.
