#!/usr/bin/env node

/**
 * ================================================================
 * 整合測試腳本 - Day 27
 * Integration Tests - Complete Database & Module Combinations
 * ================================================================
 *
 * 測試目標:
 * 1. PostgreSQL - 最小配置 (無模組)
 * 2. PostgreSQL - 標準配置 (核心模組)
 * 3. MySQL - 標準配置 (核心模組)
 * 4. MongoDB - 標準配置 (核心模組)
 * 5. SQLite - 最小配置 (無模組)
 *
 * 驗證內容:
 * - 項目結構正確
 * - Prisma Schema 正確
 * - 環境變數完整
 * - 配置文件有效
 * - 模組複製成功
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// =====================================================
// 測試配置
// =====================================================

const TEST_SCENARIOS = [
  {
    id: 'pg-minimal',
    name: 'PostgreSQL 最小配置',
    database: {
      type: 'postgresql',
      url: 'postgresql://test:test@localhost:5432/test_minimal',
    },
    modules: [],
    priority: 'P0',
  },
  {
    id: 'pg-standard',
    name: 'PostgreSQL 標準配置',
    database: {
      type: 'postgresql',
      url: 'postgresql://test:test@localhost:5432/test_standard',
    },
    modules: ['module-auth', 'module-api-gateway'],
    priority: 'P0',
  },
  {
    id: 'mysql-standard',
    name: 'MySQL 標準配置',
    database: {
      type: 'mysql',
      url: 'mysql://test:test@localhost:3306/test_mysql',
    },
    modules: ['module-auth', 'module-api-gateway'],
    priority: 'P1',
  },
  {
    id: 'mongodb-standard',
    name: 'MongoDB 標準配置',
    database: {
      type: 'mongodb',
      url: 'mongodb://test:test@localhost:27017/test_mongodb',
    },
    modules: ['module-auth', 'module-api-gateway'],
    priority: 'P1',
  },
  {
    id: 'sqlite-minimal',
    name: 'SQLite 最小配置',
    database: {
      type: 'sqlite',
      url: 'file:./test.db',
    },
    modules: [],
    priority: 'P0',
  },
];

// =====================================================
// 測試狀態
// =====================================================

const testResults = {
  passed: [],
  failed: [],
  skipped: [],
  warnings: [],
};

const startTime = Date.now();

// =====================================================
// 工具函數
// =====================================================

function log(level, message, details = null) {
  const timestamp = new Date().toISOString();
  const colors = {
    INFO: '\x1b[36m',    // Cyan
    SUCCESS: '\x1b[32m', // Green
    ERROR: '\x1b[31m',   // Red
    WARN: '\x1b[33m',    // Yellow
    RESET: '\x1b[0m',
  };

  const color = colors[level] || colors.RESET;
  console.log(`${color}[${level}] ${message}${colors.RESET}`);

  if (details) {
    console.log(`  ${JSON.stringify(details, null, 2)}`);
  }
}

function createTestProject(scenario) {
  const projectPath = path.join(process.cwd(), 'test-projects', scenario.id);

  // 確保測試項目目錄存在
  if (!fs.existsSync('test-projects')) {
    fs.mkdirSync('test-projects');
  }

  // 如果項目已存在，刪除它
  if (fs.existsSync(projectPath)) {
    log('INFO', `清理現有測試項目: ${scenario.id}`);
    try {
      execSync(`rm -rf "${projectPath}"`, { stdio: 'ignore' });
    } catch (error) {
      // Windows 使用 rmdir
      try {
        execSync(`rmdir /s /q "${projectPath}"`, { stdio: 'ignore' });
      } catch (winError) {
        throw new Error(`無法刪除現有項目: ${projectPath}`);
      }
    }
  }

  // 創建項目目錄
  fs.mkdirSync(projectPath, { recursive: true });

  return projectPath;
}

// =====================================================
// 測試步驟
// =====================================================

async function testScenario(scenario) {
  log('INFO', `\n${'='.repeat(60)}`);
  log('INFO', `測試場景: ${scenario.name} (${scenario.id})`);
  log('INFO', `優先級: ${scenario.priority}`);
  log('INFO', `數據庫: ${scenario.database.type}`);
  log('INFO', `模組數量: ${scenario.modules.length}`);
  log('INFO', '='.repeat(60));

  const errors = [];
  const warnings = [];

  try {
    // 步驟 1: 創建測試項目
    log('INFO', '步驟 1/8: 創建測試項目目錄');
    const projectPath = createTestProject(scenario);

    // 步驟 2: 複製基礎結構
    log('INFO', '步驟 2/8: 複製基礎結構');
    await copyBaseStructure(projectPath, scenario, errors);

    // 步驟 3: 配置數據庫
    log('INFO', '步驟 3/8: 配置數據庫');
    await configureDatabaseSchema(projectPath, scenario, errors);

    // 步驟 4: 生成環境變數
    log('INFO', '步驟 4/8: 生成環境變數');
    await generateEnvironmentFile(projectPath, scenario, errors);

    // 步驟 5: 複製模組
    log('INFO', '步驟 5/8: 複製模組');
    await copyModules(projectPath, scenario, errors, warnings);

    // 步驟 6: 生成配置文件
    log('INFO', '步驟 6/8: 生成配置文件');
    await generateConfigFiles(projectPath, scenario, errors);

    // 步驟 7: 生成 package.json
    log('INFO', '步驟 7/8: 生成 package.json');
    await generatePackageJson(projectPath, scenario, errors);

    // 步驟 8: 驗證項目結構
    log('INFO', '步驟 8/8: 驗證項目結構');
    await verifyProjectStructure(projectPath, scenario, errors, warnings);

    // 檢查結果
    if (errors.length === 0) {
      log('SUCCESS', `✅ ${scenario.name} - 通過`);
      testResults.passed.push({
        scenario: scenario.name,
        id: scenario.id,
        warnings: warnings.length,
      });
    } else {
      log('ERROR', `❌ ${scenario.name} - 失敗`);
      testResults.failed.push({
        scenario: scenario.name,
        id: scenario.id,
        errors: errors,
        warnings: warnings,
      });
    }

    if (warnings.length > 0) {
      log('WARN', `⚠️  ${warnings.length} 個警告`);
      testResults.warnings.push(...warnings.map(w => ({ scenario: scenario.name, warning: w })));
    }

  } catch (error) {
    log('ERROR', `❌ ${scenario.name} - 異常錯誤`);
    log('ERROR', error.message);
    testResults.failed.push({
      scenario: scenario.name,
      id: scenario.id,
      errors: [error.message],
      warnings: warnings,
    });
  }
}

// =====================================================
// 實現步驟函數
// =====================================================

async function copyBaseStructure(projectPath, scenario, errors) {
  try {
    // 創建基本目錄
    const dirs = ['app', 'components', 'lib', 'prisma', 'public'];
    for (const dir of dirs) {
      const dirPath = path.join(projectPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // 複製基礎 UI 組件（如果存在）
    const uiComponentsSource = path.join(process.cwd(), '01-base', 'components', 'ui');
    const uiComponentsDest = path.join(projectPath, 'components', 'ui');

    if (fs.existsSync(uiComponentsSource)) {
      copyDirectory(uiComponentsSource, uiComponentsDest);
    }

    // 複製基礎 lib 文件
    const libSource = path.join(process.cwd(), '01-base', 'lib');
    const libDest = path.join(projectPath, 'lib');

    if (fs.existsSync(libSource)) {
      copyDirectory(libSource, libDest);
    }

  } catch (error) {
    errors.push(`基礎結構複製失敗: ${error.message}`);
  }
}

async function configureDatabaseSchema(projectPath, scenario, errors) {
  try {
    const schemaSource = path.join(
      process.cwd(),
      '01-base',
      'prisma',
      `schema.${scenario.database.type}.prisma`
    );
    const schemaDest = path.join(projectPath, 'prisma', 'schema.prisma');

    if (!fs.existsSync(schemaSource)) {
      errors.push(`Schema 文件不存在: schema.${scenario.database.type}.prisma`);
      return;
    }

    fs.copyFileSync(schemaSource, schemaDest);

    // 驗證 Schema 內容
    const schemaContent = fs.readFileSync(schemaDest, 'utf-8');
    const expectedProvider = getProviderName(scenario.database.type);

    if (!schemaContent.includes(`provider = "${expectedProvider}"`)) {
      errors.push(`Schema provider 不正確: 期望 ${expectedProvider}`);
    }

  } catch (error) {
    errors.push(`數據庫 Schema 配置失敗: ${error.message}`);
  }
}

async function generateEnvironmentFile(projectPath, scenario, errors) {
  try {
    const envVars = {
      DATABASE_URL: scenario.database.url,
      DATABASE_TYPE: scenario.database.type,
      NODE_ENV: 'test',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    };

    // 如果包含 auth 模組，添加認證環境變數
    if (scenario.modules.includes('module-auth')) {
      envVars.JWT_SECRET = 'test-jwt-secret-32-bytes-long-key';
      envVars.JWT_ACCESS_TOKEN_EXPIRES_IN = '15m';
      envVars.JWT_REFRESH_TOKEN_EXPIRES_IN = '30d';
      envVars.NEXTAUTH_SECRET = 'test-nextauth-secret-32-bytes-key';
      envVars.NEXTAUTH_URL = 'http://localhost:3000';
    }

    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(path.join(projectPath, '.env.local'), envContent);

    // 驗證環境變數文件
    const writtenContent = fs.readFileSync(path.join(projectPath, '.env.local'), 'utf-8');
    if (!writtenContent.includes('DATABASE_URL=')) {
      errors.push('環境變數文件缺少 DATABASE_URL');
    }

  } catch (error) {
    errors.push(`環境變數文件生成失敗: ${error.message}`);
  }
}

async function copyModules(projectPath, scenario, errors, warnings) {
  try {
    for (const moduleName of scenario.modules) {
      const moduleSource = path.join(process.cwd(), '02-modules', moduleName);
      const moduleDest = path.join(projectPath, moduleName);

      if (!fs.existsSync(moduleSource)) {
        errors.push(`模組不存在: ${moduleName}`);
        continue;
      }

      copyDirectory(moduleSource, moduleDest);

      // 驗證模組複製
      if (!fs.existsSync(moduleDest)) {
        errors.push(`模組複製失敗: ${moduleName}`);
      } else {
        // 檢查 README 存在
        const readmePath = path.join(moduleDest, 'README.md');
        if (!fs.existsSync(readmePath)) {
          warnings.push(`模組缺少 README: ${moduleName}`);
        }
      }
    }

  } catch (error) {
    errors.push(`模組複製失敗: ${error.message}`);
  }
}

async function generateConfigFiles(projectPath, scenario, errors) {
  try {
    const configFiles = [
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js',
    ];

    for (const file of configFiles) {
      const templatePath = path.join(process.cwd(), '01-base', `${file}.template`);
      const destPath = path.join(projectPath, file);

      if (fs.existsSync(templatePath)) {
        let content = fs.readFileSync(templatePath, 'utf-8');

        // 替換佔位符
        content = content.replace(/\{\{PROJECT_NAME\}\}/g, scenario.id);
        content = content.replace(/\{\{DATABASE_TYPE\}\}/g, scenario.database.type);

        fs.writeFileSync(destPath, content);
      }
    }

  } catch (error) {
    errors.push(`配置文件生成失敗: ${error.message}`);
  }
}

async function generatePackageJson(projectPath, scenario, errors) {
  try {
    const templatePath = path.join(process.cwd(), '01-base', 'package.json.template');

    if (!fs.existsSync(templatePath)) {
      errors.push('package.json.template 不存在');
      return;
    }

    let packageJson = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

    packageJson.name = scenario.id;
    packageJson.description = `Test project: ${scenario.name}`;

    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

  } catch (error) {
    errors.push(`package.json 生成失敗: ${error.message}`);
  }
}

async function verifyProjectStructure(projectPath, scenario, errors, warnings) {
  try {
    // 驗證必需的目錄
    const requiredDirs = ['app', 'components', 'lib', 'prisma'];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(path.join(projectPath, dir))) {
        errors.push(`必需的目錄不存在: ${dir}`);
      }
    }

    // 驗證必需的文件
    const requiredFiles = [
      'package.json',
      '.env.local',
      'prisma/schema.prisma',
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(projectPath, file))) {
        errors.push(`必需的文件不存在: ${file}`);
      }
    }

    // 驗證模組目錄
    for (const moduleName of scenario.modules) {
      if (!fs.existsSync(path.join(projectPath, moduleName))) {
        errors.push(`模組目錄不存在: ${moduleName}`);
      }
    }

    // 檢查文件數量
    const files = getAllFiles(projectPath);
    const fileCount = files.length;

    if (fileCount === 0) {
      errors.push('項目沒有任何文件');
    } else if (fileCount < 5) {
      warnings.push(`項目文件數量較少: ${fileCount} 個文件`);
    }

    log('INFO', `  項目包含 ${fileCount} 個文件`);

  } catch (error) {
    errors.push(`項目結構驗證失敗: ${error.message}`);
  }
}

// =====================================================
// 輔助函數
// =====================================================

function copyDirectory(source, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function getProviderName(dbType) {
  switch (dbType) {
    case 'postgresql':
      return 'postgresql';
    case 'mysql':
      return 'mysql';
    case 'mongodb':
      return 'mongodb';
    case 'sqlite':
      return 'sqlite';
    default:
      return 'sqlite';
  }
}

// =====================================================
// 測試報告
// =====================================================

function generateTestReport() {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(70));
  console.log('整合測試報告 - Day 27');
  console.log('='.repeat(70) + '\n');

  // 測試摘要
  console.log('📊 測試摘要:');
  console.log(`  總測試數: ${TEST_SCENARIOS.length}`);
  console.log(`  ✅ 通過: ${testResults.passed.length}`);
  console.log(`  ❌ 失敗: ${testResults.failed.length}`);
  console.log(`  ⚠️  警告: ${testResults.warnings.length}`);
  console.log(`  ⏱️  耗時: ${duration} 秒\n`);

  // 通過的測試
  if (testResults.passed.length > 0) {
    console.log('✅ 通過的測試:');
    testResults.passed.forEach(result => {
      console.log(`  ✓ ${result.scenario} (${result.id})`);
      if (result.warnings > 0) {
        console.log(`    ⚠️  ${result.warnings} 個警告`);
      }
    });
    console.log('');
  }

  // 失敗的測試
  if (testResults.failed.length > 0) {
    console.log('❌ 失敗的測試:');
    testResults.failed.forEach(result => {
      console.log(`  ✗ ${result.scenario} (${result.id})`);
      result.errors.forEach(error => {
        console.log(`    - ${error}`);
      });
      if (result.warnings.length > 0) {
        console.log(`    ⚠️  ${result.warnings.length} 個警告`);
      }
    });
    console.log('');
  }

  // 警告詳情
  if (testResults.warnings.length > 0) {
    console.log('⚠️  警告詳情:');
    testResults.warnings.forEach(w => {
      console.log(`  • [${w.scenario}] ${w.warning}`);
    });
    console.log('');
  }

  // 通過率
  const passRate = ((testResults.passed.length / TEST_SCENARIOS.length) * 100).toFixed(1);
  console.log('='.repeat(70));
  console.log(`通過率: ${passRate}% (${testResults.passed.length}/${TEST_SCENARIOS.length})`);
  console.log('='.repeat(70) + '\n');

  // 生成報告文件
  saveTestReport(duration, passRate);

  return testResults.failed.length === 0;
}

function saveTestReport(duration, passRate) {
  const reportPath = path.join(process.cwd(), 'Docs', 'DAY27-INTEGRATION-TEST-REPORT.md');

  const report = `# Day 27 整合測試報告
# Integration Test Report

**測試日期**: ${new Date().toISOString().split('T')[0]}
**測試耗時**: ${duration} 秒
**通過率**: ${passRate}%

---

## 📊 測試摘要

| 指標 | 數量 |
|------|------|
| 總測試數 | ${TEST_SCENARIOS.length} |
| ✅ 通過 | ${testResults.passed.length} |
| ❌ 失敗 | ${testResults.failed.length} |
| ⚠️  警告 | ${testResults.warnings.length} |

---

## ✅ 通過的測試場景

${testResults.passed.map(r => `### ${r.scenario} (${r.id})
- **狀態**: ✅ 通過
${r.warnings > 0 ? `- **警告**: ${r.warnings} 個警告\n` : ''}
`).join('\n')}

---

## ❌ 失敗的測試場景

${testResults.failed.length > 0 ? testResults.failed.map(r => `### ${r.scenario} (${r.id})
- **狀態**: ❌ 失敗
- **錯誤數量**: ${r.errors.length}

**錯誤詳情**:
${r.errors.map(e => `- ${e}`).join('\n')}

${r.warnings.length > 0 ? `**警告**:\n${r.warnings.map(w => `- ${w}`).join('\n')}\n` : ''}
`).join('\n') : '無失敗測試'}

---

## ⚠️  警告詳情

${testResults.warnings.length > 0 ? testResults.warnings.map(w => `- **[${w.scenario}]** ${w.warning}`).join('\n') : '無警告'}

---

## 📋 測試場景配置

${TEST_SCENARIOS.map((s, i) => `### ${i + 1}. ${s.name}
- **ID**: ${s.id}
- **優先級**: ${s.priority}
- **數據庫**: ${s.database.type}
- **連接**: ${s.database.url}
- **模組數量**: ${s.modules.length}
- **模組列表**: ${s.modules.length > 0 ? s.modules.join(', ') : '無'}
`).join('\n')}

---

**生成時間**: ${new Date().toISOString()}
**測試腳本**: scripts/integration-tests.js
`;

  try {
    fs.writeFileSync(reportPath, report);
    log('SUCCESS', `測試報告已保存: ${reportPath}`);
  } catch (error) {
    log('ERROR', `測試報告保存失敗: ${error.message}`);
  }
}

// =====================================================
// 主函數
// =====================================================

async function main() {
  console.log('\n🧪 Day 27 整合測試\n');
  console.log(`測試場景數量: ${TEST_SCENARIOS.length}\n`);

  // 執行所有測試場景
  for (const scenario of TEST_SCENARIOS) {
    await testScenario(scenario);
  }

  // 生成測試報告
  const allPassed = generateTestReport();

  // 退出碼
  process.exit(allPassed ? 0 : 1);
}

// 執行主函數
main().catch(error => {
  log('ERROR', '測試執行失敗');
  log('ERROR', error.message);
  console.error(error.stack);
  process.exit(1);
});
