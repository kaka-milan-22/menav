#!/usr/bin/env node

const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(color, prefix, message) {
  console.log(`${colors[color]}${prefix}${colors.reset} ${message}`);
}

function logSuccess(message) {
  log('green', '✅', message);
}

function logError(message) {
  log('red', '❌', message);
}

function logWarning(message) {
  log('yellow', '⚠️ ', message);
}

function logInfo(message) {
  log('blue', 'ℹ️ ', message);
}

function logStep(step, total, message) {
  log('cyan', `[${step}/${total}]`, message);
}

function runCommand(command, description, allowFailure = false) {
  try {
    logInfo(`运行: ${command}`);
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    logSuccess(`${description} - 通过`);
    return true;
  } catch (error) {
    if (allowFailure) {
      logWarning(`${description} - 失败（已忽略）`);
      return false;
    } else {
      logError(`${description} - 失败`);
      return false;
    }
  }
}

function checkGitStatus() {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf8' });
    if (output.trim()) {
      logWarning('工作目录有未提交的更改:');
      console.log(output);
      return false;
    }
    return true;
  } catch (error) {
    logError('无法检查 Git 状态');
    return false;
  }
}

function main() {
  console.log(`${colors.magenta}
╔══════════════════════════════════════════════════════════════╗
║                    🚀 提交前检查脚本                         ║
║              Pre-commit Check Script for menav              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const startTime = Date.now();
  let totalSteps = 7;
  let currentStep = 0;
  let allPassed = true;

  try {
    // 步骤 0: 检查是否在项目根目录
    currentStep++;
    logStep(currentStep, totalSteps, '检查项目根目录');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logError('请在项目根目录运行此脚本');
      process.exit(1);
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.name !== 'menav') {
      logError('请在 menav 项目根目录运行此脚本');
      process.exit(1);
    }
    logSuccess('项目根目录检查通过');

    // 步骤 1: 检查 Git 状态
    currentStep++;
    logStep(currentStep, totalSteps, '检查 Git 状态');
    if (!checkGitStatus()) {
      logWarning('建议先提交或暂存所有更改');
      logInfo('继续检查当前代码...');
    } else {
      logSuccess('Git 工作目录干净');
    }

    // 步骤 2: 安装依赖（如果需要）
    currentStep++;
    logStep(currentStep, totalSteps, '检查依赖');
    if (!fs.existsSync('node_modules')) {
      logInfo('node_modules 不存在，正在安装依赖...');
      if (!runCommand('npm ci', '安装依赖')) {
        allPassed = false;
        throw new Error('依赖安装失败');
      }
    } else {
      logSuccess('依赖已安装');
    }

    // 步骤 3: 格式检查（变更文件）
    currentStep++;
    logStep(currentStep, totalSteps, '格式检查（变更文件）');
    if (!runCommand('npm run format:check:changed', '格式检查（变更文件）')) {
      allPassed = false;
      logError('格式检查失败！运行 `npm run format` 来自动格式化代码');
    }

    // 步骤 4: Lint 检查
    currentStep++;
    logStep(currentStep, totalSteps, 'Lint 检查');
    if (!runCommand('npm run lint', 'Lint 检查')) {
      allPassed = false;
    }

    // 步骤 5: 单元测试
    currentStep++;
    logStep(currentStep, totalSteps, '单元测试');
    if (!runCommand('npm test', '单元测试')) {
      allPassed = false;
    }

    // 步骤 6: 构建检查
    currentStep++;
    logStep(currentStep, totalSteps, '构建检查');
    // 设置环境变量，模拟 CI 环境
    process.env.PROJECTS_FETCH_TIMEOUT = '30000';
    process.env.RSS_FETCH_TIMEOUT = '20000';
    process.env.RSS_TOTAL_TIMEOUT = '180000';
    
    if (!runCommand('npm run build', '构建检查')) {
      allPassed = false;
    }

    // 总结
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    console.log(`\n${colors.magenta}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
    
    if (allPassed) {
      console.log(`${colors.magenta}║${colors.green}                    🎉 所有检查通过！                       ${colors.magenta}║${colors.reset}`);
      console.log(`${colors.magenta}║${colors.green}               ✨ 可以安全提交代码了 ✨                   ${colors.magenta}║${colors.reset}`);
      console.log(`${colors.magenta}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
      logSuccess(`检查完成，耗时 ${duration} 秒`);
      
      // 提供快捷提交选项
      console.log('\n💡 提示：现在可以提交代码了！');
      console.log('   git add -A && git commit -m "your commit message"');
      
      process.exit(0);
    } else {
      console.log(`${colors.magenta}║${colors.red}                    ❌ 检查失败！                           ${colors.magenta}║${colors.reset}`);
      console.log(`${colors.magenta}║${colors.red}              请修复上述问题后再提交                      ${colors.magenta}║${colors.reset}`);
      console.log(`${colors.magenta}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
      logError(`检查失败，耗时 ${duration} 秒`);
      
      console.log('\n💡 常见修复方法：');
      console.log('   🔧 格式问题: npm run format');
      console.log('   🐛 测试失败: npm test (查看详细错误)');
      console.log('   🏗️  构建失败: npm run build (查看构建日志)');
      
      process.exit(1);
    }

  } catch (error) {
    logError(`预期外错误: ${error.message}`);
    process.exit(1);
  }
}

// 处理中断信号
process.on('SIGINT', () => {
  console.log('\n\n⚠️  检查被用户中断');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  检查被终止');
  process.exit(143);
});

// 运行主函数
main();