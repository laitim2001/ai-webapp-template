/**
 * ================================================================
 * CLI Core Logic - 基於 init-project.js 改造
 * ================================================================
 *
 * 主要修改:
 * 1. 接受 templatePath 和 projectPath 參數
 * 2. 所有文件操作指向 projectPath
 * 3. 所有模板讀取從 templatePath
 * 4. 使用 file-processor.js 處理文件複製
 */

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const crypto = require('crypto');
const {
  copyAllFiles,
  copyPrismaSchema,
  replacePlaceholders,
} = require('./file-processor');

// 常量定義 (與 init-project.js 相同)
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
  // P0 核心模組
  { name: '認證系統 (JWT + Azure AD SSO)', value: 'module-auth', checked: true },
  { name: 'API Gateway (12個企業級中間件)', value: 'module-api-gateway', checked: true },
  { name: '安全模組 (數據保護 + 審計)', value: 'module-security', checked: true },
  { name: '監控系統 (OpenTelemetry + Prometheus)', value: 'monitoring', checked: true },

  // P1 高優先級模組
  { name: '知識庫系統 (向量搜索 + 版本控制)', value: 'module-knowledge-base', checked: false },
  { name: 'AI 整合 (Azure OpenAI 封裝)', value: 'module-ai-integration', checked: false },
  { name: '搜索模組 (多算法向量搜索)', value: 'module-search', checked: false },
  { name: '工作流程引擎 (12狀態 + 6種設計模式)', value: 'module-workflow', checked: false },
  { name: '通知系統 (多渠道通知)', value: 'module-notification', checked: false },
  { name: '性能監控 (應用級性能追蹤)', value: 'module-performance', checked: false },
  { name: '韌性模組 (容錯 + 重試 + 熔斷)', value: 'module-resilience', checked: false },

  // P2 輔助工具模組
  { name: '緩存系統 (Redis 雙層緩存)', value: 'module-cache', checked: false },
  { name: '模板管理 (Handlebars + PDF)', value: 'module-template', checked: false },
  { name: 'PDF 生成 (Puppeteer)', value: 'module-pdf', checked: false },
  { name: '文件解析器 (PDF/Word/Excel/OCR)', value: 'module-parsers', checked: false },
  { name: 'Dynamics 365 整合', value: 'module-dynamics365', checked: false },
  { name: 'Customer 360 (客戶全景視圖)', value: 'module-customer360', checked: false },

  // Phase 3 業務模組
  { name: '會議管理 (排程 + Teams 整合)', value: 'module-meeting', checked: false },
  { name: '日曆系統 (事件管理 + 同步)', value: 'module-calendar', checked: false },
  { name: '分析模組 (數據分析 + 報表)', value: 'module-analytics', checked: false },
  { name: '提醒系統 (智能提醒引擎)', value: 'module-reminder', checked: false },
  { name: '推薦引擎 (內容推薦)', value: 'module-recommendation', checked: false },
  { name: '協作模組 (團隊協作)', value: 'module-collaboration', checked: false },

  // 開發工具鏈
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

/**
 * 主 CLI 運行函數
 * @param {string} templatePath - 模板路徑 (NPM包內的template/)
 * @param {string} projectPath - 項目路徑 (新創建的項目目錄)
 * @param {string} projectName - 項目名稱
 */
async function runCLI(templatePath, projectPath, projectName) {
  // 切換工作目錄到項目路徑
  process.chdir(projectPath);

  printBanner();

  try {
    // 1. 基本信息 (使用命令行提供的項目名)
    const projectInfo = await getProjectInfo(projectName);

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

    // 8. 開始初始化 (傳入 templatePath)
    const { dbInitialized } = await initializeProject(templatePath, projectPath, {
      projectInfo,
      databaseConfig,
      selectedModules,
      monitoringConfig,
      envConfig,
      dataOptions,
    });

    // 9. 顯示完成信息
    printCompletionInfo(projectInfo, databaseConfig, selectedModules, dbInitialized);

  } catch (error) {
    console.error(chalk.red('\n❌ 初始化過程中發生錯誤:'));
    console.error(error);
    throw error;
  }
}

// =====================================================
// 互動式問題函數
// =====================================================

async function getProjectInfo(defaultName) {
  console.log(chalk.blue.bold('\n📝 項目基本信息\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '項目名稱:',
      default: defaultName,
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
        message: 'Password (用於 Docker 請使用 "password"):',
        default: 'password',
      },
    ]);

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
  if (config.selectedModules.length === 0) {
    console.log(chalk.yellow('  (零模組配置 - 演示模式)'));
  } else {
    config.selectedModules.forEach(mod => {
      const option = MODULE_OPTIONS.find(o => o.value === mod);
      console.log(`  ✓ ${option.name}`);
    });
  }

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

async function initializeProject(templatePath, projectPath, config) {
  console.log(chalk.blue.bold('\n🚀 開始初始化項目...\n'));

  // 1. 複製 Prisma Schema
  await copyPrismaSchema(templatePath, projectPath, config.databaseConfig.type);

  // 2. 複製所有文件 (使用 file-processor.js)
  await copyAllFiles(templatePath, projectPath, config);

  // 3. 生成環境變數文件
  await generateEnvFile(config.envConfig);

  // 4. 生成 package.json
  await generatePackageJson(templatePath, config);

  // 5. 安裝依賴
  await installDependencies();

  // 6. 嘗試初始化數據庫 (非致命錯誤)
  const dbInitialized = await tryInitializeDatabase(config.databaseConfig.type);

  // 7. 生成示例數據 (僅當數據庫初始化成功時)
  if (dbInitialized && config.dataOptions.seedData) {
    await generateSeedData();
  }

  // 返回初始化狀態
  return { dbInitialized };
}

async function generateEnvFile(envConfig) {
  const spinner = ora('正在生成環境變數文件...').start();

  try {
    const envContent = Object.entries(envConfig)
      .filter(([key, value]) => value !== undefined && value !== null && key !== 'enableAzureAD')
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // 只生成 .env.local (Next.js 和開發環境使用)
    await fs.writeFile('.env.local', envContent);

    spinner.succeed('環境變數文件已生成 (.env.local)');
  } catch (error) {
    spinner.fail('環境變數文件生成失敗');
    throw error;
  }
}

async function generatePackageJson(templatePath, config) {
  const spinner = ora('正在生成 package.json...').start();

  try {
    const templateFile = path.join(templatePath, '01-base', 'package.json.template');
    let packageJson = await fs.readJson(templateFile);

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
    execSync('npm install', { stdio: 'inherit' });
    spinner.succeed('依賴安裝完成');
  } catch (error) {
    spinner.fail('依賴安裝失敗');
    console.error(chalk.red('\n詳細錯誤信息:'));
    console.error(chalk.gray('請檢查網絡連接或手動運行 npm install\n'));
    throw error;
  }
}

async function tryInitializeDatabase(databaseType) {
  const spinner = ora('正在初始化數據庫...').start();

  try {
    // 確保 Prisma CLI 可以讀取環境變數
    // Windows 上 Prisma CLI 可能無法讀取 .env.local，所以複製到 .env
    spinner.text = '正在配置環境變數...';
    if (await fs.pathExists('.env.local')) {
      await fs.copy('.env.local', '.env');
    }

    // 生成 Prisma Client
    spinner.text = '正在生成 Prisma Client...';
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 運行遷移
    if (databaseType !== 'mongodb') {
      spinner.text = '正在運行數據庫遷移...';
      execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    } else {
      spinner.text = '正在推送數據庫模型...';
      execSync('npx prisma db push', { stdio: 'inherit' });
    }

    spinner.succeed('數據庫初始化完成');
    return true;

  } catch (error) {
    spinner.warn('數據庫初始化失敗（這是正常的）');

    console.log(chalk.yellow('\n⚠️  無法連接到數據庫'));
    console.log(chalk.white('可能的原因:'));
    console.log(chalk.gray('  • 數據庫服務器尚未啟動'));
    console.log(chalk.gray('  • 連接信息不正確'));
    console.log(chalk.gray('  • 數據庫尚未創建\n'));

    console.log(chalk.white('📝 不用擔心，項目已成功創建！'));
    console.log(chalk.white('   你可以稍後手動初始化數據庫\n'));

    return false;
  }
}

async function generateSeedData() {
  const spinner = ora('正在生成示例數據...').start();

  try {
    execSync('npx prisma db seed', { stdio: 'ignore' });
    spinner.succeed('示例數據已生成');
  } catch (error) {
    spinner.warn('示例數據生成失敗 (可以稍後手動添加)');
  }
}

// =====================================================
// 工具函數
// =====================================================

function printBanner() {
  console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀  AI Web App 項目創建工具                             ║
║                                                           ║
║   版本: 5.0.0                                             ║
║   由 create-ai-webapp 提供支持                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `));
}

function printCompletionInfo(projectInfo, databaseConfig, selectedModules, dbInitialized) {
  if (dbInitialized) {
    console.log(chalk.green.bold('\n🎉 項目創建成功！\n'));
  } else {
    console.log(chalk.yellow.bold('\n✅ 項目創建成功（數據庫待初始化）\n'));
  }

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

  // 如果數據庫未初始化，顯示數據庫啟動和初始化說明
  if (!dbInitialized) {
    console.log(chalk.yellow.bold('📊 數據庫初始化步驟:\n'));

    console.log(chalk.cyan('  1. 啟動數據庫服務器:\n'));

    const dbType = databaseConfig.type;
    if (dbType === 'postgresql') {
      console.log(chalk.white('     Windows:'));
      console.log(chalk.gray('       # 如果使用 PostgreSQL 安裝版'));
      console.log(chalk.gray('       net start postgresql-x64-14'));
      console.log(chalk.gray('       # 或使用 pg_ctl'));
      console.log(chalk.gray('       pg_ctl -D "C:\\Program Files\\PostgreSQL\\14\\data" start\n'));

      console.log(chalk.white('     macOS:'));
      console.log(chalk.gray('       brew services start postgresql@14\n'));

      console.log(chalk.white('     Linux:'));
      console.log(chalk.gray('       sudo systemctl start postgresql\n'));

      console.log(chalk.white('     Docker (推薦 - 包含 pgvector 擴展):'));
      console.log(chalk.gray('       docker run -d -p 5432:5432 \\'));
      console.log(chalk.gray('         -e POSTGRES_PASSWORD=password \\'));
      console.log(chalk.gray('         -e POSTGRES_DB=myapp \\'));
      console.log(chalk.gray('         --name ai-webapp-postgres \\'));
      console.log(chalk.gray('         ankane/pgvector:latest\n'));

    } else if (dbType === 'mysql') {
      console.log(chalk.white('     Windows:'));
      console.log(chalk.gray('       net start mysql80\n'));

      console.log(chalk.white('     macOS:'));
      console.log(chalk.gray('       brew services start mysql\n'));

      console.log(chalk.white('     Linux:'));
      console.log(chalk.gray('       sudo systemctl start mysql\n'));

      console.log(chalk.white('     Docker (推薦):'));
      console.log(chalk.gray('       docker run -d -p 3306:3306 \\'));
      console.log(chalk.gray('         -e MYSQL_ROOT_PASSWORD=password \\'));
      console.log(chalk.gray('         -e MYSQL_DATABASE=myapp \\'));
      console.log(chalk.gray('         --name ai-webapp-mysql \\'));
      console.log(chalk.gray('         mysql:8.0\n'));

    } else if (dbType === 'mongodb') {
      console.log(chalk.white('     Windows:'));
      console.log(chalk.gray('       net start MongoDB\n'));

      console.log(chalk.white('     macOS:'));
      console.log(chalk.gray('       brew services start mongodb-community\n'));

      console.log(chalk.white('     Linux:'));
      console.log(chalk.gray('       sudo systemctl start mongod\n'));

      console.log(chalk.white('     Docker (推薦):'));
      console.log(chalk.gray('       docker run -d -p 27017:27017 \\'));
      console.log(chalk.gray('         --name ai-webapp-mongodb \\'));
      console.log(chalk.gray('         mongo:6.0\n'));
    }

    console.log(chalk.cyan(`  2. 進入項目目錄:`));
    console.log(chalk.gray(`     cd ${projectInfo.name}\n`));

    // Docker 容器管理說明
    if (dbType === 'postgresql' || dbType === 'mysql' || dbType === 'mongodb') {
      console.log(chalk.yellow('  💡 Docker 容器管理命令:\n'));

      console.log(chalk.white('     查看運行中的容器:'));
      console.log(chalk.gray('       docker ps\n'));

      console.log(chalk.white('     查看所有容器（包括已停止）:'));
      console.log(chalk.gray('       docker ps -a\n'));

      const containerName = dbType === 'postgresql' ? 'ai-webapp-postgres'
                          : dbType === 'mysql' ? 'ai-webapp-mysql'
                          : 'ai-webapp-mongodb';

      console.log(chalk.white('     停止容器:'));
      console.log(chalk.gray(`       docker stop ${containerName}\n`));

      console.log(chalk.white('     啟動已停止的容器:'));
      console.log(chalk.gray(`       docker start ${containerName}\n`));

      console.log(chalk.white('     刪除容器（需要重新生成時）:'));
      console.log(chalk.gray(`       docker stop ${containerName}`));
      console.log(chalk.gray(`       docker rm ${containerName}\n`));

      console.log(chalk.white('     查看容器日誌（排查問題）:'));
      console.log(chalk.gray(`       docker logs ${containerName}\n`));

      console.log(chalk.white('     進入容器內部（高級操作）:'));
      console.log(chalk.gray(`       docker exec -it ${containerName} ${dbType === 'mongodb' ? 'mongosh' : 'bash'}\n`));
    }

    console.log(chalk.cyan('  3. 確認 .env.local 中的數據庫連接信息正確\n'));

    console.log(chalk.cyan('  4. 複製環境變數文件（Prisma CLI 需要）:'));
    console.log(chalk.gray('     copy .env.local .env     # Windows'));
    console.log(chalk.gray('     cp .env.local .env       # macOS/Linux\n'));

    console.log(chalk.cyan('  5. 初始化數據庫:\n'));
    if (dbType !== 'mongodb') {
      console.log(chalk.gray('     npx prisma migrate dev --name init\n'));
    } else {
      console.log(chalk.gray('     npx prisma db push\n'));
    }

    console.log(chalk.cyan('  6. 啟動開發服務器:'));
    console.log(chalk.gray('     npm run dev\n'));

    console.log(chalk.cyan('  7. 訪問應用:'));
    console.log(chalk.gray('     http://localhost:3000\n'));

  } else {
    // 數據庫已初始化，顯示簡化的啟動步驟
    console.log(chalk.white('🚀 快速開始:\n'));
    console.log(chalk.cyan(`  1. 進入項目目錄:`));
    console.log(chalk.gray(`     cd ${projectInfo.name}\n`));
    console.log(chalk.cyan('  2. 啟動開發服務器:'));
    console.log(chalk.gray('     npm run dev\n'));
    console.log(chalk.cyan('  3. 訪問應用:'));
    console.log(chalk.gray('     http://localhost:3000\n'));
  }

  if (selectedModules.length === 0) {
    console.log(chalk.yellow('🎭 演示模式:\n'));
    console.log(chalk.white('  你可以訪問以下演示頁面:'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/login         # 登錄頁'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/dashboard     # 儀表板'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/dashboard/knowledge  # 知識庫'));
    console.log(chalk.gray('  - http://localhost:3000/(demo)/api-docs      # API 文檔'));
    console.log(chalk.white('\n  💡 查看 DEMO-MODE.md 了解所有15個演示頁面\n'));
  }

  console.log(chalk.white('📖 項目文檔:\n'));
  if (selectedModules.length === 0) {
    console.log('  - 演示模式說明: DEMO-MODE.md');
  }
  console.log('  - AI 助手指南: AI-ASSISTANT-GUIDE.md');
  console.log('  - 項目索引: PROJECT-INDEX.md');
  console.log('  - 部署指南: DEPLOYMENT-GUIDE.md\n');

  console.log(chalk.gray('需要幫助？查看 README.md 或訪問 https://github.com/laitim2001/ai-webapp-template\n'));
  console.log(chalk.green.bold('✨ 祝你開發愉快！\n'));
}

// 導出主函數
module.exports = {
  runCLI,
};
