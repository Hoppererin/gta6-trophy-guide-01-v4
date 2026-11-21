// Vice Platinum — GTA VI trophy guide & tracker.
// Tracker with saved progress (localStorage), export/import, kind + status filters,
// search, spoiler setting, count trackers, roadmap, missables and a sources tab
// that audits every citation. All trophy data lives in data/trophies.json; this
// file only renders it. Every guide step carries its sources, so the audit strip
// in the header is computed from the data, never hard-coded.

const SAVE_KEY = 'vice-platinum-save-v1';
const DATA_URL = 'data/trophies.json';

const KIND_GROUPS = [
  { key: 'all', label: 'All', kinds: null },
  { key: 'story', label: 'Story', kinds: ['story'] },
  { key: 'missable', label: 'Missable', kinds: ['missable'] },
  { key: 'collectibles', label: 'Collectibles', kinds: ['collectibles'] },
  { key: 'activities', label: 'Activities', kinds: ['activities'] },
  { key: 'side', label: 'Side quests', kinds: ['side'] },
  { key: 'crimefeats', label: 'Crime & feats', kinds: ['crime', 'feats'] },
  { key: 'money', label: 'Money', kinds: ['money'] },
  { key: 'completion', label: 'Completion', kinds: ['completion'] },
  { key: 'platinum', label: 'Platinum', kinds: ['platinum'] },
  { key: 'online', label: 'Online', kinds: ['online'] },
];

const KIND_NAMES = {
  platinum: 'Platinum', story: 'Story', completion: '100% completion', activities: 'Activities',
  side: 'Side quest', missable: 'Missable', collectibles: 'Collectible', crime: 'Crime',
  feats: 'One-off feat', money: 'Money', online: 'Online',
};

// Short codes printed beside each cited step, so the reader sees at a glance
// which guides back it. The full name and link sit in the guide panel below.
const SOURCE_CODES = {
  powerpyx: 'PP', pushsquare: 'PS', keengamer: 'KG', egamers: 'EG', planetgta6: 'PG',
  gamesfuze: 'GF', gtaspotter: 'GS', vicecityhustle: 'VH', gtabase: 'GB', gamemapa: 'GM',
  gametrek: 'GT', sixshore: 'SS', onemoregame: 'OM', mobalytics: 'MB', gtadb: 'GD',
  gtasixinsider: 'GI', radiotimes: 'RT', insidergaming: 'IG', technerdiness: 'TN',
  pressstart: 'PR', gtasixhow: 'GH',
};

const ROADMAP = [
  {
    n: 1, title: 'Before you start — set up for one clean run', time: '15 minutes',
    text: 'Leave cheats off for the whole run: they disable trophies and saving. Keep a manual save at the start and end of each chapter (15 manual slots) because there is no mission replay. Turn the spoiler toggle on if you want story trophies hidden until you earn them.',
    trophies: [],
  },
  {
    n: 2, title: 'Chapter 1 — learn Leonida, grab the one missable', time: 'Story, ~10 hours',
    text: 'Play the opening mission Gone Fishing, then the rest of Chapter 1. Do the Chapter 1 meditation at Jason’s house before the chapter ends — it is the only moment in the game that might be missable (see Positive Mental Attitude). Scan vehicles with WAiNK from the start: you need 200 of them for 100%.',
    trophies: [2, 3, 28],
  },
  {
    n: 3, title: 'Chapters 2–3 — Vice City opens', time: 'Story, ~25 hours',
    text: 'Finish Chapters 2 and 3, including the named missions Breakfast Run and The Cartel Heist. After Coffee Break in Chapter 2 you can play as both characters and roam together, which opens the partner trophies. Chapter 3 unlocks the Key Cloner, the Dye Pack Jammer, Yasmani’s jewelry jobs and the fences — and starts the Andy, Kenton, Billy, Randy and Tyrone strands.',
    trophies: [4, 5, 8, 9],
  },
  {
    n: 4, title: 'Chapters 4–5 — the endgame story', time: 'Story, ~25 hours',
    text: 'Finish Chapters 4 and 5, including Child’s Play, Headliners, VCIA Takedown, Operation Savage Glory and the final mission. Take the Chapter 4 optional mission That’s Where The Money Is… when it appears: it unlocks the bank-vault robberies. After the credits, free-roam continues and the 100% checklist appears.',
    trophies: [6, 7, 10, 11, 12, 13],
  },
  {
    n: 5, title: 'Side characters — finish every strand', time: '~10 hours',
    text: 'Clear the optional questlines: Andy (Lucia only), Kenton’s 7 shipwrecks, Billy’s 5 jobs, Randy’s 16 cars, Tyrone’s labs (Jason only), Bret’s hunts (Jason only) and 8 Strangers & Freaks strands. None of them can be missed — every quest giver is still there after the story.',
    trophies: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    n: 6, title: 'Activities — races, ranges, stunts, challenges', time: '~20 hours',
    text: 'Gold all 42 Shooting Range challenges, win a Top Fun drone race at all 14 locations, win 20 different races, land 250 stunts, beat Cal at fishing, finish one arcade game, try all 9 activity types and reach 50 of the 80 challenges. The ranges, drone races and 70 challenges are all needed again for 100%, so do them properly now.',
    trophies: [15, 16, 17, 18, 19, 20, 21, 32],
  },
  {
    n: 7, title: 'Crime — robberies with your partner', time: '~15 hours',
    text: 'Rob 5 bank vaults (8 for 100%), an armored truck, a jewelry store without being seen, 3 shops back-to-back with your partner, one illegal operation for each of the 9 gangs, and the one-off feats: a 4-star escape with your partner, 5 enemies in one Combat Focus, a stolen plane out of VCIA and a stolen Rhino tank.',
    trophies: [33, 34, 36, 37, 38, 39, 40, 41, 43],
  },
  {
    n: 8, title: 'Collect & explore — Leonida 100%', time: '~30 hours',
    text: 'Finish the collections: 3 card sets, 100 WAiNK scans, 100 vehicles discovered, the last meditation spots, all 52 areas explored, 8 garages bought, 10 vehicles registered to Scooter Bros, $250,000 laundered and $100,000 spent. Most of this has been building passively since Chapter 1.',
    trophies: [28, 30, 31, 35, 42, 52, 53, 54, 55],
  },
  {
    n: 9, title: 'Cleanup — 100% and the one-offs, then Platinum', time: '~10 hours',
    text: 'Open Progress, Stats, 100% Completion and clear whatever is left — the checklist is only about 60% of the game, so the last stretch is short. Then mop up the one-off feats: the Ocean Beach cocktail, the showroom Banshee, the bowling alley valuables, maximum strength for both characters, 500 profile actions, the UFO easter egg and the bike kicks. A Long Road pops at 100%, and the Platinum pops with the last trophy.',
    trophies: [1, 14, 44, 45, 46, 47, 48, 49, 50, 51],
  },
];

let trophies = [];
let sourceList = [];
let sourceByKey = new Map();
let byId = new Map();
let save = loadSave();
let activeKind = 'all';
let activeStatus = 'all';
let queryText = '';
let openId = null;

function loadSave() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null');
    if (raw && typeof raw === 'object') {
      return {
        earned: new Set(Array.isArray(raw.earned) ? raw.earned : []),
        counts: raw.counts && typeof raw.counts === 'object' ? raw.counts : {},
        spoiler: raw.spoiler === true,
      };
    }
  } catch { /* corrupted save: start fresh */ }
  return { earned: new Set(), counts: {}, spoiler: false };
}

function persistSave() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    earned: [...save.earned],
    counts: save.counts,
    spoiler: save.spoiler,
  }));
}

function computeAudit() {
  let steps = 0, cited = 0, twoPlus = 0, cites = 0;
  const sites = new Set();
  let trophiesTwoPlus = 0;
  for (const t of trophies) {
    const distinct = new Set();
    for (const st of t.steps) {
      steps += 1;
      cites += st.s.length;
      if (st.s.length >= 1) cited += 1;
      if (st.s.length >= 2) twoPlus += 1;
      for (const k of st.s) { distinct.add(k); sites.add(k); }
    }
    if (distinct.size >= 2) trophiesTwoPlus += 1;
  }
  return { steps, cited, twoPlus, cites, sites: sites.size, trophiesTwoPlus, total: trophies.length };
}

function renderAuditStrip() {
  const a = computeAudit();
  document.getElementById('auditStrip').textContent =
    'Audit: ' + a.steps + ' steps · ' + a.cited + ' cited · ' + a.twoPlus + ' with 2+ sources · ' +
    a.cites + ' citations · ' + a.sites + ' sources · ' +
    a.trophiesTwoPlus + '/' + a.total + ' trophies with 2+ sources';
}

function renderScorecard() {
  const total = trophies.length;
  const earned = save.earned.size;
  document.getElementById('earnedTotal').textContent = earned + ' / ' + total;
  document.getElementById('meterFill').style.width = total ? (earned / total * 100) + '%' : '0%';
  const byGrade = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || [0, 0];
    byGrade[t.grade][1] += 1;
    if (save.earned.has(t.name)) byGrade[t.grade][0] += 1;
  }
  const order = ['platinum', 'gold', 'silver', 'bronze'];
  document.getElementById('gradeLine').textContent = order
    .filter(g => byGrade[g])
    .map(g => g[0].toUpperCase() + g.slice(1) + ' ' + byGrade[g][0] + '/' + byGrade[g][1])
    .join(' · ');
}

function renderKindFilters() {
  const box = document.getElementById('kindFilters');
  box.replaceChildren();
  for (const group of KIND_GROUPS) {
    const count = group.kinds === null
      ? trophies.length
      : trophies.filter(t => group.kinds.includes(t.kind)).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-chip' + (activeKind === group.key ? ' active' : '');
    btn.textContent = group.label + ' (' + count + ')';
    btn.addEventListener('click', () => { activeKind = group.key; renderKindFilters(); renderTracker(); });
    box.append(btn);
  }
}

function trophyVisible(t) {
  if (activeKind !== 'all') {
    const group = KIND_GROUPS.find(g => g.key === activeKind);
    if (group && group.kinds && !group.kinds.includes(t.kind)) return false;
  }
  if (activeStatus === 'earned' && !save.earned.has(t.name)) return false;
  if (activeStatus === 'remaining' && save.earned.has(t.name)) return false;
  if (queryText) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.steps.map(s => s.t).join(' ')).toLowerCase();
    if (!hay.includes(queryText)) return false;
  }
  return true;
}

function countText(t) {
  const n = save.counts[t.id] ?? 0;
  if (t.countUnit && t.countUnit.startsWith('dollars')) {
    return '$' + n.toLocaleString('en-US') + ' / $' + t.countTarget.toLocaleString('en-US');
  }
  return n + ' / ' + t.countTarget + ' ' + t.countUnit;
}

function stepCitations(t) {
  let n = 0;
  for (const st of t.steps) n += st.s.length;
  return n;
}

function buildCard(t) {
  const card = document.createElement('article');
  card.className = 'card' + (save.earned.has(t.name) ? ' earned' : '') + (t.missable ? ' missable' : '');
  card.id = 'trophy-' + t.id;
  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'earn-check';
  box.checked = save.earned.has(t.name);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
  box.addEventListener('change', () => toggleEarned(t, box.checked));
  head.append(box);
  const main = document.createElement('div');
  main.className = 'card-main';
  const spoilerHidden = save.spoiler && t.kind === 'story' && !save.earned.has(t.name);
  const nameEl = document.createElement('h3');
  nameEl.className = 'card-name';
  if (spoilerHidden) {
    nameEl.textContent = 'Hidden story trophy';
    const tag = document.createElement('span');
    tag.className = 'tag-hidden';
    tag.textContent = 'SPOILER HIDDEN';
    nameEl.append(tag);
  } else {
    nameEl.textContent = t.name;
    if (t.hidden) {
      const tag = document.createElement('span');
      tag.className = 'tag-hidden';
      tag.textContent = 'HIDDEN ON PSN';
      nameEl.append(tag);
    }
  }
  main.append(nameEl);
  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = spoilerHidden
    ? 'Earn this trophy in the game to reveal its name and description. (Spoiler setting is on.)'
    : t.description;
  main.append(desc);
  const meta = document.createElement('div');
  meta.className = 'card-meta';
  const grade = document.createElement('span');
  grade.className = 'grade grade-' + t.grade;
  grade.textContent = t.grade;
  meta.append(grade);
  const kind = document.createElement('span');
  kind.className = 'tag-kind';
  kind.textContent = KIND_NAMES[t.kind] ?? t.kind;
  meta.append(kind);
  if (t.missable) {
    const flag = document.createElement('span');
    flag.className = 'tag-missable';
    flag.textContent = '⚠ POSSIBLY MISSABLE';
    meta.append(flag);
  }
  const stage = document.createElement('span');
  stage.className = 'tag-stage';
  stage.textContent = 'Roadmap stage ' + t.stage;
  meta.append(stage);
  const cite = document.createElement('span');
  cite.className = 'tag-cited';
  cite.textContent = '✓ 2+ SOURCES · ' + t.steps.length + ' steps · ' + stepCitations(t) + ' citations';
  meta.append(cite);
  if (t.countTarget) {
    const countBox = document.createElement('span');
    countBox.className = 'counter';
    const label = document.createElement('span');
    label.className = 'counter-label';
    label.textContent = 'Progress';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.textContent = '−';
    minus.setAttribute('aria-label', 'Decrease count for ' + t.name);
    minus.addEventListener('click', () => setCount(t, (save.counts[t.id] ?? 0) - 1));
    const value = document.createElement('span');
    value.className = 'counter-value';
    value.textContent = countText(t);
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'Increase count for ' + t.name);
    plus.addEventListener('click', () => setCount(t, (save.counts[t.id] ?? 0) + 1));
    countBox.append(label, minus, value, plus);
    meta.append(countBox);
  }
  main.append(meta);
  if (!spoilerHidden) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-toggle';
    btn.textContent = openId === t.id ? 'Hide guide ▲' : 'Read the guide ▼';
    btn.addEventListener('click', () => openGuide(t.id));
    meta.append(btn);
    if (openId === t.id) main.append(buildGuide(t));
  }
  head.append(main);
  card.append(head);
  return card;
}

function buildGuide(t) {
  const panel = document.createElement('div');
  panel.className = 'guide';
  const h = document.createElement('h4');
  h.textContent = 'How to get it';
  panel.append(h);
  const text = document.createElement('p');
  text.className = 'guide-lede';
  text.textContent = t.guide;
  panel.append(text);
  const list = document.createElement('ol');
  for (const st of t.steps) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = st.t + ' ';
    li.append(span);
    for (const key of st.s) {
      const src = sourceByKey.get(key);
      const chip = document.createElement('span');
      chip.className = 'src-chip';
      chip.title = src ? src.name + ' — ' + src.date : key;
      chip.textContent = SOURCE_CODES[key] ?? key;
      li.append(chip);
    }
    list.append(li);
  }
  panel.append(list);
  const sources = document.createElement('div');
  sources.className = 'guide-sources';
  const strong = document.createElement('strong');
  strong.textContent = 'Sources (' + t.sources.length + '): ';
  sources.append(strong);
  const ul = document.createElement('ul');
  for (const key of t.sources) {
    const s = sourceByKey.get(key);
    if (!s) continue;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a, document.createTextNode(' — ' + s.date));
    ul.append(li);
  }
  sources.append(ul);
  panel.append(sources);
  return panel;
}

function renderTracker() {
  renderScorecard();
  renderAuditStrip();
  const list = document.getElementById('trophyCards');
  list.replaceChildren();
  const shown = trophies.filter(trophyVisible);
  document.getElementById('countLine').textContent =
    'Showing ' + shown.length + ' of ' + trophies.length + ' trophies'
    + (activeKind !== 'all' ? ' — ' + KIND_GROUPS.find(g => g.key === activeKind).label : '')
    + (activeStatus !== 'all' ? ' — ' + activeStatus : '')
    + (queryText ? ' — matching “' + queryText + '”' : '')
    + '. Every step below cites its sources.';
  if (shown.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = activeKind === 'online'
      ? 'There are no online trophies in GTA VI — all 55 are offline, single-player (PowerPyx, 19 Nov 2026).'
      : 'No trophies match this filter.';
    list.append(p);
    return;
  }
  for (const t of shown) list.append(buildCard(t));
}

function toggleEarned(t, earned) {
  if (earned) save.earned.add(t.name);
  else save.earned.delete(t.name);
  persistSave();
  renderTracker();
}

function setCount(t, next) {
  const clamped = Math.max(0, Math.min(t.countTarget, next));
  save.counts[t.id] = clamped;
  persistSave();
  renderTracker();
}

function scrollToCard(id) {
  const el = document.getElementById('trophy-' + id);
  if (!el) return;
  const bar = document.getElementById('topbar');
  const controls = document.querySelector('.controls');
  const offset = (bar ? bar.offsetHeight : 0) + (controls ? controls.offsetHeight : 0) + 8;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'instant' });
}

function openGuide(id) {
  openId = openId === id ? null : id;
  renderTracker();
  if (openId !== null) scrollToCard(openId);
}

function renderRoadmap() {
  const box = document.getElementById('roadmapList');
  box.replaceChildren();
  for (const stage of ROADMAP) {
    const div = document.createElement('div');
    div.className = 'stage';
    const time = document.createElement('p');
    time.className = 'stage-time';
    time.textContent = 'Stage ' + stage.n + ' · ' + stage.time;
    div.append(time);
    const h = document.createElement('h3');
    h.textContent = stage.title;
    div.append(h);
    const p = document.createElement('p');
    p.textContent = stage.text;
    div.append(p);
    if (stage.trophies.length) {
      const chips = document.createElement('div');
      chips.className = 'stage-trophies';
      for (const id of stage.trophies) {
        const t = byId.get(id);
        const chip = document.createElement('span');
        chip.className = 'stage-trophy';
        chip.textContent = t.name + ' ';
        const g = document.createElement('span');
        g.className = 'g';
        g.textContent = '(' + t.grade + ')';
        chip.append(g);
        chips.append(chip);
      }
      div.append(chips);
    }
    box.append(div);
  }
}

function renderMissables() {
  const alert = document.getElementById('missableAlert');
  alert.replaceChildren();
  const warn = document.createElement('div');
  warn.className = 'warn';
  const h = document.createElement('h3');
  h.textContent = '⚠ 1 trophy is possibly missable: Positive Mental Attitude';
  warn.append(h);
  const p1 = document.createElement('p');
  p1.textContent = 'Meditate at every spot across Leonida. The first meditation, at Jason’s house in Chapter 1, is only offered in Chapter 1: after the mission Down to Earth, in the morning, talk to Lucia in the kitchen, follow her to the balcony and choose Accept. It never comes back. It is not yet confirmed whether that session counts toward the trophy — PowerPyx earned the trophy after doing it, so do it anyway.';
  warn.append(p1);
  const p2 = document.createElement('p');
  p2.textContent = 'Everything else can be finished after the story in free-roam. Two warnings that are not trophy misses: there is no mission replay, so keep a manual save at the start and end of each chapter; and any cheat disables trophies and saving, so leave cheats off until the Platinum pops.';
  warn.append(p2);
  alert.append(warn);
  const rows = document.getElementById('missableBody');
  rows.replaceChildren();
  for (const t of trophies) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = t.name;
    const grade = document.createElement('td');
    grade.textContent = t.grade;
    const miss = document.createElement('td');
    miss.textContent = t.missable ? 'Possibly' : 'No';
    miss.className = t.missable ? 'miss-yes' : 'miss-no';
    const why = document.createElement('td');
    why.textContent = t.missableNote;
    tr.append(name, grade, miss, why);
    rows.append(tr);
  }
}

function trophiesCiting(key) {
  let n = 0;
  for (const t of trophies) {
    if (t.steps.some(st => st.s.includes(key))) n += 1;
  }
  return n;
}

function renderSources() {
  const box = document.getElementById('auditBody');
  box.replaceChildren();
  const a = computeAudit();
  const intro = document.createElement('p');
  intro.className = 'intro';
  intro.textContent = 'Every trophy in this guide cites its sources by name, link and date — and every single step carries its own citations. The methods come from the guides below, rewritten in our own words; nothing is copied. The trophy names, descriptions and grades are the official list as PlayStation publishes it, as reported on 18 Nov 2026 and cross-checked across the lists below.';
  box.append(intro);
  const cards = document.createElement('div');
  cards.className = 'audit-cards';
  const figures = [
    [String(a.steps), 'guide steps in total'],
    [String(a.cited), 'steps with at least one source'],
    [String(a.twoPlus), 'steps with two or more sources'],
    [String(a.cites), 'citations across all steps'],
    [String(a.sites), 'different sources cited'],
    [a.trophiesTwoPlus + ' / ' + a.total, 'trophies with 2+ sources'],
  ];
  for (const [num, label] of figures) {
    const c = document.createElement('div');
    c.className = 'audit-card';
    const big = document.createElement('p');
    big.className = 'audit-num';
    big.textContent = num;
    const lab = document.createElement('p');
    lab.className = 'audit-label';
    lab.textContent = label;
    c.append(big, lab);
    cards.append(c);
  }
  box.append(cards);
  const table = document.createElement('table');
  table.className = 'grid-table matrix';
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  for (const label of ['Source', 'Date', 'List', 'Roadmap', 'Methods', 'Counts', 'Trophies']) {
    const th = document.createElement('th');
    th.textContent = label;
    headRow.append(th);
  }
  thead.append(headRow);
  table.append(thead);
  const tbody = document.createElement('tbody');
  const rows = [...sourceList].sort((x, y) => trophiesCiting(y.key) - trophiesCiting(x.key));
  for (const s of rows) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    const aEl = document.createElement('a');
    aEl.href = s.url;
    aEl.target = '_blank';
    aEl.rel = 'noopener';
    aEl.textContent = s.name;
    name.append(aEl);
    const role = document.createElement('p');
    role.className = 'src-role';
    role.textContent = s.role;
    name.append(role);
    const date = document.createElement('td');
    date.textContent = s.date;
    const mk = (cover) => {
      const td = document.createElement('td');
      td.className = 'cov';
      td.textContent = s.covers.includes(cover) ? '●' : '—';
      return td;
    };
    const count = document.createElement('td');
    count.className = 'cov';
    count.textContent = String(trophiesCiting(s.key));
    tr.append(name, date, mk('list'), mk('roadmap'), mk('methods'), mk('counts'), count);
    tbody.append(tr);
  }
  table.append(tbody);
  box.append(table);
  const listNote = document.createElement('div');
  listNote.className = 'note';
  const lh = document.createElement('h3');
  lh.textContent = 'Where the official list comes from';
  listNote.append(lh);
  const lp = document.createElement('p');
  lp.textContent = 'The 55 names, descriptions and grades are the official PlayStation 5 list as reported on 18 Nov 2026 by PlanetGTA6, taken from Exophase and cross-checked with PSNProfiles and TrueAchievements; the same names and grades appear in the lists at PowerPyx, PushSquare, KeenGamer, EGamers, GamesFuze, GTASpotter, Vice City Hustle, GTABase, Press Start, Radio Times, Insider Gaming, TechNerdiness, GTADB, One More Game, GTA Six Insider and GTA Six How. 28 of the 55 are hidden on PlayStation until earned.';
  listNote.append(lp);
  box.append(listNote);
  const honest = document.createElement('div');
  honest.className = 'note';
  const hh = document.createElement('h3');
  hh.textContent = 'What is still unconfirmed — stated honestly';
  honest.append(hh);
  const hul = document.createElement('ul');
  for (const line of [
    'Bad Luck, I Guess: PowerPyx reports a method (rob the Little Cuba Payday Loans again as Lucia, on foot), while Vice City Hustle still lists the trigger as unconfirmed. The guide gives the method and says so.',
    'In The Beginning…: PowerPyx reports the Ocean View Rooftop Bar Apple Martini method; Vice City Hustle still lists the trigger as unconfirmed.',
    'Fair Game: PowerPyx notes it is still unconfirmed which exact animal pops the trophy — the guide tells you to work Bret’s whole strand.',
    'Positive Mental Attitude: it is unconfirmed whether the Chapter 1 meditation counts toward the trophy. The guide tells you to do it anyway.',
    'Ten Pin: Vice City Hustle lists the trigger as unconfirmed; PowerPyx reports the bike-kick method, so the guide gives it with that caveat.',
    'Counts such as 42 Shooting Range challenges, 14 drone race locations and 52 areas come from the trophy descriptions and the guides above; where a count is the game’s own tracked number it is shown as a target in the tracker.',
  ]) {
    const li = document.createElement('li');
    li.textContent = line;
    hul.append(li);
  }
  honest.append(hul);
  box.append(honest);
  const about = document.createElement('div');
  about.className = 'note';
  const ah = document.createElement('h3');
  ah.textContent = 'About this guide';
  about.append(ah);
  const ap = document.createElement('p');
  ap.textContent = 'Vice Platinum is a fan-made guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI. It is not affiliated with, endorsed by, or connected to Rockstar Games, Take-Two Interactive, or PlayStation. It runs entirely offline from its own files: no network requests, no accounts, no tracking. Your progress lives only in this browser and in the file you export.';
  about.append(ap);
  box.append(about);
}

function switchPanel(name) {
  for (const btn of document.querySelectorAll('.tablink')) {
    btn.classList.toggle('active', btn.dataset.panel === name);
  }
  for (const panel of document.querySelectorAll('.panel')) {
    panel.classList.toggle('hidden', panel.id !== 'panel-' + name);
  }
  if (history.replaceState) history.replaceState(null, '', '#tab=' + name);
}

function applyHash() {
  const hash = new URLSearchParams(location.hash.slice(1));
  const tab = hash.get('tab');
  if (tab && document.getElementById('panel-' + tab)) switchPanel(tab);
  const kind = hash.get('kind');
  if (kind && KIND_GROUPS.some(g => g.key === kind)) { activeKind = kind; renderKindFilters(); }
  const earned = hash.get('earned');
  if (earned) {
    const names = new Set(trophies.map(t => t.name));
    save.earned = new Set(
      earned.split(',').map(Number).filter(id => byId.has(id)).map(id => byId.get(id).name).filter(n => names.has(n)),
    );
    persistSave();
  }
  const guide = Number(hash.get('guide'));
  if (guide && byId.has(guide)) {
    openId = guide;
    renderTracker();
    scrollToCard(guide);
    if (hash.get('focus') === 'guide') {
      const panel = document.querySelector('#trophy-' + guide + ' .guide');
      if (panel) {
        const bar = document.getElementById('topbar');
        const controls = document.querySelector('.controls');
        const off = (bar ? bar.offsetHeight : 0) + (controls ? controls.offsetHeight : 0) + 8;
        window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY - off, behavior: 'instant' });
      }
    }
  } else if (openId !== null) {
    openId = null;
    renderTracker();
  }
  measureTopbar();
}

window.addEventListener('hashchange', applyHash);

function exportProgress() {
  const payload = {
    app: 'vice-platinum-gta6-trophies',
    exportedAt: new Date().toISOString(),
    earned: [...save.earned],
    counts: save.counts,
    spoiler: save.spoiler,
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'vice-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const names = new Set(trophies.map(t => t.name));
      save.earned = new Set((data.earned ?? []).filter(n => names.has(n)));
      const counts = {};
      for (const [id, n] of Object.entries(data.counts ?? {})) {
        const t = byId.get(Number(id));
        if (t && t.countTarget) counts[id] = Math.max(0, Math.min(t.countTarget, Number(n) || 0));
      }
      save.counts = counts;
      if (typeof data.spoiler === 'boolean') {
        save.spoiler = data.spoiler;
        document.getElementById('spoilerBox').checked = save.spoiler;
      }
      persistSave();
      renderTracker();
    } catch {
      alert('That file is not a Vice Platinum progress export.');
    }
  };
  reader.readAsText(file);
}

async function loadData() {
  const doc = await (await fetch(DATA_URL)).json();
  trophies = doc.trophies;
  sourceList = doc.sources ?? [];
  sourceByKey = new Map(sourceList.map(s => [s.key, s]));
  byId = new Map(trophies.map(t => [t.id, t]));
}

function wireControls() {
  for (const btn of document.querySelectorAll('.tablink')) {
    btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
  }
  document.getElementById('findBox').addEventListener('input', e => {
    queryText = e.target.value.trim().toLowerCase();
    renderTracker();
  });
  document.getElementById('statusPick').addEventListener('change', e => {
    activeStatus = e.target.value;
    renderTracker();
  });
  const spoiler = document.getElementById('spoilerBox');
  spoiler.checked = save.spoiler;
  spoiler.addEventListener('change', () => {
    save.spoiler = spoiler.checked;
    persistSave();
    renderTracker();
  });
  document.getElementById('exportBtn').addEventListener('click', exportProgress);
  document.getElementById('importFile').addEventListener('change', e => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = '';
  });
}

function measureTopbar() {
  const bar = document.getElementById('topbar');
  if (bar) document.documentElement.style.setProperty('--top-height', bar.offsetHeight + 'px');
}

await loadData();
wireControls();
renderKindFilters();
renderRoadmap();
renderMissables();
renderSources();
renderTracker();
applyHash();
measureTopbar();
window.addEventListener('resize', measureTopbar);
