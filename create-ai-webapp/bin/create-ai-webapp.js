#!/usr/bin/env node

/**
 * ================================================================
 * create-ai-webapp - NPX Entry Point
 * ================================================================
 *
 * 使用方式:
 * npx create-ai-webapp my-new-app
 *
 * 功能:
 * 1. 解析命令行參數 (項目目錄名)
 * 2. 驗證目標目錄不存在
 * 3. 創建項目目錄
 * 4. 調用 CLI 引導用戶配置
 */

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { runCLI } = require('../lib/cli');

async function main() {
  console.clear();

  // 獲取目標目錄名
  const targetDirName = process.argv[2];

  if (!targetDirName) {
    console.error(chalk.red('\n❌ 錯誤: 請指定項目目錄名稱\n'));
    console.log(chalk.white('使用方式:'));
    console.log(chalk.cyan('  npx create-ai-webapp <project-name>\n'));
    console.log(chalk.white('範例:'));
    console.log(chalk.gray('  npx create-ai-webapp my-awesome-app'));
    console.log(chalk.gray('  npx create-ai-webapp sales-platform\n'));
    process.exit(1);
  }

  // 驗證項目名稱格式
  if (!/^[a-z0-9-]+$/.test(targetDirName)) {
    console.error(chalk.red('\n❌ 錯誤: 項目名稱只能包含小寫字母、數字和連字符\n'));
    console.log(chalk.white('有效範例:'));
    console.log(chalk.green('  ✓ my-app'));
    console.log(chalk.green('  ✓ sales-platform-2024'));
    console.log(chalk.green('  ✓ webapp123\n'));
    console.log(chalk.white('無效範例:'));
    console.log(chalk.red('  ✗ MyApp (包含大寫字母)'));
    console.log(chalk.red('  ✗ my_app (包含下劃線)'));
    console.log(chalk.red('  ✗ my app (包含空格)\n'));
    process.exit(1);
  }

  // 解析項目路徑 (絕對路徑)
  const projectPath = path.resolve(process.cwd(), targetDirName);

  // 檢查目錄是否已存在
  if (await fs.pathExists(projectPath)) {
    console.error(chalk.red(`\n❌ 錯誤: 目錄 "${targetDirName}" 已存在\n`));
    console.log(chalk.white('解決方案:'));
    console.log(chalk.gray('  1. 選擇不同的項目名稱'));
    console.log(chalk.gray(`  2. 刪除現有目錄: rm -rf ${targetDirName}`));
    console.log(chalk.gray(`  3. 重命名現有目錄: mv ${targetDirName} ${targetDirName}-old\n`));
    process.exit(1);
  }

  // 創建項目目錄
  console.log(chalk.blue(`\n📁 創建項目目錄: ${targetDirName}\n`));
  await fs.ensureDir(projectPath);

  // 獲取模板路徑 (NPM 包內的 template/ 目錄)
  const templatePath = path.join(__dirname, '../template');

  // 驗證模板路徑存在
  if (!await fs.pathExists(templatePath)) {
    console.error(chalk.red('\n❌ 錯誤: 模板文件未找到\n'));
    console.log(chalk.gray('這可能是安裝問題，請重試:\n'));
    console.log(chalk.cyan('  npm cache clean --force'));
    console.log(chalk.cyan('  npx create-ai-webapp@latest ' + targetDirName + '\n'));

    // 清理已創建的空目錄
    await fs.remove(projectPath);
    process.exit(1);
  }

  try {
    // 運行 CLI 互動流程
    await runCLI(templatePath, projectPath, targetDirName);

  } catch (error) {
    console.error(chalk.red('\n❌ 項目創建失敗\n'));
    console.error(error);

    // 清理失敗的項目目錄 (Windows 安全處理)
    console.log(chalk.yellow('\n🧹 清理失敗的項目目錄...\n'));
    try {
      // 等待文件句柄釋放
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fs.remove(projectPath);
      console.log(chalk.green('✓ 清理完成\n'));
    } catch (cleanupError) {
      console.error(chalk.yellow('⚠️  自動清理失敗，請手動刪除目錄:\n'));
      console.error(chalk.gray(`  rm -rf ${targetDirName}\n`));
    }

    process.exit(1);
  }
}

// 執行主函數
main().catch(error => {
  console.error(chalk.red('\n❌ 發生未預期的錯誤:\n'));
  console.error(error);
  process.exit(1);
});
