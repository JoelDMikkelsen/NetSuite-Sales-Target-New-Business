import { useState } from 'react'
import './App.css'

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
    },
    {
      name: 'Selection Partner Sourcing',
      purpose: 'OPD + SMC deal flow',
      frequency: 'Quarterly',
    },
    {
      name: 'Vendor Co-GTM',
      purpose: 'Celigo / NetStock / SPS attach',
      frequency: 'Ongoing',
    },
    {
      name: 'PE Intros',
      purpose: 'Selective high-value pursuits',
      frequency: 'Opportunistic',
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

  // Talk track timestamps
  talkTrack: [
    { time: '0:00', point: 'Targets + capacity (2 reps, $1.35M total)' },
    { time: '1:00', point: 'What we track (margin only)' },
    { time: '2:00', point: 'BAU engine (Construction anchor)' },
    { time: '4:00', point: 'Vendor acceleration (attach motion)' },
    { time: '5:30', point: 'PE upside (optional)' },
    { time: '6:30', point: 'Close / move on' },
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

function RepTable() {
  return (
    <section className="section">
      <h2 className="section-title">Targets by Rep</h2>
      <table className="rep-table">
        <thead>
          <tr>
            <th>Rep</th>
            <th>NetSuite Margin</th>
            <th>Add-ons Margin</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {DATA.reps.map((rep) => (
            <tr key={rep.name}>
              <td>{rep.name}</td>
              <td title={formatAUD(DATA.perRep.netsuiteMargin)}>
                {formatShort(DATA.perRep.netsuiteMargin)}
              </td>
              <td title={formatAUD(DATA.perRep.addonsMargin)}>
                {formatShort(DATA.perRep.addonsMargin)}
              </td>
              <td title={formatAUD(perRepTotal)}>
                {formatShort(perRepTotal)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td title={formatAUD(totalNetsuiteMargin)}>
              {formatShort(totalNetsuiteMargin)}
            </td>
            <td title={formatAUD(totalAddonsMargin)}>
              {formatShort(totalAddonsMargin)}
            </td>
            <td title={formatAUD(totalMargin)}>
              {formatShort(totalMargin)}
            </td>
          </tr>
        </tfoot>
      </table>
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
          </div>
        ))}
      </div>
    </section>
  )
}

function TalkTrack() {
  return (
    <section className="section">
      <h2 className="section-title">Talk Track</h2>
      <div className="talk-track">
        {DATA.talkTrack.map((item, i) => (
          <div key={i} className="talk-track-item">
            <span className="talk-time">{item.time}</span>
            <span className="talk-point">{item.point}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PipelineAssumptions() {
  const [isOpen, setIsOpen] = useState(false)
  const [winRate, setWinRate] = useState(DATA.pipelineDefaults.winRate)
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
// APP
// ============================================================================
function App() {
  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-content">
        <KPIRow />
        <RepTable />
        <Motions />
        <ActivitySummary />
        <TalkTrack />
        <PipelineAssumptions />
      </main>
    </div>
  )
}

export default App
