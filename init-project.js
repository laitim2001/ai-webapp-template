#!/usr/bin/env node

/**
 * ================================================================
 * AI Web App 模板初始化工具
 * AI Web App Template Initialization Tool
 * ================================================================
 * 
 * 【功能】
 * 互動式 CLI 工具，引導用戶完成項目初始化配置。
 * 
 * 【使用方式】
 * node init-project.js
 * 或
 * npm run init
 * 
 * 【流程】
 * 1. 基本信息 → 2. 數據庫選擇 → 3. 模組選擇 → 4. 監控配置
 * 5. 環境變數 → 6. 示例數據 → 7. 安裝依賴 → 8. 數據庫初始化
 */

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const crypto = require('crypto');

// =====================================================
// 常量定義
// =====================================================

const DATABASE_OPTIONS = [
  {
    name: 'PostgreSQL (推薦 - 功能最完整，支援向量搜索)',
    value: 'postgresql',
    short: 'PostgreSQL',
  },
  {
    name: 'MySQL (廣泛使用，高性能)',
    value: 'mysql',
    short: 'MySQL',
  },
  {
    name: 'MongoDB (NoSQL，靈活 Schema)',
    value: 'mongodb',
    short: 'MongoDB',
  },
  {
    name: 'SQLite (開發測試用，零配置)',
    value: 'sqlite',
    short: 'SQLite',
  },
];

const MODULE_OPTIONS = [
  // === P0 核心模組（預設選中）===
  { name: '認證系統 (JWT + Azure AD SSO)', value: 'module-auth', checked: true },
  { name: 'API Gateway (12個企業級中間件)', value: 'module-api-gateway', checked: true },
  { name: '安全模組 (數據保護 + 審計)', value: 'module-security', checked: true },
  { name: '監控系統 (OpenTelemetry + Prometheus)', value: 'monitoring', checked: true },

  // === P1 高優先級模組 ===
  { name: '知識庫系統 (向量搜索 + 版本控制)', value: 'module-knowledge-base', checked: false },
  { name: 'AI 整合 (Azure OpenAI 封裝)', value: 'module-ai-integration', checked: false },
  { name: '搜索模組 (多算法向量搜索)', value: 'module-search', checked: false },
  { name: '工作流程引擎 (12狀態 + 6種設計模式)', value: 'module-workflow', checked: false },
  { name: '通知系統 (多渠道通知)', value: 'module-notification', checked: false },
  { name: '性能監控 (應用級性能追蹤)', value: 'module-performance', checked: false },
  { name: '韌性模組 (容錯 + 重試 + 熔斷)', value: 'module-resilience', checked: false },

  // === P2 輔助工具模組 ===
  { name: '緩存系統 (Redis 雙層緩存)', value: 'module-cache', checked: false },
  { name: '模板管理 (Handlebars + PDF)', value: 'module-template', checked: false },
  { name: 'PDF 生成 (Puppeteer)', value: 'module-pdf', checked: false },
  { name: '文件解析器 (PDF/Word/Excel/OCR)', value: 'module-parsers', checked: false },
  { name: 'Dynamics 365 整合', value: 'module-dynamics365', checked: false },
  { name: 'Customer 360 (客戶全景視圖)', value: 'module-customer360', checked: false },

  // === Phase 3 業務模組 ===
  { name: '會議管理 (排程 + Teams 整合)', value: 'module-meeting', checked: false },
  { name: '日曆系統 (事件管理 + 同步)', value: 'module-calendar', checked: false },
  { name: '分析模組 (數據分析 + 報表)', value: 'module-analytics', checked: false },
  { name: '提醒系統 (智能提醒引擎)', value: 'module-reminder', checked: false },
  { name: '推薦引擎 (內容推薦)', value: 'module-recommendation', checked: false },
  { name: '協作模組 (團隊協作)', value: 'module-collaboration', checked: false },

  // === 開發工具鏈（預設選中）===
  { name: '測試框架 (Jest + Playwright, 564+ 測試)', value: 'testing', checked: true },
  { name: 'AI 助手指南', value: 'ai-guide', checked: true },
];

const MONITORING_BACKENDS = [
  {
    name: 'Prometheus + Grafana (本地部署，完全控制)',
    value: 'prometheus',
    short: 'Prometheus',
  },
  {
    name: 'Azure Monitor (雲端託管，零維護)',
    value: 'azure',
    short: 'Azure Monitor',
  },
  {
    name: '兩者都要 (最大靈活性)',
    value: 'both',
    short: '雙後端',
  },
];

// =====================================================
// 主函數
// =====================================================

async function main() {
  console.clear();
  printBanner();

  try {
    // 1. 基本信息
    const projectInfo = await getProjectInfo();
    
    // 2. 數據庫選擇
    const databaseConfig = await getDatabaseConfig();
    
    // 3. 模組選擇
    const selectedModules = await getModuleSelection();
    
    // 4. 監控配置
    const monitoringConfig = await getMonitoringConfig(selectedModules);
    
    // 5. 環境變數配置
    const envConfig = await getEnvironmentConfig(databaseConfig, selectedModules);
    
    // 6. 示例數據選擇
    const dataOptions = await getDataOptions();
    
    // 7. 確認配置
    const confirmed = await confirmConfiguration({
      projectInfo,
      databaseConfig,
      selectedModules,
      monitoringConfig,
      envConfig,
      dataOptions,
    });
    
    if (!confirmed) {
      console.log(chalk.yellow('\n❌ 初始化已取消'));
      process.exit(0);
    }
    
    // 8. 開始初始化
    await initializeProject({
      projectInfo,
      databaseConfig,
      selectedModules,
      monitoringConfig,
      envConfig,
      dataOptions,
    });
    
    // 9. 顯示完成信息
    printCompletionInfo(projectInfo, databaseConfig, selectedModules);

  } catch (error) {
    console.error(chalk.red('\n❌ 初始化過程中發生錯誤:'));
    console.error(error);
    process.exit(1);
  }
}

// =====================================================
// 互動式問題函數
// =====================================================

async function getProjectInfo() {
  console.log(chalk.blue.bold('\n📝 項目基本信息\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '項目名稱:',
      default: 'my-ai-webapp',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return '項目名稱不能為空';
        }
        if (!/^[a-z0-9-]+$/.test(input)) {
          return '項目名稱只能包含小寫字母、數字和連字符';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: '項目描述:',
      default: 'An AI-powered web application',
    },
    {
      type: 'input',
      name: 'author',
      message: '作者:',
      default: '',
    },
  ]);
  
  console.log(chalk.green(`\n✅ 項目名稱：${answers.name}`));
  return answers;
}

async function getDatabaseConfig() {
  console.log(chalk.blue.bold('\n💾 數據庫配置\n'));
  
  const { database } = await inquirer.prompt([
    {
      type: 'list',
      name: 'database',
      message: '請選擇數據庫類型:',
      choices: DATABASE_OPTIONS,
    },
  ]);
  
  let connectionInfo = {};
  
  if (database === 'sqlite') {
    connectionInfo = {
      url: 'file:./dev.db',
    };
  } else if (database === 'mongodb') {
    const mongoAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'MongoDB 連接字符串:',
        default: 'mongodb://localhost:27017/myapp',
      },
    ]);
    connectionInfo = mongoAnswers;
  } else {
    // PostgreSQL 或 MySQL
    const dbAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'host',
        message: 'Host:',
        default: 'localhost',
      },
      {
        type: 'input',
        name: 'port',
        message: 'Port:',
        default: database === 'postgresql' ? '5432' : '3306',
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database:',
        default: 'myapp',
      },
      {
        type: 'input',
        name: 'username',
        message: 'Username:',
        default: database === 'postgresql' ? 'postgres' : 'root',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
        default: '',
      },
    ]);
    
    // 構建連接字符串
    const { host, port, database: dbName, username, password } = dbAnswers;
    connectionInfo = {
      url: `${database}://${username}:${password}@${host}:${port}/${dbName}`,
    };
  }
  
  console.log(chalk.green(`\n✅ 將使用 ${database.toUpperCase()} 數據庫`));
  
  return {
    type: database,
    ...connectionInfo,
  };
}

async function getModuleSelection() {
  console.log(chalk.blue.bold('\n📦 選擇功能模組\n'));
  console.log(chalk.gray('(使用空格鍵選擇，Enter 確認)\n'));
  console.log(chalk.yellow('💡 提示: 如果不選擇任何模組，將獲得基礎演示項目:\n'));
  console.log(chalk.gray('   - 完整的 UI 設計系統 (20+ shadcn/ui 組件)'));
  console.log(chalk.gray('   - 演示頁面 (登錄、儀表板、知識庫、客戶管理等)'));
  console.log(chalk.gray('   - 模擬數據和 API，可直接運行查看效果'));
  console.log(chalk.gray('   - 隨時可通過複製模組目錄添加完整功能\n'));

  const { modules } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'modules',
      message: '選擇要安裝的模組:',
      choices: MODULE_OPTIONS,
    },
  ]);

  if (modules.length === 0) {
    console.log(chalk.yellow('\n⚠️  未選擇任何模組'));
    console.log(chalk.white('📦 零模組配置 - 你將獲得:'));
    console.log(chalk.green('   ✓ 基礎項目結構 (Next.js 14 + TypeScript)'));
    console.log(chalk.green('   ✓ 完整 UI 設計系統 (20+ 組件)'));
    console.log(chalk.green('   ✓ 15個演示頁面 (包含完整 UI/UX)'));
    console.log(chalk.green('   ✓ 演示數據和模擬 API'));
    console.log(chalk.green('   ✓ 響應式設計和深色模式'));
    console.log(chalk.white('\n💡 所有演示頁面位於 app/(demo)/ 路由組'));
    console.log(chalk.white('📚 詳細說明請查看生成的 DEMO-MODE.md 文檔\n'));
  } else {
    console.log(chalk.green(`\n✅ 已選擇 ${modules.length} 個模組`));
  }

  return modules;
}

async function getMonitoringConfig(selectedModules) {
  if (!selectedModules.includes('monitoring')) {
    return { enabled: false };
  }
  
  console.log(chalk.blue.bold('\n📊 監控系統配置\n'));
  
  const { backend } = await inquirer.prompt([
    {
      type: 'list',
      name: 'backend',
      message: '選擇監控後端:',
      choices: MONITORING_BACKENDS,
    },
  ]);
  
  console.log(chalk.green(`\n✅ 將配置 ${backend === 'both' ? 'Prometheus + Azure Monitor' : backend.toUpperCase()}`));
  
  return {
    enabled: true,
    backend,
  };
}

async function getEnvironmentConfig(databaseConfig, selectedModules) {
  console.log(chalk.blue.bold('\n⚙️  環境變數配置\n'));
  
  const envVars = {
    DATABASE_URL: databaseConfig.url,
    DATABASE_TYPE: databaseConfig.type,
    NEXTAUTH_SECRET: crypto.randomBytes(32).toString('hex'),
  };
  
  // 根據選擇的模組詢問相關環境變數
  const questions = [];
  
  if (selectedModules.includes('module-auth')) {
    questions.push(
      {
        type: 'input',
        name: 'NEXTAUTH_URL',
        message: 'NEXTAUTH_URL:',
        default: 'http://localhost:3000',
      },
      {
        type: 'confirm',
        name: 'enableAzureAD',
        message: '啟用 Azure AD SSO?',
        default: false,
      }
    );
  }

  const answers = await inquirer.prompt(questions);
  Object.assign(envVars, answers);

  // Azure AD 配置
  if (answers.enableAzureAD) {
    const azureQuestions = await inquirer.prompt([
      {
        type: 'input',
        name: 'AZURE_AD_CLIENT_ID',
        message: 'Azure AD Client ID:',
      },
      {
        type: 'input',
        name: 'AZURE_AD_CLIENT_SECRET',
        message: 'Azure AD Client Secret:',
      },
      {
        type: 'input',
        name: 'AZURE_AD_TENANT_ID',
        message: 'Azure AD Tenant ID:',
      },
    ]);
    Object.assign(envVars, azureQuestions);
  }

  // AI 模組配置
  if (selectedModules.includes('module-ai-integration')) {
    const aiQuestions = await inquirer.prompt([
      {
        type: 'input',
        name: 'AZURE_OPENAI_API_KEY',
        message: 'Azure OpenAI API Key:',
      },
      {
        type: 'input',
        name: 'AZURE_OPENAI_ENDPOINT',
        message: 'Azure OpenAI Endpoint:',
      },
    ]);
    Object.assign(envVars, aiQuestions);
  }
  
  console.log(chalk.green('\n✅ 環境變數已配置'));
  console.log(chalk.gray('💡 提示: 可以稍後在 .env.local 中修改這些值\n'));
  
  return envVars;
}

async function getDataOptions() {
  console.log(chalk.blue.bold('\n🌱 示例數據和日誌\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'seedData',
      message: '是否生成示例數據？',
      default: true,
    },
    {
      type: 'confirm',
      name: 'sampleLogs',
      message: '是否生成示例日誌？',
      default: true,
    },
  ]);
  
  if (answers.seedData || answers.sampleLogs) {
    console.log(chalk.green('\n✅ 將生成示例內容'));
  }
  
  return answers;
}

async function confirmConfiguration(config) {
  console.log(chalk.blue.bold('\n📋 配置摘要\n'));
  
  console.log(chalk.white('項目信息:'));
  console.log(`  名稱: ${config.projectInfo.name}`);
  console.log(`  描述: ${config.projectInfo.description}`);
  console.log(`  作者: ${config.projectInfo.author || '未設置'}`);
  
  console.log(chalk.white('\n數據庫:'));
  console.log(`  類型: ${config.databaseConfig.type.toUpperCase()}`);
  
  console.log(chalk.white('\n功能模組:'));
  config.selectedModules.forEach(mod => {
    const option = MODULE_OPTIONS.find(o => o.value === mod);
    console.log(`  ✓ ${option.name}`);
  });
  
  if (config.monitoringConfig.enabled) {
    console.log(chalk.white('\n監控:'));
    console.log(`  後端: ${config.monitoringConfig.backend}`);
  }
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '\n確認開始初始化？',
      default: true,
    },
  ]);
  
  return confirm;
}

// =====================================================
// 初始化執行函數
// =====================================================

async function initializeProject(config) {
  console.log(chalk.blue.bold('\n🚀 開始初始化項目...\n'));
  
  // 1. 複製 Prisma Schema
  await copyPrismaSchema(config.databaseConfig.type);
  
  // 2. 生成配置文件
  await generateConfigFiles(config);
  
  // 3. 生成環境變數文件
  await generateEnvFile(config.envConfig);
  
  // 4. 複製模組文件
  await copyModules(config.selectedModules);

  // 5. 生成 AI 助手指南
  await generateAIAssistantGuide(config);

  // 6. 生成 package.json
  await generatePackageJson(config);

  // 7. 安裝依賴
  await installDependencies();

  // 8. 初始化數據庫
  await initializeDatabase(config.databaseConfig.type);

  // 9. 生成示例數據
  if (config.dataOptions.seedData) {
    await generateSeedData(config.databaseConfig.type);
  }

  // 10. 生成示例日誌
  if (config.dataOptions.sampleLogs) {
    await generateSampleLogs();
  }

  // 11. 清理模板文件
  await cleanupTemplateFiles();
}

async function copyPrismaSchema(databaseType) {
  const spinner = ora('正在配置 Prisma Schema...').start();
  
  try {
    const schemaSource = path.join(__dirname, '01-base', 'prisma', `schema.${databaseType}.prisma`);
    const schemaDest = path.join(process.cwd(), 'prisma', 'schema.prisma');
    
    await fs.ensureDir(path.dirname(schemaDest));
    await fs.copy(schemaSource, schemaDest);
    
    spinner.succeed('Prisma Schema 已配置');
  } catch (error) {
    spinner.fail('Prisma Schema 配置失敗');
    throw error;
  }
}

async function generateConfigFiles(config) {
  const spinner = ora('正在生成配置文件...').start();
  
  try {
    // 複製並處理配置文件模板
    const configFiles = [
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js',
      'postcss.config.js',
    ];
    
    for (const file of configFiles) {
      const source = path.join(__dirname, '01-base', `${file}.template`);
      const dest = path.join(process.cwd(), file);
      
      if (await fs.pathExists(source)) {
        let content = await fs.readFile(source, 'utf-8');
        
        // 替換佔位符
        content = replacePlaceholders(content, {
          PROJECT_NAME: config.projectInfo.name,
          DATABASE_TYPE: config.databaseConfig.type,
        });
        
        await fs.writeFile(dest, content);
      }
    }
    
    spinner.succeed('配置文件已生成');
  } catch (error) {
    spinner.fail('配置文件生成失敗');
    throw error;
  }
}

async function generateEnvFile(envConfig) {
  const spinner = ora('正在生成環境變數文件...').start();
  
  try {
    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    await fs.writeFile('.env.local', envContent);
    
    spinner.succeed('環境變數文件已生成');
  } catch (error) {
    spinner.fail('環境變數文件生成失敗');
    throw error;
  }
}

async function copyModules(selectedModules) {
  const spinner = ora('正在複製功能模組...').start();

  try {
    for (const module of selectedModules) {
      const source = path.join(__dirname, '02-modules', module);
      const dest = process.cwd();

      if (await fs.pathExists(source)) {
        await fs.copy(source, dest, { overwrite: true });
      }
    }

    spinner.succeed(`已複製 ${selectedModules.length} 個功能模組`);
  } catch (error) {
    spinner.fail('功能模組複製失敗');
    throw error;
  }
}

async function generateAIAssistantGuide(config) {
  const spinner = ora('正在生成 AI 助手指南...').start();

  try {
    const templatePath = path.join(__dirname, '01-base', 'AI-ASSISTANT-GUIDE.md.template');
    let content = await fs.readFile(templatePath, 'utf-8');

    // 生成已安裝模組清單
    const modulesList = generateModulesList(config.selectedModules);

    // 生成監控命令（如果啟用）
    const monitoringCommands = config.monitoringConfig.enabled
      ? generateMonitoringCommands(config.monitoringConfig.backend)
      : '';

    // 生成監控技術棧說明（如果啟用）
    const monitoringStack = config.monitoringConfig.enabled
      ? generateMonitoringStack(config.monitoringConfig.backend)
      : '';

    // 獲取當前日期
    const creationDate = new Date().toISOString().split('T')[0];

    // 替換所有佔位符
    content = replacePlaceholders(content, {
      PROJECT_NAME: config.projectInfo.name,
      CREATION_DATE: creationDate,
      DATABASE_TYPE: config.databaseConfig.type.toUpperCase(),
      INSTALLED_MODULES: modulesList,
      MONITORING_COMMANDS: monitoringCommands,
      MONITORING_STACK: monitoringStack,
      PROJECT_REPOSITORY: config.projectInfo.repository || 'https://github.com/your-username/' + config.projectInfo.name,
    });

    // 寫入文件
    const destPath = path.join(process.cwd(), 'AI-ASSISTANT-GUIDE.md');
    await fs.writeFile(destPath, content);

    spinner.succeed('AI 助手指南已生成');
  } catch (error) {
    spinner.fail('AI 助手指南生成失敗');
    throw error;
  }
}

function generateModulesList(selectedModules) {
  const moduleDescriptions = {
    'module-auth': '✅ **認證系統** (`module-auth/`)\n   - JWT 雙令牌認證\n   - Azure AD SSO 整合\n   - 使用: `import { ... } from "@/lib/auth"`',
    'module-api-gateway': '✅ **API Gateway** (`module-api-gateway/`)\n   - 12個企業級中間件\n   - 速率限制、CORS、驗證\n   - 使用: `import { withApiMiddleware } from "@/lib/api-gateway/middleware"`',
    'module-security': '✅ **安全模組** (`module-security/`)\n   - 數據保護和加密\n   - 審計日誌系統\n   - 使用: `import { ... } from "@/lib/security"`',
    'module-knowledge-base': '✅ **知識庫系統** (`module-knowledge-base/`)\n   - 向量搜索 (pgvector)\n   - 版本控制和審計\n   - 使用: `import { ... } from "@/lib/knowledge"`',
    'module-ai-integration': '✅ **AI 整合** (`module-ai-integration/`)\n   - Azure OpenAI 封裝\n   - 流式回應支持\n   - 使用: `import { azureOpenAI } from "@/lib/ai"`',
    'module-search': '✅ **搜索模組** (`module-search/`)\n   - 多算法向量搜索\n   - 全文檢索\n   - 使用: `import { ... } from "@/lib/search"`',
    'module-workflow': '✅ **工作流程引擎** (`module-workflow/`)\n   - 12狀態工作流\n   - 6種設計模式\n   - 使用: `import { ... } from "@/lib/workflow"`',
    'module-notification': '✅ **通知系統** (`module-notification/`)\n   - 多渠道通知 (Email, SMS, Push)\n   - 模板管理\n   - 使用: `import { ... } from "@/lib/notification"`',
    'module-performance': '✅ **性能監控** (`module-performance/`)\n   - 應用級性能追蹤\n   - 響應時間分析\n   - 使用: `import { ... } from "@/lib/performance"`',
    'module-resilience': '✅ **韌性模組** (`module-resilience/`)\n   - 容錯和重試機制\n   - 熔斷器模式\n   - 使用: `import { ... } from "@/lib/resilience"`',
    'module-cache': '✅ **緩存系統** (`module-cache/`)\n   - Redis 雙層緩存\n   - 智能緩存策略\n   - 使用: `import { ... } from "@/lib/cache"`',
    'module-template': '✅ **模板管理** (`module-template/`)\n   - Handlebars 模板引擎\n   - PDF 導出\n   - 使用: `import { ... } from "@/lib/template"`',
    'module-pdf': '✅ **PDF 生成** (`module-pdf/`)\n   - Puppeteer 引擎\n   - HTML to PDF 轉換\n   - 使用: `import { ... } from "@/lib/pdf"`',
    'module-parsers': '✅ **文件解析器** (`module-parsers/`)\n   - PDF/Word/Excel 解析\n   - OCR 文字識別\n   - 使用: `import { ... } from "@/lib/parsers"`',
    'module-dynamics365': '✅ **Dynamics 365 整合** (`module-dynamics365/`)\n   - CRM 數據同步\n   - OAuth 認證\n   - 使用: `import { ... } from "@/lib/dynamics365"`',
    'module-customer360': '✅ **Customer 360** (`module-customer360/`)\n   - 客戶全景視圖\n   - 數據聚合分析\n   - 使用: `import { ... } from "@/lib/customer360"`',
    'module-meeting': '✅ **會議管理** (`module-meeting/`)\n   - 會議排程\n   - Teams 整合\n   - 使用: `import { ... } from "@/lib/meeting"`',
    'module-calendar': '✅ **日曆系統** (`module-calendar/`)\n   - 事件管理\n   - 多日曆同步\n   - 使用: `import { ... } from "@/lib/calendar"`',
    'module-analytics': '✅ **分析模組** (`module-analytics/`)\n   - 數據分析引擎\n   - 自定義報表\n   - 使用: `import { ... } from "@/lib/analytics"`',
    'module-reminder': '✅ **提醒系統** (`module-reminder/`)\n   - 智能提醒引擎\n   - 多渠道通知\n   - 使用: `import { ... } from "@/lib/reminder"`',
    'module-recommendation': '✅ **推薦引擎** (`module-recommendation/`)\n   - 內容推薦算法\n   - 個性化推送\n   - 使用: `import { ... } from "@/lib/recommendation"`',
    'module-collaboration': '✅ **協作模組** (`module-collaboration/`)\n   - 團隊協作功能\n   - 實時同步\n   - 使用: `import { ... } from "@/lib/collaboration"`',
    'monitoring': '✅ **監控系統** (`00-monitoring/`)\n   - OpenTelemetry 遙測\n   - Prometheus/Azure Monitor\n   - 自動配置和啟用',
    'testing': '✅ **測試框架**\n   - Jest 單元測試 (564+ 測試)\n   - Playwright E2E 測試\n   - 執行: `npm test` / `npm run test:e2e`',
  };

  const installedModules = selectedModules
    .map(mod => moduleDescriptions[mod] || `✅ **${mod}**`)
    .join('\n\n');

  const notInstalledNote = `
### ⚠️ 未安裝的模組

以下模組在初始化時未選擇，如需使用請參考模板倉庫的 \`02-modules/\` 目錄手動添加：

${Object.keys(moduleDescriptions)
  .filter(mod => !selectedModules.includes(mod))
  .map(mod => `- ${mod}`)
  .join('\n')}
`;

  return installedModules + '\n\n' + notInstalledNote;
}

function generateMonitoringCommands(backend) {
  if (backend === 'prometheus' || backend === 'both') {
    return `
# 監控系統
npm run monitoring:start  # 啟動 Prometheus + Grafana (Docker)
npm run monitoring:stop   # 停止監控堆棧
npm run monitoring:logs   # 查看監控日誌

# 訪問監控面板
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin)
`;
  }
  return '';
}

function generateMonitoringStack(backend) {
  const stacks = {
    'prometheus': `
**監控**:
- OpenTelemetry (遙測收集)
- Prometheus (指標存儲)
- Grafana (可視化面板)
- 46個預配置告警規則
- 4個預建 Grafana 儀表板`,
    'azure': `
**監控**:
- OpenTelemetry (遙測收集)
- Azure Monitor (雲端監控)
- Application Insights (應用洞察)
- 自動化告警和診斷`,
    'both': `
**監控**:
- OpenTelemetry (遙測收集)
- Prometheus + Grafana (本地監控)
- Azure Monitor (雲端監控)
- 雙後端支持，最大靈活性`,
  };

  return stacks[backend] || '';
}

async function generatePackageJson(config) {
  const spinner = ora('正在生成 package.json...').start();
  
  try {
    const templatePath = path.join(__dirname, '01-base', 'package.json.template');
    let packageJson = await fs.readJson(templatePath);
    
    // 更新項目信息
    packageJson.name = config.projectInfo.name;
    packageJson.description = config.projectInfo.description;
    packageJson.author = config.projectInfo.author;
    
    await fs.writeJson('package.json', packageJson, { spaces: 2 });
    
    spinner.succeed('package.json 已生成');
  } catch (error) {
    spinner.fail('package.json 生成失敗');
    throw error;
  }
}

async function installDependencies() {
  const spinner = ora('正在安裝依賴 (這可能需要幾分鐘)...').start();
  
  try {
    execSync('npm install', { stdio: 'ignore' });
    spinner.succeed('依賴安裝完成');
  } catch (error) {
    spinner.fail('依賴安裝失敗');
    throw error;
  }
}

async function initializeDatabase(databaseType) {
  const spinner = ora('正在初始化數據庫...').start();
  
  try {
    // 生成 Prisma Client
    execSync('npx prisma generate', { stdio: 'ignore' });
    
    // 運行遷移（SQLite 和關聯式數據庫）
    if (databaseType !== 'mongodb') {
      execSync('npx prisma migrate dev --name init', { stdio: 'ignore' });
    } else {
      execSync('npx prisma db push', { stdio: 'ignore' });
    }
    
    spinner.succeed('數據庫初始化完成');
  } catch (error) {
    spinner.fail('數據庫初始化失敗');
    throw error;
  }
}

async function generateSeedData(databaseType) {
  const spinner = ora('正在生成示例數據...').start();
  
  try {
    // 運行種子腳本
    execSync('npx prisma db seed', { stdio: 'ignore' });
    
    spinner.succeed('示例數據已生成');
  } catch (error) {
    spinner.warn('示例數據生成失敗 (可以稍後手動添加)');
  }
}

async function generateSampleLogs() {
  const spinner = ora('正在生成示例日誌...').start();
  
  try {
    const sampleLogsPath = path.join(__dirname, 'examples', 'sample-logs');
    
    if (await fs.pathExists(sampleLogsPath)) {
      await fs.copy(sampleLogsPath, process.cwd(), { overwrite: false });
    }
    
    spinner.succeed('示例日誌已生成');
  } catch (error) {
    spinner.warn('示例日誌生成失敗');
  }
}

async function cleanupTemplateFiles() {
  const spinner = ora('正在清理模板文件...').start();
  
  try {
    // 刪除 .template 文件
    const files = await fs.readdir(process.cwd());
    for (const file of files) {
      if (file.endsWith('.template')) {
        await fs.remove(file);
      }
    }
    
    spinner.succeed('模板文件已清理');
  } catch (error) {
    spinner.warn('模板文件清理失敗');
  }
}

// =====================================================
// 工具函數
// =====================================================

function replacePlaceholders(content, replacements) {
  let result = content;
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

function printBanner() {
  console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀  AI Web App 模板初始化工具                            ║
║                                                           ║
║   版本: 5.0.0                                             ║
║   作者: AI Sales Enablement Team                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `));
}

function printCompletionInfo(projectInfo, databaseConfig, selectedModules) {
  console.log(chalk.green.bold('\n🎉 項目初始化完成！\n'));

  console.log(chalk.white('📁 項目結構:'));
  console.log(`  ${projectInfo.name}/`);
  console.log('  ├── app/                    # Next.js 應用');
  if (selectedModules.length === 0) {
    console.log('  │   └── (demo)/             # 演示頁面路由組');
  }
  console.log('  ├── components/             # React 組件');
  console.log('  ├── lib/                    # 工具函數');
  if (selectedModules.length === 0) {
    console.log('  │   ├── demo-data.ts        # 演示數據');
    console.log('  │   └── demo-api.ts         # 模擬 API');
  }
  console.log('  ├── prisma/                 # 數據庫模型');
  console.log('  ├── .env.local              # 環境變數');
  console.log('  └── ...\n');

  console.log(chalk.white('🚀 快速開始:\n'));
  console.log(chalk.cyan('  1. 啟動開發服務器:'));
  console.log('     npm run dev\n');
  console.log(chalk.cyan('  2. 訪問應用:'));
  console.log('     http://localhost:3000\n');

  if (selectedModules.length === 0) {
    console.log(chalk.yellow('🎭 演示模式:\n'));
    console.log(chalk.white('  你可以訪問以下演示頁面:'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/login         # 登錄頁'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/dashboard     # 儀表板'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/dashboard/knowledge  # 知識庫'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/dashboard/customers  # 客戶管理'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/api-docs      # API 文檔'));
    console.log(chalk.white('\n  💡 查看 DEMO-MODE.md 了解所有演示頁面\n'));
  } else if (selectedModules.includes('monitoring')) {
    console.log(chalk.cyan('  3. 查看監控面板:'));
    console.log('     http://localhost:3001\n');
  }

  console.log(chalk.white('📖 文檔:\n'));
  if (selectedModules.length === 0) {
    console.log('  - 演示模式說明: DEMO-MODE.md');
  }
  console.log('  - AI 助手指南: AI-ASSISTANT-GUIDE.md');
  console.log('  - 項目索引: PROJECT-INDEX.md');
  console.log('  - 部署指南: DEPLOYMENT-GUIDE.md\n');

  console.log(chalk.white('💡 提示:\n'));
  if (selectedModules.includes('testing')) {
    console.log('  - 運行測試: npm test');
  }
  console.log('  - 查看日誌: tail -f DEVELOPMENT-LOG.md');
  console.log('  - 健康檢查: npm run health-check\n');

  console.log(chalk.gray('需要幫助？查看 README.md\n'));
}

// =====================================================
// 執行主函數
// =====================================================

main().catch((error) => {
  console.error(chalk.red('\n❌ 發生未預期的錯誤:'));
  console.error(error);
  process.exit(1);
});

