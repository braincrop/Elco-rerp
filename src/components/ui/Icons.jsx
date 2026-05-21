/* SVG sprite — rendered once in root layout, hidden from view */
const Icons = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <symbol id="i-dashboard" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2.5" width="5" height="5" rx="1"/>
          <rect x="9" y="2.5" width="5" height="3" rx="1"/>
          <rect x="2" y="9.5" width="5" height="4" rx="1"/>
          <rect x="9" y="7.5" width="5" height="6" rx="1"/>
        </g>
      </symbol>
      <symbol id="i-grid" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/>
          <rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/>
          <rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/>
          <rect x="9" y="9" width="4.5" height="4.5" rx="1"/>
        </g>
      </symbol>
      <symbol id="i-box" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M2.5 5l5.5-2.5L13.5 5v6L8 13.5 2.5 11z"/>
          <path d="M2.5 5L8 7.5 13.5 5M8 7.5v6"/>
        </g>
      </symbol>
      <symbol id="i-branch" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13.5v-8l5-3 5 3v8"/>
          <path d="M3 13.5h10M6 13.5V9.5h4v4M6 6.5h4"/>
        </g>
      </symbol>
      <symbol id="i-list" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M5 4h8M5 8h8M5 12h8"/>
          <circle cx="3" cy="4" r=".6" fill="currentColor"/>
          <circle cx="3" cy="8" r=".6" fill="currentColor"/>
          <circle cx="3" cy="12" r=".6" fill="currentColor"/>
        </g>
      </symbol>
      <symbol id="i-users" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="6" cy="6" r="2.4"/>
          <path d="M2 13c.5-2 2.2-3 4-3s3.5 1 4 3"/>
          <path d="M10.5 6.6a2 2 0 100-3.8M14 12.5c-.3-1.4-1.4-2.3-2.7-2.6"/>
        </g>
      </symbol>
      <symbol id="i-cal" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.5"/>
          <path d="M5 2v3M11 2v3M2.5 7h11"/>
        </g>
      </symbol>
      <symbol id="i-tag" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M2.5 8.2V3a.5.5 0 01.5-.5h5.2a1 1 0 01.7.3l5 5a1 1 0 010 1.4l-4.5 4.5a1 1 0 01-1.4 0l-5-5a1 1 0 01-.3-.7z"/>
          <circle cx="6" cy="6" r="1.1"/>
        </g>
      </symbol>
      <symbol id="i-screen" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2" y="3" width="12" height="8.5" rx="1.2"/>
          <path d="M5.5 14h5M8 11.5V14"/>
        </g>
      </symbol>
      <symbol id="i-bell" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M3.5 11h9c-.8-1-1.2-1.7-1.2-3.5C11.3 5 9.7 3 8 3S4.7 5 4.7 7.5C4.7 9.3 4.3 10 3.5 11z"/>
          <path d="M6.8 13c.2.6.7 1 1.2 1s1-.4 1.2-1"/>
        </g>
      </symbol>
      <symbol id="i-doc" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M4 2.5h5l3 3v8a.5.5 0 01-.5.5h-7.5a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5z"/>
          <path d="M9 2.5v3h3M6 9h4M6 11.5h4"/>
        </g>
      </symbol>
      <symbol id="i-chart" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 13.5h11"/>
          <path d="M4 11V7M7 11V4.5M10 11V8M13 11V5.5"/>
        </g>
      </symbol>
      <symbol id="i-device" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="4" y="2" width="8" height="12" rx="1.4"/>
          <path d="M7 12.5h2"/>
        </g>
      </symbol>
      <symbol id="i-globe" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8" cy="8" r="5.5"/>
          <path d="M2.5 8h11M8 2.5c1.8 2 1.8 9 0 11M8 2.5c-1.8 2-1.8 9 0 11"/>
        </g>
      </symbol>
      <symbol id="i-search" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="7" cy="7" r="3.8"/>
          <path d="M10 10l3 3"/>
        </g>
      </symbol>
      <symbol id="i-plus" viewBox="0 0 16 16">
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </symbol>
      <symbol id="i-edit" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M3 13l.5-2.5 7-7 2 2-7 7L3 13z"/>
          <path d="M9.5 4l2 2"/>
        </g>
      </symbol>
      <symbol id="i-trash" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 4.5h9M5.5 4.5V3.5h5v1M4.5 4.5l.5 8.5a1 1 0 001 1h4a1 1 0 001-1l.5-8.5"/>
          <path d="M7 7v4M9 7v4"/>
        </g>
      </symbol>
      <symbol id="i-eye" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1.5 8s2-4.5 6.5-4.5S14.5 8 14.5 8s-2 4.5-6.5 4.5S1.5 8 1.5 8z"/>
          <circle cx="8" cy="8" r="1.8"/>
        </g>
      </symbol>
      <symbol id="i-down" viewBox="0 0 16 16">
        <path d="M4 6.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-up" viewBox="0 0 16 16">
        <path d="M4 9.5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-filter" viewBox="0 0 16 16">
        <path d="M2.5 3.5h11l-4 5v4l-3 1.5v-5.5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-sort" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M5 3v10M3 11l2 2 2-2M11 13V3M9 5l2-2 2 2"/>
        </g>
      </symbol>
      <symbol id="i-col" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2.5" y="2.5" width="11" height="11" rx="1.2"/>
          <path d="M6 2.5v11M10 2.5v11"/>
        </g>
      </symbol>
      <symbol id="i-arrow" viewBox="0 0 16 16">
        <path d="M3.5 8h9M9 4.5l3.5 3.5-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-x" viewBox="0 0 16 16">
        <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </symbol>
      <symbol id="i-check" viewBox="0 0 16 16">
        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-up-r" viewBox="0 0 16 16">
        <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-sun-moon" viewBox="0 0 16 16">
        <path d="M11.5 9.5A4 4 0 016 5a3.5 3.5 0 00-.4 7c.6.2 1.3.3 2 .3a4 4 0 003.9-2.8z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-cog" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8" cy="8" r="2"/>
          <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/>
        </g>
      </symbol>
      <symbol id="i-user" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8" cy="6" r="2.5"/>
          <path d="M3 13c.6-2.4 2.7-3.5 5-3.5s4.4 1.1 5 3.5"/>
        </g>
      </symbol>
      <symbol id="i-id" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2" y="3.5" width="12" height="9" rx="1.5"/>
          <circle cx="6" cy="8" r="1.6"/>
          <path d="M3.6 11.4c.4-1 1.3-1.6 2.4-1.6s2 .6 2.4 1.6M10 7h2.5M10 9.5h2"/>
        </g>
      </symbol>
      <symbol id="i-lock" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="3" y="7" width="10" height="7" rx="1.4"/>
          <path d="M5.5 7V5a2.5 2.5 0 015 0v2"/>
        </g>
      </symbol>
      <symbol id="i-sliders" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M3 4.5h6M11 4.5h2M3 11.5h2M7 11.5h6"/>
          <circle cx="10" cy="4.5" r="1.3"/>
          <circle cx="6" cy="11.5" r="1.3"/>
        </g>
      </symbol>
      <symbol id="i-shield" viewBox="0 0 16 16">
        <path d="M8 1.8l5 1.7v4c0 3-2 5.4-5 6.7-3-1.3-5-3.7-5-6.7v-4z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </symbol>
      <symbol id="i-palette" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M8 2.5C4.7 2.5 2 5 2 8.2c0 1.7 1.2 2.8 2.8 2.8H6c.8 0 1.4.6 1.4 1.4 0 .8.6 1.4 1.4 1.4 3.1 0 5.7-2.6 5.7-5.7 0-3.1-2.9-5.6-6.5-5.6z"/>
          <circle cx="5" cy="7" r=".8" fill="currentColor"/>
          <circle cx="8" cy="5" r=".8" fill="currentColor"/>
          <circle cx="11" cy="7" r=".8" fill="currentColor"/>
        </g>
      </symbol>
      <symbol id="i-upload" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11v1.5a1 1 0 001 1h8a1 1 0 001-1V11"/>
          <path d="M8 2.5v8M5 5.5l3-3 3 3"/>
        </g>
      </symbol>
      <symbol id="i-warn" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M8 2.5l6 10H2z"/>
          <path d="M8 6.5v3M8 11h0" strokeLinecap="round"/>
        </g>
      </symbol>
      <symbol id="i-link" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M7 9.5l-2 2a2 2 0 11-2.8-2.8l2-2M9 6.5l2-2a2 2 0 112.8 2.8l-2 2M5.5 10.5l5-5"/>
        </g>
      </symbol>
      <symbol id="i-monitor" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2" y="3" width="12" height="8" rx="1.2"/>
          <path d="M5.5 14h5M8 11.5V14"/>
        </g>
      </symbol>
      <symbol id="i-phone" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="5" y="2" width="6" height="12" rx="1.2"/>
          <path d="M7 12.5h2"/>
        </g>
      </symbol>
      <symbol id="i-mail" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <rect x="2" y="3.5" width="12" height="9" rx="1.4"/>
          <path d="M2.5 5l5.5 4 5.5-4"/>
        </g>
      </symbol>
      <symbol id="i-drag" viewBox="0 0 16 16">
        <g fill="currentColor">
          <circle cx="5.5" cy="4" r="1"/>
          <circle cx="5.5" cy="8" r="1"/>
          <circle cx="5.5" cy="12" r="1"/>
          <circle cx="9.5" cy="4" r="1"/>
          <circle cx="9.5" cy="8" r="1"/>
          <circle cx="9.5" cy="12" r="1"/>
        </g>
      </symbol>
      <symbol id="i-import" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11v1.5a1 1 0 001 1h8a1 1 0 001-1V11"/>
          <path d="M8 2.5v8M5 7.5l3 3 3-3"/>
        </g>
      </symbol>
      <symbol id="i-sms" viewBox="0 0 16 16">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2.5 3.5h11a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H5l-3 2V4a.5.5 0 01.5-.5z"/>
          <path d="M5 7.5h6M5 10h4"/>
        </g>
      </symbol>
    </defs>
  </svg>
)

export default Icons
