# Morten-Liu Personal Archive

Morten-Liu 的个人主页，以 Story、Favorites、Pictures 与 Thinking 四个入口组织个人经历、音乐、影视、书籍、照片和想法。

## 项目结构

- `app/content.ts`：集中管理可持续扩展的文字与作品内容。
- `app/page.tsx`：主页、四个入口以及所有交互状态。
- `app/globals.css`：深色森林主题、毛玻璃界面和响应式布局。
- `public/`：头像、封面、海报和照片等静态资源。

项目保留两种发布目标，共用同一套内容、视觉和交互代码：

- Vinext / Sites 构建：适合当前 GPT Sites 和 Cloudflare Worker 运行环境。
- 静态构建：生成不需要服务器的 HTML、JavaScript、CSS 与图片，可放在静态 CDN 或对象存储中。

## 本地开发

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

## 构建

验证 Sites / Worker 构建：

```bash
npm run build
```

生成静态网站：

```bash
npm run build:static
```

静态产物位于 `dist-static/`。其中只有可公开托管的文件，不包含 Worker 入口、Sites 配置或数据库迁移。

如需让分享卡片指向新的正式域名，可在构建时提供 `STATIC_SITE_URL`。默认继续使用当前 Sites 地址。

## 验证

```bash
npm test
```

测试会同时检查 Worker 首屏渲染与静态产物完整性，包括首页核心内容、四个入口、脚本样式和本地图片引用。
