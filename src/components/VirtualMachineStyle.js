export const vvmStyles = `
.vvm-wrapper .vvm-root {
  min-height: 100vh;
  background: #050708;
  color: #f8fafc;
}

.vvm-wrapper .vvm-page {
  max-width: 1440px;
}

.vvm-wrapper .vvm-eyebrow {
  color: #facc15;
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.32em;
}

.vvm-wrapper .vvm-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 950;
  color: #fff;
  line-height: 1;
}

.vvm-wrapper .vvm-muted {
  color: #94a3b8;
}

.vvm-wrapper .vvm-btn {
  border: 0;
  border-radius: 1.15rem;
  padding: 0.8rem 1rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: 0.18s ease;
}

.vvm-wrapper .vvm-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.vvm-wrapper .vvm-btn-primary {
  background: #facc15;
  color: #071014;
}

.vvm-wrapper .vvm-btn-primary:hover:not(:disabled) {
  background: #fde047;
}

.vvm-wrapper .vvm-btn-soft {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
}

.vvm-wrapper .vvm-btn-soft:hover:not(:disabled) {
  background: rgba(255,255,255,0.14);
}

.vvm-wrapper .vvm-btn-danger {
  background: rgba(239,68,68,0.1);
  color: #fecaca;
  border: 1px solid rgba(248,113,113,0.28);
}

.vvm-wrapper .vvm-card {
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1.6rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.24);
}

.vvm-wrapper .vvm-machine-shell {
  background: #111416;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2.5rem;
  box-shadow: 0 30px 90px rgba(0,0,0,0.38);
}

.vvm-wrapper .vvm-glass-outer {
  background: linear-gradient(180deg, #101826 0%, #020617 52%, #000 100%);
  border: 8px solid #050607;
  border-radius: 2rem;
  box-shadow: inset 0 0 70px rgba(255,255,255,0.04);
}

.vvm-wrapper .vvm-glass-inner {
  border-radius: 1.5rem;
  border: 1px solid rgba(186,230,253,0.1);
  background: rgba(186,230,253,0.035);
  box-shadow: inset 0 0 80px rgba(125,211,252,0.08);
}

.vvm-wrapper .vvm-row-label {
  background: #facc15;
  color: #071014;
  border-radius: 0.55rem;
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 950;
}

.vvm-wrapper .vvm-line {
  height: 1px;
  background: rgba(255,255,255,0.1);
  flex: 1;
}

.vvm-wrapper .vvm-slot-grid-small {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.vvm-wrapper .vvm-slot-grid-large {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .vvm-wrapper .vvm-slot-grid-small {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .vvm-wrapper .vvm-slot-grid-large {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .vvm-wrapper .vvm-slot-grid-large {
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }
}

.vvm-wrapper .vvm-slot {
  width: 100%;
  text-align: left;
  overflow: hidden;
  border-radius: 1.2rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.075);
  color: #fff;
  padding: 0.5rem;
  transition: 0.18s ease;
}

.vvm-wrapper .vvm-slot:hover {
  background: rgba(255,255,255,0.13);
}

.vvm-wrapper .vvm-slot-selected {
  border-color: #fde047;
  background: rgba(254,240,138,0.14);
  box-shadow: 0 0 30px rgba(250,204,21,0.28);
}

.vvm-wrapper .vvm-slot-disabled {
  opacity: 0.45;
  filter: grayscale(1);
}

.vvm-wrapper .vvm-slot-image-wrap {
  position: relative;
  height: 82px;
  overflow: hidden;
  border-radius: 0.9rem;
  background: rgba(0,0,0,0.35);
}

.vvm-wrapper .vvm-slot-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vvm-wrapper .vvm-slot-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 65%, transparent 100%);
}

.vvm-wrapper .vvm-slot-code {
  position: absolute;
  left: 0.35rem;
  bottom: 0.35rem;
  background: rgba(0,0,0,0.75);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 950;
  padding: 0.2rem 0.38rem;
  border-radius: 0.35rem;
}

.vvm-wrapper .vvm-dispensing-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.68);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 900;
}

.vvm-wrapper .vvm-product-name {
  font-size: 0.78rem;
  font-weight: 850;
  color: #fff;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vvm-wrapper .vvm-price {
  color: #fde68a;
  font-size: 0.72rem;
  font-weight: 950;
}

.vvm-wrapper .vvm-stock-ok {
  color: #86efac;
  font-size: 0.68rem;
}

.vvm-wrapper .vvm-stock-low {
  color: #fca5a5;
  font-size: 0.68rem;
}

.vvm-wrapper .vvm-stock-bar {
  height: 0.38rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
}

.vvm-wrapper .vvm-stock-fill-ok {
  height: 100%;
  border-radius: 999px;
  background: #4ade80;
}

.vvm-wrapper .vvm-stock-fill-low {
  height: 100%;
  border-radius: 999px;
  background: #f87171;
}

.vvm-wrapper .vvm-panel {
  height: 100%;
  background: #111416;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2rem;
  box-shadow: 0 30px 90px rgba(0,0,0,0.38);
}

.vvm-wrapper .vvm-online-pill {
  background: rgba(16,185,129,0.1);
  color: #6ee7b7;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 850;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.vvm-wrapper .vvm-lcd-shell {
  border: 1px solid rgba(103,232,249,0.22);
  background: rgba(103,232,249,0.1);
  border-radius: 1.3rem;
}

.vvm-wrapper  .vvm-lcd-screen {
  min-height: 90px;
  background: #dff8ff;
  color: #0f172a;
  border-radius: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.vvm-wrapper .vvm-keypad-box {
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  border-radius: 1.3rem;
}

.vvm-wrapper .vvm-keypad-display {
  background: #000;
  color: #bef264;
  border-radius: 0.8rem;
  padding: 0.55rem 0.8rem;
  min-width: 105px;
  font-size: 1.25rem;
  font-weight: 950;
  letter-spacing: 0.16em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.vvm-wrapper .vvm-key {
  border-radius: 0.8rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: #1e293b;
  color: #fff;
  padding: 0.85rem 0.5rem;
  font-weight: 950;
}

.vvm-wrapper .vvm-key:hover {
  background: #334155;
}

.vvm-wrapper .vvm-command-box {
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.28);
  border-radius: 1.3rem;
}

.vvm-wrapper .vvm-push-button {
  width: 100%;
  max-width: 430px;
  border-radius: 1.25rem;
  border: 4px solid #321a10;
  background: #fff4d2;
  color: #b91c1c;
  padding: 1rem 2rem;
  font-size: 2rem;
  font-weight: 950;
  letter-spacing: 0.25em;
  box-shadow: 0 16px 45px rgba(0,0,0,0.32);
}

.vvm-wrapper .vvm-push-button:hover {
  background: #fff;
}

.vvm-wrapper .vvm-editor {
  background: #15181b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2rem;
  box-shadow: 0 30px 90px rgba(0,0,0,0.35);
}

.vvm-wrapper .vvm-input {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.34);
  color: #fff;
  border-radius: 0.9rem;
  padding: 0.8rem 0.95rem;
  outline: none;
}

.vvm-wrapper .vvm-input:focus {
  border-color: #facc15;
}

.vvm-wrapper .vvm-close-btn {
  border: 0;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
  color: #fff;
  height: 38px;
  width: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vvm-wrapper .vvm-close-btn:hover {
  background: rgba(255,255,255,0.16);
}

.vvm-wrapper .vvm-splash {
  min-height: 100vh;
  background: #050708;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.vvm-wrapper .vvm-splash-glow-one {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 520px;
  height: 520px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgba(250,204,21,0.1);
  filter: blur(70px);
}

.vvm-wrapper .vvm-splash-glow-two {
  position: absolute;
  right: 4rem;
  bottom: 4rem;
  width: 300px;
  height: 300px;
  border-radius: 999px;
  background: rgba(103,232,249,0.1);
  filter: blur(70px);
}

.vvm-wrapper .vvm-splash-card {
  position: relative;
  width: 100%;
  max-width: 1100px;
  background: rgba(16,19,21,0.92);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2.5rem;
  box-shadow: 0 35px 100px rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
}

.vvm-wrapper .vvm-splash-icon {
  height: 64px;
  width: 64px;
  border-radius: 1.5rem;
  background: #facc15;
  color: #071014;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 40px rgba(250,204,21,0.18);
}

.vvm-wrapper .vvm-progress-track {
  height: 1rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
}

.vvm-wrapper .vvm-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #facc15;
}

.vvm-wrapper .vvm-step {
  border-radius: 1.1rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.035);
  color: #94a3b8;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 850;
}

.vvm-wrapper .vvm-step-active {
  border-color: rgba(250,204,21,0.34);
  background: rgba(250,204,21,0.1);
  color: #fef3c7;
}

.vvm-wrapper .vvm-step-done {
  border-color: rgba(110,231,183,0.22);
  background: rgba(52,211,153,0.1);
  color: #a7f3d0;
}

.vvm-wrapper .vvm-step-dot {
  height: 20px;
  width: 20px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.22);
}

.vvm-wrapper .vvm-log-screen {
  height: 360px;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(190,242,100,0.1);
  background: #000;
  color: #bef264;
  padding: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
}

.vvm-wrapper .vvm-log-time {
  color: #64748b;
}
`