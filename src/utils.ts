import { readdirSync, statSync, renameSync, unlinkSync } from "fs";
import { join } from "path";

export interface Folder {
	path: string; // 文件夹路径
	svgs: string[]; // 当前文件夹内所有svg文件的路径
}

export function getAllSvgFiles(dir: string = process.cwd()): Folder[] {
	const folders: Folder[] = [];

	// 递归遍历目录
	function traverseDir(currentDir: string) {
		const files = readdirSync(currentDir);

		const svgs = files.filter((file) => file.endsWith(".svg")).map((svgFile) => join(currentDir, svgFile));

		if (svgs.length > 0) {
			folders.push({
				path: currentDir,
				svgs: svgs,
			});
		}

		files.forEach((file) => {
			const filePath = join(currentDir, file);
			if (statSync(filePath).isDirectory()) {
				traverseDir(filePath);
			}
		});
	}

	traverseDir(dir);

	return folders;
}

export function renameFile(oldPath: string, newPath: string): void {
	renameSync(oldPath, newPath);
}

export function deleteFile(filePath: string): void {
	unlinkSync(filePath);
}
