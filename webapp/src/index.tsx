import { Hono } from 'hono'

const app = new Hono()

const MAP_EMBED_URL = "https://www.google.com/maps/d/u/0/embed?mid=1TiKfBdWNTFHb1xDB9f1hA5Ck7Xz9g5k&ehbc=2E312F"
const MAP_VIEW_URL  = "https://www.google.com/maps/d/u/0/viewer?mid=1TiKfBdWNTFHb1xDB9f1hA5Ck7Xz9g5k"

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RDMS Inc. — PETC & PMVIC Dashboard</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<script src="https://cdn.tailwindcss.com"></script>
<style>
/* ── TOKENS ─────────────────────────────── */
:root{
  --bg:       #0b0f1a;
  --surface:  #111827;
  --surface2: #1a2235;
  --border:   #1e2d45;
  --accent:   #00d4ff;
  --accent2:  #7c3aed;
  --green:    #10b981;
  --red:      #ef4444;
  --orange:   #f59e0b;
  --blue:     #3b82f6;
  --text:     #e2e8f0;
  --muted:    #64748b;
  --pmvic:    #a78bfa;
  --petcl:    #38bdf8;
  --petcv:    #34d399;
  --petcm:    #fb7185;
  --lto:      #fbbf24;
}

*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--text);font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh}

/* ── SCROLLBAR ──────────────────────────── */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--surface)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

/* ── GLOW UTILITIES ─────────────────────── */
.glow-accent  {box-shadow:0 0 18px rgba(0,212,255,0.25)}
.glow-purple  {box-shadow:0 0 18px rgba(124,58,237,0.25)}
.glow-green   {box-shadow:0 0 18px rgba(16,185,129,0.25)}
.glow-red     {box-shadow:0 0 18px rgba(239,68,68,0.25)}
.text-accent  {color:var(--accent)}
.border-accent{border-color:var(--accent)!important}

/* ── TICKER BAR ─────────────────────────── */
#tickerWrap{
  background: linear-gradient(90deg,#0f172a 0%,#1e293b 50%,#0f172a 100%);
  border-top:   1px solid var(--border);
  border-bottom:1px solid var(--border);
  overflow:hidden; height:38px; display:flex; align-items:center;
  position:relative;
}
#tickerLabel{
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  color:#fff; font-size:.7rem; font-weight:800; letter-spacing:2px;
  padding:0 16px; height:100%; display:flex; align-items:center;
  white-space:nowrap; z-index:2; flex-shrink:0;
  clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%);
  padding-right:26px;
}
.ticker-track{
  display:flex; align-items:center; gap:0;
  animation: ticker-scroll 80s linear infinite;
  white-space:nowrap; will-change:transform;
}
.ticker-track:hover{animation-play-state:paused}
@keyframes ticker-scroll{
  0%  {transform:translateX(0)}
  100%{transform:translateX(-50%)}
}
.ticker-item{
  display:inline-flex; align-items:center; gap:8px;
  font-size:.72rem; font-weight:600; padding:0 28px;
  color:var(--text); border-right:1px solid var(--border);
}
.ticker-item .ti-dot{
  width:7px;height:7px;border-radius:50%;flex-shrink:0;
  animation:pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
.ticker-num{color:var(--accent);font-weight:800;font-size:.82rem}
.ticker-sep{color:var(--muted);padding:0 6px}

/* ── HEADER ─────────────────────────────── */
header{
  background:linear-gradient(135deg,#060d1a 0%,#0f1f3d 60%,#060d1a 100%);
  border-bottom:1px solid var(--border);
  padding:18px 24px;
}
.logo-ring{
  width:52px;height:52px;border-radius:14px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 20px rgba(0,212,255,0.4);
  flex-shrink:0;
}
.hdg-title{font-size:1.35rem;font-weight:800;color:#fff;letter-spacing:.5px}
.hdg-sub  {font-size:.68rem;color:var(--muted);letter-spacing:3px;text-transform:uppercase;margin-top:2px}

/* live pulse */
.live-badge{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.3);
  color:var(--green);border-radius:999px;padding:4px 12px;font-size:.7rem;font-weight:700;
}
.live-dot{
  width:7px;height:7px;border-radius:50%;background:var(--green);
  animation:live-pulse 1.4s ease-in-out infinite;
}
@keyframes live-pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.6)}50%{box-shadow:0 0 0 5px rgba(16,185,129,0)}}

/* ── STAT CARDS ─────────────────────────── */
.stat-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;padding:16px 24px}
@media(max-width:1100px){.stat-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:640px) {.stat-grid{grid-template-columns:repeat(2,1fr)}}

.sc{
  background:var(--surface);border:1px solid var(--border);border-radius:14px;
  padding:16px; position:relative; overflow:hidden;
  transition:transform .2s,border-color .2s;cursor:default;
}
.sc:hover{transform:translateY(-4px)}
.sc::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  border-radius:14px 14px 0 0;
}
.sc.s-total::before {background:linear-gradient(90deg,var(--accent),var(--accent2))}
.sc.s-pmvic::before {background:var(--pmvic)}
.sc.s-petcl::before {background:var(--petcl)}
.sc.s-petcv::before {background:var(--petcv)}
.sc.s-petcm::before {background:var(--petcm)}
.sc.s-lto::before   {background:var(--lto)}
.sc:hover.s-total{border-color:var(--accent);glow-accent}
.sc:hover.s-pmvic{border-color:var(--pmvic)}
.sc:hover.s-petcl{border-color:var(--petcl)}
.sc:hover.s-petcv{border-color:var(--petcv)}
.sc:hover.s-petcm{border-color:var(--petcm)}
.sc:hover.s-lto  {border-color:var(--lto)}

.sc-num{font-size:2rem;font-weight:900;line-height:1;font-variant-numeric:tabular-nums}
.sc-label{font-size:.7rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-top:4px}
.sc-icon{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:2rem;opacity:.1}

.sc.s-total .sc-num{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sc.s-pmvic .sc-num{color:var(--pmvic)}
.sc.s-petcl .sc-num{color:var(--petcl)}
.sc.s-petcv .sc-num{color:var(--petcv)}
.sc.s-petcm .sc-num{color:var(--petcm)}
.sc.s-lto   .sc-num{color:var(--lto)}

/* sparkbar */
.spark{height:4px;border-radius:2px;margin-top:10px;background:var(--border);overflow:hidden}
.spark-fill{height:100%;border-radius:2px;transition:width 1.2s ease}

/* ── LIVE COUNTER WIDGET ────────────────── */
.live-widget{
  background:var(--surface);border:1px solid var(--border);border-radius:14px;
  padding:14px 20px; display:flex; align-items:center; gap:14px;
  margin:0 24px 16px;
  background:linear-gradient(135deg,rgba(0,212,255,.04),rgba(124,58,237,.04));
  border-color:rgba(0,212,255,.2);
}
.lw-icon{
  width:44px;height:44px;border-radius:12px;flex-shrink:0;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  font-size:1.1rem;color:#fff;box-shadow:0 0 14px rgba(0,212,255,.35);
}
.lw-label{font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px}
.lw-val{font-size:1.6rem;font-weight:900;color:var(--accent);font-variant-numeric:tabular-nums;line-height:1.1}
.lw-sub{font-size:.7rem;color:var(--muted);margin-top:2px}
.lw-divider{width:1px;background:var(--border);align-self:stretch;margin:0 6px}

/* counting animation */
@keyframes count-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.count-anim{animation:count-up .4s ease}

/* ── MAIN BODY ──────────────────────────── */
.main-grid{
  display:grid;grid-template-columns:340px 1fr;gap:16px;
  padding:0 24px 24px;
}
@media(max-width:1024px){.main-grid{grid-template-columns:1fr}}

/* ── SIDEBAR ─────────────────────────────── */
.sidebar{display:flex;flex-direction:column;gap:12px}

/* search */
.search-wrap{position:relative}
.search-wrap input{
  width:100%;background:var(--surface);border:1px solid var(--border);
  border-radius:10px;padding:10px 14px 10px 38px;color:var(--text);
  font-size:.82rem;outline:none;transition:border-color .2s,box-shadow .2s;
}
.search-wrap input::placeholder{color:var(--muted)}
.search-wrap input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,212,255,.12)}
.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:.8rem}

/* filter tabs */
.ftabs{display:flex;flex-wrap:wrap;gap:7px}
.ftab{
  padding:6px 14px;border-radius:999px;font-size:.72rem;font-weight:700;
  cursor:pointer;border:1.5px solid var(--border);background:var(--surface);
  color:var(--muted);transition:all .18s;display:flex;align-items:center;gap:5px;
}
.ftab:hover{border-color:var(--muted);color:var(--text)}
.ftab.active{color:#fff;border-color:transparent}
.ftab.fa-all   .active,.ftab.active.t-all  {background:linear-gradient(135deg,var(--accent),var(--accent2))}
.ftab.active.t-pmvic {background:var(--pmvic);color:#0b0f1a}
.ftab.active.t-petcl {background:var(--petcl);color:#0b0f1a}
.ftab.active.t-petcv {background:var(--petcv);color:#0b0f1a}
.ftab.active.t-petcm {background:var(--petcm)}
.ftab.active.t-lto   {background:var(--lto);color:#0b0f1a}

/* location list */
.loc-panel{
  background:var(--surface);border:1px solid var(--border);
  border-radius:14px;overflow:hidden;flex:1;
}
.loc-header{
  padding:10px 16px;border-bottom:1px solid var(--border);
  display:flex;justify-content:space-between;align-items:center;
  background:var(--surface2);
}
.loc-header-title{font-size:.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px}
#visibleCount{font-size:.72rem;color:var(--accent);font-weight:700}

#locationList{height:480px;overflow-y:auto}
.loc-item{
  display:flex;align-items:center;gap:10px;padding:10px 16px;
  border-bottom:1px solid rgba(30,45,69,.6);cursor:pointer;
  transition:background .15s;
}
.loc-item:hover{background:rgba(0,212,255,.05)}
.loc-item.active{background:rgba(0,212,255,.09);border-left:2px solid var(--accent)}
.loc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.loc-name{font-size:.78rem;font-weight:500;color:var(--text);line-height:1.3;flex:1}
.loc-badge{
  font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:999px;
  white-space:nowrap;flex-shrink:0;border:1px solid transparent;
}
.b-pmvic{background:rgba(167,139,250,.12);color:var(--pmvic);border-color:rgba(167,139,250,.25)}
.b-petcl{background:rgba(56,189,248,.12);color:var(--petcl);border-color:rgba(56,189,248,.25)}
.b-petcv{background:rgba(52,211,153,.12);color:var(--petcv);border-color:rgba(52,211,153,.25)}
.b-petcm{background:rgba(251,113,133,.12);color:var(--petcm);border-color:rgba(251,113,133,.25)}
.b-lto  {background:rgba(251,191,36,.12); color:var(--lto);  border-color:rgba(251,191,36,.25)}

/* category dot colors */
.d-pmvic{background:var(--pmvic)}
.d-petcl{background:var(--petcl)}
.d-petcv{background:var(--petcv)}
.d-petcm{background:var(--petcm)}
.d-lto  {background:var(--lto)}

/* ── DETAIL PANEL ───────────────────────── */
#detailPanel{
  background:var(--surface2);border:1px solid var(--border);border-radius:14px;
  padding:18px;display:none;
  border-top:2px solid var(--accent);
  animation:slide-up .22s ease;
}
@keyframes slide-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.dp-name{font-size:.95rem;font-weight:700;color:#fff;line-height:1.3;margin-bottom:6px}
.dp-desc{font-size:.75rem;color:var(--muted);margin-bottom:12px;min-height:16px}
.dp-coords{font-size:.68rem;color:var(--muted);font-family:monospace;margin-bottom:14px}
.dp-actions{display:flex;gap:8px;flex-wrap:wrap}
.btn-maps{
  display:inline-flex;align-items:center;gap:6px;
  background:linear-gradient(135deg,var(--accent),#0099cc);
  color:#0b0f1a;font-size:.75rem;font-weight:700;
  padding:8px 16px;border-radius:8px;text-decoration:none;
  transition:opacity .18s,transform .15s;border:none;cursor:pointer;
}
.btn-maps:hover{opacity:.85;transform:translateY(-1px)}
.btn-close{
  display:inline-flex;align-items:center;gap:6px;
  background:var(--surface);color:var(--muted);font-size:.75rem;font-weight:600;
  padding:8px 14px;border-radius:8px;border:1px solid var(--border);cursor:pointer;
  transition:color .18s,border-color .18s;
}
.btn-close:hover{color:var(--text);border-color:var(--muted)}

/* ── MAP PANEL ──────────────────────────── */
.map-panel{display:flex;flex-direction:column;gap:12px}
.map-frame-wrap{
  border-radius:14px;overflow:hidden;border:1px solid var(--border);
  position:relative;background:var(--surface);
}
#mapFrame{width:100%;height:560px;display:block;border:0}
.map-btn{
  position:absolute;top:12px;right:12px;z-index:5;
  background:rgba(11,15,26,.85);backdrop-filter:blur(8px);
  color:var(--accent);border:1px solid rgba(0,212,255,.3);
  border-radius:8px;padding:8px 14px;font-size:.75rem;font-weight:700;
  cursor:pointer;transition:background .18s;display:flex;align-items:center;gap:6px;
}
.map-btn:hover{background:rgba(0,212,255,.12)}

/* legend row */
.legend-row{
  display:grid;grid-template-columns:repeat(5,1fr);gap:10px;
}
@media(max-width:768px){.legend-row{grid-template-columns:repeat(3,1fr)}}
.lg-card{
  background:var(--surface);border:1px solid var(--border);border-radius:10px;
  padding:10px;display:flex;flex-direction:column;align-items:center;text-align:center;
  transition:border-color .18s,transform .18s;cursor:default;
}
.lg-card:hover{transform:translateY(-2px)}
.lg-dot-big{width:14px;height:14px;border-radius:50%;margin-bottom:6px}
.lg-name{font-size:.68rem;font-weight:700;color:var(--text)}
.lg-sub{font-size:.6rem;color:var(--muted);margin-top:2px}

/* ── INFO STRIP ─────────────────────────── */
.info-strip{
  background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.15);
  border-radius:10px;padding:12px 16px;display:flex;align-items:start;gap:10px;
  font-size:.72rem;color:rgba(147,197,235,.8);line-height:1.5;
}
.info-strip i{color:var(--accent);margin-top:1px;flex-shrink:0}

/* ── FOOTER ─────────────────────────────── */
footer{
  border-top:1px solid var(--border);background:var(--surface);
  padding:12px 24px;display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;gap:8px;
}
footer span{font-size:.68rem;color:var(--muted)}

/* ── ANIMATIONS ─────────────────────────── */
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeIn .22s ease both}

/* no results */
.no-results{padding:40px 20px;text-align:center;color:var(--muted)}
.no-results i{font-size:2.5rem;margin-bottom:10px;display:block;opacity:.3}

/* clock */
#liveClock{font-size:.8rem;color:var(--accent);font-weight:700;font-family:monospace;letter-spacing:1px}
#liveDate{font-size:.65rem;color:var(--muted)}

/* responsive */
@media(max-width:1024px){
  .main-grid{padding:0 12px 12px}
  .stat-grid{padding:12px}
  .live-widget{margin:0 12px 12px}
  header{padding:14px 16px}
  #mapFrame{height:400px}
  #locationList{height:380px}
}
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════
     HEADER
═══════════════════════════════════════════════════ -->
<header>
  <div style="max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
    <!-- Logo + Title -->
    <div style="display:flex;align-items:center;gap:14px">
      <div class="logo-ring"><i class="fas fa-map-marked-alt" style="font-size:1.3rem;color:#fff"></i></div>
      <div>
        <div class="hdg-title">RDMS Inc.</div>
        <div class="hdg-sub">PETC &amp; PMVIC Location Intelligence Dashboard · Philippines</div>
      </div>
    </div>
    <!-- Right cluster -->
    <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
      <!-- Live clock -->
      <div style="text-align:right">
        <div id="liveClock">--:--:--</div>
        <div id="liveDate">Loading…</div>
      </div>
      <!-- Live badge -->
      <div class="live-badge"><span class="live-dot"></span>LIVE DATA</div>
      <!-- Full map btn -->
      <a href="${MAP_VIEW_URL}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.3);color:var(--accent);font-size:.75rem;font-weight:700;padding:8px 16px;border-radius:8px;text-decoration:none;transition:background .18s" onmouseover="this.style.background='rgba(0,212,255,.18)'" onmouseout="this.style.background='rgba(0,212,255,.1)'">
        <i class="fas fa-external-link-alt"></i> Full Map
      </a>
    </div>
  </div>
</header>

<!-- ══════════════════════════════════════════════════
     TICKER BAR
═══════════════════════════════════════════════════ -->
<div id="tickerWrap">
  <div class="tickerLabel" id="tickerLabel" style="background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-size:.68rem;font-weight:800;letter-spacing:2px;padding:0 20px 0 16px;height:100%;display:flex;align-items:center;white-space:nowrap;flex-shrink:0;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%);padding-right:28px;z-index:2">
    ⚡ LIVE FEED
  </div>
  <div style="overflow:hidden;flex:1">
    <div class="ticker-track" id="tickerTrack"><!-- JS fills --></div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════
     STAT CARDS
═══════════════════════════════════════════════════ -->
<div style="max-width:1400px;margin:0 auto">
<div class="stat-grid">
  <div class="sc s-total">
    <div class="sc-num" id="cntTotal">0</div>
    <div class="sc-label">All Locations</div>
    <div class="spark"><div class="spark-fill" id="spkTotal" style="background:linear-gradient(90deg,var(--accent),var(--accent2));width:0%"></div></div>
    <i class="fas fa-globe-asia sc-icon"></i>
  </div>
  <div class="sc s-pmvic">
    <div class="sc-num" id="cntPmvic">0</div>
    <div class="sc-label">PMVIC</div>
    <div class="spark"><div class="spark-fill" id="spkPmvic" style="background:var(--pmvic);width:0%"></div></div>
    <i class="fas fa-car-side sc-icon"></i>
  </div>
  <div class="sc s-petcl">
    <div class="sc-num" id="cntPetcL">0</div>
    <div class="sc-label">PETC Luzon</div>
    <div class="spark"><div class="spark-fill" id="spkPetcL" style="background:var(--petcl);width:0%"></div></div>
    <i class="fas fa-smog sc-icon"></i>
  </div>
  <div class="sc s-petcv">
    <div class="sc-num" id="cntPetcV">0</div>
    <div class="sc-label">PETC Visayas</div>
    <div class="spark"><div class="spark-fill" id="spkPetcV" style="background:var(--petcv);width:0%"></div></div>
    <i class="fas fa-smog sc-icon"></i>
  </div>
  <div class="sc s-petcm">
    <div class="sc-num" id="cntPetcM">0</div>
    <div class="sc-label">PETC Mindanao</div>
    <div class="spark"><div class="spark-fill" id="spkPetcM" style="background:var(--petcm);width:0%"></div></div>
    <i class="fas fa-smog sc-icon"></i>
  </div>
  <div class="sc s-lto">
    <div class="sc-num" id="cntLTO">0</div>
    <div class="sc-label">LTO Offices</div>
    <div class="spark"><div class="spark-fill" id="spkLTO" style="background:var(--lto);width:0%"></div></div>
    <i class="fas fa-building sc-icon"></i>
  </div>
</div>

<!-- ══════════════════════════════════════════════════
     LIVE COUNTER WIDGET
═══════════════════════════════════════════════════ -->
<div class="live-widget">
  <div class="lw-icon"><i class="fas fa-chart-bar"></i></div>
  <div>
    <div class="lw-label">Total PETC Clients</div>
    <div class="lw-val" id="lwPetcTotal">0</div>
    <div class="lw-sub">(Luzon + Visayas + Mindanao combined)</div>
  </div>
  <div class="lw-divider"></div>
  <div>
    <div class="lw-label">PMVIC Centers</div>
    <div class="lw-val" id="lwPmvic" style="color:var(--pmvic)">0</div>
    <div class="lw-sub">Private Motor Vehicle Inspection</div>
  </div>
  <div class="lw-divider"></div>
  <div>
    <div class="lw-label">LTO Satellite Offices</div>
    <div class="lw-val" id="lwLTO" style="color:var(--lto)">0</div>
    <div class="lw-sub">Nationwide Coverage</div>
  </div>
  <div class="lw-divider"></div>
  <div>
    <div class="lw-label">Coverage</div>
    <div class="lw-val" style="color:var(--green)" id="lwCoverage">0</div>
    <div class="lw-sub">Philippine Regions Covered</div>
  </div>
  <div class="lw-divider"></div>
  <!-- live update time -->
  <div style="margin-left:auto;text-align:right">
    <div style="font-size:.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px">Last Updated</div>
    <div id="lastUpdated" style="font-size:.78rem;color:var(--accent);font-weight:700;font-family:monospace">--:--:--</div>
    <div style="font-size:.6rem;color:var(--muted);margin-top:2px" id="nextUpdate">Next refresh in 60s</div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════
     MAIN GRID
═══════════════════════════════════════════════════ -->
<div class="main-grid">

  <!-- ─── SIDEBAR ─────────────────────────────── -->
  <div class="sidebar">

    <!-- Search -->
    <div class="search-wrap">
      <i class="fas fa-search search-icon"></i>
      <input id="searchInput" type="text" placeholder="Search location name…" oninput="renderList()">
    </div>

    <!-- Filter Tabs -->
    <div class="ftabs">
      <button class="ftab active t-all"   onclick="setFilter('all')"   id="tab-all">
        <i class="fas fa-th-large"></i> All
      </button>
      <button class="ftab t-pmvic" onclick="setFilter('pmvic')" id="tab-pmvic">
        <i class="fas fa-car-side"></i> PMVIC
      </button>
      <button class="ftab t-petcl" onclick="setFilter('petcl')" id="tab-petcl">
        <i class="fas fa-smog"></i> PETC Luzon
      </button>
      <button class="ftab t-petcv" onclick="setFilter('petcv')" id="tab-petcv">
        <i class="fas fa-smog"></i> PETC Visayas
      </button>
      <button class="ftab t-petcm" onclick="setFilter('petcm')" id="tab-petcm">
        <i class="fas fa-smog"></i> PETC Mindanao
      </button>
      <button class="ftab t-lto"   onclick="setFilter('lto')"  id="tab-lto">
        <i class="fas fa-building"></i> LTO
      </button>
    </div>

    <!-- List panel -->
    <div class="loc-panel">
      <div class="loc-header">
        <span class="loc-header-title"><i class="fas fa-list-ul" style="margin-right:6px"></i>Locations</span>
        <span id="visibleCount">—</span>
      </div>
      <div id="locationList"></div>
    </div>

    <!-- Detail panel -->
    <div id="detailPanel">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div id="dpDot" style="width:12px;height:12px;border-radius:50%;flex-shrink:0"></div>
        <span id="dpBadge" class="loc-badge"></span>
      </div>
      <div class="dp-name" id="dpName"></div>
      <div class="dp-desc" id="dpDesc"></div>
      <div class="dp-coords" id="dpCoords"></div>
      <div class="dp-actions">
        <a id="dpMapLink" href="#" target="_blank" class="btn-maps">
          <i class="fas fa-map-marker-alt"></i> View in Google Maps
        </a>
        <button class="btn-close" onclick="closeDetail()">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>

  </div><!-- /sidebar -->

  <!-- ─── MAP PANEL ────────────────────────── -->
  <div class="map-panel">
    <div class="map-frame-wrap">
      <iframe id="mapFrame"
        src="${MAP_EMBED_URL}"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
      <button class="map-btn" onclick="window.open('${MAP_VIEW_URL}','_blank')">
        <i class="fas fa-expand-alt"></i> Full Screen
      </button>
    </div>

    <!-- Legend -->
    <div class="legend-row">
      <div class="lg-card" style="border-top:2px solid var(--pmvic)">
        <div class="lg-dot-big" style="background:var(--pmvic)"></div>
        <div class="lg-name">PMVIC</div>
        <div class="lg-sub">Vehicle Inspection</div>
      </div>
      <div class="lg-card" style="border-top:2px solid var(--petcl)">
        <div class="lg-dot-big" style="background:var(--petcl)"></div>
        <div class="lg-name">PETC Luzon</div>
        <div class="lg-sub">Emission Testing</div>
      </div>
      <div class="lg-card" style="border-top:2px solid var(--petcv)">
        <div class="lg-dot-big" style="background:var(--petcv)"></div>
        <div class="lg-name">PETC Visayas</div>
        <div class="lg-sub">Emission Testing</div>
      </div>
      <div class="lg-card" style="border-top:2px solid var(--petcm)">
        <div class="lg-dot-big" style="background:var(--petcm)"></div>
        <div class="lg-name">PETC Mindanao</div>
        <div class="lg-sub">Emission Testing</div>
      </div>
      <div class="lg-card" style="border-top:2px solid var(--lto)">
        <div class="lg-dot-big" style="background:var(--lto)"></div>
        <div class="lg-name">LTO Office</div>
        <div class="lg-sub">Land Transport</div>
      </div>
    </div>

    <!-- Info strip -->
    <div class="info-strip">
      <i class="fas fa-info-circle"></i>
      <span><strong style="color:var(--accent)">Tip:</strong> Click any row in the location list to see its details and open the exact pinpoint in Google Maps. Use the filter tabs or search box to narrow down results. Hover on the ticker to pause it.</span>
    </div>
  </div><!-- /map-panel -->

</div><!-- /main-grid -->
</div><!-- /max-width wrapper -->

<!-- ══════════════════════════════════════════════════
     FOOTER
═══════════════════════════════════════════════════ -->
<footer>
  <span>© 2025 <strong style="color:var(--accent)">RDMS Inc.</strong> — All Rights Reserved</span>
  <span id="footerStats">Loading stats…</span>
  <span>Philippine PETC &amp; PMVIC Client Registry</span>
</footer>

<!-- ══════════════════════════════════════════════════
     DATA + LOGIC
═══════════════════════════════════════════════════ -->
<script>
// ════════════════════════════════════════
// DATA
// ════════════════════════════════════════
const LOCATIONS=[
  // PMVIC
  {id:1,  name:"South MM Vehicle Registration Services Inc.",    cat:"pmvic",lat:14.382188, lng:121.0441511,desc:""},
  {id:2,  name:"TRUE SOUTH VEHICLE REGISTRATION SERVICES",       cat:"pmvic",lat:14.3821888,lng:121.0439561,desc:""},
  {id:3,  name:"TQM Vehicle Inspection Service Manila PMVIC",    cat:"pmvic",lat:14.5850784,lng:120.9913746,desc:""},
  {id:4,  name:"TYLJ Auto Inspection Center (MVIC)",             cat:"pmvic",lat:14.5591307,lng:121.080293, desc:""},
  {id:5,  name:"Kingsway Inspection Services Corp.",             cat:"pmvic",lat:14.4124439,lng:121.0151549,desc:""},
  {id:6,  name:"ABC FURNITURE LINES INC.",                       cat:"pmvic",lat:14.7010973,lng:120.9837388,desc:"ABC PMVIC - Private Motor Vehicle Inspection Center"},
  {id:7,  name:"APCMVIC INC. PMVIC",                            cat:"pmvic",lat:14.7038601,lng:121.0397027,desc:"APC Emission (APC PMVIC)"},
  {id:8,  name:"AUTOTEC AUTOMOTIVE TESTING CENTER, INC.",        cat:"pmvic",lat:14.5853006,lng:121.0479118,desc:"AutoTEC (Automotive Testing Center)"},
  {id:9,  name:"4CG MVIC Pagsanjan",                            cat:"pmvic",lat:14.2653858,lng:121.440606, desc:""},
  {id:10, name:"ABONDANTE MOTOR VEHICLE INSPECTION SERVICES",    cat:"pmvic",lat:14.3220176,lng:121.1115341,desc:""},
  {id:11, name:"BGT Vehicle Inspection Center",                  cat:"pmvic",lat:14.7555577,lng:121.0165013,desc:"BGT Auto Inspection Center"},
  {id:12, name:"Blue Circle Motor Vehicle Inspection Center",    cat:"pmvic",lat:8.2117891, lng:124.2451722,desc:""},
  {id:13, name:"EBVC Motor Vehicle Inspection Services",         cat:"pmvic",lat:16.3895081,lng:120.5627716,desc:""},
  {id:14, name:"G3MS Motor Vehicle Inspection, Inc.",            cat:"pmvic",lat:7.831632,  lng:123.412179, desc:""},
  {id:15, name:"GOLDEN STAR PRIVATE MOTOR VEHICLE INSPECTION",   cat:"pmvic",lat:16.6968369,lng:121.5851431,desc:""},
  {id:16, name:"GSC Vehicle Inspection Center Inc.",             cat:"pmvic",lat:6.1190063, lng:125.1641728,desc:""},
  {id:17, name:"Hakoo and Sons Motor Vehicle Inspection Center", cat:"pmvic",lat:14.6382637,lng:120.533743, desc:""},
  {id:18, name:"PHESCO PMVIC",                                   cat:"pmvic",lat:14.6306031,lng:121.0113784,desc:""},
  {id:19, name:"QWIK Private Motor Vehicle Inspection Center",   cat:"pmvic",lat:15.1298548,lng:120.5973929,desc:""},
  {id:20, name:"RDC SERBISYO PUBLICO PMVIC - Mati",             cat:"pmvic",lat:6.9461763, lng:126.2556702,desc:""},
  {id:21, name:"RDC SERBISYO PUBLICO PMVIC Cotabato",           cat:"pmvic",lat:7.2004008, lng:124.2474168,desc:""},
  {id:22, name:"The Rock Sinai Motor Vehicle Inspection Center", cat:"pmvic",lat:14.3492139,lng:121.0646871,desc:""},
  {id:23, name:"Roadworthy Motor Vehicle Inspection Center",     cat:"pmvic",lat:10.7332477,lng:122.5407784,desc:""},
  {id:24, name:"Scan&Go123 Vehicle Inspection Services",         cat:"pmvic",lat:13.9550688,lng:121.5874745,desc:""},
  {id:25, name:"SURE SAFE VEHICLE TESTING INC.",                cat:"pmvic",lat:9.5928754, lng:123.1174018,desc:""},
  {id:26, name:"Veterans Builder Private Motor Vehicle Inspection Center",cat:"pmvic",lat:6.9234981,lng:122.09014,desc:""},
  {id:27, name:"Green One Motor Vehicle Inspection Center",      cat:"pmvic",lat:10.4959154,lng:123.4217753,desc:""},
  {id:28, name:"JCV MOTOR VEHICLE INSPECTION CENTER - CALAPAN",  cat:"pmvic",lat:13.3893969,lng:121.1699557,desc:""},
  {id:29, name:"Autoverde PMVIC",                               cat:"pmvic",lat:10.002081, lng:122.8026934,desc:""},
  {id:30, name:"CPP PMVIC/PETC - LA TRINIDAD BENGUET",          cat:"pmvic",lat:16.4519018,lng:120.5756119,desc:""},
  {id:31, name:"Green Pastuer PMVIC - Tagaytay",                cat:"pmvic",lat:14.1048464,lng:120.9313415,desc:""},
  {id:32, name:"IPIL FIRST - PMVIC",                            cat:"pmvic",lat:7.7716192, lng:122.5749668,desc:""},
  {id:33, name:"Chief PMVIC Palawan",                           cat:"pmvic",lat:9.7751327, lng:118.7481291,desc:""},
  {id:34, name:"SMARTSAFE MVIS - Talibon",                      cat:"pmvic",lat:10.1345777,lng:124.3226161,desc:""},
  {id:35, name:"Rosales Star Vehicle Inspection Center",        cat:"pmvic",lat:15.9100223,lng:120.6416701,desc:""},
  {id:36, name:"M2 PMVIC - MAASIM LEYTE",                      cat:"pmvic",lat:10.1135614,lng:124.895827, desc:"Waiting Approval"},
  {id:37, name:"GAPAN PMVIC",                                   cat:"pmvic",lat:15.2477059,lng:120.9537237,desc:"6 Asian Highway, San Roque, Gapan City, 3105 Nueva Ecija"},
  {id:38, name:"JRKHO PMVIC TACURONG",                          cat:"pmvic",lat:6.6926132, lng:124.6747323,desc:""},
  {id:39, name:"EMIL SILVER PMVIC MIDSAYAP",                    cat:"pmvic",lat:7.1756845, lng:124.5246404,desc:""},
  {id:40, name:"ZRM PMVIC - KAWIT",                             cat:"pmvic",lat:14.4270304,lng:120.888909, desc:""},
  {id:41, name:"Jubila PMVIC",                                  cat:"pmvic",lat:15.8292194,lng:121.0258696,desc:""},
  // PETC LUZON
  {id:42, name:"SETTE Emission Testing Center",                 cat:"petcl",lat:13.8405024,lng:121.2034118,desc:"Carandang St. Rosario Batangas"},
  {id:43, name:"Automatic Emission Testing Center",             cat:"petcl",lat:14.9849464,lng:120.7504419,desc:""},
  {id:44, name:"Phantom Emission Testing Center",               cat:"petcl",lat:16.4689426,lng:120.6281377,desc:""},
  {id:45, name:"Univille Motors Corporation (Makati Smoke Emission)",cat:"petcl",lat:14.5466002,lng:121.0152716,desc:""},
  {id:46, name:"A.M. PACLEB Enterprises Inc. - Lark",           cat:"petcl",lat:14.6340053,lng:121.1015282,desc:""},
  {id:47, name:"RPA Emission Testing Las Pinas",                cat:"petcl",lat:14.4438749,lng:120.994759, desc:"RPA Emission Testing"},
  {id:48, name:"Joy Emission Testing Center",                   cat:"petcl",lat:14.6589326,lng:120.9805247,desc:""},
  {id:49, name:"FLV PRIVATE EMISSION TESTING CENTER - Pasay",   cat:"petcl",lat:14.522109, lng:121.0006996,desc:""},
  {id:50, name:"AIR WORTHYNESS EMISSION TESTING CENTER",        cat:"petcl",lat:14.592362, lng:121.0299198,desc:""},
  {id:51, name:"AIR SOLUTIONS EMISSION TESTING CENTER",         cat:"petcl",lat:16.0434167,lng:120.3316111,desc:"#56 A.B Fernandez West, Dagupan City, Pangasinan"},
  {id:52, name:"SAVECO - Burgos Branch",                        cat:"petcl",lat:18.513013, lng:120.644993, desc:""},
  {id:53, name:"BIL EMISSION TESTING CENTER - Tuguegarao",      cat:"petcl",lat:17.6218313,lng:121.7228868,desc:"Caritan Centro Tuguegarao City, Cagayan"},
  {id:54, name:"Right Side Emission Testing Center",            cat:"petcl",lat:16.951891, lng:121.7673047,desc:""},
  {id:55, name:"DGS Vehicle Emission Testing Center",           cat:"petcl",lat:15.4772681,lng:120.967731, desc:""},
  {id:56, name:"Rev-It Private Emission Testing Center",        cat:"petcl",lat:15.0358345,lng:120.673882, desc:""},
  {id:57, name:"Green Auto Ventures Emission Testing Center",   cat:"petcl",lat:14.8317528,lng:120.8689403,desc:""},
  {id:58, name:"AutoTEC Automotive Testing and Emission Center",cat:"petcl",lat:14.8216965,lng:120.299172, desc:"AUTOTEC AUTOMOTIVE TESTING AND EMISSION CENTER"},
  {id:59, name:"Airmix Emission Testing Center",                cat:"petcl",lat:15.6413296,lng:120.8885993,desc:""},
  {id:60, name:"Princess Aliah Emission Testing Center",        cat:"petcl",lat:14.803101, lng:120.5321116,desc:""},
  {id:61, name:"168 Emission Testing Center",                   cat:"petcl",lat:14.764709, lng:120.94464,  desc:""},
  {id:62, name:"Cj-five Emission Testing Center",               cat:"petcl",lat:14.9734059,lng:120.9143929,desc:""},
  {id:63, name:"Banahaw Emission Testing Center",               cat:"petcl",lat:13.9592366,lng:121.6187038,desc:""},
  {id:64, name:"Dua Emission Testing Center - POLANGUI",        cat:"petcl",lat:13.2980921,lng:123.4884018,desc:""},
  {id:65, name:"Air Master Emission Testing Center - Molino",   cat:"petcl",lat:14.3907263,lng:120.9774676,desc:""},
  {id:66, name:"GREEN CITY EMISSION TESTING CENTER",            cat:"petcl",lat:14.0671025,lng:121.291924, desc:""},
  {id:67, name:"Air Master - Bay Laguna",                       cat:"petcl",lat:14.1774835,lng:121.2721792,desc:""},
  {id:68, name:"Shema Emission Testing Center",                 cat:"petcl",lat:14.3121941,lng:120.7727393,desc:""},
  {id:69, name:"R5 Emission Testing Center - Buho, Silang",     cat:"petcl",lat:14.1346511,lng:120.9558973,desc:""},
  {id:70, name:"Bro Emission Testing Center",                   cat:"petcl",lat:14.3208259,lng:121.109868, desc:""},
  {id:71, name:"Mangas Emission Testing Center",                cat:"petcl",lat:14.1325539,lng:120.8592449,desc:""},
  {id:72, name:"Amj Emission Testing Center",                   cat:"petcl",lat:13.9517757,lng:121.1592136,desc:""},
  {id:73, name:"JMV Emission Center",                           cat:"petcl",lat:13.6196444,lng:123.1812412,desc:""},
  {id:74, name:"NPJN EMISSION TESTING CENTER",                  cat:"petcl",lat:13.3718745,lng:123.7216369,desc:""},
  {id:75, name:"GTZ EMISSION TESTING CENTER",                   cat:"petcl",lat:13.4082918,lng:121.8246777,desc:""},
  {id:76, name:"EE CASCO EMISSION - Legazpi",                   cat:"petcl",lat:13.1670381,lng:123.7514037,desc:""},
  {id:77, name:"Mamburao Vehicle Emission Testing Center",      cat:"petcl",lat:13.2127817,lng:120.615766, desc:""},
  {id:78, name:"AMF EMISSION TESTING CENTER",                   cat:"petcl",lat:13.6080722,lng:122.3104355,desc:""},
  {id:79, name:"7 ARCHANGELS - Tanza",                         cat:"petcl",lat:14.3899077,lng:120.8532904,desc:"Seven Archangels Emission Testing Center"},
  {id:80, name:"Elric Emission Testing Center",                 cat:"petcl",lat:16.2992171,lng:121.0384792,desc:""},
  {id:81, name:"ECO ENVIRO CARE - PILA",                       cat:"petcl",lat:14.2230305,lng:121.3604951,desc:""},
  {id:82, name:"ST. VINCENT EMISSION TESTING CENTER",          cat:"petcl",lat:13.7949637,lng:121.0025798,desc:""},
  {id:83, name:"NPJN EMISSION TESTING CENTER - Ligao",         cat:"petcl",lat:13.2375121,lng:123.5336575,desc:""},
  {id:84, name:"Kaugnayan - Bulacan",                          cat:"petcl",lat:14.9869271,lng:120.9365101,desc:"Bagong Kalsada st. Orani Bataan"},
  {id:85, name:"DOLORES EMISSION TESTING CENTER",              cat:"petcl",lat:15.3599599,lng:120.5920619,desc:"Dolores Capas Tarlac"},
  {id:86, name:"ESR EMISSION TESTING CENTER",                  cat:"petcl",lat:12.7129829,lng:124.0238204,desc:"San Julian, Irosin, Sorsogon"},
  {id:87, name:"FLV EMISSION TESTING CENTER",                  cat:"petcl",lat:14.6356174,lng:121.0084573,desc:"1295 G. Araneta Avenue, Quezon City"},
  {id:88, name:"Kaugnayan - Bataan",                           cat:"petcl",lat:14.7980701,lng:120.4901074,desc:""},
  {id:89, name:"Lottex Inc. - Baras Rizal",                    cat:"petcl",lat:14.5193935,lng:121.2727415,desc:""},
  {id:90, name:"R5 EMISSION TESTING CENTER - Indang",          cat:"petcl",lat:14.2016069,lng:120.8744918,desc:"A. MOJICA ST. POBLACION III INDANG, CAVITE"},
  {id:91, name:"Triple-7 Emission Testing Center",             cat:"petcl",lat:15.5013609,lng:120.8548682,desc:""},
  {id:92, name:"CPP'S EMISSION TESTING CENTER",                cat:"petcl",lat:16.4519288,lng:120.5755969,desc:""},
  {id:93, name:"DriverStop Petc - Candelaria",                 cat:"petcl",lat:13.9324944,lng:121.3970574,desc:""},
  {id:94, name:"Exactly 8 Emission Testing Center",            cat:"petcl",lat:16.947805, lng:121.77162,  desc:"Maharlika Hway, Cauayan City, Isabela"},
  {id:95, name:"Primero Emissions Testing",                    cat:"petcl",lat:15.9768289,lng:120.5635685,desc:""},
  {id:96, name:"AIRMIX Emission Testing Center New Site",      cat:"petcl",lat:15.5635385,lng:121.1013835,desc:"Palayan City, Nueva Ecija"},
  {id:97, name:"San Isidro Labrador",                          cat:"petcl",lat:13.4387463,lng:123.4076728,desc:"Iriga City"},
  {id:98, name:"5J EMISSION TESTING CENTER",                   cat:"petcl",lat:13.3674877,lng:123.7241962,desc:"TABACO CITY ALBAY"},
  {id:99, name:"Dua Emission Testing Center - TABACO",         cat:"petcl",lat:13.3738465,lng:123.720603, desc:""},
  {id:100,name:"Jasma Emission Testing Center",                cat:"petcl",lat:17.0791061,lng:120.9830387,desc:""},
  // PETC VISAYAS
  {id:101,name:"Yang-Lab Emission Testing Center",             cat:"petcv",lat:10.8909152,lng:122.4881069,desc:""},
  {id:102,name:"Airtool Emission Testing Center",              cat:"petcv",lat:10.7895531,lng:122.0130444,desc:""},
  {id:103,name:"RST Emission Testing Center",                  cat:"petcv",lat:10.5390575,lng:122.8340413,desc:""},
  {id:104,name:"CARDAY - Banate",                              cat:"petcv",lat:11.0090786,lng:122.8265084,desc:""},
  {id:105,name:"CARDAY - Estancia",                            cat:"petcv",lat:11.4583442,lng:123.1413156,desc:""},
  {id:106,name:"DNE Emission Center",                          cat:"petcv",lat:10.3831218,lng:124.9848732,desc:""},
  {id:107,name:"JPV - Bais",                                   cat:"petcv",lat:9.5964506, lng:123.1184473,desc:""},
  {id:108,name:"JPV - Dumaguete",                              cat:"petcv",lat:9.3150008, lng:123.3092237,desc:""},
  {id:109,name:"JPV - Kalibo",                                 cat:"petcv",lat:11.6818445,lng:122.364232, desc:""},
  {id:110,name:"JPV - Tagbilaran",                             cat:"petcv",lat:9.6442342, lng:123.8643802,desc:"Waiting for lifting suspension"},
  {id:111,name:"JPV - Tigbauan",                               cat:"petcv",lat:10.6733437,lng:122.3961484,desc:""},
  {id:112,name:"JPV - Passi",                                  cat:"petcv",lat:11.1056844,lng:122.6466606,desc:""},
  {id:113,name:"JPV - Pontevedra",                             cat:"petcv",lat:10.365926, lng:122.8691458,desc:""},
  {id:114,name:"JPV - Himamaylan",                             cat:"petcv",lat:10.1116665,lng:122.8713797,desc:""},
  {id:115,name:"Talibon Emission Testing Center",              cat:"petcv",lat:10.1506266,lng:124.3254787,desc:""},
  {id:116,name:"PAW Motor Emission",                           cat:"petcv",lat:10.1485846,lng:124.3261782,desc:""},
  {id:117,name:"Raj Smoke Emission Testing Center",            cat:"petcv",lat:10.7562137,lng:122.5380911,desc:""},
  {id:118,name:"MRJ Emission Center",                          cat:"petcv",lat:10.7810189,lng:122.4267741,desc:""},
  {id:119,name:"Rdp Smoke Testing - Siquijor",                 cat:"petcv",lat:9.2449216, lng:124.730971, desc:""},
  {id:120,name:"San Roques - Medellin",                        cat:"petcv",lat:11.1381938,lng:123.9647715,desc:""},
  {id:121,name:"Sulit Express - Negros",                       cat:"petcv",lat:10.956739, lng:123.3012911,desc:""},
  {id:122,name:"SUK Emission Testing Center - Tacloban",       cat:"petcv",lat:11.2416724,lng:124.9893389,desc:"Brgy. 91 (Abucay) beside Shell"},
  {id:123,name:"SYU EMISSION TESTING CENTER",                  cat:"petcv",lat:10.49221,  lng:123.4221459,desc:""},
  {id:124,name:"Triple J Emission Testing Center",             cat:"petcv",lat:10.8470765,lng:122.6466372,desc:""},
  {id:125,name:"Tubigon Vehicle Inspection Center",            cat:"petcv",lat:9.9197297, lng:123.9297564,desc:""},
  {id:126,name:"B & N Motor Vehicle Smoke Emission",           cat:"petcv",lat:10.9572587,lng:122.5043107,desc:""},
  {id:127,name:"JPV - Guimaras Branch",                        cat:"petcv",lat:10.6262036,lng:122.5913685,desc:""},
  {id:128,name:"DJagna Emission Testing Center",               cat:"petcv",lat:9.652295,  lng:124.3708308,desc:""},
  {id:129,name:"SHEKINAH EMISSION SERVICES - Dinagat",        cat:"petcv",lat:10.0211381,lng:125.5793161,desc:"Don Ruben, San Jose"},
  // PETC MINDANAO
  {id:130,name:"Alt Emission Test Center - Catalunan",         cat:"petcm",lat:7.0732113, lng:125.5196831,desc:""},
  {id:131,name:"Beldad Private Emission Test Center",          cat:"petcm",lat:8.7185038, lng:125.7389906,desc:""},
  {id:132,name:"CAPITOL EMISSION TESTING CENTER",              cat:"petcm",lat:7.4534818, lng:125.7822832,desc:""},
  {id:133,name:"City Emission Center",                         cat:"petcm",lat:7.4564093, lng:125.8102637,desc:""},
  {id:134,name:"Teyap Emission Test Center",                   cat:"petcm",lat:8.5036829, lng:124.6078462,desc:""},
  {id:135,name:"Cotabato Emission Diagnostic",                 cat:"petcm",lat:7.1875427, lng:124.5328189,desc:""},
  {id:136,name:"DAYONDON EMISSION TEST CENTER",                cat:"petcm",lat:8.5100216, lng:125.9727333,desc:""},
  {id:137,name:"Dipolog Emission Testing",                     cat:"petcm",lat:8.575525,  lng:123.3618581,desc:""},
  {id:138,name:"Flomen PMVIC",                                 cat:"petcm",lat:8.5262598, lng:123.3161401,desc:""},
  {id:139,name:"JCA EMISSION TEST CENTER - Digos",             cat:"petcm",lat:6.7386407, lng:125.3618376,desc:""},
  {id:140,name:"JCA Emission Test Center - Davao",             cat:"petcm",lat:7.1115064, lng:125.6321305,desc:""},
  {id:141,name:"KIDAPAWAN PETC INC.",                          cat:"petcm",lat:7.0112175, lng:125.0936756,desc:""},
  {id:142,name:"Kidapawan PETC Inc. - Kabacan",               cat:"petcm",lat:7.1099371, lng:124.8164357,desc:""},
  {id:143,name:"Mabuhay - Panacan",                            cat:"petcm",lat:7.147227,  lng:125.658385, desc:""},
  {id:144,name:"Mabuhay - Sasa",                               cat:"petcm",lat:7.1152004, lng:125.6526293,desc:""},
  {id:145,name:"Mcroy Emission Test Center",                   cat:"petcm",lat:7.0559786, lng:125.598391, desc:""},
  {id:146,name:"Mindanao Clean Air Corp.",                     cat:"petcm",lat:7.0850308, lng:125.6232851,desc:""},
  {id:147,name:"Polomolok Private Emission",                   cat:"petcm",lat:6.2218335, lng:125.0567807,desc:""},
  {id:148,name:"San Jose - Zamboanga",                         cat:"petcm",lat:6.9132573, lng:122.0642263,desc:""},
  {id:149,name:"San Jose - Digos",                             cat:"petcm",lat:6.738342,  lng:125.3596961,desc:""},
  {id:150,name:"San Jose - Butuan",                            cat:"petcm",lat:8.9429258, lng:125.5327433,desc:""},
  {id:151,name:"SHEKINAH - Cabadbaraan",                       cat:"petcm",lat:9.119619,  lng:125.5362201,desc:""},
  {id:152,name:"Sierra Fox - Suspended",                       cat:"petcm",lat:8.5083851, lng:125.9765089,desc:"Suspended"},
  {id:153,name:"Sm Cabrisus Emission",                         cat:"petcm",lat:7.0797618, lng:125.6244616,desc:""},
  {id:154,name:"St. Mary's Emission Test Centre",              cat:"petcm",lat:7.122978,  lng:125.6237892,desc:""},
  {id:155,name:"St. Marys - Panabo",                           cat:"petcm",lat:7.3134581, lng:125.6858143,desc:""},
  {id:156,name:"Trinity Emission Test Center",                 cat:"petcm",lat:7.0610906, lng:125.6093551,desc:""},
  {id:157,name:"Veterans Builder Emission",                    cat:"petcm",lat:6.9262117, lng:122.0825564,desc:""},
  {id:158,name:"Veterans Builder - Baliwasan",                 cat:"petcm",lat:6.9175043, lng:122.0583222,desc:"Acacia Drive, San Jose, Zamboanga City"},
  {id:159,name:"Shekinah Emission - Dapa",                     cat:"petcm",lat:9.770318,  lng:126.0646136,desc:""},
  {id:160,name:"Tandag Emission Testing Center",               cat:"petcm",lat:9.0662468, lng:126.2046301,desc:""},
  {id:161,name:"Tristian Emission Testing",                    cat:"petcm",lat:9.2666711, lng:125.9607169,desc:""},
  {id:162,name:"St. Pio of Pietrelcina - Tagum",              cat:"petcm",lat:7.4592781, lng:125.7874447,desc:""},
  {id:163,name:"SAN ROQUE - Nabunturan",                       cat:"petcm",lat:7.6027844, lng:125.9679847,desc:""},
  {id:164,name:"San Roque - Sto. Tomas",                       cat:"petcm",lat:7.5179349, lng:125.6235934,desc:"Road 1 Menzi, Tibal Og Sto. Tomas, Davao"},
  {id:165,name:"San Roque - Maragusan",                        cat:"petcm",lat:7.3184464, lng:126.1300357,desc:""},
  {id:166,name:"St. Francis Emission",                         cat:"petcm",lat:7.0601656, lng:125.6085658,desc:""},
  {id:167,name:"Santa Isabel - Basilan",                       cat:"petcm",lat:6.7029017, lng:121.98014,  desc:""},
  {id:168,name:"CLEAN-AIR - Puerto CDO",                       cat:"petcm",lat:8.5023436, lng:124.7527889,desc:"Purok 5, near Phoenix, Cagayan de Oro"},
  {id:169,name:"MEM 39 EMISSION TESTING",                      cat:"petcm",lat:8.0406812, lng:123.7903673,desc:""},
  {id:170,name:"San Vicente Ferrer",                           cat:"petcm",lat:7.3186111, lng:125.6880556,desc:"Purok 1, San Vicente Road, Panabo City"},
  {id:171,name:"Flomen Emission - Initao",                     cat:"petcm",lat:8.5208411, lng:124.3092502,desc:""},
  {id:172,name:"Green Tech Emission Test",                     cat:"petcm",lat:7.2018397, lng:124.2372008,desc:""},
  {id:173,name:"Wum Emission Testing Center",                  cat:"petcm",lat:6.6603011, lng:122.1411477,desc:""},
  {id:174,name:"SHEKINAH EMISSION - Dinagat Island",           cat:"petcm",lat:10.0211381,lng:125.5793161,desc:"Don Ruben, San Jose"},
  // LTO OFFICES
  {id:175,name:"LTO - San Simon",           cat:"lto",lat:14.9841695,lng:120.7514947,desc:""},
  {id:176,name:"LTO - Manila East",          cat:"lto",lat:14.6042138,lng:121.0067097,desc:""},
  {id:177,name:"LTO - Otis Renewal",         cat:"lto",lat:14.5896256,lng:120.9927137,desc:""},
  {id:178,name:"LTO Manila South",           cat:"lto",lat:14.5853883,lng:120.991315, desc:""},
  {id:179,name:"LTO - Pasig",               cat:"lto",lat:14.5743074,lng:121.0632324,desc:""},
  {id:180,name:"LTO - Las Pinas VREF",       cat:"lto",lat:14.4123819,lng:121.0151034,desc:""},
  {id:181,name:"LTO Valenzuela",             cat:"lto",lat:14.6971909,lng:120.9744755,desc:""},
  {id:182,name:"LTO - Muntinlupa",           cat:"lto",lat:14.3783335,lng:121.0453799,desc:""},
  {id:183,name:"LTO - Novaliches",           cat:"lto",lat:14.731308, lng:121.047466, desc:""},
  {id:184,name:"LTO VREF",                   cat:"lto",lat:14.7039653,lng:121.0398025,desc:"Vehicle Registration Extension Facility"},
  {id:185,name:"LTO - Mandaluyong",          cat:"lto",lat:14.59244,  lng:121.029876, desc:""},
  {id:186,name:"LTO - Kabankalan",           cat:"lto",lat:9.9949443, lng:122.8145754,desc:""},
  {id:187,name:"LTO - Robinsons Fuente Cebu",cat:"lto",lat:10.3094377,lng:123.8941959,desc:""},
  {id:188,name:"LTO - Cebu City",            cat:"lto",lat:10.2982455,lng:123.8927559,desc:""},
  {id:189,name:"LTO - Lapu-Lapu",            cat:"lto",lat:10.3168976,lng:123.964219, desc:""},
  {id:190,name:"LTO - Talisay City",         cat:"lto",lat:10.260111, lng:123.8304234,desc:""},
  {id:191,name:"LTO - Toledo City",          cat:"lto",lat:10.3742963,lng:123.6340719,desc:""},
  {id:192,name:"LTO Balamban",               cat:"lto",lat:10.5054961,lng:123.7166774,desc:""},
  {id:193,name:"LTO - Medellin",             cat:"lto",lat:11.1380175,lng:123.9644279,desc:""},
  {id:194,name:"LTO - Bantayan",             cat:"lto",lat:11.1543821,lng:123.8066033,desc:""},
  {id:195,name:"LTO Mambajao",               cat:"lto",lat:9.245532,  lng:124.7280846,desc:""},
  {id:196,name:"LTO - Malaybalay",           cat:"lto",lat:8.150126,  lng:125.1334961,desc:""},
  {id:197,name:"LTO Valencia",               cat:"lto",lat:7.9308436, lng:125.0979093,desc:""},
  {id:198,name:"LTO - Tacurong City",        cat:"lto",lat:6.6935021, lng:124.6758486,desc:""},
  {id:199,name:"LTO - Polomolok",            cat:"lto",lat:6.4983534, lng:124.837738, desc:""},
  {id:200,name:"LTO Naga District",          cat:"lto",lat:13.6195176,lng:123.1805361,desc:""},
  {id:201,name:"LTO Alabat Extension",       cat:"lto",lat:14.0996322,lng:122.0131205,desc:""},
  {id:202,name:"LTO Catanauan",              cat:"lto",lat:13.6080838,lng:122.3104588,desc:""},
  {id:203,name:"LTO - Virac",               cat:"lto",lat:13.5745998,lng:124.2088723,desc:""},
  {id:204,name:"LTO Masbate",               cat:"lto",lat:12.3694464,lng:123.6254221,desc:""},
  {id:205,name:"LTO - Calbayog",             cat:"lto",lat:12.0650401,lng:124.5985478,desc:""},
  {id:206,name:"LTO - Catbalogan",           cat:"lto",lat:11.7759655,lng:124.8863606,desc:""},
  {id:207,name:"LTO - Borongan",             cat:"lto",lat:11.598873, lng:125.438633, desc:""},
  {id:208,name:"LTO - Catarman",             cat:"lto",lat:12.5060234,lng:124.628626, desc:""},
  {id:209,name:"LTO - Marikina",             cat:"lto",lat:14.6362471,lng:121.0940776,desc:""},
  {id:210,name:"LTO Malabon",               cat:"lto",lat:14.6577851,lng:120.95075,  desc:""},
  {id:211,name:"LTO - Navotas",             cat:"lto",lat:14.6446519,lng:120.9496935,desc:""},
  {id:212,name:"LTO San Juan",              cat:"lto",lat:14.6060239,lng:121.0231799,desc:""},
  {id:213,name:"LTO - Araneta QC",          cat:"lto",lat:14.6297789,lng:121.0112108,desc:""},
  {id:214,name:"LTO - Meycauayan",          cat:"lto",lat:14.7671524,lng:120.9893739,desc:""},
  {id:215,name:"LTO - Rodriguez Rizal",     cat:"lto",lat:14.7452354,lng:121.1305456,desc:""},
  {id:216,name:"LTO - Areza Town Center",   cat:"lto",lat:14.3375615,lng:121.0759315,desc:""},
  {id:217,name:"LTO - Calamba",             cat:"lto",lat:14.2016835,lng:121.1571783,desc:""},
  {id:218,name:"LTO Southwoods",            cat:"lto",lat:14.3312501,lng:121.0499372,desc:""},
  {id:219,name:"LTO - Makati",              cat:"lto",lat:14.5725509,lng:121.0250047,desc:""},
  {id:220,name:"LTO INFANTA",               cat:"lto",lat:14.7422632,lng:121.6367688,desc:""},
  {id:221,name:"LTO Taguig",                cat:"lto",lat:14.50271,  lng:121.0439595,desc:""},
  {id:222,name:"LTO Tarlac",                cat:"lto",lat:15.4748558,lng:120.6078802,desc:""},
  {id:223,name:"LTO Paniqui",               cat:"lto",lat:15.6538781,lng:120.5846606,desc:""},
  {id:224,name:"LTO Gapan",                 cat:"lto",lat:15.2484491,lng:120.9535008,desc:""},
  {id:225,name:"LTO Mabiga",                cat:"lto",lat:15.2025642,lng:120.5810026,desc:""},
  {id:226,name:"LTO Subic Bay",             cat:"lto",lat:14.8264057,lng:120.2727595,desc:""},
  {id:227,name:"LTO Olongapo",              cat:"lto",lat:14.8292544,lng:120.2870569,desc:""},
  {id:228,name:"LTO - GenSan",              cat:"lto",lat:6.1135072, lng:125.1723593,desc:""},
  {id:229,name:"LTO - Tagaytay",            cat:"lto",lat:14.1047403,lng:120.9319582,desc:""},
  {id:230,name:"LTO Kibawae",               cat:"lto",lat:7.4877792, lng:125.0610835,desc:""},
  {id:231,name:"LTO San Rafael",            cat:"lto",lat:14.9863385,lng:120.936231, desc:""},
  {id:232,name:"LTO - Irosin",              cat:"lto",lat:12.703729, lng:124.0349718,desc:""},
  {id:233,name:"LTO La Loma",               cat:"lto",lat:14.6356278,lng:121.0085812,desc:""},
  {id:234,name:"LTO - Capas",               cat:"lto",lat:15.3595918,lng:120.592069, desc:""},
  {id:235,name:"LTO Orani",                 cat:"lto",lat:14.7976717,lng:120.4900031,desc:""},
  {id:236,name:"LTO Tanay District",        cat:"lto",lat:14.5048416,lng:121.3000005,desc:""},
  {id:237,name:"LTO Tanay Extension",       cat:"lto",lat:14.504827, lng:121.2999969,desc:""},
  {id:238,name:"LTO Morong",                cat:"lto",lat:14.5063281,lng:121.2351294,desc:""},
  {id:239,name:"LTO Cauayan City",          cat:"lto",lat:16.9526673,lng:121.7672167,desc:""},
  {id:240,name:"LTO Aliaga",                cat:"lto",lat:15.5013601,lng:120.8546067,desc:""},
  {id:241,name:"LTO - Las Pinas Licensing", cat:"lto",lat:14.442338, lng:120.996315, desc:""},
  {id:242,name:"LTO Angeles",               cat:"lto",lat:15.127883, lng:120.5981339,desc:""},
  {id:243,name:"LTO Main",                  cat:"lto",lat:14.6356992,lng:121.0468221,desc:""},
  {id:244,name:"LTO MARILAO",               cat:"lto",lat:14.7756826,lng:120.9594948,desc:""},
  {id:245,name:"LTO Dagupan",               cat:"lto",lat:16.0933253,lng:120.3705132,desc:""},
  {id:246,name:"LTO SAN JOSE",              cat:"lto",lat:12.3770515,lng:121.047806, desc:""},
  {id:247,name:"LTO Odiongan",              cat:"lto",lat:12.4004791,lng:121.9821569,desc:""},
  {id:248,name:"LTO Aritao",                cat:"lto",lat:16.294504, lng:121.034015, desc:""},
  {id:249,name:"LTO - Bangued",             cat:"lto",lat:17.597664, lng:120.6179916,desc:""},
  {id:250,name:"LTO Santiago City",         cat:"lto",lat:16.7045724,lng:121.5375772,desc:""},
  {id:251,name:"LTO Bayambang",             cat:"lto",lat:15.8046341,lng:120.4584256,desc:""},
  {id:252,name:"LTO Cabagan",               cat:"lto",lat:17.356143, lng:121.8195766,desc:""},
  {id:253,name:"LTO Tuguegarao",            cat:"lto",lat:17.6222392,lng:121.720702, desc:""},
  {id:254,name:"LTO Kalinga",               cat:"lto",lat:17.403608, lng:121.442253, desc:""},
  {id:255,name:"LTO Aparri",                cat:"lto",lat:18.3486042,lng:121.6312811,desc:""},
  {id:256,name:"LTO Burgos",                cat:"lto",lat:18.5126573,lng:120.6449326,desc:""},
  {id:257,name:"LTO Ilagan",                cat:"lto",lat:17.1262618,lng:122.0097162,desc:""},
  {id:258,name:"LTO - Baler",               cat:"lto",lat:15.7531309,lng:121.5408807,desc:""},
  {id:259,name:"LTO Mamburao",              cat:"lto",lat:13.212688, lng:120.6158664,desc:""},
  {id:260,name:"LTO Garcia-Hernandez",      cat:"lto",lat:9.6204013, lng:124.3090192,desc:""},
  {id:261,name:"LTO Candelaria",            cat:"lto",lat:13.933083, lng:121.3966873,desc:""},
  {id:262,name:"LTO PALAYAN",               cat:"lto",lat:15.5451618,lng:121.0873169,desc:""},
  {id:263,name:"LTO Urdaneta",              cat:"lto",lat:15.9633457,lng:120.5710362,desc:""},
  {id:264,name:"LTO Polangui",              cat:"lto",lat:13.297897, lng:123.4885859,desc:""},
  {id:265,name:"LTO Tabaco",                cat:"lto",lat:13.3706992,lng:123.7222239,desc:""},
  {id:266,name:"LTO Festive Walk Mall",     cat:"lto",lat:10.7175062,lng:122.5475106,desc:""},
  {id:267,name:"LTO Palo Leyte",            cat:"lto",lat:11.1773036,lng:125.0115446,desc:""},
  {id:268,name:"LTO Tacloban",              cat:"lto",lat:11.246477, lng:125.008616, desc:""},
  {id:269,name:"LTO Bais City",             cat:"lto",lat:9.594248,  lng:123.1175884,desc:""},
  {id:270,name:"LTO Dumaguete",             cat:"lto",lat:9.3116374, lng:123.3013897,desc:""},
  {id:271,name:"LTO Kalibo",                cat:"lto",lat:11.6681391,lng:122.3563795,desc:""},
  {id:272,name:"LTO Tagbilaran",            cat:"lto",lat:9.6439051, lng:123.8639268,desc:""},
  {id:273,name:"LTO Roxas City",            cat:"lto",lat:11.5715444,lng:122.7595846,desc:""},
  {id:274,name:"LTO Dinagat",               cat:"lto",lat:10.0212193,lng:125.5792501,desc:""},
  {id:275,name:"LTO San Carlos City",       cat:"lto",lat:10.5158864,lng:123.4327285,desc:""},
  {id:276,name:"LTO Bislig City",           cat:"lto",lat:8.1905685, lng:126.3293806,desc:""},
  {id:277,name:"LTO Surigao",               cat:"lto",lat:9.7821585, lng:125.4890463,desc:""},
  {id:278,name:"LTO Palawan",               cat:"lto",lat:9.7406798, lng:118.7345062,desc:""},
  {id:279,name:"LTO Initao",                cat:"lto",lat:8.5081929, lng:124.3092463,desc:""},
  {id:280,name:"LTO Talibon",               cat:"lto",lat:10.1528122,lng:124.3282839,desc:""},
  {id:281,name:"LTO Midsayap",              cat:"lto",lat:7.1895457, lng:124.5326086,desc:""},
  {id:282,name:"LTO BARMM",                 cat:"lto",lat:7.196978,  lng:124.243923, desc:""},
  {id:283,name:"LTO Kabacan",               cat:"lto",lat:7.1098378, lng:124.8147301,desc:""},
  {id:284,name:"LTO Kidapawan",             cat:"lto",lat:7.0091139, lng:125.0921401,desc:""},
  {id:285,name:"LTO Dipolog",               cat:"lto",lat:8.5747227, lng:123.3627892,desc:""},
  {id:286,name:"LTO Digos City",            cat:"lto",lat:6.7382309, lng:125.3615357,desc:""},
  {id:287,name:"LTO Butuan City",           cat:"lto",lat:8.943802,  lng:125.532869, desc:""},
  {id:288,name:"LTO Panabo",                cat:"lto",lat:7.2836273, lng:125.6713649,desc:""},
  {id:289,name:"LTO Dapa",                  cat:"lto",lat:9.7773975, lng:126.0715031,desc:""},
  {id:290,name:"LTO Davao City (ARD)",      cat:"lto",lat:7.0513902, lng:125.5889101,desc:""},
  {id:291,name:"LTO Zamboanga",             cat:"lto",lat:6.9037422, lng:122.0808017,desc:""},
  {id:292,name:"LTO Tagum",                 cat:"lto",lat:7.4543815, lng:125.7812368,desc:""},
  {id:293,name:"LTO Tandag",                cat:"lto",lat:9.0707422, lng:126.1939008,desc:""},
  {id:294,name:"LTO Tubod",                 cat:"lto",lat:8.0402358, lng:123.7904407,desc:""},
  {id:295,name:"LTO Calapan",               cat:"lto",lat:13.3894382,lng:121.1697713,desc:""},
  {id:296,name:"LTO Pinamalayan",           cat:"lto",lat:13.0061002,lng:121.4791848,desc:""},
  {id:297,name:"LTO Siquijor",              cat:"lto",lat:9.2061583, lng:123.486688, desc:""},
  {id:298,name:"LTO Mercedes Samar",        cat:"lto",lat:11.0989058,lng:125.7091236,desc:""},
  {id:299,name:"LTO Binangonan/Rizal",      cat:"lto",lat:14.509688, lng:121.1684845,desc:""},
];

// ════════════════════════════════════════
// CATEGORY CONFIG
// ════════════════════════════════════════
const CATS={
  pmvic:{dot:'d-pmvic',badge:'b-pmvic',hex:'#a78bfa',label:'PMVIC'},
  petcl:{dot:'d-petcl',badge:'b-petcl',hex:'#38bdf8',label:'PETC Luzon'},
  petcv:{dot:'d-petcv',badge:'b-petcv',hex:'#34d399',label:'PETC Visayas'},
  petcm:{dot:'d-petcm',badge:'b-petcm',hex:'#fb7185',label:'PETC Mindanao'},
  lto:  {dot:'d-lto',  badge:'b-lto',  hex:'#fbbf24',label:'LTO Office'},
};

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
let currentFilter='all', activeId=null, refreshTimer=60, nextUpdateId=null;

// ════════════════════════════════════════
// COUNTS
// ════════════════════════════════════════
function getCounts(){
  const c={pmvic:0,petcl:0,petcv:0,petcm:0,lto:0};
  LOCATIONS.forEach(l=>c[l.cat]++);
  return c;
}

// ════════════════════════════════════════
// ANIMATED COUNT-UP
// ════════════════════════════════════════
function animCount(el,target,dur=900){
  const start=Date.now();
  const from=parseInt(el.textContent)||0;
  const tick=()=>{
    const p=Math.min((Date.now()-start)/dur,1);
    const ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(from+ease*(target-from));
    if(p<1)requestAnimationFrame(tick);
    else el.textContent=target;
  };
  requestAnimationFrame(tick);
}

// ════════════════════════════════════════
// INIT STATS
// ════════════════════════════════════════
function initStats(){
  const c=getCounts();
  const total=LOCATIONS.length;
  const petcTotal=c.petcl+c.petcv+c.petcm;

  // stat cards
  animCount(document.getElementById('cntTotal'), total);
  animCount(document.getElementById('cntPmvic'), c.pmvic);
  animCount(document.getElementById('cntPetcL'),  c.petcl);
  animCount(document.getElementById('cntPetcV'),  c.petcv);
  animCount(document.getElementById('cntPetcM'),  c.petcm);
  animCount(document.getElementById('cntLTO'),    c.lto);

  // spark bars (% relative to total)
  setTimeout(()=>{
    document.getElementById('spkTotal').style.width='100%';
    document.getElementById('spkPmvic').style.width=(c.pmvic/total*100)+'%';
    document.getElementById('spkPetcL').style.width=(c.petcl/total*100)+'%';
    document.getElementById('spkPetcV').style.width=(c.petcv/total*100)+'%';
    document.getElementById('spkPetcM').style.width=(c.petcm/total*100)+'%';
    document.getElementById('spkLTO').style.width=(c.lto/total*100)+'%';
  },200);

  // live widgets
  animCount(document.getElementById('lwPetcTotal'),petcTotal);
  animCount(document.getElementById('lwPmvic'),    c.pmvic);
  animCount(document.getElementById('lwLTO'),      c.lto);
  animCount(document.getElementById('lwCoverage'), 17); // 17 Philippine regions

  // footer
  document.getElementById('footerStats').textContent=
    \`📍 \${total} Locations · 🚗 \${c.pmvic} PMVIC · 💨 \${petcTotal} PETC · 🏛️ \${c.lto} LTO\`;
}

// ════════════════════════════════════════
// LIVE CLOCK
// ════════════════════════════════════════
function startClock(){
  const tick=()=>{
    const now=new Date();
    const ph=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Manila'}));
    document.getElementById('liveClock').textContent=
      ph.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
    document.getElementById('liveDate').textContent=
      ph.toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'});
  };
  tick(); setInterval(tick,1000);
}

// ════════════════════════════════════════
// LIVE UPDATE TIMER (cosmetic refresh)
// ════════════════════════════════════════
function startRefreshCycle(){
  refreshTimer=60;
  const update=()=>{
    const now=new Date();
    const ph=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Manila'}));
    document.getElementById('lastUpdated').textContent=
      ph.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
    refreshTimer--;
    if(refreshTimer<=0){
      refreshTimer=60;
      initStats(); // re-run count animation
      buildTicker(); // refresh ticker
    }
    document.getElementById('nextUpdate').textContent=\`Next refresh in \${refreshTimer}s\`;
  };
  update(); setInterval(update,1000);
}

// ════════════════════════════════════════
// TICKER
// ════════════════════════════════════════
const TICKER_ITEMS=[
  {color:'#00d4ff', icon:'fa-globe-asia',  text:'TOTAL LOCATIONS — Philippines'},
  {color:'#a78bfa', icon:'fa-car-side',     text:'TOTAL PMVIC CLIENTS'},
  {color:'#38bdf8', icon:'fa-smog',         text:'TOTAL PETC CLIENTS — Luzon'},
  {color:'#34d399', icon:'fa-smog',         text:'TOTAL PETC CLIENTS — Visayas'},
  {color:'#fb7185', icon:'fa-smog',         text:'TOTAL PETC CLIENTS — Mindanao'},
  {color:'#fbbf24', icon:'fa-building',     text:'LTO SATELLITE OFFICES'},
  {color:'#00d4ff', icon:'fa-chart-bar',    text:'TOTAL PETC COMBINED'},
  {color:'#10b981', icon:'fa-map-marked-alt',text:'PHILIPPINE REGIONS COVERED'},
  {color:'#f59e0b', icon:'fa-star',         text:'RDMS Inc. CLIENT NETWORK'},
];

function buildTicker(){
  const c=getCounts();
  const total=LOCATIONS.length;
  const petcTotal=c.petcl+c.petcv+c.petcm;
  const vals=[total,c.pmvic,c.petcl,c.petcv,c.petcm,c.lto,petcTotal,17,'299+'];

  // Build items ×2 for seamless loop
  let html='';
  const items=[...TICKER_ITEMS,...TICKER_ITEMS];
  items.forEach((t,i)=>{
    const val=vals[i%TICKER_ITEMS.length];
    html+=\`<span class="ticker-item">
      <span class="ti-dot" style="background:\${t.color}"></span>
      <i class="fas \${t.icon}" style="color:\${t.color};font-size:.75rem"></i>
      \${t.text}
      <span class="ticker-sep">—</span>
      <span class="ticker-num">\${val}</span>
    </span>\`;
  });
  document.getElementById('tickerTrack').innerHTML=html;
}

// ════════════════════════════════════════
// FILTER
// ════════════════════════════════════════
function setFilter(cat){
  currentFilter=cat;
  document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('active'));
  const tab=document.getElementById('tab-'+cat);
  if(tab) tab.classList.add('active');
  renderList();
}

// ════════════════════════════════════════
// RENDER LIST
// ════════════════════════════════════════
function renderList(){
  const q=(document.getElementById('searchInput')?.value||'').toLowerCase().trim();
  const items=LOCATIONS.filter(l=>{
    const cm=currentFilter==='all'||l.cat===currentFilter;
    const tm=!q||l.name.toLowerCase().includes(q);
    return cm&&tm;
  });
  document.getElementById('visibleCount').textContent=items.length+' found';
  const list=document.getElementById('locationList');
  if(!items.length){
    list.innerHTML='<div class="no-results"><i class="fas fa-search-minus"></i>No locations match your search</div>';
    return;
  }
  list.innerHTML=items.map(l=>{
    const c=CATS[l.cat];
    const isA=l.id===activeId;
    return \`<div class="loc-item\${isA?' active':''}" onclick="selectLocation(\${l.id})" data-id="\${l.id}">
      <span class="loc-dot \${c.dot}"></span>
      <span class="loc-name">\${esc(l.name)}</span>
      <span class="loc-badge \${c.badge}">\${c.label}</span>
    </div>\`;
  }).join('');
}

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// ════════════════════════════════════════
// SELECT LOCATION
// ════════════════════════════════════════
function selectLocation(id){
  activeId=id;
  const loc=LOCATIONS.find(l=>l.id===id);
  if(!loc) return;
  const c=CATS[loc.cat];

  // update list highlight
  document.querySelectorAll('.loc-item').forEach(el=>el.classList.remove('active'));
  document.querySelector(\`.loc-item[data-id="\${id}"]\`)?.classList.add('active');
  document.querySelector(\`.loc-item[data-id="\${id}"]\`)?.scrollIntoView({behavior:'smooth',block:'nearest'});

  // detail panel
  const dp=document.getElementById('detailPanel');
  dp.style.display='block';
  void dp.offsetWidth;
  dp.style.animation='none';
  void dp.offsetWidth;
  dp.style.animation='';

  document.getElementById('dpDot').style.background=c.hex;
  document.getElementById('dpBadge').textContent=c.label;
  document.getElementById('dpBadge').className='loc-badge '+c.badge;
  document.getElementById('dpName').textContent=loc.name;
  document.getElementById('dpDesc').textContent=loc.desc||'No additional description available.';
  document.getElementById('dpCoords').textContent=
    \`📍 \${loc.lat.toFixed(6)}, \${loc.lng.toFixed(6)}\`;
  document.getElementById('dpMapLink').href=
    \`https://www.google.com/maps?q=\${loc.lat},\${loc.lng}&z=17\`;
}

function closeDetail(){
  document.getElementById('detailPanel').style.display='none';
  activeId=null;
  document.querySelectorAll('.loc-item').forEach(el=>el.classList.remove('active'));
}

// ════════════════════════════════════════
// BOOT
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  startClock();
  initStats();
  buildTicker();
  renderList();
  startRefreshCycle();
});
</script>
</body>
</html>`)
})

export default app
