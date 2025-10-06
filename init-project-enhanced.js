#!/usr/bin/env node

/**
 * ================================================================
 * AI Web App 模板初始化工具 (增強版)
 * AI Web App Template Initialization Tool (Enhanced)
 * ================================================================
 *
 * 版本: 5.1.0
 * 新增功能:
 * - 完整的錯誤處理機制
 * - 詳細的進度指示器
 * - 失敗自動回滾功能
 * - 操作日誌記錄
 *
 * 【使用方式】
 * node init-project-enhanced.js
 */

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const crypto = require('crypto');

// =====================================================
// 全局狀態管理
// =====================================================

const state = {
  projectPath: null,
  createdFiles: [],
  createdDirs: [],
  installedPackages: false,
  databaseInitialized: false,
  startTime: null,
  logFile: null,
};

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
  { name: '認證系統 (JWT + Azure AD SSO)', value: 'auth', checked: true },
  { name: 'API Gateway (10個企業級中間件)', value: 'api-gateway', checked: true },
  { name: '知識庫系統 (向量搜索 + 版本控制)', value: 'knowledge', checked: false },
  { name: 'AI 整合 (Azure OpenAI 封裝)', value: 'ai', checked: false },
  { name: '工作流程引擎 (12狀態 + 6種設計模式)', value: 'workflow', checked: false },
  { name: '通知系統 (多渠道通知)', value: 'notifications', checked: false },
  { name: '模板管理 (CRUD + PDF導出)', value: 'templates', checked: false },
  { name: 'Dynamics 365 整合', value: 'dynamics365', checked: false },
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
// 錯誤處理類
// =====================================================

class InitializationError extends Error {
  constructor(message, step, details = null) {
    super(message);
    this.name = 'InitializationError';
    this.step = step;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// =====================================================
// 日誌系統
// =====================================================

function initializeLogging(projectName) {
  const logDir = path.join(process.cwd(), 'logs');
  fs.ensureDirSync(logDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  state.logFile = path.join(logDir, `init-${projectName}-${timestamp}.log`);

  log('INFO', '初始化日誌系統');
  log('INFO', `日誌文件: ${state.logFile}`);
}

function log(level, message, details = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    details,
  };

  const logLine = `[${timestamp}] [${level}] ${message}${details ? '\n' + JSON.stringify(details, null, 2) : ''}\n`;

  if (state.logFile) {
    try {
      fs.appendFileSync(state.logFile, logLine);
    } catch (error) {
      console.error(chalk.red(`日誌寫入失敗: ${error.message}`));
    }
  }

  // 同時輸出到控制台（DEBUG 級別除外）
  if (level !== 'DEBUG') {
    const colorMap = {
      INFO: chalk.blue,
      WARN: chalk.yellow,
      ERROR: chalk.red,
      SUCCESS: chalk.green,
    };
    const colorFn = colorMap[level] || chalk.white;
    console.log(colorFn(`[${level}] ${message}`));
  }
}

// =====================================================
// 回滾機制
// =====================================================

async function rollbackChanges() {
  console.log(chalk.yellow('\n⚠️  正在回滾更改...\n'));
  log('WARN', '開始回滾操作');

  const rollbackSpinner = ora('正在清理已創建的文件和目錄...').start();

  try {
    // 1. 刪除創建的文件
    for (const file of state.createdFiles.reverse()) {
      if (await fs.pathExists(file)) {
        await fs.remove(file);
        log('DEBUG', `刪除文件: ${file}`);
      }
    }

    // 2. 刪除創建的目錄
    for (const dir of state.createdDirs.reverse()) {
      if (await fs.pathExists(dir)) {
        const isEmpty = (await fs.readdir(dir)).length === 0;
        if (isEmpty) {
          await fs.remove(dir);
          log('DEBUG', `刪除目錄: ${dir}`);
        }
      }
    }

    // 3. 如果項目目錄存在且為空，刪除它
    if (state.projectPath && await fs.pathExists(state.projectPath)) {
      const files = await fs.readdir(state.projectPath);
      if (files.length === 0) {
        await fs.remove(state.projectPath);
        log('INFO', `刪除空項目目錄: ${state.projectPath}`);
      }
    }

    rollbackSpinner.succeed('回滾完成');
    log('SUCCESS', '回滾操作成功完成');
  } catch (error) {
    rollbackSpinner.fail('回滾過程中發生錯誤');
    log('ERROR', '回滾失敗', { error: error.message });
    console.error(chalk.red(`回滾錯誤: ${error.message}`));
  }
}

// =====================================================
// 增強的文件操作
// =====================================================

async function safeEnsureDir(dirPath) {
  try {
    if (!await fs.pathExists(dirPath)) {
      await fs.ensureDir(dirPath);
      state.createdDirs.push(dirPath);
      log('DEBUG', `創建目錄: ${dirPath}`);
    }
    return true;
  } catch (error) {
    throw new InitializationError(
      `無法創建目錄: ${dirPath}`,
      'directory_creation',
      { path: dirPath, error: error.message }
    );
  }
}

async function safeCopyFile(source, dest) {
  try {
    if (!await fs.pathExists(source)) {
      throw new Error(`源文件不存在: ${source}`);
    }

    await fs.ensureDir(path.dirname(dest));
    await fs.copy(source, dest);
    state.createdFiles.push(dest);
    log('DEBUG', `複製文件: ${source} → ${dest}`);
    return true;
  } catch (error) {
    throw new InitializationError(
      `無法複製文件: ${path.basename(source)}`,
      'file_copy',
      { source, dest, error: error.message }
    );
  }
}

async function safeWriteFile(filePath, content) {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    state.createdFiles.push(filePath);
    log('DEBUG', `寫入文件: ${filePath}`);
    return true;
  } catch (error) {
    throw new InitializationError(
      `無法寫入文件: ${path.basename(filePath)}`,
      'file_write',
      { path: filePath, error: error.message }
    );
  }
}

// =====================================================
// 增強的命令執行
// =====================================================

function safeExecSync(command, options = {}) {
  const step = options.step || 'command_execution';
  const description = options.description || command;

  try {
    log('INFO', `執行命令: ${description}`);
    const result = execSync(command, {
      ...options,
      encoding: 'utf-8',
    });
    log('SUCCESS', `命令執行成功: ${description}`);
    return result;
  } catch (error) {
    throw new InitializationError(
      `命令執行失敗: ${description}`,
      step,
      {
        command,
        exitCode: error.status,
        stderr: error.stderr?.toString(),
        stdout: error.stdout?.toString(),
      }
    );
  }
}

// =====================================================
// 主函數（增強版）
// =====================================================

async function main() {
  console.clear();
  printBanner();

  state.startTime = Date.now();

  try {
    // 1. 基本信息
    const projectInfo = await getProjectInfo();
    initializeLogging(projectInfo.name);

    state.projectPath = path.join(process.cwd(), projectInfo.name);

    // 2. 檢查項目目錄是否已存在
    if (await fs.pathExists(state.projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目錄 ${projectInfo.name} 已存在，是否覆蓋？`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('\n初始化已取消'));
        process.exit(0);
      } else {
        await fs.remove(state.projectPath);
        log('WARN', `刪除現有項目目錄: ${state.projectPath}`);
      }
    }

    // 3. 創建項目目錄
    await safeEnsureDir(state.projectPath);
    process.chdir(state.projectPath);
    log('INFO', `切換到項目目錄: ${state.projectPath}`);

    // 4. 數據庫配置
    const databaseConfig = await getDatabaseConfig();

    // 5. 模組選擇
    const selectedModules = await getModuleSelection();

    // 6. 監控配置
    const monitoringConfig = await getMonitoringConfig(selectedModules);

    // 7. 環境變數配置
    const envConfig = await getEnvironmentConfig(databaseConfig, selectedModules);

    // 8. 示例數據選擇
    const dataOptions = await getDataOptions();

    // 9. 確認配置
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
      await fs.remove(state.projectPath);
      process.exit(0);
    }

    // 10. 開始初始化
    await initializeProject({
      projectInfo,
      databaseConfig,
      selectedModules,
      monitoringConfig,
      envConfig,
      dataOptions,
    });

    // 11. 顯示完成信息
    printCompletionInfo(projectInfo, databaseConfig);

    const duration = ((Date.now() - state.startTime) / 1000).toFixed(2);
    log('SUCCESS', `初始化完成，耗時 ${duration} 秒`);

  } catch (error) {
    console.error(chalk.red('\n\n❌ 初始化失敗\n'));

    if (error instanceof InitializationError) {
      console.error(chalk.red(`錯誤步驟: ${error.step}`));
      console.error(chalk.red(`錯誤信息: ${error.message}`));

      if (error.details) {
        console.error(chalk.gray('\n詳細信息:'));
        console.error(chalk.gray(JSON.stringify(error.details, null, 2)));
      }

      log('ERROR', error.message, {
        step: error.step,
        details: error.details,
      });
    } else {
      console.error(chalk.red(error.message));
      log('ERROR', error.message, { stack: error.stack });
    }

    // 詢問是否回滾
    const { shouldRollback } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldRollback',
        message: '是否回滾所有更改？',
        default: true,
      },
    ]);

    if (shouldRollback) {
      await rollbackChanges();
    } else {
      log('WARN', '用戶選擇不回滾更改');
      console.log(chalk.yellow('\n保留部分完成的項目文件'));
      console.log(chalk.gray(`項目路徑: ${state.projectPath}`));
    }

    if (state.logFile) {
      console.log(chalk.gray(`\n詳細日誌: ${state.logFile}`));
    }

    process.exit(1);
  }
}

// =====================================================
// 互動式問題函數（與原版相同）
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
  log('INFO', '收集項目基本信息', answers);
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

    const { host, port, database: dbName, username, password } = dbAnswers;
    connectionInfo = {
      url: `${database}://${username}:${password}@${host}:${port}/${dbName}`,
    };
  }

  console.log(chalk.green(`\n✅ 將使用 ${database.toUpperCase()} 數據庫`));
  log('INFO', '數據庫配置完成', { type: database });

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
  log('INFO', '模組選擇完成', { count: modules.length, modules });
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
  log('INFO', '監控配置完成', { backend });

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
  log('INFO', '環境變數配置完成');

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

  log('INFO', '示例數據選項', answers);
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
// 初始化執行函數（增強版）
// =====================================================

async function initializeProject(config) {
  console.log(chalk.blue.bold('\n🚀 開始初始化項目...\n'));
  log('INFO', '開始項目初始化');

  const totalSteps = 10;
  let currentStep = 0;

  const progress = (step, total) => {
    const percentage = Math.round((step / total) * 100);
    const filled = Math.round(percentage / 2);
    const empty = 50 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}] ${percentage}%`;
  };

  try {
    // 步驟 1: 複製 Prisma Schema
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await copyPrismaSchema(config.databaseConfig.type);

    // 步驟 2: 生成配置文件
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await generateConfigFiles(config);

    // 步驟 3: 生成環境變數文件
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await generateEnvFile(config.envConfig);

    // 步驟 4: 複製模組文件
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await copyModules(config.selectedModules);

    // 步驟 5: 生成 package.json
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await generatePackageJson(config);

    // 步驟 6: 安裝依賴
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await installDependencies();

    // 步驟 7: 初始化數據庫
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await initializeDatabase(config.databaseConfig.type);

    // 步驟 8: 生成示例數據
    if (config.dataOptions.seedData) {
      currentStep++;
      console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
      await generateSeedData(config.databaseConfig.type);
    }

    // 步驟 9: 生成示例日誌
    if (config.dataOptions.sampleLogs) {
      currentStep++;
      console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
      await generateSampleLogs();
    }

    // 步驟 10: 清理模板文件
    currentStep++;
    console.log(chalk.cyan(`\n[${currentStep}/${totalSteps}] ${progress(currentStep, totalSteps)}`));
    await cleanupTemplateFiles();

    console.log(chalk.green(`\n[${totalSteps}/${totalSteps}] ${progress(totalSteps, totalSteps)}`));
    log('SUCCESS', '項目初始化完成');

  } catch (error) {
    log('ERROR', '項目初始化失敗', { step: currentStep, error: error.message });
    throw error;
  }
}

// 步驟實現函數（增強錯誤處理）

async function copyPrismaSchema(databaseType) {
  const spinner = ora('正在配置 Prisma Schema...').start();

  try {
    const schemaSource = path.join(__dirname, '01-base', 'prisma', `schema.${databaseType}.prisma`);
    const schemaDest = path.join(process.cwd(), 'prisma', 'schema.prisma');

    if (!await fs.pathExists(schemaSource)) {
      throw new Error(`Schema 模板不存在: schema.${databaseType}.prisma`);
    }

    await safeEnsureDir(path.dirname(schemaDest));
    await safeCopyFile(schemaSource, schemaDest);

    spinner.succeed('Prisma Schema 已配置');
  } catch (error) {
    spinner.fail('Prisma Schema 配置失敗');
    throw new InitializationError(
      '無法配置 Prisma Schema',
      'prisma_schema',
      { databaseType, error: error.message }
    );
  }
}

async function generateConfigFiles(config) {
  const spinner = ora('正在生成配置文件...').start();

  try {
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

        content = replacePlaceholders(content, {
          PROJECT_NAME: config.projectInfo.name,
          DATABASE_TYPE: config.databaseConfig.type,
        });

        await safeWriteFile(dest, content);
      } else {
        log('WARN', `配置模板文件不存在: ${file}.template`);
      }
    }

    spinner.succeed(`配置文件已生成 (${configFiles.length} 個文件)`);
  } catch (error) {
    spinner.fail('配置文件生成失敗');
    throw new InitializationError(
      '無法生成配置文件',
      'config_files',
      { error: error.message }
    );
  }
}

async function generateEnvFile(envConfig) {
  const spinner = ora('正在生成環境變數文件...').start();

  try {
    const envContent = Object.entries(envConfig)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    await safeWriteFile('.env.local', envContent);

    spinner.succeed(`環境變數文件已生成 (${Object.keys(envConfig).length} 個變數)`);
  } catch (error) {
    spinner.fail('環境變數文件生成失敗');
    throw new InitializationError(
      '無法生成環境變數文件',
      'env_file',
      { error: error.message }
    );
  }
}

async function copyModules(selectedModules) {
  const spinner = ora('正在複製功能模組...').start();

  try {
    for (const module of selectedModules) {
      const source = path.join(__dirname, '02-modules', module);
      const dest = process.cwd();

      if (!await fs.pathExists(source)) {
        log('WARN', `模組不存在: ${module}`);
        continue;
      }

      await fs.copy(source, dest, { overwrite: true });
      log('INFO', `已複製模組: ${module}`);
    }

    spinner.succeed(`已複製 ${selectedModules.length} 個功能模組`);
  } catch (error) {
    spinner.fail('功能模組複製失敗');
    throw new InitializationError(
      '無法複製功能模組',
      'copy_modules',
      { error: error.message }
    );
  }
}

async function generatePackageJson(config) {
  const spinner = ora('正在生成 package.json...').start();

  try {
    const templatePath = path.join(__dirname, '01-base', 'package.json.template');

    if (!await fs.pathExists(templatePath)) {
      throw new Error('package.json.template 不存在');
    }

    let packageJson = await fs.readJson(templatePath);

    packageJson.name = config.projectInfo.name;
    packageJson.description = config.projectInfo.description;
    packageJson.author = config.projectInfo.author;

    await safeWriteFile('package.json', JSON.stringify(packageJson, null, 2));

    spinner.succeed('package.json 已生成');
  } catch (error) {
    spinner.fail('package.json 生成失敗');
    throw new InitializationError(
      '無法生成 package.json',
      'package_json',
      { error: error.message }
    );
  }
}

async function installDependencies() {
  const spinner = ora('正在安裝依賴 (這可能需要 2-5 分鐘)...').start();

  try {
    safeExecSync('npm install', {
      stdio: 'pipe',
      step: 'npm_install',
      description: '安裝 npm 依賴',
    });

    state.installedPackages = true;
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
    safeExecSync('npx prisma generate', {
      stdio: 'pipe',
      step: 'prisma_generate',
      description: '生成 Prisma Client',
    });

    // 運行遷移
    if (databaseType !== 'mongodb') {
      safeExecSync('npx prisma migrate dev --name init', {
        stdio: 'pipe',
        step: 'prisma_migrate',
        description: '運行數據庫遷移',
      });
    } else {
      safeExecSync('npx prisma db push', {
        stdio: 'pipe',
        step: 'prisma_push',
        description: '推送數據庫 Schema',
      });
    }

    state.databaseInitialized = true;
    spinner.succeed('數據庫初始化完成');
  } catch (error) {
    spinner.fail('數據庫初始化失敗');
    throw error;
  }
}

async function generateSeedData(databaseType) {
  const spinner = ora('正在生成示例數據...').start();

  try {
    safeExecSync('npx prisma db seed', {
      stdio: 'pipe',
      step: 'seed_data',
      description: '生成示例數據',
    });

    spinner.succeed('示例數據已生成');
  } catch (error) {
    spinner.warn('示例數據生成失敗 (可以稍後手動添加)');
    log('WARN', '示例數據生成失敗，但繼續執行', { error: error.message });
  }
}

async function generateSampleLogs() {
  const spinner = ora('正在生成示例日誌...').start();

  try {
    const sampleLogsPath = path.join(__dirname, 'examples', 'sample-logs');

    if (await fs.pathExists(sampleLogsPath)) {
      await fs.copy(sampleLogsPath, process.cwd(), { overwrite: false });
      spinner.succeed('示例日誌已生成');
    } else {
      spinner.warn('示例日誌路徑不存在');
    }
  } catch (error) {
    spinner.warn('示例日誌生成失敗');
    log('WARN', '示例日誌生成失敗，但繼續執行', { error: error.message });
  }
}

async function cleanupTemplateFiles() {
  const spinner = ora('正在清理模板文件...').start();

  try {
    const files = await fs.readdir(process.cwd());
    let cleanedCount = 0;

    for (const file of files) {
      if (file.endsWith('.template')) {
        await fs.remove(file);
        cleanedCount++;
      }
    }

    spinner.succeed(`模板文件已清理 (${cleanedCount} 個文件)`);
  } catch (error) {
    spinner.warn('模板文件清理失敗');
    log('WARN', '模板文件清理失敗，但不影響項目運行', { error: error.message });
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
║   🚀  AI Web App 模板初始化工具 (增強版)                   ║
║                                                           ║
║   版本: 5.1.0                                             ║
║   新增: 錯誤處理 + 進度指示 + 自動回滾                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `));
}

function printCompletionInfo(projectInfo, databaseConfig) {
  console.log(chalk.green.bold('\n\n🎉 項目初始化完成！\n'));

  console.log(chalk.white('📁 項目結構:'));
  console.log(`  ${projectInfo.name}/`);
  console.log('  ├── app/                    # Next.js 應用');
  console.log('  ├── components/             # React 組件');
  console.log('  ├── lib/                    # 工具函數');
  console.log('  ├── prisma/                 # 數據庫模型');
  console.log('  ├── .env.local              # 環境變數');
  console.log('  └── ...\n');

  console.log(chalk.white('🚀 快速開始:\n'));
  console.log(chalk.cyan('  1. 進入項目目錄:'));
  console.log(`     cd ${projectInfo.name}\n`);
  console.log(chalk.cyan('  2. 啟動開發服務器:'));
  console.log('     npm run dev\n');
  console.log(chalk.cyan('  3. 訪問應用:'));
  console.log('     http://localhost:3000\n');

  console.log(chalk.white('📖 文檔:\n'));
  console.log('  - AI 助手指南: AI-ASSISTANT-GUIDE.md');
  console.log('  - 項目索引: PROJECT-INDEX.md');
  console.log('  - 部署指南: DEPLOYMENT-GUIDE.md\n');

  console.log(chalk.white('💡 提示:\n'));
  console.log('  - 運行測試: npm test');
  console.log('  - 健康檢查: npm run health-check\n');

  if (state.logFile) {
    console.log(chalk.gray(`📋 初始化日誌: ${state.logFile}\n`));
  }

  console.log(chalk.gray('需要幫助？查看 README.md\n'));
}

// =====================================================
// 執行主函數
// =====================================================

main().catch(async (error) => {
  console.error(chalk.red('\n❌ 發生未預期的嚴重錯誤'));
  console.error(chalk.red(error.message));

  if (error.stack) {
    log('ERROR', '未捕獲的錯誤', { stack: error.stack });
  }

  // 嘗試回滾
  try {
    await rollbackChanges();
  } catch (rollbackError) {
    console.error(chalk.red('回滾失敗:', rollbackError.message));
  }

  process.exit(1);
});
