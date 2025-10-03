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
  // 核心模組（預設選中）
  { name: '認證系統 (JWT + Azure AD SSO)', value: 'auth', checked: true },
  { name: 'API Gateway (10個企業級中間件)', value: 'api-gateway', checked: true },
  
  // 可選模組
  { name: '知識庫系統 (向量搜索 + 版本控制)', value: 'knowledge', checked: false },
  { name: 'AI 整合 (Azure OpenAI 封裝)', value: 'ai', checked: false },
  { name: '工作流程引擎 (12狀態 + 6種設計模式)', value: 'workflow', checked: false },
  { name: '通知系統 (多渠道通知)', value: 'notifications', checked: false },
  { name: '模板管理 (CRUD + PDF導出)', value: 'templates', checked: false },
  { name: 'Dynamics 365 整合', value: 'dynamics365', checked: false },
  
  // 開發工具鏈（預設選中）
  { name: '監控系統 (OpenTelemetry + Prometheus)', value: 'monitoring', checked: true },
  { name: '測試框架 (Jest + Playwright)', value: 'testing', checked: true },
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
    printCompletionInfo(projectInfo, databaseConfig);
    
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
  
  const { modules } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'modules',
      message: '選擇要安裝的模組:',
      choices: MODULE_OPTIONS,
    },
  ]);
  
  console.log(chalk.green(`\n✅ 已選擇 ${modules.length} 個模組`));
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
  
  if (selectedModules.includes('auth')) {
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
  if (selectedModules.includes('ai')) {
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
  
  // 5. 生成 package.json
  await generatePackageJson(config);
  
  // 6. 安裝依賴
  await installDependencies();
  
  // 7. 初始化數據庫
  await initializeDatabase(config.databaseConfig.type);
  
  // 8. 生成示例數據
  if (config.dataOptions.seedData) {
    await generateSeedData(config.databaseConfig.type);
  }
  
  // 9. 生成示例日誌
  if (config.dataOptions.sampleLogs) {
    await generateSampleLogs();
  }
  
  // 10. 清理模板文件
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

function printCompletionInfo(projectInfo, databaseConfig) {
  console.log(chalk.green.bold('\n🎉 項目初始化完成！\n'));
  
  console.log(chalk.white('📁 項目結構:'));
  console.log(`  ${projectInfo.name}/`);
  console.log('  ├── app/                    # Next.js 應用');
  console.log('  ├── components/             # React 組件');
  console.log('  ├── lib/                    # 工具函數');
  console.log('  ├── prisma/                 # 數據庫模型');
  console.log('  ├── .env.local              # 環境變數');
  console.log('  └── ...\n');
  
  console.log(chalk.white('🚀 快速開始:\n'));
  console.log(chalk.cyan('  1. 啟動開發服務器:'));
  console.log('     npm run dev\n');
  console.log(chalk.cyan('  2. 訪問應用:'));
  console.log('     http://localhost:3000\n');
  console.log(chalk.cyan('  3. 查看監控面板:'));
  console.log('     http://localhost:3001\n');
  
  console.log(chalk.white('📖 文檔:\n'));
  console.log('  - AI 助手指南: AI-ASSISTANT-GUIDE.md');
  console.log('  - 項目索引: PROJECT-INDEX.md');
  console.log('  - 部署指南: DEPLOYMENT-GUIDE.md\n');
  
  console.log(chalk.white('💡 提示:\n'));
  console.log('  - 運行測試: npm test');
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

