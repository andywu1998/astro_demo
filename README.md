# Astro Demo

这是一个部署在 GitHub Pages 上的 Astro 静态站点，访问地址：

`https://andywu1998.github.io/astro_demo/`

这个仓库一开始只是一个 Astro 演示项目，随后演进成了一个同时承载公开页面和私有个人助理看板的静态站点。

## 仓库现在做什么

当前这个站点主要承担两件事：

1. 提供一个公开的 Astro 首页。
2. 提供一个 `/private/` 私有页面，用于加载加密数据并在浏览器中使用口令解密展示。

整个仓库仍然是纯静态部署，不包含后端服务。私有数据以加密 JSON 的形式公开存放，口令不会保存在这个仓库里。

## 项目怎么实现

### 公开站点

- 使用 Astro 负责路由、页面渲染和静态构建。
- 使用 `.github/workflows/deploy.yml` 配置 GitHub Pages 自动部署。
- 使用 `astro.config.mjs` 里的 `site` 和 `base` 配置，保证站点能正确部署在 `/astro_demo` 这个仓库路径下。

### 私有看板

- `src/pages/private.astro` 定义 `/private/` 页面的结构。
- `public/assets/js/private-assistant.js` 负责浏览器端的数据加载、解密、筛选、日历渲染以及日志和任务视图。
- `public/assets/css/private-assistant.css` 负责私有看板的样式。
- `public/assets/private/personal-assistant.encrypted.json` 存放运行时加载的加密数据。

### 私有数据同步

- `npm run sync:private` 会执行 `scripts/sync-private-data.sh`。
- 这个脚本会调用个人助理工作区中的共享发布脚本：
  `codex_personal_assistant/scripts/publish_private_blog_data.js`
- 共享发布脚本会统一刷新当前仓库和相关博客仓库使用的加密数据，因此加密和分发逻辑集中维护在上游，而不是在这个仓库里重复实现。

## 基于 commit 的项目演进

当前所有提交都发生在 `2026-08-10`。

### `85d3b48` Add Astro GitHub Pages demo

这是初始化提交，完成了 Astro 站点的基础搭建。

- 创建了 Astro 项目结构和依赖配置。
- 添加了 `BaseLayout`、首页和全局样式。
- 配置了面向 GitHub Pages 的静态构建参数。
- 添加了 GitHub Actions 自动构建和部署流程。

结果：仓库从空项目变成了一个可以自动发布到 GitHub Pages 的 Astro 站点。

### `deed08e` Trigger GitHub Pages deploy

这是一次只用于触发部署的提交。

- 没有代码改动。
- 主要目的是触发 GitHub Pages 工作流，确认初始化后的部署链路是否正常。

结果：验证了 CI/CD 发布流程可以正常工作。

### `3641104` Migrate private assistant dashboard to Astro

这是仓库功能扩展最关键的一次提交。

- 新增了 `/private/` 路由页面 `src/pages/private.astro`。
- 新增了私有看板专用的 CSS 和浏览器端 JavaScript。
- 新增了 `public/assets/private/` 下的加密数据文件。
- 新增了 `npm run sync:private` 和 `scripts/sync-private-data.sh`。
- 更新了 `BaseLayout`，让它在 GitHub Pages 的 `BASE_URL` 场景下也能正确加载资源。

这一版的实现方式是：

- Astro 页面把加密 JSON 的地址注入到 DOM。
- 浏览器端 JavaScript 拉取加密数据包。
- 使用 Web Crypto API 通过 `PBKDF2` 从口令派生密钥。
- 使用 `AES-GCM` 解密数据。
- 将解密后的数据渲染成日历、日志和任务三个视图。

结果：仓库不再只是一个演示首页，而是开始承载一个真正可用的私有个人助理看板。

### `51bd944` Use shared private data publisher

这是一次小范围但很重要的工程整理。

- 简化了 `scripts/sync-private-data.sh`。
- 去掉了仓库内自己复制数据文件的逻辑。
- 改为完全依赖上游共享发布脚本统一更新多个目标仓库的数据。

结果：私有数据的发布逻辑被集中到了共享脚本中，减少了重复实现和同步错误风险。

### `181fc67` 2026-08-10 sync

这是一次纯数据同步提交。

- 只更新了 `public/assets/private/personal-assistant.encrypted.json`。

结果：应用代码没有变化，但私有看板展示的数据内容被刷新了。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

本地构建只用于让 Agent 提前检查 Astro 的静态构建结果，尽早发现页面、类型或资源引用问题，不代表正式部署。正式部署仍由 GitHub Actions 在代码推送后执行。

## 刷新私有数据

如果需要从个人助理工作区重新同步加密数据：

```bash
npm run sync:private
```
