(function () {
  "use strict";

  const app = document.getElementById("app");
  const navLinks = document.querySelectorAll(".nav-links a");
  const themeToggle = document.getElementById("theme-toggle");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Theme ----------
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;
  themeToggle.textContent = initialTheme === "dark" ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // ---------- Markdown rendering ----------
  marked.setOptions({ breaks: true, gfm: true });
  function renderMarkdown(md) {
    const html = marked.parse(md || "");
    return DOMPurify.sanitize(html);
  }

  async function fetchMarkdown(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load " + path);
    return res.text();
  }

  // ---------- Router ----------
  const routes = {
    "": renderHome,
    "/": renderHome,
    "/projects": renderProjects,
    "/articles": renderArticles,
    "/about": renderAbout,
    "/wechat": renderWeChat,
  };

  function parseHash() {
    const hash = location.hash.replace(/^#/, "") || "/";
    return hash;
  }

  function setActiveNav(path) {
    const top = "/" + (path.split("/")[1] || "");
    navLinks.forEach((a) => {
      const href = a.getAttribute("href").replace(/^#/, "");
      a.classList.toggle("active", href === top || (href === "/" && path === "/"));
    });
  }

  async function route() {
    const path = parseHash();
    setActiveNav(path);
    window.scrollTo({ top: 0, behavior: "instant" });

    if (routes[path]) {
      routes[path]();
      return;
    }

    // Dynamic: /articles/:slug or /projects/:slug
    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "articles" && parts[1]) {
      renderArticlePost(parts[1]);
      return;
    }
    if (parts[0] === "projects" && parts[1]) {
      renderProjectPost(parts[1]);
      return;
    }

    renderNotFound();
  }

  // ---------- Views ----------
  function renderHome() {
    const p = window.SITE_DATA.profile;
    const projects = window.SITE_DATA.projects.slice(0, 3);
    const articles = window.SITE_DATA.articles.slice(0, 5);

    app.innerHTML = `
      <section class="hero">
        <h1 class="hero-title">你好，我是 <span class="accent">${escapeHTML(p.name)}</span>。</h1>
        <p class="hero-sub">${escapeHTML(p.intro)}</p>
        <div class="tags">
          ${p.tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}
        </div>
        <div class="btn-row">
          <a class="btn primary" href="https://xlearnity.ai" target="_blank" rel="noopener">🚀 访问 xlearnity.ai</a>
          <a class="btn" href="#/articles">📝 看文章</a>
          <a class="btn" href="#/wechat">💬 关注公众号</a>
          <a class="btn" href="https://x.com/pandatalk8" target="_blank" rel="noopener">𝕏 在 X 上关注我</a>
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <h2>最近在做的项目</h2>
          <a href="#/projects">全部 →</a>
        </div>
        <div class="card-grid">
          ${projects.map(projectCard).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <h2>最近的文章</h2>
          <a href="#/articles">全部 →</a>
        </div>
        <ul class="article-list">
          ${articles.map(articleRow).join("")}
        </ul>
      </section>

      <section class="section">
        <div class="section-title"><h2>在这里找到我</h2></div>
        <div class="social-list">
          ${window.SITE_DATA.socials.map(socialItem).join("")}
        </div>
      </section>
    `;
  }

  function renderProjects() {
    const projects = window.SITE_DATA.projects;
    app.innerHTML = `
      <section class="section">
        <div class="section-title"><h2>作品 / Projects</h2></div>
        <p style="color:var(--text-soft); margin-top:-8px;">
          我相信「少而精」—— 这里只放我真正投入时间在做的东西。
        </p>
        <div class="card-grid" style="margin-top:20px;">
          ${projects.map(projectCard).join("")}
        </div>
      </section>
    `;
  }

  function renderArticles() {
    const articles = window.SITE_DATA.articles;
    app.innerHTML = `
      <section class="section">
        <div class="section-title"><h2>文章 / Writing</h2></div>
        <p style="color:var(--text-soft); margin-top:-8px;">
          关于 AI、独立开发、产品、以及一些个人思考。
        </p>
        <ul class="article-list" style="margin-top:10px;">
          ${articles.map(articleRow).join("")}
        </ul>
      </section>
    `;
  }

  async function renderAbout() {
    app.innerHTML = `<div class="loading">加载中…</div>`;
    try {
      const md = await fetchMarkdown("./content/about.md");
      app.innerHTML = `
        <article class="md">
          ${renderMarkdown(md)}
        </article>
      `;
    } catch (e) {
      app.innerHTML = `<div class="empty">无法加载 about.md：${escapeHTML(e.message)}</div>`;
    }
  }

  function renderWeChat() {
    app.innerHTML = `
      <section class="section">
        <div class="section-title"><h2>微信公众号</h2></div>
        <p style="color:var(--text-soft);">
          扫码关注公众号「<strong>Panda 的 AI 笔记</strong>」，第一时间看到我的长文、项目复盘与 AI 独立开发实录。
        </p>
        <div class="qr-card" style="margin-top:18px;">
          <img src="./assets/wechat-qr.png" alt="微信公众号二维码"
               onerror="this.replaceWith(Object.assign(document.createElement('div'),{textContent:'（请把你的公众号二维码放到 homepage/assets/wechat-qr.png）',style:'width:120px;height:120px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;color:var(--text-muted);border:1px dashed var(--border);border-radius:10px;padding:8px;'}));" />
          <div class="qr-text">
            <strong>Panda 的 AI 笔记</strong>
            <span>微信扫一扫 · 即可关注</span>
            <span style="margin-top:8px; display:block;">也可在微信中搜索：<code>Panda 的 AI 笔记</code></span>
          </div>
        </div>
      </section>
    `;
  }

  async function renderArticlePost(slug) {
    const meta = window.SITE_DATA.articles.find((a) => a.slug === slug);
    app.innerHTML = `<div class="loading">加载中…</div>`;
    try {
      const md = await fetchMarkdown(`./content/articles/${slug}.md`);
      app.innerHTML = `
        <header class="post-header">
          <h1>${meta ? escapeHTML(meta.title) : escapeHTML(slug)}</h1>
          ${meta ? `<div class="post-meta">${escapeHTML(meta.date)} · ${escapeHTML(meta.summary || "")}</div>` : ""}
        </header>
        <article class="md">${renderMarkdown(md)}</article>
        <a class="back-link" href="#/articles">← 返回文章列表</a>
      `;
    } catch (e) {
      app.innerHTML = `<div class="empty">找不到文章：${escapeHTML(slug)}</div>`;
    }
  }

  async function renderProjectPost(slug) {
    app.innerHTML = `<div class="loading">加载中…</div>`;
    try {
      const md = await fetchMarkdown(`./content/projects/${slug}.md`);
      app.innerHTML = `
        <article class="md" style="padding-top:28px;">${renderMarkdown(md)}</article>
        <a class="back-link" href="#/projects">← 返回作品列表</a>
      `;
    } catch (e) {
      app.innerHTML = `<div class="empty">找不到项目：${escapeHTML(slug)}</div>`;
    }
  }

  function renderNotFound() {
    app.innerHTML = `
      <section class="section">
        <h2>页面不存在</h2>
        <p><a href="#/">回到首页</a></p>
      </section>
    `;
  }

  // ---------- Templates ----------
  function projectCard(p) {
    const external = p.href && p.href.startsWith("http");
    const attrs = external ? `target="_blank" rel="noopener"` : "";
    return `
      <a class="card" href="${escapeAttr(p.href)}" ${attrs}>
        <h3 class="card-title">${escapeHTML(p.title)}</h3>
        <p class="card-desc">${escapeHTML(p.desc)}</p>
        <div class="card-meta">
          <span>${escapeHTML(p.tag)}</span>
          <span>·</span>
          <span>${escapeHTML(p.status)}</span>
        </div>
      </a>
    `;
  }

  function articleRow(a) {
    return `
      <li>
        <a href="#/articles/${encodeURIComponent(a.slug)}">${escapeHTML(a.title)}</a>
        <span class="date">${escapeHTML(a.date)}</span>
      </li>
    `;
  }

  function socialItem(s) {
    const external = s.href && s.href.startsWith("http");
    const attrs = external ? `target="_blank" rel="noopener"` : "";
    return `
      <a class="social-item" href="${escapeAttr(s.href)}" ${attrs}>
        <div class="social-icon">${escapeHTML(s.icon)}</div>
        <div class="social-text">
          <span class="social-title">${escapeHTML(s.title)}</span>
          <span class="social-sub">${escapeHTML(s.sub)}</span>
        </div>
      </a>
    `;
  }

  // ---------- Helpers ----------
  function escapeHTML(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  }
  function escapeAttr(str) { return escapeHTML(str); }

  // ---------- Init ----------
  window.addEventListener("hashchange", route);
  if (!location.hash) location.hash = "#/";
  route();
})();
