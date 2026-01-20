#!/bin/bash

# 提交前检查示例脚本
# 这是一个展示如何在提交前自动运行检查的示例

echo "🚀 准备提交代码..."

# 运行提交前检查
echo "📋 运行提交前检查..."
npm run pre-commit

# 检查上一条命令的退出状态
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 所有检查通过！"
    echo ""
    echo "现在可以安全提交代码："
    echo "  git add -A"
    echo "  git commit -m '你的提交信息'"
    echo "  git push"
    echo ""
    echo "或者运行: git add -A && git commit -m '你的提交信息' && git push"
else
    echo ""
    echo "❌ 检查失败，请修复问题后再提交"
    echo ""
    echo "常见修复方法："
    echo "  🔧 格式问题: npm run format"
    echo "  🐛 测试失败: npm test"
    echo "  🏗️  构建失败: npm run build"
    exit 1
fi