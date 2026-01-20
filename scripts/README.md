# 提交前检查脚本

这个脚本会在提交代码前执行所有 CI 中的检查，帮助您在本地发现问题，避免 CI 失败。

## 使用方法

### 方法一：使用 npm 脚本（推荐）
```bash
npm run pre-commit
```

### 方法二：直接运行脚本
```bash
node scripts/pre-commit-check.js
```

### 方法三：使用可执行文件
```bash
./scripts/pre-commit-check.js
```

## 检查内容

脚本按照 CI 的执行顺序进行以下检查：

1. **项目环境检查** - 确认在正确的项目目录
2. **Git 状态检查** - 检查工作目录状态
3. **依赖检查** - 确保依赖已安装
4. **格式检查** - 检查变更文件的代码格式（`npm run format:check:changed`）
5. **代码检查** - 运行 ESLint 检查（`npm run lint`）
6. **单元测试** - 运行所有测试（`npm test`）
7. **构建检查** - 验证项目能否正常构建（`npm run build`）

## 常见问题修复

- **格式问题**：运行 `npm run format` 自动格式化代码
- **测试失败**：运行 `npm test` 查看详细测试错误
- **构建失败**：运行 `npm run build` 查看构建日志

## 环境变量

脚本会自动设置以下环境变量以模拟 CI 环境：
- `PROJECTS_FETCH_TIMEOUT=30000` (30秒)
- `RSS_FETCH_TIMEOUT=20000` (20秒) 
- `RSS_TOTAL_TIMEOUT=180000` (3分钟)

## 工作流建议

建议在提交代码前总是运行这个脚本：

```bash
# 1. 修改代码
# 2. 运行检查
npm run pre-commit

# 3. 如果通过，提交代码
git add -A
git commit -m "your commit message"
git push
```

这样可以大大减少 CI 失败的概率，提高开发效率。