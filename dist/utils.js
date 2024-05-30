import { readdirSync, statSync, renameSync, unlinkSync } from "fs";
import { join } from "path";
export function getAllSvgFiles(dir = process.cwd()) {
    const folders = [];
    // 递归遍历目录
    function traverseDir(currentDir) {
        const files = readdirSync(currentDir);
        const svgs = files.filter((file) => file.endsWith(".svg")).map((svgFile) => join(currentDir, svgFile));
        if (svgs.length > 0) {
            folders.push({
                path: currentDir,
                svgs: svgs,
            });
        }
        const ignoreNodeModules = !process.argv.includes("--node_modules");
        files.forEach((file) => {
            const filePath = join(currentDir, file);
            if (statSync(filePath).isDirectory() && (!ignoreNodeModules || filePath !== "node_modules")) {
                traverseDir(filePath);
            }
        });
    }
    traverseDir(dir);
    return folders;
}
export function renameFile(oldPath, newPath) {
    renameSync(oldPath, newPath);
}
export function deleteFile(filePath) {
    unlinkSync(filePath);
}
