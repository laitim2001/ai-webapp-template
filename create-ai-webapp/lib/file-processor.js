/**
 * ================================================================
 * File Processor - 文件處理核心
 * ================================================================
 *
 * 功能:
 * 1. 從模板目錄複製文件到項目目錄
 * 2. 處理 .template 文件 (替換占位符 + 移除後綴)
 * 3. 複製選中的模組
 * 4. 生成配置文件
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

/**
 * 主要文件複製函數
 * @param {string} templatePath - 模板目錄路徑
 * @param {string} projectPath - 項目目錄路徑
 * @param {object} config - 配置對象
 */
async function copyAllFiles(templatePath, projectPath, config) {
  // 1. 複製基礎文件 (01-base/)
  await copyBaseFiles(templatePath, projectPath, config);

  // 2. 複製選中的模組
  await copySelectedModules(templatePath, projectPath, config);

  // 3. 複製監控系統 (如果選中)
  if (config.selectedModules.includes('monitoring')) {
    await copyMonitoring(templatePath, projectPath, config);
  }

  // 4. 複製示例數據 (如果選中)
  if (config.dataOptions.seedData) {
    await copyExamples(templatePath, projectPath);
  }
}

/**
 * 複製基礎文件 (01-base/)
 */
async function copyBaseFiles(templatePath, projectPath, config) {
  const spinner = ora('正在複製基礎文件...').start();

  try {
    const baseSource = path.join(templatePath, '01-base');

    // 遞歸複製所有基礎文件
    await copyDirectory(baseSource, projectPath, config, (filePath) => {
      // 過濾掉不需要的文件
      const relativePath = path.relative(baseSource, filePath);

      // 跳過 node_modules
      if (relativePath.includes('node_modules')) return false;

      // 跳過 Prisma schema 文件 (由 copyPrismaSchema 專門處理)
      if (relativePath.includes('prisma') && path.basename(filePath).startsWith('schema.')) {
        return false;
      }

      return true;
    });

    spinner.succeed('基礎文件已複製');
  } catch (error) {
    spinner.fail('基礎文件複製失敗');
    throw error;
  }
}

/**
 * 複製選中的模組
 */
async function copySelectedModules(templatePath, projectPath, config) {
  if (config.selectedModules.length === 0) {
    console.log(chalk.gray('⏭️  未選擇任何模組，跳過模組複製\n'));
    return;
  }

  const spinner = ora(`正在複製 ${config.selectedModules.length} 個功能模組...`).start();

  try {
    for (const moduleName of config.selectedModules) {
      // 跳過特殊模組 (不是實際文件夾)
      if (moduleName === 'testing' || moduleName === 'ai-guide' || moduleName === 'monitoring') {
        continue;
      }

      const moduleSource = path.join(templatePath, '02-modules', moduleName);

      if (await fs.pathExists(moduleSource)) {
        await copyDirectory(moduleSource, projectPath, config);
      } else {
        console.warn(chalk.yellow(`⚠️  警告: 模組 ${moduleName} 不存在，已跳過`));
      }
    }

    spinner.succeed(`已複製 ${config.selectedModules.length} 個功能模組`);
  } catch (error) {
    spinner.fail('功能模組複製失敗');
    throw error;
  }
}

/**
 * 複製監控系統
 */
async function copyMonitoring(templatePath, projectPath, config) {
  const spinner = ora('正在配置監控系統...').start();

  try {
    const monitoringSource = path.join(templatePath, '00-monitoring');
    const monitoringDest = path.join(projectPath, '00-monitoring');

    await copyDirectory(monitoringSource, monitoringDest, config);

    // 也複製根目錄的 instrumentation.ts (如果存在)
    const instrumentationSource = path.join(monitoringSource, 'instrumentation.ts.template');
    if (await fs.pathExists(instrumentationSource)) {
      await processTemplateFile(
        instrumentationSource,
        path.join(projectPath, 'instrumentation.ts'),
        config
      );
    }

    spinner.succeed('監控系統已配置');
  } catch (error) {
    spinner.fail('監控系統配置失敗');
    throw error;
  }
}

/**
 * 複製示例數據
 */
async function copyExamples(templatePath, projectPath) {
  const spinner = ora('正在生成示例數據...').start();

  try {
    const examplesSource = path.join(templatePath, 'examples');

    if (await fs.pathExists(examplesSource)) {
      // 只複製 seed-data (不複製 sample-logs 到項目根目錄)
      const seedDataSource = path.join(examplesSource, 'seed-data');
      if (await fs.pathExists(seedDataSource)) {
        const seedDataDest = path.join(projectPath, 'prisma', 'seed-data');
        await fs.copy(seedDataSource, seedDataDest);
      }
    }

    spinner.succeed('示例數據已生成');
  } catch (error) {
    spinner.warn('示例數據生成失敗 (可以稍後手動添加)');
  }
}

/**
 * 遞歸複製目錄
 * @param {string} source - 源目錄
 * @param {string} dest - 目標目錄
 * @param {object} config - 配置對象
 * @param {function} filter - 過濾函數 (可選)
 */
async function copyDirectory(source, dest, config, filter = null) {
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);

    // 應用過濾器
    if (filter && !filter(sourcePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      // 遞歸複製子目錄
      await fs.ensureDir(destPath);
      await copyDirectory(sourcePath, destPath, config, filter);
    } else {
      // 處理文件
      if (entry.name.endsWith('.template')) {
        // 處理模板文件 (替換占位符 + 移除 .template 後綴)
        const finalDestPath = destPath.replace(/\.template$/, '');
        await processTemplateFile(sourcePath, finalDestPath, config);
      } else {
        // 直接複製非模板文件
        await fs.copy(sourcePath, destPath);
      }
    }
  }
}

/**
 * 處理模板文件
 * @param {string} sourcePath - 源文件路徑
 * @param {string} destPath - 目標文件路徑 (已移除 .template 後綴)
 * @param {object} config - 配置對象
 */
async function processTemplateFile(sourcePath, destPath, config) {
  // 讀取模板文件內容
  let content = await fs.readFile(sourcePath, 'utf-8');

  // 替換占位符
  content = replacePlaceholders(content, {
    PROJECT_NAME: config.projectInfo.name,
    PROJECT_DESCRIPTION: config.projectInfo.description,
    AUTHOR: config.projectInfo.author || '',
    DATABASE_TYPE: config.databaseConfig.type,
    DATABASE_URL: config.envConfig.DATABASE_URL || '',
    CREATION_DATE: new Date().toISOString().split('T')[0],
    NEXTAUTH_SECRET: config.envConfig.NEXTAUTH_SECRET || '',
    NEXTAUTH_URL: config.envConfig.NEXTAUTH_URL || 'http://localhost:3000',
    // 可以根據需要添加更多占位符
  });

  // 確保目標目錄存在
  await fs.ensureDir(path.dirname(destPath));

  // 寫入最終文件
  await fs.writeFile(destPath, content, 'utf-8');
}

/**
 * 替換占位符
 * @param {string} content - 文件內容
 * @param {object} replacements - 替換映射
 * @returns {string} - 替換後的內容
 */
function replacePlaceholders(content, replacements) {
  let result = content;

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
}

/**
 * 複製 Prisma Schema (特殊處理)
 * @param {string} templatePath - 模板路徑
 * @param {string} projectPath - 項目路徑
 * @param {string} databaseType - 數據庫類型
 */
async function copyPrismaSchema(templatePath, projectPath, databaseType) {
  const spinner = ora('正在配置 Prisma Schema...').start();

  try {
    const schemaSource = path.join(
      templatePath,
      '01-base',
      'prisma',
      `schema.${databaseType}.prisma`
    );
    const schemaDest = path.join(projectPath, 'prisma', 'schema.prisma');

    await fs.ensureDir(path.dirname(schemaDest));
    await fs.copy(schemaSource, schemaDest);

    spinner.succeed('Prisma Schema 已配置');
  } catch (error) {
    spinner.fail('Prisma Schema 配置失敗');
    throw error;
  }
}

module.exports = {
  copyAllFiles,
  copyBaseFiles,
  copySelectedModules,
  copyMonitoring,
  copyExamples,
  copyDirectory,
  processTemplateFile,
  replacePlaceholders,
  copyPrismaSchema,
};
