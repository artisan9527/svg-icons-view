const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');
const fse = require('fs-extra');

// 步骤1：删除当前目录下的 dist 文件夹
fs.rmSync('./dist', { recursive: true, force: true });

// 步骤2：执行 shell 命令 npm run compile
console.log('编译中...');
execSync('npm run compile', { stdio: 'inherit' });

// 步骤3：复制 src/web 到 dist
console.log('复制文件中...');
fse.copySync('./src/web', './dist/web');

// 步骤4：获取当前版本号
const packageJson = require('./package.json');
const currentVersion = packageJson.version;

// 步骤5：输入新的版本号并检查
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askForNewVersion = () => {
    rl.question(`当前版本号为：${currentVersion}，请输入新的版本号：`, (newVersion) => {
        if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
            console.log('版本号格式不正确，请重新输入！');
            askForNewVersion();
            return;
        }
        if (compareVersions(newVersion, currentVersion) <= 0) {
            console.log('新版本号必须大于当前版本号，请重新输入！');
            askForNewVersion();
            return;
        }

        // 步骤6：替换 package.json 中的 version 字段
        packageJson.version = newVersion;
        fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

        // 步骤7：运行 shell 命令 npm publish
        console.log('发布中...');
        try {
            execSync('npm publish', { stdio: 'inherit' });
            // 步骤8：发布成功
            console.log('发布成功');
        } catch (error) {
            console.error(`发布失败: ${error.message}`);
        } finally {
            rl.close();
        }
    });
};

// 比较版本号的函数
const compareVersions = (version1, version2) => {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        const num1 = v1[i] || 0;
        const num2 = v2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
};

// 开始询问新版本号
askForNewVersion();
