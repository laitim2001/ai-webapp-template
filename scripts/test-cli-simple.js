#!/usr/bin/env node

/**
 * CLI 工具簡化測試腳本
 * Simple Testing Script for CLI Tool (no dependencies)
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 CLI 工具測試\n');

// 測試場景
const tests = {
  passed: 0,
  failed: 0,
  total: 0,
};

function log(status, message) {
  const symbols = {
    PASS: '✓',
    FAIL: '✗',
    INFO: 'ℹ',
  };
  console.log(`${symbols[status] || ' '} ${message}`);
}

function test(name, fn) {
  tests.total++;
  try {
    fn();
    tests.passed++;
    log('PASS', name);
    return true;
  } catch (error) {
    tests.failed++;
    log('FAIL', `${name}: ${error.message}`);
    return false;
  }
}

// ===== 測試開始 =====

console.log('檢查核心文件結構...\n');

// 測試 1: 檢查 init-project.js 存在
test('init-project.js 存在', () => {
  if (!fs.existsSync('init-project.js')) {
    throw new Error('文件不存在');
  }
});

// 測試 2: 檢查增強版存在
test('init-project-enhanced.js 存在', () => {
  if (!fs.existsSync('init-project-enhanced.js')) {
    throw new Error('文件不存在');
  }
});

// 測試 3: 檢查測試腳本存在
test('test-cli-workflow.js 存在', () => {
  if (!fs.existsSync('scripts/test-cli-workflow.js')) {
    throw new Error('文件不存在');
  }
});

console.log('\n檢查數據庫 Schema 模板...\n');

// 測試 4-7: 檢查所有數據庫 Schema
const databases = ['postgresql', 'mysql', 'mongodb', 'sqlite'];
databases.forEach(db => {
  test(`Schema 模板存在: ${db}`, () => {
    const schemaPath = path.join('01-base', 'prisma', `schema.${db}.prisma`);
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`文件不存在: ${schemaPath}`);
    }
  });
});

console.log('\n檢查模組目錄...\n');

// 測試 8: 檢查模組目錄存在
test('02-modules 目錄存在', () => {
  if (!fs.existsSync('02-modules')) {
    throw new Error('目錄不存在');
  }
  if (!fs.statSync('02-modules').isDirectory()) {
    throw new Error('不是目錄');
  }
});

// 測試 9: 檢查至少有一個模組
test('至少有一個模組存在', () => {
  const modules = fs.readdirSync('02-modules');
  const moduleDirs = modules.filter(m => {
    const modulePath = path.join('02-modules', m);
    return fs.statSync(modulePath).isDirectory() && m.startsWith('module-');
  });

  if (moduleDirs.length === 0) {
    throw new Error('沒有找到任何模組');
  }

  log('INFO', `找到 ${moduleDirs.length} 個模組`);
});

console.log('\n檢查配置模板文件...\n');

// 測試 10-13: 檢查配置模板
const configTemplates = [
  '01-base/package.json.template',
  '01-base/tsconfig.json.template',
  '01-base/next.config.js.template',
  '01-base/tailwind.config.js.template',
];

configTemplates.forEach(template => {
  test(`配置模板存在: ${path.basename(template)}`, () => {
    if (!fs.existsSync(template)) {
      throw new Error(`文件不存在: ${template}`);
    }
  });
});

console.log('\n檢查 CLI 核心功能...\n');

// 測試 14: 讀取 init-project.js 內容
test('init-project.js 包含數據庫選項', () => {
  const content = fs.readFileSync('init-project.js', 'utf-8');
  if (!content.includes('DATABASE_OPTIONS')) {
    throw new Error('缺少 DATABASE_OPTIONS');
  }
  if (!content.includes('postgresql')) {
    throw new Error('缺少 PostgreSQL 配置');
  }
});

// 測試 15: 檢查模組選項
test('init-project.js 包含模組選項', () => {
  const content = fs.readFileSync('init-project.js', 'utf-8');
  if (!content.includes('MODULE_OPTIONS')) {
    throw new Error('缺少 MODULE_OPTIONS');
  }
});

// 測試 16: 檢查環境變數生成
test('init-project.js 包含環境變數生成', () => {
  const content = fs.readFileSync('init-project.js', 'utf-8');
  if (!content.includes('getEnvironmentConfig') || !content.includes('generateEnvFile')) {
    throw new Error('缺少環境變數生成功能');
  }
});

// 測試 17: 檢查增強版特性
test('init-project-enhanced.js 包含錯誤處理', () => {
  const content = fs.readFileSync('init-project-enhanced.js', 'utf-8');
  if (!content.includes('InitializationError')) {
    throw new Error('缺少 InitializationError 類');
  }
});

// 測試 18: 檢查回滾機制
test('init-project-enhanced.js 包含回滾機制', () => {
  const content = fs.readFileSync('init-project-enhanced.js', 'utf-8');
  if (!content.includes('rollbackChanges')) {
    throw new Error('缺少 rollbackChanges 函數');
  }
});

// 測試 19: 檢查日誌系統
test('init-project-enhanced.js 包含日誌系統', () => {
  const content = fs.readFileSync('init-project-enhanced.js', 'utf-8');
  if (!content.includes('initializeLogging') || !content.includes('log(')) {
    throw new Error('缺少日誌系統');
  }
});

// 測試 20: 檢查進度指示器
test('init-project-enhanced.js 包含進度指示器', () => {
  const content = fs.readFileSync('init-project-enhanced.js', 'utf-8');
  if (!content.includes('progress')) {
    throw new Error('缺少進度指示器');
  }
});

console.log('\n檢查文檔...\n');

// 測試 21: 檢查分析文檔
test('DAY26-CLI-ANALYSIS.md 存在', () => {
  if (!fs.existsSync('Docs/DAY26-CLI-ANALYSIS.md')) {
    throw new Error('分析文檔不存在');
  }
});

// ===== 測試摘要 =====

console.log('\n' + '='.repeat(60));
console.log('測試摘要');
console.log('='.repeat(60) + '\n');

console.log(`通過: ${tests.passed}/${tests.total}`);
console.log(`失敗: ${tests.failed}/${tests.total}`);

const passRate = ((tests.passed / tests.total) * 100).toFixed(1);
console.log(`通過率: ${passRate}%\n`);

if (tests.failed === 0) {
  console.log('✅ 所有測試通過！CLI 工具已準備就緒。\n');
  process.exit(0);
} else {
  console.log('⚠️  部分測試失敗，請檢查錯誤信息。\n');
  process.exit(1);
}
