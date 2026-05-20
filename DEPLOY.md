# Cloudflare Pages 部署指南

## 🚀 快速部署到 Cloudflare Pages

### 方式一：通过 Cloudflare Dashboard (推荐)

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 登录你的 Cloudflare 账户

2. **创建 Pages 项目**
   - 点击左侧菜单 "Pages"
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接 Git 仓库**
   - 选择 GitHub / GitLab / Bitbucket
   - 授权 Cloudflare 访问你的仓库
   - 选择 `material-library` 仓库

4. **配置构建设置**
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (或 `material-library` 如果仓库根目录不是项目根目录)

5. **环境变量** (可选)
   - 如果需要，添加环境变量
   - 点击 "Save and Deploy"

6. **等待部署完成**
   - Cloudflare 会自动构建并部署
   - 完成后会获得一个 `xxx.pages.dev` 的域名

---

### 方式二：通过 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   cd material-library
   npm install
   npm run build
   ```

4. **部署到 Pages**
   ```bash
   wrangler pages deploy dist
   ```

5. **获取部署URL**
   - 部署成功后会显示访问链接

---

### 方式三：Git 集成自动部署

1. **推送代码到 Git 仓库**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **在 Cloudflare Dashboard 配置**
   - 按照方式一的步骤 1-4 配置
   - 启用 "Automatic deployments on push"

3. **自动部署**
   - 每次推送到 main 分支会自动触发部署
   - 预览环境会在 Pull Request 时自动创建

---

## ⚙️ 构建设置详情

| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | `18` (推荐) |

## 🔧 环境变量

如果需要设置环境变量，在 Cloudflare Dashboard 的 Pages 项目设置中添加：

| 变量名 | 说明 |
|--------|------|
| `NODE_VERSION` | `18` |
| `NPM_VERSION` | `9` |

## 🌐 自定义域名

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. 点击 "Custom domains" 标签
3. 点击 "Set up a custom domain"
4. 输入你的域名并按照指引完成 DNS 配置

## 📋 部署前检查清单

- [ ] 项目可以本地成功构建 (`npm run build`)
- [ ] `dist` 目录生成正确
- [ ] 所有资源路径使用相对路径
- [ ] 环境变量已配置（如有需要）

## 🐛 常见问题

### 1. 构建失败
检查 Node 版本是否为 18+：
```bash
node --version
```

### 2. 404 错误
确保 `vite.config.ts` 中设置了正确的 `base`：
```typescript
base: '/',
```

### 3. 资源加载失败
检查所有资源路径是否为相对路径，避免硬编码的绝对路径。

---

## 📚 相关文档

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)
