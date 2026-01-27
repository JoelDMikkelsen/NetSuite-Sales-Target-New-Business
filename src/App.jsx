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
    winRate: 25,
    avgNetsuiteMarginPerWin: 275000,
    coverageRatio: 3.0,
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
  const [coverage, setCoverage] = useState(DATA.pipelineDefaults.coverageRatio)

  const requiredPipeline = totalNetsuiteMargin / (winRate / 100)
  const coveragePipelineTarget = requiredPipeline * coverage

  return (
    <section className="section">
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide pipeline assumptions' : 'Show pipeline assumptions'}
      </button>

      {isOpen && (
        <div className="pipeline-panel">
          <p className="assumptions-label">Working assumptions</p>

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
            <label>
              <span>Coverage ratio</span>
              <input
                type="number"
                value={coverage}
                onChange={(e) => setCoverage(Number(e.target.value) || 0)}
                step="0.1"
                min="1"
              />
            </label>
          </div>

          <div className="pipeline-outputs">
            <div className="pipeline-output">
              <span className="output-label">Required pipeline margin</span>
              <span className="output-value">{formatShort(requiredPipeline)}</span>
              <span className="output-detail">NetSuite target / win rate</span>
            </div>
            <div className="pipeline-output">
              <span className="output-label">Coverage pipeline target</span>
              <span className="output-value">{formatShort(coveragePipelineTarget)}</span>
              <span className="output-detail">Required pipeline x coverage ratio</span>
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
