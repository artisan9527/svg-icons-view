// src/server.ts
import express from "express";
import cors from "cors"; // 导入 cors 中间件
import fs from "fs"; // 导入 fs 模块
import path from "path"; // 导入 path 模块
import { getAllSvgFiles, renameFile, deleteFile } from "./utils.js";
import { createServer } from "http";
import { exec } from "child_process";
const app = express();
app.use(express.json());
app.use(cors()); // 使用 cors 中间件
app.get("/svgs", (req, res) => {
    try {
        const folders = getAllSvgFiles();
        res.json(folders);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to get SVG files." });
    }
});
app.get("/svg/:folder/:file", (req, res) => {
    const { folder, file } = req.params;
    const filePath = path.resolve(process.cwd(), folder, file);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "SVG file not found." });
    }
    res.sendFile(filePath);
});
app.post("/rename", (req, res) => {
    const { oldPath, newPath } = req.body;
    if (!oldPath || !newPath) {
        return res.status(400).json({ error: "oldPath and newPath are required." });
    }
    try {
        renameFile(oldPath, newPath);
        res.json({ message: "File renamed successfully." });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to rename file." });
    }
});
app.delete("/delete", (req, res) => {
    const { filePath } = req.body;
    if (!filePath) {
        return res.status(400).json({ error: "filePath is required." });
    }
    try {
        deleteFile(filePath);
        res.json({ message: "File deleted successfully." });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete file." });
    }
});
// 添加一个路由处理器，用于处理根路径的 GET 请求，返回 HTML 文件的内容
app.get("/", (req, res) => {
    const currentFileUrl = new URL(import.meta.url);
    let webDirectory = path.join(path.dirname(currentFileUrl.pathname), "web");
    // 根据操作系统处理路径格式
    if (process.platform === "win32") {
        if (webDirectory.startsWith("\\")) {
            webDirectory = webDirectory.slice(1);
        }
    }
    const indexHtml = fs.readFileSync(path.join(webDirectory, "index.html"), "utf-8");
    const stylesCss = fs.readFileSync(path.join(webDirectory, "styles.css"), "utf-8");
    const scriptJs = fs.readFileSync(path.join(webDirectory, "script.js"), "utf-8");
    const modalJs = fs.readFileSync(path.join(webDirectory, "modal.js"), "utf-8");
    const mergedHtml = indexHtml
        .replace('<link rel="stylesheet" href="/styles.css" />', `<style>${stylesCss}</style>`)
        .replace('<script src="/script.js"></script>', `<script>${scriptJs}</script>`)
        .replace('<script src="/modal.js"></script>', `<script>${modalJs}</script>`);
    res.set("content-type", "text/html");
    res.send(mergedHtml);
});
// 定义退出接口
app.post("/exit", () => {
    process.exit(0);
});
const server = createServer(app);
function startServer() {
    server.listen(0, () => {
        const port = server.address().port;
        const url = `http://localhost:${port}`;
        exec(`start ${url}`, (error) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });
        console.log(`local website: ${url}`);
    });
}
export { startServer };
