(() => {
  "use strict";

  const STORAGE_KEY = "agora-state-v1";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M12 3.1 3.5 10.2V21h6.3v-6h4.4v6h6.3V10.2L12 3.1z"/></svg>',
    explore: '<svg viewBox="0 0 24 24"><path d="M10.6 3a7.4 7.4 0 1 0 0 14.8c1.2 0 2.4-.3 3.4-.8l5.2 5.2 1.4-1.4-5.2-5.2c.5-1 .8-2.2.8-3.4A7.4 7.4 0 0 0 10.6 3zm0 2a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8z"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.2L5 21V4a1 1 0 0 1 1-1z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><path d="M10.6 3a7.4 7.4 0 1 0 0 14.8c1.2 0 2.4-.3 3.4-.8l5.2 5.2 1.4-1.4-5.2-5.2c.5-1 .8-2.2.8-3.4A7.4 7.4 0 0 0 10.6 3zm0 2a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8z"/></svg>',
    feather: '<svg viewBox="0 0 24 24"><path d="M3 17.2V21h3.8L17.9 9.9l-3.8-3.8L3 17.2zM20.7 7.1a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.8 1.8 3.8 3.8 1.8-1.8z"/></svg>',
    reply: '<svg viewBox="0 0 24 24"><path d="M4 3h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9.4L4 21.5V4a1 1 0 0 1 1-1z"/></svg>',
    repost: '<svg viewBox="0 0 24 24"><path d="M17 2.5 21.5 7 17 11.5V8.5H8v-2h9V2.5zM7 21.5 2.5 17 7 12.5v3h9v2H7v4z"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    views: '<svg viewBox="0 0 24 24"><path d="M5 9.2h3V19H5V9.2zm5.6-4.2h2.8V19h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M12 1.8 14.6 4l3.5-.3.6 3.4 3 1.8-1.6 3.1 1.6 3.1-3 1.8-.6 3.4-3.5-.3L12 22.2 9.4 20l-3.5.3-.6-3.4-3-1.8L3.9 12 2.3 8.9l3-1.8.6-3.4L9.4 4 12 1.8zM10.8 16.4l5-5-1.4-1.4-3.6 3.6-1.8-1.8-1.4 1.4 3.2 3.2z"/></svg>',
    external: '<svg viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z"/></svg>'
  };

  const defaultState = () => ({
    liked: {},
    reposted: {},
    bookmarked: {},
    userPosts: [],
    view: "home",
    sort: "latest",
    topic: null,
    q: ""
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return defaultState();
  }

  const state = loadState();
  const expanded = new Set();

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function hash(s) {
    let h = 7;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function baseCounts(id) {
    const h = hash(id);
    return {
      replies: h % 137,
      reposts: 5 + ((h >> 3) % 400),
      likes: 40 + ((h >> 6) % 3600),
      views: 500 + ((h >> 9) % 90000)
    };
  }

  function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  function timeAgo(iso) {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return Math.max(1, Math.floor(s)) + "s";
    if (s < 3600) return Math.floor(s / 60) + "m";
    if (s < 86400) return Math.floor(s / 3600) + "h";
    if (s < 86400 * 30) return Math.floor(s / 86400) + "d";
    if (s < 86400 * 365) return Math.floor(s / (86400 * 30)) + "mo";
    return Math.floor(s / (86400 * 365)) + "y";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function initials(authors) {
    return authors.map(a => a.trim().charAt(0)).join("").slice(0, 2).toUpperCase();
  }

  function handle(p) {
    const last = p.authors.length ? p.authors[p.authors.length - 1].split(" ").pop() : "paper";
    return "@" + String(last).toLowerCase().replace(/[^a-z0-9]/g, "") + "_" + p.year;
  }

  function allPosts() {
    return state.userPosts.concat(PAPERS);
  }

  function totalLikes(p) {
    return baseCounts(p.id).likes + (state.liked[p.id] ? 1 : 0);
  }

  function visiblePosts() {
    let list = allPosts();
    if (state.topic) list = list.filter(p => p.topics.indexOf(state.topic) !== -1);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(p =>
        (p.title + " " + p.authors.join(" ") + " " + p.venue + " " + p.abstract + " " + p.topics.join(" "))
          .toLowerCase().indexOf(q) !== -1);
    }
    if (state.sort === "top") {
      list = list.slice().sort((a, b) => totalLikes(b) - totalLikes(a));
    } else {
      list = list.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts));
    }
    return list;
  }

  function cardHTML(p) {
    const c = baseCounts(p.id);
    const liked = !!state.liked[p.id];
    const rep = !!state.reposted[p.id];
    const bm = !!state.bookmarked[p.id];
    const isExpanded = expanded.has(p.id);
    const long = p.abstract.length > 300 && !isExpanded;
    const hue = hash(p.id) % 360;
    return `
  <article class="post" id="p-${esc(p.id)}" data-id="${esc(p.id)}">
    <div class="avatar" style="background:hsl(${hue} 45% 22%)">${esc(initials(p.authors))}</div>
    <div class="post-body">
      <div class="post-head">
        <span class="names">${esc(p.authors.join(", "))}</span>
        ${p.classic ? `<span class="verified" title="Seminal work">${ICONS.check}</span>` : ""}
        <span class="meta">${esc(handle(p))} · ${esc(p.venue)} ’${String(p.year).slice(-2)} · ${timeAgo(p.ts)}</span>
      </div>
      <a class="title" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}<span class="ext">${ICONS.external}</span></a>
      <p class="abstract${long ? " clamped" : ""}">${esc(p.abstract)}</p>
      ${p.abstract.length > 300 ? `<button class="show-more" data-action="toggle-expand">${isExpanded ? "show less" : "show more"}</button>` : ""}
      ${p.topics.length ? `<div class="chips">${p.topics.map(t => `<button class="chip" data-action="topic" data-topic="${esc(t)}">#${esc(t)}</button>`).join("")}</div>` : ""}
      <div class="actions">
        <span class="action" title="Replies">${ICONS.reply}<span>${fmt(c.replies)}</span></span>
        <button class="action${rep ? " on repost" : ""}" data-action="repost" title="Repost">${ICONS.repost}<span>${fmt(c.reposts + (rep ? 1 : 0))}</span></button>
        <button class="action${liked ? " on like" : ""}" data-action="like" title="Like">${ICONS.heart}<span>${fmt(c.likes + (liked ? 1 : 0))}</span></button>
        <span class="action" title="Views">${ICONS.views}<span>${fmt(c.views)}</span></span>
        <button class="action${bm ? " on bookmark" : ""}" data-action="bookmark" title="Bookmark">${ICONS.bookmark}<span></span></button>
        <button class="action" data-action="share" title="Copy link">${ICONS.share}<span></span></button>
      </div>
    </div>
  </article>`;
  }

  function homeHTML() {
    const posts = visiblePosts();
    const tabs = `<div class="tabs">
      <button class="tab${state.sort === "latest" ? " active" : ""}" data-sort="latest">Latest</button>
      <button class="tab${state.sort === "top" ? " active" : ""}" data-sort="top">Top</button>
    </div>`;
    const banner = state.topic
      ? `<div class="filter-banner">#${esc(state.topic)} · ${posts.length} paper${posts.length === 1 ? "" : "s"}<button class="clear" data-action="clear-topic">clear</button></div>`
      : "";
    const composer = `<div class="composer"><div class="avatar you">You</div><button class="composer-open" data-action="compose">Share a paper…</button></div>`;
    const feed = posts.length
      ? posts.map(cardHTML).join("")
      : `<div class="empty">No papers match your search. <button class="link" data-action="clear-all">Clear search &amp; filters</button></div>`;
    return `<div class="tl-head"><h1>Home</h1>${tabs}</div>${composer}${banner}<section class="feed">${feed}</section>`;
  }

  function exploreHTML() {
    const byTopic = {};
    allPosts().forEach(p => p.topics.forEach(t => { (byTopic[t] = byTopic[t] || []).push(p); }));
    const topics = Object.keys(byTopic).sort();
    const cards = topics.map(t => {
      const ex = byTopic[t][0];
      const title = ex.title.length > 80 ? ex.title.slice(0, 80) + "…" : ex.title;
      return `<button class="topic-card" data-action="topic" data-topic="${esc(t)}">
        <span class="topic-name">#${esc(t)}</span>
        <span class="topic-n">${byTopic[t].length} paper${byTopic[t].length === 1 ? "" : "s"}</span>
        <span class="topic-ex">e.g. ${esc(title)}</span>
      </button>`;
    }).join("");
    return `<div class="tl-head"><h1>Explore</h1></div><section class="topic-grid">${cards}</section>`;
  }

  function bookmarksHTML() {
    const posts = allPosts().filter(p => state.bookmarked[p.id])
      .sort((a, b) => new Date(b.ts) - new Date(a.ts));
    const feed = posts.length
      ? posts.map(cardHTML).join("")
      : `<div class="empty">Nothing bookmarked yet.<br />Tap the bookmark icon on any paper to save it here.</div>`;
    return `<div class="tl-head"><h1>Bookmarks</h1></div><section class="feed">${feed}</section>`;
  }

  function aboutHTML() {
    return `<div class="tl-head"><h1>About</h1></div>
    <section class="about">
      <p><strong>Agora</strong> is an X-style reading feed where every post is a seminal paper in
      <strong>political theory</strong> and <strong>international relations</strong> — from Wendt on anarchy
      to Rawls on justice, Mearsheimer on institutions to Berlin on liberty.</p>
      <p>Like, repost, bookmark and share papers; filter by topic; search the abstracts; or post your own
      reading with the <em>Post a paper</em> button. Everything is stored locally in your browser
      (<code>localStorage</code>) — no account, no server.</p>
      <ul>
        <li>Feed seeded from the classics in <code>assets/js/data.js</code> (DOI-linked)</li>
        <li>Vanilla HTML/CSS/JS — no build step, no dependencies, no runtime network calls</li>
        <li>Run it by opening <code>index.html</code> or with <code>python3 -m http.server</code></li>
      </ul>
    </section>`;
  }

  function renderMain() {
    const main = $("#main");
    if (state.view === "explore") main.innerHTML = exploreHTML();
    else if (state.view === "bookmarks") main.innerHTML = bookmarksHTML();
    else if (state.view === "about") main.innerHTML = aboutHTML();
    else main.innerHTML = homeHTML();
  }

  function renderNav() {
    $$("#nav .nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === state.view));
  }

  function renderAside() {
    const counts = {};
    allPosts().forEach(p => p.topics.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    $("#trending").innerHTML = `<h2>Trending in IR &amp; theory</h2>` + top.map(([t, n]) =>
      `<button class="trend" data-topic="${esc(t)}"><span class="trend-topic">#${esc(t)}</span><span class="trend-n">${n} paper${n === 1 ? "" : "s"}</span></button>`).join("");
    const sugg = allPosts().slice().sort((a, b) => totalLikes(b) - totalLikes(a)).slice(0, 3);
    $("#suggested").innerHTML = `<h2>Most liked</h2>` + sugg.map(p =>
      `<a class="sugg" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"><span class="sugg-title">${esc(p.title)}</span><span class="sugg-meta">${esc(p.authors.join(", "))} · ${esc(p.year)}</span></a>`).join("");
  }

  function renderAll() {
    renderNav();
    renderMain();
    renderAside();
  }

  function setView(v) {
    state.view = v;
    save();
    renderAll();
    window.scrollTo(0, 0);
  }

  function setTopic(t) {
    state.topic = t;
    state.view = "home";
    save();
    renderAll();
    window.scrollTo(0, 0);
  }

  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  function copyText(text) {
    const done = () => toast("Link copied");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    ta.remove();
    done();
  }

  function onMainClick(e) {
    const sortBtn = e.target.closest("[data-sort]");
    if (sortBtn) {
      state.sort = sortBtn.dataset.sort;
      save();
      renderAll();
      return;
    }
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    if (action === "compose") { openComposer(); return; }
    if (action === "clear-topic") { state.topic = null; save(); renderAll(); return; }
    if (action === "clear-all") {
      state.topic = null;
      state.q = "";
      const s = $("#search");
      if (s) s.value = "";
      save();
      renderAll();
      return;
    }
    if (action === "topic") { setTopic(el.dataset.topic); return; }
    if (action === "toggle-expand") {
      const post = el.closest(".post");
      if (!post) return;
      if (expanded.has(post.dataset.id)) expanded.delete(post.dataset.id);
      else expanded.add(post.dataset.id);
      renderMain();
      return;
    }
    const post = el.closest(".post");
    if (!post) return;
    const id = post.dataset.id;
    if (action === "like" || action === "repost" || action === "bookmark") {
      const key = action === "like" ? "liked" : action === "repost" ? "reposted" : "bookmarked";
      if (state[key][id]) delete state[key][id];
      else state[key][id] = true;
      save();
      renderAll();
      return;
    }
    if (action === "share") {
      copyText(location.href.split("#")[0] + "#p-" + id);
      return;
    }
  }

  function openComposer() {
    $("#modal-root").innerHTML = `
    <div class="modal-overlay">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Share a paper">
        <div class="modal-head">
          <button class="icon-btn" data-action="close-modal" aria-label="Close">${ICONS.close}</button>
          <h2>Share a paper</h2>
        </div>
        <form id="composer-form" class="composer-form">
          <input name="title" placeholder="Paper title *" required maxlength="220" />
          <input name="authors" placeholder="Authors, comma separated *" required maxlength="200" />
          <div class="row2">
            <input name="venue" placeholder="Venue / journal" maxlength="120" />
            <input name="year" placeholder="Year" inputmode="numeric" maxlength="4" />
          </div>
          <input name="url" type="url" placeholder="Link (DOI or page URL)" maxlength="300" />
          <textarea name="abstract" rows="6" placeholder="Abstract *" required maxlength="1500"></textarea>
          <input name="topics" placeholder="Topics, comma separated (e.g. realism, norms)" maxlength="200" />
          <div class="modal-foot">
            <span class="hint">Saved to this browser’s local feed.</span>
            <button type="submit" class="post-btn small">Post</button>
          </div>
        </form>
      </div>
    </div>`;
    $("#composer-form").addEventListener("submit", onComposerSubmit);
    const first = $("#composer-form input[name=title]");
    if (first) first.focus();
  }

  function closeModal() {
    $("#modal-root").innerHTML = "";
  }

  function onModalClick(e) {
    if (e.target.closest("[data-action=close-modal]") || e.target.classList.contains("modal-overlay")) closeModal();
  }

  function onComposerSubmit(e) {
    e.preventDefault();
    const f = e.target;
    const g = n => (f.elements[n].value || "").trim();
    const authors = g("authors").split(",").map(s => s.trim()).filter(Boolean);
    const topics = g("topics").split(",")
      .map(s => s.trim().toLowerCase().replace(/[^a-z0-9-]/g, ""))
      .filter(Boolean).slice(0, 6);
    const url = g("url") || ("https://api.crossref.org/works?query.bibliographic=" +
      encodeURIComponent(g("title") + " " + authors.join(" ")));
    const post = {
      id: "u-" + Date.now(),
      title: g("title"),
      authors: authors.length ? authors : ["Anonymous"],
      venue: g("venue") || "Self-published",
      year: g("year") || String(new Date().getFullYear()),
      url,
      abstract: g("abstract"),
      topics,
      ts: new Date().toISOString(),
      classic: false
    };
    state.userPosts.unshift(post);
    state.view = "home";
    state.sort = "latest";
    save();
    closeModal();
    renderAll();
    const el = document.getElementById("p-" + post.id);
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.classList.add("flash");
    }
  }

  function init() {
    $$("[data-icon]").forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || ""; });

    const search = $("#search");
    search.value = state.q;
    search.addEventListener("input", () => {
      state.q = search.value.trim();
      renderMain();
    });

    $("#nav").addEventListener("click", e => {
      const v = e.target.closest("[data-view]");
      if (v) {
        e.preventDefault();
        setView(v.dataset.view);
      }
    });

    $(".logo").addEventListener("click", e => {
      e.preventDefault();
      setView("home");
    });

    $("#open-composer").addEventListener("click", openComposer);

    $(".rail-right").addEventListener("click", e => {
      const t = e.target.closest("[data-topic]");
      if (t) setTopic(t.dataset.topic);
    });

    $("#main").addEventListener("click", onMainClick);
    $("#modal-root").addEventListener("click", onModalClick);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

    renderAll();

    const m = location.hash.match(/^#p-(.+)$/);
    if (m) {
      const el = document.getElementById("p-" + m[1]);
      if (el) {
        el.scrollIntoView({ block: "center" });
        el.classList.add("flash");
      }
    }
  }

  init();
})();
