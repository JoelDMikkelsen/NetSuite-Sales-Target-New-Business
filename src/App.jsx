import { useState, useEffect } from 'react'
import './App.css'

// ============================================================================
// IMPORTANT: Place the CSV at public/data/pipeline.csv
// ============================================================================

// ============================================================================
// CSV PARSER
// ============================================================================
function parseCsv(text) {
  // Remove BOM if present and trim
  text = text.replace(/^\uFEFF/, '').trim()

  const lines = text.split('\n')
  if (lines.length === 0) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    // Basic CSV parsing with quoted field support
    const values = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''))
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''))

    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

// ============================================================================
// DATA - Edit values here
// ============================================================================
const DATA = {
  fiscalYear: 'FY26',

  // Per-rep targets (AUD)
  perRep: {
    netsuiteMargin: 550000,
    addonsMargin: 125000,
  },

  // Reps in scope (New Business only)
  reps: [
    { name: 'Anthony' },
    { name: 'Tony' },
  ],

  // BAU Activity Pillars
  bauPillars: [
    { name: 'Vertical Outbound', detail: 'Construction / Development' },
    { name: 'Vendor Selection Partners', detail: 'OPD + SMC' },
    { name: 'Finance Persona Outreach', detail: 'Targeted campaigns' },
  ],

  // Vendor Selection Partners
  selectionPartners: [
    {
      name: 'On Point Digital',
      type: 'Primary Selection Partner',
      quarterlyTarget: 2,
      annualRunRate: 8,
      primary: true,
    },
    {
      name: 'Other Partners (SMC)',
      type: 'Selection Partners',
      quarterlyTarget: 1,
      annualRunRate: 4,
      primary: false,
    },
  ],

  // Shared Vertical Context (BAU extension)
  sharedVertical: {
    title: 'Shared Vertical Focus: Software / SaaS + Construction',
    vertical: 'Software / SaaS serving Construction',
    owner: 'Anthony',
    status: 'Active GTM',
    description: 'Focus on Software/SaaS vendors operating in the Construction ecosystem, leveraging shared construction narratives and partner-led credibility.',

    gtmPartner: {
      name: 'FullClarity',
      badge: 'SuiteCloud Partner',
      role: 'Joint GTM / Industry Credibility',
      customersSigned: 2,
      note: 'Joint GTM accelerates credibility and reduces early-cycle friction.',
    },

    enablement: [
      'Fusion5 team committed to implementation training',
      'Solution complexity: light / manageable',
      'Objective: reduce dependency on partner over time',
    ],

    industryAlliances: [
      'Oracle Industry Alliances',
      'Master Builders (Construction)',
      'AAAA (Australian Automotive Aftermarket Association)',
    ],

    framingStatement: 'This vertical is treated as BAU once credibility is established; partner leverage accelerates time-to-scale.',
  },

  // Activity Summary
  activitySummary: [
    {
      name: 'Vertical Outbound',
      purpose: 'Construction-led pipeline generation',
      frequency: 'Ongoing',
      tactics: [
        'Joint GTM Webinars',
        'Joint Events',
        'McCorkell Campaigns',
        'SEM',
        'Ad Campaigns',
        'Oracle Industry Alliance Team',
      ],
    },
    {
      name: 'Selection Partner Sourcing',
      purpose: 'OPD + SMC deal flow',
      frequency: 'Quarterly',
      tactics: [
        'Information Events',
        'Lunch and Learns',
        'Regular Cadence',
        'Co-Sell',
      ],
    },
    {
      name: 'Vendor Co-GTM',
      purpose: 'Celigo / NetStock / SPS attach',
      frequency: 'Ongoing',
      tactics: [
        'Bi-monthly webinars',
        'Customer Event sponsorship',
      ],
    },
    {
      name: 'PE Intros',
      purpose: 'Selective high-value pursuits',
      frequency: 'Opportunistic',
      tactics: [
        'Oracle PE Team leverage',
        'Co-Op funded Events',
        'Customer Heatmapping',
      ],
    },
  ],

  // Motions
  motions: [
    {
      id: 'bau',
      name: 'BAU Verticals',
      anchor: 'Construction / Property Development',
      confidence: 'High',
      tag: 'Core',
      weight: 70,
      bullets: [
        'Construction / development is the anchor vertical',
        'Repeatable playbook: narrative + targeted outbound',
        'Designed to deliver majority of the $1.1M NetSuite margin',
      ],
    },
    {
      id: 'vendor',
      name: 'Vendor Alliances',
      confidence: 'Med-High',
      tag: 'Accelerator',
      weight: 20,
      partners: ['Celigo', 'NetStock', 'SPS Commerce'],
      bullets: [
        'Add-on attach motion riding NetSuite wins',
        'Co-GTM improves yield without extra headcount',
        'Supports $125K/rep add-ons target (not a separate focus)',
      ],
    },
    {
      id: 'pe',
      name: 'Private Equity',
      confidence: 'Opportunistic',
      tag: 'Upside',
      weight: 10,
      bullets: [
        'Fewer deals, larger value, longer cycle',
        'Not required to hit the core target',
        'Used selectively for asymmetric upside',
      ],
    },
  ],

  // Pipeline defaults
  pipelineDefaults: {
    winRate: 30,
    avgNetsuiteMarginPerWin: 60000,
  },
}

// ============================================================================
// HELPERS
// ============================================================================
function formatAUD(value) {
  return '$' + value.toLocaleString('en-AU')
}

function formatShort(value) {
  if (value >= 1000000) {
    return '$' + (value / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M'
  }
  if (value >= 1000) {
    return '$' + Math.round(value / 1000) + 'K'
  }
  return '$' + value
}

// ============================================================================
// COMPUTED VALUES
// ============================================================================
const repCount = DATA.reps.length
const perRepTotal = DATA.perRep.netsuiteMargin + DATA.perRep.addonsMargin
const totalNetsuiteMargin = DATA.perRep.netsuiteMargin * repCount
const totalAddonsMargin = DATA.perRep.addonsMargin * repCount
const totalMargin = perRepTotal * repCount
const netsuiteMix = Math.round((totalNetsuiteMargin / totalMargin) * 100)

// ============================================================================
// COMPONENTS
// ============================================================================

function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>{DATA.fiscalYear} New Business Plan — Exec View</h1>
        <p className="subtitle">Margin-led targets with a repeatable pipeline engine</p>
      </div>
      <div className="header-right">
        <span className="pill">{repCount} reps in scope</span>
      </div>
    </header>
  )
}

function KPICard({ label, value, sublabel, title }) {
  return (
    <div className="kpi-card" title={title}>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {sublabel && <div className="kpi-sublabel">{sublabel}</div>}
    </div>
  )
}

function KPIRow() {
  return (
    <section className="kpi-row">
      <KPICard
        label="NetSuite Margin Target"
        value={formatShort(totalNetsuiteMargin)}
        title={formatAUD(totalNetsuiteMargin)}
      />
      <KPICard
        label="Add-on Margin Target"
        value={formatShort(totalAddonsMargin)}
        title={formatAUD(totalAddonsMargin)}
      />
      <KPICard
        label="Total Margin Target"
        value={formatShort(totalMargin)}
        title={formatAUD(totalMargin)}
      />
      <KPICard
        label="Per Rep Target"
        value={formatShort(perRepTotal)}
        sublabel={`${formatShort(DATA.perRep.netsuiteMargin)} + ${formatShort(DATA.perRep.addonsMargin)}`}
        title={formatAUD(perRepTotal)}
      />
      <KPICard
        label="NetSuite Mix"
        value={`${netsuiteMix}%`}
        title={`${totalNetsuiteMargin.toLocaleString()} / ${totalMargin.toLocaleString()}`}
      />
    </section>
  )
}

function BAUMotionCard({ motion, isOpen, onToggle }) {
  const [showPartners, setShowPartners] = useState(false)
  const [showVerticalContext, setShowVerticalContext] = useState(false)
  const confidenceClass = motion.confidence.toLowerCase().replace(/[^a-z]/g, '')
  const motionClass = `motion-${motion.tag.toLowerCase()}`

  return (
    <div className={`motion-card ${motionClass}`}>
      <div className="motion-header">
        <div className="motion-title-row">
          <h3 className="motion-name">{motion.name}</h3>
          <span className={`motion-tag tag-${motion.tag.toLowerCase()}`}>{motion.tag}</span>
        </div>
        <div className="motion-meta">
          <span className={`confidence confidence-${confidenceClass}`}>
            {motion.confidence}
          </span>
        </div>
      </div>

      <div className="weight-bar-container">
        <div className="weight-bar" style={{ width: `${motion.weight}%` }}></div>
        <span className="weight-label">{motion.weight}%</span>
      </div>

      {/* Core BAU Motions */}
      <div className="bau-pillars">
        <p className="bau-pillars-title">Core BAU Motions</p>
        <div className="bau-pillars-grid">
          {DATA.bauPillars.map((pillar, i) => (
            <div key={i} className="bau-pillar">
              <span className="pillar-name">{pillar.name}</span>
              <span className="pillar-detail">{pillar.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="motion-toggles">
        <button className="details-toggle" onClick={onToggle}>
          {isOpen ? 'Hide Details' : 'Details'}
        </button>
        <button className="details-toggle" onClick={() => setShowPartners(!showPartners)}>
          {showPartners ? 'Hide Partners' : 'Selection Partners'}
        </button>
        <button className="details-toggle" onClick={() => setShowVerticalContext(!showVerticalContext)}>
          {showVerticalContext ? 'Hide Vertical Context' : 'Software/SaaS Vertical'}
        </button>
      </div>

      {isOpen && (
        <ul className="motion-bullets">
          {motion.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}

      {showPartners && (
        <div className="selection-partners-panel">
          <p className="panel-title">Vendor Selection Partners — Quarterly Targets</p>
          <div className="partners-grid">
            {DATA.selectionPartners.map((partner, i) => (
              <div key={i} className={`partner-card ${partner.primary ? 'partner-primary' : 'partner-secondary'}`}>
                <div className="partner-name">{partner.name}</div>
                <div className="partner-type">{partner.type}</div>
                <div className="partner-metrics">
                  <div className="partner-metric">
                    <span className="metric-value">{partner.quarterlyTarget}</span>
                    <span className="metric-label">deals/qtr</span>
                  </div>
                  <div className="partner-metric">
                    <span className="metric-value">{partner.annualRunRate}</span>
                    <span className="metric-label">annual run-rate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="partners-note">Selection partners form part of BAU pipeline, not a separate motion.</p>
        </div>
      )}

      {showVerticalContext && (
        <div className="vertical-context-panel">
          <p className="panel-title">{DATA.sharedVertical.title}</p>

          {/* Vertical Positioning Block */}
          <div className="vertical-positioning">
            <div className="vertical-info-grid">
              <div className="vertical-info-item">
                <span className="info-label">Vertical</span>
                <span className="info-value">{DATA.sharedVertical.vertical}</span>
              </div>
              <div className="vertical-info-item">
                <span className="info-label">Owner</span>
                <span className="info-value">{DATA.sharedVertical.owner}</span>
              </div>
              <div className="vertical-info-item">
                <span className="info-label">Status</span>
                <span className="info-value status-active">{DATA.sharedVertical.status}</span>
              </div>
            </div>
            <p className="vertical-description">{DATA.sharedVertical.description}</p>
          </div>

          {/* FullClarity Partner - Highlighted */}
          <div className="gtm-partner-highlight">
            <div className="gtm-partner-header">
              <div className="gtm-partner-title">
                <span className="gtm-partner-name">{DATA.sharedVertical.gtmPartner.name}</span>
                <span className="gtm-partner-badge">{DATA.sharedVertical.gtmPartner.badge}</span>
              </div>
              <span className="gtm-partner-role">{DATA.sharedVertical.gtmPartner.role}</span>
            </div>
            <div className="gtm-partner-status">
              <span className="status-indicator">{DATA.sharedVertical.gtmPartner.customersSigned} Fusion5 customers already signed</span>
              <span className="status-detail">Borrowing partner credibility while Fusion5 builds deeper reference base</span>
            </div>
            <p className="gtm-partner-note">{DATA.sharedVertical.gtmPartner.note}</p>
          </div>

          {/* Enablement Commitment */}
          <div className="enablement-block">
            <p className="enablement-title">Enablement Commitment</p>
            <ul className="enablement-checklist">
              {DATA.sharedVertical.enablement.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Industry Alliances */}
          <div className="industry-leverage">
            <p className="industry-leverage-title">Industry Leverage</p>
            <div className="industry-pills">
              {DATA.sharedVertical.industryAlliances.map((alliance, i) => (
                <span key={i} className="industry-pill">{alliance}</span>
              ))}
            </div>
            <p className="industry-leverage-desc">Industry bodies used for access, credibility, and co-marketed demand generation.</p>
          </div>

          {/* Framing Statement */}
          <div className="framing-statement">{DATA.sharedVertical.framingStatement}</div>
        </div>
      )}
    </div>
  )
}

function MotionCard({ motion, isOpen, onToggle }) {
  const confidenceClass = motion.confidence.toLowerCase().replace(/[^a-z]/g, '')
  const motionClass = `motion-${motion.tag.toLowerCase()}`

  return (
    <div className={`motion-card ${motionClass}`}>
      <div className="motion-header">
        <div className="motion-title-row">
          <h3 className="motion-name">{motion.name}</h3>
          <span className={`motion-tag tag-${motion.tag.toLowerCase()}`}>{motion.tag}</span>
        </div>
        <div className="motion-meta">
          <span className={`confidence confidence-${confidenceClass}`}>
            {motion.confidence}
          </span>
          {motion.partners && (
            <div className="partners">
              {motion.partners.map((p) => (
                <span key={p} className="partner-tag">{p}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="weight-bar-container">
        <div className="weight-bar" style={{ width: `${motion.weight}%` }}></div>
        <span className="weight-label">{motion.weight}%</span>
      </div>

      <button className="details-toggle" onClick={onToggle}>
        {isOpen ? 'Hide Details' : 'Details'}
      </button>

      {isOpen && (
        <ul className="motion-bullets">
          {motion.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Motions() {
  const [openMotions, setOpenMotions] = useState({})

  const toggleMotion = (id) => {
    setOpenMotions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="section">
      <h2 className="section-title">Motions</h2>
      <div className="motions-grid">
        {DATA.motions.map((motion) => (
          motion.id === 'bau' ? (
            <BAUMotionCard
              key={motion.id}
              motion={motion}
              isOpen={openMotions[motion.id]}
              onToggle={() => toggleMotion(motion.id)}
            />
          ) : (
            <MotionCard
              key={motion.id}
              motion={motion}
              isOpen={openMotions[motion.id]}
              onToggle={() => toggleMotion(motion.id)}
            />
          )
        ))}
      </div>
    </section>
  )
}

function ActivitySummary() {
  return (
    <section className="section">
      <h2 className="section-title">High-Level Activity Plan</h2>
      <div className="activity-grid">
        {DATA.activitySummary.map((activity, i) => (
          <div key={i} className="activity-tile">
            <div className="activity-name">{activity.name}</div>
            <div className="activity-purpose">{activity.purpose}</div>
            <div className="activity-frequency">{activity.frequency}</div>
            {activity.tactics && activity.tactics.length > 0 && (
              <div className="activity-tactics">
                {activity.tactics.map((tactic, j) => (
                  <span key={j} className="activity-tactic-badge">{tactic}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function PipelineAssumptions({ winRate, setWinRate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [avgMargin, setAvgMargin] = useState(DATA.pipelineDefaults.avgNetsuiteMarginPerWin)

  const requiredPipeline = totalNetsuiteMargin / (winRate / 100)
  const dealsRequired = Math.round(totalNetsuiteMargin / avgMargin)

  return (
    <section className="section">
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide pipeline assumptions' : 'Show pipeline assumptions'}
      </button>

      {isOpen && (
        <div className="pipeline-panel">
          <p className="assumptions-label">Pipeline Working Assumptions (Win-rate based)</p>

          <div className="pipeline-inputs">
            <label>
              <span>Win rate %</span>
              <input
                type="number"
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value) || 0)}
                min="1"
                max="100"
              />
            </label>
            <label>
              <span>Avg NetSuite margin per win</span>
              <input
                type="number"
                value={avgMargin}
                onChange={(e) => setAvgMargin(Number(e.target.value) || 0)}
              />
            </label>
          </div>

          <div className="pipeline-outputs">
            <div className="pipeline-output">
              <span className="output-label">Required Qualified Pipeline</span>
              <span className="output-value">{formatShort(requiredPipeline)}</span>
              <span className="output-detail">NetSuite target ÷ win rate</span>
            </div>
            <div className="pipeline-output">
              <span className="output-label">Deals required (approx.)</span>
              <span className="output-value">{dealsRequired}</span>
              <span className="output-detail">Target ÷ avg margin per win</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ============================================================================
// CIRCULAR PROGRESS COMPONENT
// ============================================================================
function CircularProgress({ percent, size = 120, strokeWidth = 12, label, value }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference

  return (
    <div className="circular-progress">
      <svg width={size} height={size} className="circular-progress-svg">
        {/* Background circle */}
        <circle
          className="circular-progress-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--f5-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className="circular-progress-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--f5-purple)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="circular-progress-text"
        >
          {percent}%
        </text>
      </svg>
      <div className="circular-progress-label">{label}</div>
      <div className="circular-progress-value">{value}</div>
    </div>
  )
}

// ============================================================================
// PIPELINE VS TARGET
// ============================================================================
function PipelineVsTarget({ pipelineData, loadStatus, winRate }) {
  const [showTonyDeals, setShowTonyDeals] = useState(false)
  const [showAnthonyDeals, setShowAnthonyDeals] = useState(false)

  if (!pipelineData) {
    return (
      <section className="section">
        <h2 className="section-title">Current Pipeline vs Target</h2>
        <div className="pipeline-status">
          {loadStatus === 'loading' && <p className="status-text">Loading pipeline data...</p>}
          {loadStatus === 'error' && (
            <p className="status-text status-error">
              Pipeline data not available. Ensure CSV is at public/data/pipeline.csv
            </p>
          )}
        </div>
      </section>
    )
  }

  const tonyTarget = 675000
  const anthonyTarget = 675000
  const combinedTarget = 1350000

  const tonyPipeline = pipelineData.tony.totalMargin
  const anthonyPipeline = pipelineData.anthony.totalMargin
  const combinedPipeline = tonyPipeline + anthonyPipeline

  // Calculate percentages against target for the cards
  const tonyPercent = Math.round((tonyPipeline / tonyTarget) * 100)
  const anthonyPercent = Math.round((anthonyPipeline / anthonyTarget) * 100)
  const combinedPercent = Math.round((combinedPipeline / combinedTarget) * 100)

  // Calculate required pipeline coverage based on win rate
  const tonyRequiredPipeline = tonyTarget / (winRate / 100)
  const anthonyRequiredPipeline = anthonyTarget / (winRate / 100)
  const combinedRequiredPipeline = combinedTarget / (winRate / 100)

  // Calculate coverage percentages
  const tonyCoveragePercent = Math.round((tonyPipeline / tonyRequiredPipeline) * 100)
  const anthonyCoveragePercent = Math.round((anthonyPipeline / anthonyRequiredPipeline) * 100)
  const combinedCoveragePercent = Math.round((combinedPipeline / combinedRequiredPipeline) * 100)

  return (
    <section className="section">
      <h2 className="section-title">Current Pipeline vs Target</h2>
      <div className="pipeline-status">
        <p className="status-text status-success">Loaded {pipelineData.totalRows} rows</p>
      </div>

      <div className="pipeline-cards">
        {/* Tony Card */}
        <div className="pipeline-rep-card">
          <div className="pipeline-rep-header">
            <h3 className="pipeline-rep-name">Tony Goh</h3>
            <span className="pipeline-percent">{tonyPercent}%</span>
          </div>
          <div className="pipeline-metrics">
            <div className="pipeline-metric">
              <span className="pipeline-value">{formatShort(tonyPipeline)}</span>
              <span className="pipeline-label">Pipeline</span>
            </div>
            <div className="pipeline-metric">
              <span className="pipeline-target-value">{formatShort(tonyTarget)}</span>
              <span className="pipeline-label">Target</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${Math.min(tonyPercent, 100)}%` }}></div>
          </div>
          <button className="details-toggle" onClick={() => setShowTonyDeals(!showTonyDeals)}>
            {showTonyDeals ? 'Hide deals' : `Show deals (${pipelineData.tony.deals.length})`}
          </button>
          {showTonyDeals && (
            <div className="deals-table-container">
              <table className="deals-table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Topic</th>
                    <th>Stage</th>
                    <th>Est. Date</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineData.tony.deals.map((deal, i) => (
                    <tr key={i}>
                      <td>{deal.Account}</td>
                      <td className="deal-topic">{deal.Topic}</td>
                      <td>{deal['Current BPF Status']}</td>
                      <td>{deal['Estimated signature date']}</td>
                      <td>{formatShort(deal.marginValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Anthony Card */}
        <div className="pipeline-rep-card">
          <div className="pipeline-rep-header">
            <h3 className="pipeline-rep-name">Anthony Najafian</h3>
            <span className="pipeline-percent">{anthonyPercent}%</span>
          </div>
          <div className="pipeline-metrics">
            <div className="pipeline-metric">
              <span className="pipeline-value">{formatShort(anthonyPipeline)}</span>
              <span className="pipeline-label">Pipeline</span>
            </div>
            <div className="pipeline-metric">
              <span className="pipeline-target-value">{formatShort(anthonyTarget)}</span>
              <span className="pipeline-label">Target</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${Math.min(anthonyPercent, 100)}%` }}></div>
          </div>
          <button className="details-toggle" onClick={() => setShowAnthonyDeals(!showAnthonyDeals)}>
            {showAnthonyDeals ? 'Hide deals' : `Show deals (${pipelineData.anthony.deals.length})`}
          </button>
          {showAnthonyDeals && (
            <div className="deals-table-container">
              <table className="deals-table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Topic</th>
                    <th>Stage</th>
                    <th>Est. Date</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineData.anthony.deals.map((deal, i) => (
                    <tr key={i}>
                      <td>{deal.Account}</td>
                      <td className="deal-topic">{deal.Topic}</td>
                      <td>{deal['Current BPF Status']}</td>
                      <td>{deal['Estimated signature date']}</td>
                      <td>{formatShort(deal.marginValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Combined Card */}
        <div className="pipeline-combined-card">
          <div className="pipeline-rep-header">
            <h3 className="pipeline-rep-name">Combined</h3>
            <span className="pipeline-percent">{combinedPercent}%</span>
          </div>
          <div className="pipeline-metrics">
            <div className="pipeline-metric">
              <span className="pipeline-value">{formatShort(combinedPipeline)}</span>
              <span className="pipeline-label">Total Pipeline</span>
            </div>
            <div className="pipeline-metric">
              <span className="pipeline-target-value">{formatShort(combinedTarget)}</span>
              <span className="pipeline-label">Total Target</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar progress-bar-combined" style={{ width: `${Math.min(combinedPercent, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Circular Progress Visualizations - Pipeline Coverage */}
      <div className="pipeline-coverage-section">
        <div className="pipeline-coverage-header">
          <h3 className="pipeline-coverage-title">Pipeline Coverage Analysis</h3>
          <p className="pipeline-coverage-description">
            Based on a <strong>{winRate}% win rate</strong>, each rep needs <strong>{formatShort(tonyRequiredPipeline)}</strong> in qualified pipeline
            to hit their <strong>{formatShort(tonyTarget)}</strong> target. Combined required pipeline: <strong>{formatShort(combinedRequiredPipeline)}</strong>
          </p>
        </div>
        <div className="pipeline-circles">
          <div className="circular-progress-wrapper">
            <CircularProgress
              percent={tonyCoveragePercent}
              label="Tony Goh"
              value={`${formatShort(tonyPipeline)} / ${formatShort(tonyRequiredPipeline)}`}
            />
            <div className="coverage-metrics">
              <div className="coverage-metric-item">
                <span className="coverage-metric-label">Current Pipeline</span>
                <span className="coverage-metric-value">{formatShort(tonyPipeline)}</span>
              </div>
              <div className="coverage-metric-item">
                <span className="coverage-metric-label">Required Pipeline</span>
                <span className="coverage-metric-value coverage-required">{formatShort(tonyRequiredPipeline)}</span>
              </div>
            </div>
          </div>
          <div className="circular-progress-wrapper">
            <CircularProgress
              percent={anthonyCoveragePercent}
              label="Anthony Najafian"
              value={`${formatShort(anthonyPipeline)} / ${formatShort(anthonyRequiredPipeline)}`}
            />
            <div className="coverage-metrics">
              <div className="coverage-metric-item">
                <span className="coverage-metric-label">Current Pipeline</span>
                <span className="coverage-metric-value">{formatShort(anthonyPipeline)}</span>
              </div>
              <div className="coverage-metric-item">
                <span className="coverage-metric-label">Required Pipeline</span>
                <span className="coverage-metric-value coverage-required">{formatShort(anthonyRequiredPipeline)}</span>
              </div>
            </div>
          </div>
          <div className="circular-progress-wrapper">
            <CircularProgress
              percent={combinedCoveragePercent}
              label="Combined Total"
              value={`${formatShort(combinedPipeline)} / ${formatShort(combinedRequiredPipeline)}`}
            />
            <div className="coverage-metrics">
              <div className="coverage-metric-item">
                <span className="coverage-metric-label">Current Pipeline</span>
                <span className="coverage-metric-value">{formatShort(combinedPipeline)}</span>
              </div>
              <div className="coverage-metric-item">
                <span className="coverage-metric-label">Required Pipeline</span>
                <span className="coverage-metric-value coverage-required">{formatShort(combinedRequiredPipeline)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// APP
// ============================================================================
function App() {
  const [pipelineData, setPipelineData] = useState(null)
  const [loadStatus, setLoadStatus] = useState('loading')
  const [winRate, setWinRate] = useState(DATA.pipelineDefaults.winRate)

  useEffect(() => {
    fetch('/data/pipeline.csv')
      .then(response => {
        if (!response.ok) throw new Error('CSV not found')
        return response.text()
      })
      .then(text => {
        const rows = parseCsv(text)

        // Filter and calculate pipeline for each rep (ALL pillars)
        // Note: Trim Owner field to handle leading/trailing spaces in data
        const tonyDeals = rows.filter(row =>
          row.Owner && row.Owner.trim() === 'Tony Goh' &&
          row['Annual Margin']
        ).map(row => ({
          ...row,
          marginValue: parseFloat(row['Annual Margin'].replace(/[^0-9.-]/g, '')) || 0
        }))

        const anthonyDeals = rows.filter(row =>
          row.Owner && row.Owner.trim() === 'Anthony Najafian' &&
          row['Annual Margin']
        ).map(row => ({
          ...row,
          marginValue: parseFloat(row['Annual Margin'].replace(/[^0-9.-]/g, '')) || 0
        }))

        const tonyTotal = tonyDeals.reduce((sum, deal) => sum + deal.marginValue, 0)
        const anthonyTotal = anthonyDeals.reduce((sum, deal) => sum + deal.marginValue, 0)

        setPipelineData({
          totalRows: rows.length,
          tony: {
            deals: tonyDeals,
            totalMargin: tonyTotal
          },
          anthony: {
            deals: anthonyDeals,
            totalMargin: anthonyTotal
          }
        })
        setLoadStatus('success')
      })
      .catch(error => {
        console.error('Error loading pipeline:', error)
        setLoadStatus('error')
      })
  }, [])

  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-content">
        <KPIRow />
        <PipelineVsTarget pipelineData={pipelineData} loadStatus={loadStatus} winRate={winRate} />
        <Motions />
        <ActivitySummary />
        <PipelineAssumptions winRate={winRate} setWinRate={setWinRate} />
      </main>
    </div>
  )
}

export default App
