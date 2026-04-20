# Personal Homepage

一个纯静态的个人主页 —— 无需后端，markdown 直接在浏览器里渲染成 HTML。

## 技术栈

- 原生 HTML / CSS / JS
- [marked](https://github.com/markedjs/marked) 做 markdown 解析
- [DOMPurify](https://github.com/cure53/DOMPurify) 做 XSS 防护
- Hash-based 路由（不需要服务器重写规则）

## 目录结构

```
homepage/
├── index.html          # 页面入口
├── styles.css          # 样式（支持深色模式）
├── data.js             # 站点数据（个人资料 / 项目 / 文章列表）
├── script.js           # 路由 + 渲染逻辑
├── assets/             # 图片，如公众号二维码
│   └── wechat-qr.png   # （请自行放置）
└── content/
    ├── about.md
    ├── articles/       # 每个 slug 对应一个 md 文件
    │   ├── why-indie-ai.md
    │   ├── xlearnity-roadmap.md
    │   └── building-in-public.md
    └── projects/
        └── pandatalk.md
```

## 本地预览

因为页面会通过 `fetch` 加载 markdown 文件，所以不能直接用 `file://` 打开，需要一个最简单的本地静态服务器：

```bash
cd homepage

# 任选其一：
python3 -m http.server 5173
# 或
npx serve .
```

然后访问 <http://localhost:5173> 即可。

## 如何编辑

### 1. 改个人资料 / 项目 / 文章列表

编辑 `data.js`。里面的结构一目了然：

```js
window.SITE_DATA = {
  profile: { name, title, intro, tags },
  socials: [...],
  projects: [...],
  articles: [...],
};
```

### 2. 写一篇新文章

1. 在 `data.js` 的 `articles` 数组里新增一项：
   ```js
   { slug: "my-new-post", title: "...", date: "2026-05-01", summary: "..." }
   ```
2. 在 `content/articles/` 下新建 `my-new-post.md`，随便写。
3. 保存，刷新页面即可。

### 3. 放公众号二维码

把你的公众号二维码图片命名为 `wechat-qr.png`，放到 `homepage/assets/` 下。找不到时页面会显示占位提示。

## 路由

- `#/` 首页
- `#/projects` 作品列表
- `#/projects/:slug` 作品详情（md 渲染）
- `#/articles` 文章列表
- `#/articles/:slug` 文章详情（md 渲染）
- `#/about` 关于我
- `#/wechat` 公众号二维码

## 部署

直接把 `homepage/` 目录扔到任意静态托管平台即可：

- GitHub Pages
- Cloudflare Pages
- Vercel（静态项目）
- Netlify
- 自己的 Nginx / OSS

不需要构建，开箱即用。
