(() => {
  const $app = document.getElementById("app");

  // ---------- Simple Router (hash-based) ----------
  const routes = {"#/case/FBI-HOM-24-001": CaseViewer,    "": Landing,
    "#/": Landing,
    "#/login": Login,
    "#/register": Register,
    "#/hq": HQ,
    "#/leaderboard": Leaderboard,
    "#/owner": OwnerDashboard,
    "#/owner/cases": OwnerCases,
    "#/owner/analytics": OwnerAnalytics,
    "#/owner/players": OwnerPlayers,
    "#/owner/revenue": OwnerRevenue,
  };

  window.addEventListener("hashchange", render);
  window.addEventListener("load", render);

  // ---------- Auth (localStorage) ----------
  const LS_USERS = "cf_users";
  const LS_SESSION = "cf_session";
  const LS_OWNER = "cf_owner"; // owner login flag

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(LS_USERS)) || []; }
    catch { return []; }
  }
  function setUsers(users) {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(LS_SESSION)); }
    catch { return null; }
  }
  function setSession(sess) {
    localStorage.setItem(LS_SESSION, JSON.stringify(sess));
  }
  function clearSession() {
    localStorage.removeItem(LS_SESSION);
  }

  // owner “dev” login (like your screenshot)
  // You can change these later
  const OWNER_EMAIL = "admin@casefiles.fbi";
  const OWNER_PASS  = "admin123";

  function isOwner() { return localStorage.getItem(LS_OWNER) === "1"; }
  function setOwner(v) { v ? localStorage.setItem(LS_OWNER,"1") : localStorage.removeItem(LS_OWNER); }

  // ---------- Utilities ----------
  function navTo(path) { window.location.hash = path; }
  function esc(s=""){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

  function Topbar() {
    const sess = getSession();
    return `
      <div class="topbar">
        <div class="brand"><span class="dot"></span><span>${esc(DB.appName)}</span></div>
        <div class="navright">
          ${sess ? `<span class="pill">Agent: ${esc(sess.username)}</span>` : `<span class="pill">CLASSIFIED</span>`}
          ${sess ? `<button class="btn ghost" data-act="logout">Logout</button>` : `<button class="btn ghost" data-nav="#/login">Agent Login</button>`}
          <button class="btn ghost" data-nav="#/owner">Owner Portal</button>
        </div>
      </div>
    `;
  }

  function PageShell(content) {
    return `<div class="bg-vignette">${Topbar()}${content}</div>`;
  }

  function bindGlobalClicks() {
    document.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", () => navTo(el.getAttribute("data-nav")));
    });
    document.querySelectorAll("[data-act='logout']").forEach(el => {
      el.addEventListener("click", () => { clearSession(); render(); navTo("#/"); });
    });
  }

  // ---------- Pages ----------
  function Landing() {
    return PageShell(`
      <div class="hero">
        <div class="smallcaps">Classified // For Authorized Personnel Only</div>
        <h1>CASE FILES</h1>
        <p>Step into the shoes of an FBI investigator. Solve hyper-realistic cases where every decision shapes the outcome. One wrong move and the case is compromised.</p>
        <div class="ctaRow">
          <button class="btn" data-nav="#/login">Start Investigation</button>
          <button class="btn ghost" data-nav="#/register">Request Clearance</button>
        </div>
        <div class="hr"></div>
        <div class="row" style="justify-content:center">
          <div class="badge">12+ Cases</div>
          <div class="badge">5 Ranks</div>
          <div class="badge">∞ Outcomes</div>
        </div>
      </div>

      <div class="wrap">
        <div class="smallcaps" style="text-align:center">System Capabilities</div>
        <h2 style="text-align:center; letter-spacing:.08em; text-transform:uppercase;">Your Investigation Toolkit</h2>
        <div style="height:18px"></div>

        <div class="grid4">
          <div class="card">
            <h3>Authentic Case Files</h3>
            <p>Investigate realistic cases with chain-of-custody, warrants, and legal procedure.</p>
          </div>
          <div class="card">
            <h3>Procedural Consequences</h3>
            <p>Every action matters. Reckless investigation leads to compromised evidence.</p>
          </div>
          <div class="card">
            <h3>AI Interrogations</h3>
            <p>Question suspects using advanced AI. They lie, deflect, and may request a lawyer.</p>
          </div>
          <div class="card">
            <h3>Career Progression</h3>
            <p>Rise through ranks from Analyst to Task Force Lead. Unlock harder cases and tools.</p>
          </div>
        </div>

        <div class="hr"></div>

        <div class="hero" style="padding:40px 0 60px">
          <div class="smallcaps good">Clearance Granted</div>
          <h2 style="margin:12px 0 10px; letter-spacing:.06em; text-transform:uppercase;">Ready to Join the Bureau?</h2>
          <p class="help">Subscribe for full access to all cases, AI interrogations, and career progression.</p>
          <div class="ctaRow">
            <button class="btn" data-nav="#/register">Get Started</button>
          </div>
        </div>
      </div>
    `);
  }

  function Login() {
    return PageShell(`
      <div class="wrap">
        <div class="centerBox">
          <div style="text-align:center">
            <div class="smallcaps">Secure Authentication Required</div>
            <h2 style="margin:10px 0 4px; letter-spacing:.08em; text-transform:uppercase;">Agent Login</h2>
            <p class="help">Use your registered email + access code.</p>
          </div>

          <div class="field">
            <label>Agent Email</label>
            <input id="email" placeholder="agent@fbi.gov" />
          </div>

          <div class="field">
            <label>Access Code</label>
            <input id="pass" type="password" placeholder="••••••••" />
          </div>

          <div class="ctaRow" style="justify-content:stretch">
            <button class="btn" style="width:100%" id="doLogin">Access System</button>
          </div>

          <div style="margin-top:12px; text-align:center">
            <a class="help" href="#/register">New to the Bureau? Request Clearance</a>
          </div>
        </div>
      </div>
    `);
  }

  function Register() {
    return PageShell(`
      <div class="wrap">
        <div class="centerBox">
          <div style="text-align:center">
            <div class="smallcaps">New Agent Registration</div>
            <h2 style="margin:10px 0 4px; letter-spacing:.08em; text-transform:uppercase;">Request Clearance</h2>
            <p class="help">This is a front-end demo. Account is stored in your browser.</p>
          </div>

          <div class="field">
            <label>Agent Codename</label>
            <input id="username" placeholder="SHADOW.WOLF" />
          </div>

          <div class="field">
            <label>Agent Email</label>
            <input id="email" placeholder="agent@fbi.gov" />
          </div>

          <div class="field">
            <label>Access Code</label>
            <input id="pass1" type="password" placeholder="••••••••" />
          </div>

          <div class="field">
            <label>Confirm Access Code</label>
            <input id="pass2" type="password" placeholder="••••••••" />
          </div>

          <div class="ctaRow" style="justify-content:stretch">
            <button class="btn" style="width:100%" id="doRegister">Request Clearance</button>
          </div>

          <div style="margin-top:12px; text-align:center">
            <a class="help" href="#/login">Already cleared? Agent Login</a>
          </div>
        </div>
      </div>
    `);
  }

  function requireAgent() {
    const sess = getSession();
    if (!sess) { navTo("#/login"); return null; }
    return sess;
  }

  function HQ() {
    const sess = requireAgent();
    if (!sess) return PageShell(`<div class="wrap"><p class="help">Redirecting…</p></div>`);

    const c = DB.cases[0];
    return PageShell(`
      <div class="wrap">
        <div class="card" style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px">
          <div>
            <div class="smallcaps">Agent Dossier</div>
            <div style="font-size:34px; font-weight:900; letter-spacing:.06em; margin-top:6px">${esc(sess.username)}</div>
            <div class="row" style="margin-top:10px">
              <div class="badge">Rank: Analyst</div>
              <div class="badge">Career Points: ${esc(String(sess.cp ?? 0))} CP</div>
              <div class="badge">Clearance: Standard</div>
            </div>
          </div>
          <div class="badge">LEVEL 1</div>
        </div>

        <div class="hr"></div>

        <div class="row" style="justify-content:space-between; align-items:center">
          <div>
            <div class="smallcaps">Active Case Files</div>
            <h2 style="margin:8px 0 0; letter-spacing:.08em; text-transform:uppercase;">Available Cases</h2>
          </div>
          <div class="row">
            <button class="btn ghost" data-nav="#/leaderboard">Leaderboard</button>
          </div>
        </div>

        <div style="height:14px"></div>

        <div class="card" style="max-width:520px">
          <div class="badge" style="border-color: rgba(49,208,123,.35); color: rgba(49,208,123,.9)">FREE</div>
          <div style="margin-top:10px" class="smallcaps">${esc(c.id)} • ${esc(c.time)}</div>
          <div style="font-size:22px; font-weight:900; margin-top:8px">${esc(c.title)}</div>
          <p class="help" style="margin-top:8px">${esc(c.description)}</p>
          <div class="help" style="margin-top:8px">${esc(c.location)}</div>
          <div style="height:14px"></div>
          <button class="btn ghost" style="width:100%" data-act="openCase">Open Case File</button>
        </div>
      </div>
    `);
  }

  function Leaderboard() {
    const sess = requireAgent();
    if (!sess) return PageShell(`<div class="wrap"><p class="help">Redirecting…</p></div>`);

    const rows = DB.leaderboard.map(r => `
      <tr>
        <td>${esc(String(r.rank))}</td>
        <td>${esc(r.agent)}</td>
        <td>${esc(r.level)}</td>
        <td style="text-align:right">${esc(String(r.cp))} CP</td>
      </tr>
    `).join("");

    return PageShell(`
      <div class="wrap">
        <div class="row" style="justify-content:space-between; align-items:center">
          <div>
            <div class="smallcaps">Top Agents by Career Points</div>
            <h2 style="margin:8px 0 0; letter-spacing:.08em; text-transform:uppercase;">Leaderboard</h2>
          </div>
          <button class="btn ghost" data-nav="#/hq">Back to HQ</button>
        </div>

        <div style="height:14px"></div>

        <table class="table">
          <thead>
            <tr><th>Rank</th><th>Agent</th><th>Level</th><th style="text-align:right">Career Points</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `);
  }
  function CaseViewer() {
  const sess = requireAgent();
  if (!sess) return PageShell(`<div class="wrap"><p class="help">Redirecting…</p></div>`);

  const c = DB.cases.find(x => x.id === "FBI-HOM-24-001");
  if (!c) return PageShell(`<div class="wrap"><p class="help">Case not found.</p></div>`);

  const sceneItems = c.scenes.map(s => `
    <a class="sideLink ${s.id === "S1" ? "active" : ""}" href="#/case/${esc(c.id)}">
      <span>${esc(s.id)} — ${esc(s.name)}</span>
      <span class="badge" style="opacity:.8">${esc(s.status)}</span>
    </a>
  `).join("");

  const evidenceRows = c.evidence.map(e => `
    <tr>
      <td><b>${esc(e.id)}</b></td>
      <td>${esc(e.name)}</td>
      <td>${esc(e.type)}</td>
      <td><span class="badge">${esc(e.status)}</span></td>
      <td style="text-align:right"><button class="btn ghost" data-act="evidence" data-id="${esc(e.id)}">View</button></td>
    </tr>
  `).join("");

  const suspectRows = c.suspects.map(p => `
    <tr>
      <td><b>${esc(p.id)}</b></td>
      <td>${esc(p.name)}</td>
      <td>${esc(p.role)}</td>
      <td><span class="badge ${p.risk === "HIGH" ? "bad" : p.risk === "LOW" ? "good" : ""}">${esc(p.risk)}</span></td>
      <td style="text-align:right"><button class="btn ghost" data-act="suspect" data-id="${esc(p.id)}">Profile</button></td>
    </tr>
  `).join("");

  return PageShell(`
    <div class="shell">
      <aside class="sidebar">
        <div class="sideTitle">
          <div class="name">${esc(c.id)}</div>
          <div class="sub">${esc(c.title)} • ${esc(c.location)}</div>
        </div>

        <div class="smallcaps">Scenes</div>
        <div class="sideNav" style="margin-top:10px">
          ${sceneItems}
        </div>

        <div style="margin-top:18px">
          <a class="sideLink" href="#/hq">← Back to HQ</a>
        </div>
      </aside>

      <main class="main">
        <div class="card">
          <div class="smallcaps">Scene S1 • Briefing Room</div>
          <div style="font-size:28px; font-weight:900; margin-top:10px">Briefing: ${esc(c.title)}</div>
          <p class="help" style="margin-top:10px; max-width:900px">
            This is the case viewer layout. Later you’ll plug in your real scene text, choices, interrogations, and outcomes.
          </p>
          <div class="hr"></div>

          <div class="row">
            <span class="badge">Clearance: Standard</span>
            <span class="badge">Time Estimate: ${esc(c.time)}</span>
            <span class="badge">Status: OPEN</span>
          </div>
        </div>

        <div style="height:14px"></div>

        <div class="row">
          <div class="card" style="flex:1; min-width:320px">
            <div class="smallcaps">Evidence Vault</div>
            <h3 style="margin:10px 0 12px; letter-spacing:.10em; text-transform:uppercase">Evidence</h3>
            <table class="table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Type</th><th>Status</th><th style="text-align:right">Action</th></tr>
              </thead>
              <tbody>${evidenceRows}</tbody>
            </table>
          </div>

          <div class="card" style="flex:1; min-width:320px">
            <div class="smallcaps">Persons of Interest</div>
            <h3 style="margin:10px 0 12px; letter-spacing:.10em; text-transform:uppercase">Suspects</h3>
            <table class="table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Role</th><th>Risk</th><th style="text-align:right">Action</th></tr>
              </thead>
              <tbody>${suspectRows}</tbody>
            </table>
          </div>
        </div>

        <div style="height:14px"></div>

        <div class="card">
          <div class="smallcaps">Next Actions</div>
          <div class="row" style="margin-top:10px">
            <button class="btn ghost" data-act="unlock">Request Warrant</button>
            <button class="btn ghost" data-act="unlock">Authorize Evidence Access</button>
            <button class="btn" data-act="unlock">Proceed to Crime Scene</button>
          </div>
          <p class="help" style="margin-top:10px">Buttons are placeholders for your future case logic.</p>
        </div>
      </main>
    </div>
  `);
}
  // ---------- Owner Portal (interactive, protected by owner login) ----------
  function OwnerShell(active, content) {
    return `
      <div class="shell">
        <aside class="sidebar">
          <div class="sideTitle">
            <div class="brand"><span class="dot"></span><span>${esc(DB.appName)}</span></div>
            <div class="sub"><span class="bad">OWNER PORTAL</span></div>
          </div>

          <div class="sideNav">
            ${sideLink("#/owner", "Dashboard", active === "#/owner")}
            ${sideLink("#/owner/cases", "Cases", active === "#/owner/cases")}
            ${sideLink("#/owner/analytics", "Analytics", active === "#/owner/analytics")}
            ${sideLink("#/owner/players", "Players", active === "#/owner/players")}
            ${sideLink("#/owner/revenue", "Revenue", active === "#/owner/revenue")}
          </div>

          <div style="margin-top:18px">
            <button class="btn danger" style="width:100%" data-act="ownerLogout">Logout</button>
          </div>
        </aside>

        <main class="main">
          ${content}
        </main>
      </div>
    `;
  }

  function sideLink(href, text, isActive) {
    return `<a class="sideLink ${isActive ? "active" : ""}" href="${href}">${esc(text)} <span style="opacity:.5">›</span></a>`;
  }

  function OwnerGate(targetHash) {
    if (!isOwner()) return OwnerLogin(targetHash);
    return null;
  }

  function OwnerLogin(backTo) {
    return PageShell(`
      <div class="wrap">
        <div class="centerBox">
          <div style="text-align:center">
            <div class="smallcaps bad">Restricted Access — Owner Only</div>
            <h2 style="margin:10px 0 4px; letter-spacing:.08em; text-transform:uppercase;">Owner Portal</h2>
            <p class="help">Dev login (for now): <b>${OWNER_EMAIL}</b> / <b>${OWNER_PASS}</b></p>
          </div>

          <div class="field">
            <label>Owner Email</label>
            <input id="oemail" placeholder="admin@casefiles.fbi" />
          </div>

          <div class="field">
            <label>Access Code</label>
            <input id="opass" type="password" placeholder="••••••••" />
          </div>

          <div class="ctaRow" style="justify-content:stretch">
            <button class="btn" style="width:100%" id="doOwnerLogin">Access Owner Portal</button>
          </div>
        </div>
      </div>
    `);
  }

  function OwnerDashboard() {
    const gate = OwnerGate("#/owner");
    if (gate) return gate;

    const m = DB.ownerMetrics;
    return PageShell(OwnerShell("#/owner", `
      <div class="row" style="justify-content:space-between; align-items:center">
        <div>
          <div class="smallcaps">Owner Portal</div>
          <h2 style="margin:8px 0 0; letter-spacing:.08em; text-transform:uppercase;">Dashboard</h2>
          <p class="help">Welcome back.</p>
        </div>
        <button class="btn ghost" data-act="newCase">+ New Case</button>
      </div>

      <div style="height:12px"></div>

      <div class="row">
        <div class="stat"><div class="k">${m.totalPlayers}</div><div class="t">Total Players</div></div>
        <div class="stat"><div class="k">${m.activeToday}</div><div class="t">Active Today</div></div>
        <div class="stat"><div class="k">${m.totalSessions}</div><div class="t">Total Sessions</div></div>
        <div class="stat"><div class="k">${m.completionRate}%</div><div class="t">Completion Rate</div></div>
      </div>

      <div style="height:14px"></div>

      <div class="row">
        <div class="card" style="flex:1; min-width:320px">
          <div class="smallcaps">Recent Cases</div>
          <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <div style="font-weight:900">${esc(DB.cases[0].title)}</div>
              <div class="help">${esc(DB.cases[0].id)}</div>
            </div>
            <span class="badge good">PUBLISHED</span>
          </div>
        </div>

        <div class="card" style="flex:1; min-width:320px">
          <div class="smallcaps">Ending Distribution</div>
          <div style="margin-top:12px">
            <div class="help"><span class="good">CLOSED (GOOD)</span> <span style="float:right">${m.goodEndings}</span></div>
            <div class="progress"><div style="width:${Math.max(3, m.goodEndings)}%; background: rgba(49,208,123,.7)"></div></div>
            <div style="height:10px"></div>
            <div class="help"><span class="bad">COMPROMISED (BAD)</span> <span style="float:right">${m.badEndings}</span></div>
            <div class="progress"><div style="width:${Math.min(100, 20*m.badEndings)}%; background: rgba(255,59,59,.8)"></div></div>
          </div>
        </div>
      </div>

      <div style="height:14px"></div>

      <div class="card">
        <div class="smallcaps">Subscriptions</div>
        <div style="font-size:36px; font-weight:900; margin-top:10px">${m.subscribers}</div>
        <div class="help">Active subscribers</div>
      </div>
    `));
  }

  function OwnerCases() {
    const gate = OwnerGate("#/owner/cases");
    if (gate) return gate;

    const rows = DB.cases.map(c => `
      <tr>
        <td>${esc(c.id)}</td>
        <td><b>${esc(c.title)}</b></td>
        <td>${esc(c.location)}</td>
        <td>10</td>
        <td>${c.published ? `<span class="badge good">PUBLISHED</span>` : `<span class="badge">DRAFT</span>`}</td>
        <td style="text-align:right">
          <button class="btn ghost" data-act="editCase" data-id="${esc(c.id)}">Edit</button>
        </td>
      </tr>
    `).join("");

    return PageShell(OwnerShell("#/owner/cases", `
      <div class="row" style="justify-content:space-between; align-items:center">
        <div>
          <div class="smallcaps">Cases in database</div>
          <h2 style="margin:8px 0 0; letter-spacing:.08em; text-transform:uppercase;">Case Manager</h2>
        </div>
        <div class="row">
          <button class="btn ghost" data-act="aiGenerate">AI Generate</button>
          <button class="btn ghost" data-act="newCase">+ New Case</button>
        </div>
      </div>

      <div style="height:14px"></div>

      <table class="table">
        <thead>
          <tr><th>Case ID</th><th>Title</th><th>Location</th><th>Scenes</th><th>Status</th><th style="text-align:right">Actions</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `));
  }

  function OwnerAnalytics() {
    const gate = OwnerGate("#/owner/analytics");
    if (gate) return gate;

    const m = DB.ownerMetrics;
    return PageShell(OwnerShell("#/owner/analytics", `
      <div>
        <div class="smallcaps">Platform performance metrics</div>
        <h2 style="margin:8px 0 0; letter-spacing:.08em; text-transform:uppercase;">Analytics</h2>
      </div>

      <div style="height:14px"></div>

      <div class="row">
        <div class="stat"><div class="k">${m.totalPlayers}</div><div class="t">Total Players</div></div>
        <div class="stat"><div class="k">${m.activeToday}</div><div class="t">Active Today</div></div>
        <div class="stat"><div class="k">${m.totalSessions}</div><div class="t">Total Sessions</div></div>
        <div class="stat"><div class="k">${m.subscribers}</div><div class="t">Subscribers</div></div>
      </div>

      <div style="height:14px"></div>

      <div class="row">
        <div class="card" style="flex:1; min-width:320px">
          <div class="smallcaps">Completion Rate</div>
          <div style="font-size:48px; font-weight:900; margin-top:8px">${m.completionRate}%</div>
          <div class="help">of started cases completed</div>
          <div style="height:10px"></div>
          <div class="progress"><div style="width:${m.completionRate}%; background: rgba(49,208,123,.7)"></div></div>
        </div>

        <div class="card" style="flex:1; min-width:320px">
          <div class="smallcaps">Ending Distribution</div>
          <div style="margin-top:12px">
            <div class="help"><span class="good">CLOSED (GOOD)</span> <span style="float:right">${m.goodEndings}</span></div>
            <div class="progress"><div style="width:${Math.max(2, m.goodEndings)}%; background: rgba(49,208,123,.7)"></div></div>
            <div style="height:10px"></div>
            <div class="help"><span class="bad">COMPROMISED (BAD)</span> <span style="float:right">${m.badEndings}</span></div>
            <div class="progress"><div style="width:${Math.min(100, 20*m.badEndings)}%; background: rgba(255,59,59,.8)"></div></div>
          </div>
        </div>
      </div>
    `));
  }

  function OwnerPlayers() {
    const gate = OwnerGate("#/owner/players");
    if (gate) return gate;

    const players = DB.ownerMetrics.players;
    const rows = players.map(p => `
      <tr>
        <td><b>${esc(p.username)}</b></td>
        <td>${esc(p.email)}</td>
        <td>${esc(p.level)}</td>
        <td>${esc(String(p.cp))} CP</td>
        <td>${esc(p.joined)}</td>
      </tr>
    `).join("");

    return PageShell(OwnerShell("#/owner/players", `
      <div>
        <div class="smallcaps">${players.length} registered players</div>
        <h2 style="margin:8px 0 0; letter-spacing:.08em; text-transform:uppercase;">Players</h2>
      </div>

      <div style="height:14px"></div>

      <div class="card">
        <input id="playerSearch" placeholder="Search by username or email..." style="width:100%" />
      </div>

      <div style="height:14px"></div>

      <table class="table" id="playersTable">
        <thead>
          <tr><th>Username</th><th>Email</th><th>Level</th><th>Career Points</th><th>Joined</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `));
  }

  function OwnerRevenue() {
    const gate = OwnerGate("#/owner/revenue");
    if (gate) return gate;

    const m = DB.ownerMetrics;
    const tx = m.recentTransactions.map(t => `
      <tr>
        <td><b>${esc(t.title)}</b><div class="help">${esc(t.date)}</div></td>
        <td style="text-align:right" class="good">+$${esc(t.amount.toFixed(2))}<div class="help">${esc(t.status)}</div></td>
      </tr>
    `).join("");

    return PageShell(OwnerShell("#/owner/revenue", `
      <div>
        <div class="smallcaps">Manage your earnings and bank payouts</div>
        <h2 style="margin:8px 0 0; letter-spacing:.08em; text-transform:uppercase;">Revenue & Payouts</h2>
      </div>

      <div style="height:14px"></div>

      <div class="card" style="border-color: rgba(49,208,123,.25)">
        <div class="badge good">Stripe Account Connected</div>
        <p class="help" style="margin-top:10px">
          This is a UI mock. Later we’ll connect real Stripe.
        </p>
        <div style="height:10px"></div>
        <button class="btn ghost" data-act="openStripe">Open Stripe Dashboard</button>
      </div>

      <div style="height:14px"></div>

      <div class="row">
        <div class="stat"><div class="k">$${m.totalRevenue.toFixed(2)}</div><div class="t">Total Revenue</div></div>
        <div class="stat"><div class="k">$${m.thisMonth.toFixed(2)}</div><div class="t">This Month</div></div>
        <div class="stat"><div class="k">$${m.pendingPayout.toFixed(2)}</div><div class="t">Pending Payout</div></div>
      </div>

      <div style="height:14px"></div>

      <table class="table">
        <thead><tr><th>Recent Transactions</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>${tx}</tbody>
      </table>
    `));
  }

  // ---------- Render + Page-specific bindings ----------
  function render() {
    const hash = window.location.hash || "#/";
    const page = routes[hash] || NotFound;
    $app.innerHTML = page();

    bindGlobalClicks();
    bindPageActions(hash);
  }

  function bindPageActions(hash) {if (hash === "#/hq") {
  document.querySelector("[data-act='openCase']")?.addEventListener("click", () => {
    navTo("#/case/FBI-HOM-24-001");if (hash === "#/case/FBI-HOM-24-001") {
  document.querySelectorAll("[data-act='evidence']").forEach(b => {
    b.addEventListener("click", () => alert("Evidence viewer later. Layout ready."));
  });
  document.querySelectorAll("[data-act='suspect']").forEach(b => {
    b.addEventListener("click", () => alert("Suspect profile later. Layout ready."));
  });
  document.querySelectorAll("[data-act='unlock']").forEach(b => {
    b.addEventListener("click", () => alert("Progression system later. Layout ready."));
  });
}  });
};
  });
}
    if (hash === "#/login") {
      document.getElementById("doLogin")?.addEventListener("click", () => {
        const email = document.getElementById("email").value.trim().toLowerCase();
        const pass = document.getElementById("pass").value;
        const users = getUsers();
        const u = users.find(x => x.email === email && x.pass === pass);
        if (!u) return alert("Invalid credentials.");
        setSession({ username: u.username, email: u.email, cp: u.cp ?? 0 });
        navTo("#/hq");
      });
    }

    if (hash === "#/register") {
      document.getElementById("doRegister")?.addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const p1 = document.getElementById("pass1").value;
        const p2 = document.getElementById("pass2").value;

        if (!username || !email || !p1) return alert("Fill out all fields.");
        if (p1 !== p2) return alert("Access codes do not match.");

        const users = getUsers();
        if (users.some(x => x.email === email)) return alert("Email already registered.");

        users.push({ username, email, pass: p1, cp: 0 });
        setUsers(users);
        setSession({ username, email, cp: 0 });
        navTo("#/hq");
      });
    }

    if (hash === "#/hq") {
      document.querySelector("[data-act='openCase']")?.addEventListener("click", () => {
        alert("Case view coming next. Layout is ready.");
      });
    }

    // Owner login submit
    if (hash.startsWith("#/owner") && !isOwner()) {
      document.getElementById("doOwnerLogin")?.addEventListener("click", () => {
        const e = document.getElementById("oemail").value.trim().toLowerCase();
        const p = document.getElementById("opass").value;
        if (e === OWNER_EMAIL && p === OWNER_PASS) {
          setOwner(true);
          navTo(hash); // retry same route
          render();
        } else {
          alert("Invalid owner credentials.");
        }
      });
    }

    // Owner logout
    document.querySelectorAll("[data-act='ownerLogout']").forEach(b => {
      b.addEventListener("click", () => { setOwner(false); navTo("#/"); });
    });

    // Owner portal actions (mock)
    document.querySelectorAll("[data-act='newCase']").forEach(b => b.addEventListener("click", () => alert("New Case builder later. Layout ready.")));
    document.querySelectorAll("[data-act='aiGenerate']").forEach(b => b.addEventListener("click", () => alert("AI generate later. Layout ready.")));
    document.querySelectorAll("[data-act='openStripe']").forEach(b => b.addEventListener("click", () => alert("Stripe connection later. Layout ready.")));
    document.querySelectorAll("[data-act='editCase']").forEach(b => b.addEventListener("click", () => alert("Case editor later. Layout ready.")));

    // Players search filter (Owner Players page)
    const search = document.getElementById("playerSearch");
    if (search) {
      const table = document.getElementById("playersTable");
      const original = table.querySelector("tbody").innerHTML;
      search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        const players = DB.ownerMetrics.players.filter(p =>
          p.username.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
        );
        table.querySelector("tbody").innerHTML = players.map(p => `
          <tr>
            <td><b>${esc(p.username)}</b></td>
            <td>${esc(p.email)}</td>
            <td>${esc(p.level)}</td>
            <td>${esc(String(p.cp))} CP</td>
            <td>${esc(p.joined)}</td>
          </tr>
        `).join("") || `<tr><td colspan="5" class="help">No results.</td></tr>`;
        if (!q) table.querySelector("tbody").innerHTML = original;
      });
    }
  }

  function NotFound() {
    return PageShell(`
      <div class="wrap">
        <div class="centerBox" style="text-align:center">
          <div class="smallcaps">404</div>
          <h2 style="letter-spacing:.08em; text-transform:uppercase;">Page Not Found</h2>
          <button class="btn" data-nav="#/">Go Home</button>
        </div>
      </div>
    `);
  }
})();
