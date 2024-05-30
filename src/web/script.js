// script.js

const modal = new Modal();

let isDarkMode = false;

let dataSource = [];

// 获取文件列表并渲染
async function fetchSvgFiles() {
    try {
        toggleLoading(true);
        const response = await fetch('/svgs');
        dataSource = await response.json();
        renderSvgFiles(dataSource);
        toggleLoading(false);
    } catch (error) {
        toggleLoading(false);
        showMessage('Failed to fetch SVG files', 'error');
        console.error('Failed to fetch SVG files:', error);
    }
}

function toggleLoading(show) {
    let loader = document.getElementById('loader');

    if (show) {
        if (!loader) {
            const loaderDiv = document.createElement('div');
            loaderDiv.id = 'loader';
            loaderDiv.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loaderDiv);
            loader = loaderDiv;
        }
        loader.style.display = 'block';
    } else {
        if (loader) {
            loader.style.display = 'none';
        }
    }
}



// 显示复制成功状态的函数
function showMessage(message, status = 'success') {
    const messageBox = document.createElement('div');
    messageBox.textContent = message;
    messageBox.style.position = 'fixed';
    messageBox.style.top = '20px';
    messageBox.style.left = '50%';
    messageBox.style.transform = 'translateX(-50%)';
    messageBox.style.padding = '8px 24px'; // 修改左右内边距为24px，上下内边距为8px
    messageBox.style.backgroundColor = '#ffffff';
    messageBox.style.border = '1px solid #ddd'; // 浅色边框
    messageBox.style.borderRadius = '4px'; // 圆角
    messageBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; // 浅色阴影

    // 根据状态设置字体颜色
    switch (status) {
        case 'success':
            messageBox.style.color = '#008000'; // 绿色
            break;
        case 'warning':
            messageBox.style.color = '#ff8c00'; // 橙色
            break;
        case 'error':
            messageBox.style.color = '#ff0000'; // 红色
            break;
        default:
            messageBox.style.color = '#000000'; // 默认为黑色
            break;
    }

    document.body.appendChild(messageBox);

    // 两秒后隐藏状态消息
    setTimeout(() => {
        messageBox.remove();
    }, 2000);
}

function showNoDataMessage(element) {
    const noDataDiv = document.createElement('div');
    noDataDiv.classList.add('no-data-message');

    const svgImage = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgImage.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgImage.setAttribute('width', '100');
    svgImage.setAttribute('height', '100');
    svgImage.setAttribute('viewBox', '0 0 24 24');
    svgImage.innerHTML = '<path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v2h-2zm0 4h2v6h-2z"/>';

    const messageText = document.createElement('p');
    messageText.textContent = '暂无数据';

    noDataDiv.appendChild(svgImage);
    noDataDiv.appendChild(messageText);

    element.innerHTML = '';
    element.appendChild(noDataDiv);
}



function createBubble() {
    // 创建气泡框
    const bubble = document.createElement('div');
    bubble.style.position = 'fixed';
    bubble.style.left = '-9999px';
    bubble.style.top = '-9999px';
    bubble.style.padding = '8px 0';
    bubble.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    bubble.style.backgroundColor = 'white';
    bubble.style.borderRadius = '4px';
    bubble.style.color = '#222222';

    // 创建选项的样式
    const optionStyle = `
        padding: 4px 24px;
        cursor: pointer;
        transition: background-color 0.3s;
    `;

    // 创建重命名选项
    const renameOption = document.createElement('div');
    renameOption.innerText = '重命名';
    renameOption.style.cssText = optionStyle;
    renameOption.style.marginBottom = '8px'; // 下外边距为8px

    // 创建删除选项
    const deleteOption = document.createElement('div');
    deleteOption.innerText = '删除';
    deleteOption.style.cssText = optionStyle;

    // 添加悬停效果
    renameOption.addEventListener('mouseover', () => {
        renameOption.style.backgroundColor = '#f0f0f0';
    });
    renameOption.addEventListener('mouseout', () => {
        renameOption.style.backgroundColor = 'white';
    });

    deleteOption.addEventListener('mouseover', () => {
        deleteOption.style.backgroundColor = '#f0f0f0';
    });
    deleteOption.addEventListener('mouseout', () => {
        deleteOption.style.backgroundColor = 'white';
    });

    // 将选项添加到气泡框中
    bubble.appendChild(renameOption);
    bubble.appendChild(deleteOption);

    // 将气泡框插入到 document.body 中
    document.body.appendChild(bubble);

    return {
        // 返回气泡框 DOM 元素
        element: bubble,
        // 设置气泡框位置的方法
        setPosition: function (x, y) {
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
        },
        // 设置重命名选项点击事件的方法
        onRename: function (callback) {
            renameOption.onclick = callback;
        },
        // 设置删除选项点击事件的方法
        onDelete: function (callback) {
            deleteOption.onclick = callback;
        }
    };
}

// 使用示例
const bubble = createBubble();

// 渲染文件列表
function renderSvgFiles(folders) {
    const app = document.getElementById('app');
    app.innerHTML = ''; // 清空现有内容
    if (!folders.length) {
        showNoDataMessage(document.body);
        return;
    }
    folders.forEach(folder => {
        const folderDiv = document.createElement('div');
        folderDiv.classList.add('folder');

        // 显示文件夹路径
        const folderTitle = document.createElement('div');
        folderTitle.classList.add('folderTitle');
        folderTitle.textContent = `文件夹：${folder.path}`;
        folderDiv.appendChild(folderTitle);

        // 渲染文件
        folder.svgs.forEach(svg => {
            const fileDiv = document.createElement('div');
            fileDiv.classList.add('file');
            if (isDarkMode) fileDiv.classList.add('dark');

            // 显示文件图片
            const img = document.createElement('img');
            img.src = `/svg/${encodeURIComponent(folder.path)}/${encodeURIComponent(svg)}`;
            img.height = 40;
            img.alt = 'SVG';
            fileDiv.appendChild(img);

            // 显示文件名
            const fileName = document.createElement('div');
            fileName.classList.add('fileName');
            fileName.textContent = svg.split(/[\\\/]/).pop().split('.')[0]; // 提取文件名
            fileDiv.appendChild(fileName);

            // 双击复制文件名
            fileDiv.addEventListener('dblclick', () => {
                navigator.clipboard.writeText(fileName.textContent);
                showMessage("复制成功"); // 显示复制成功状态
            });

            // 右键菜单
            fileDiv.addEventListener('contextmenu', (event) => {
                event.preventDefault();

                // 设置气泡框的位置
                bubble.setPosition(event.clientX, event.clientY);

                // 设置重命名操作
                bubble.onRename(() => {
                    renameFile(fileName.textContent, svg);
                    bubble.setPosition(-9999, -9999); // 隐藏气泡框
                });

                // 设置删除操作
                bubble.onDelete(() => {
                    deleteFile(svg);
                    bubble.setPosition(-9999, -9999); // 隐藏气泡框
                });

                // 隐藏其他可能存在的菜单
                document.addEventListener('click', (e) => {
                    if (!bubble.element.contains(e.target)) {
                        bubble.setPosition(-9999, -9999); // 隐藏气泡框
                    }
                }, { once: true });
            });


            folderDiv.appendChild(fileDiv);
        });

        app.appendChild(folderDiv);
    });
}

// 页面加载完成后获取文件列表并渲染
window.addEventListener('DOMContentLoaded', fetchSvgFiles);

// 重命名操作
function renameFile(fileName, svg) {
    modal.prompt('新文件名：', fileName, (newName) => {
        newName = newName ? newName.trim() : newName;
        if (newName) {
            const pathSegments = svg.split(/[\\\/]/); // 使用正则表达式匹配斜杠和反斜杠
            const fileName = pathSegments.pop(); // 获取文件名
            const separator = svg.includes('\\') ? '\\' : '/'; // 确定路径分隔符
            const newPath = pathSegments.join(separator) + separator + newName + '.svg'; // 拼接新的文件路径

            // 发送重命名请求
            fetch('/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPath: svg,
                    newPath: newPath
                })
            })
                .then(response => {
                    if (response.ok) {
                        fileName.textContent = newName;
                        showMessage("操作成功");
                        fetchSvgFiles(); // 重命名完成后刷新文件列表
                    } else {
                        showMessage("Failed to rename file.", "error");
                    }
                })
                .catch(error => {
                    showMessage(`Failed to rename file: ${error.message}`, "error");
                    console.error('Failed to rename file:', error);
                });
        } else {
            console.log(newName);
            if (newName !== null) showMessage("操作失败：新文件名为空", "warning");
        }
    });
}

// 删除操作
function deleteFile(svg) {
    modal.confirm('确认删除文件？', (confirmed) => {
        if (confirmed) {
            // 发送删除请求
            fetch('/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filePath: svg
                })
            })
                .then(response => {
                    if (response.ok) {
                        showMessage('文件删除成功', 'success');
                        fetchSvgFiles(); // 删除完成后刷新文件列表
                    } else {
                        showMessage('删除文件失败', 'error');
                    }
                })
                .catch(error => {
                    showMessage(`Failed to delete file: ${error.message}`, 'error');
                    console.error('Failed to delete file:', error);
                });
        }
    });
}


// 添加按钮到页面右上角
const toggleButton = document.createElement('button');
toggleButton.textContent = '切换主题';
toggleButton.style.position = 'absolute';
toggleButton.style.top = '20px';
toggleButton.style.right = '20px';
toggleButton.style.width = '100px';
toggleButton.style.height = '32px';
toggleButton.style.padding = '8px';
toggleButton.style.cursor = 'pointer';
toggleButton.style.backgroundColor = '#FFA500'; // 橙色
toggleButton.style.color = '#fff';
toggleButton.style.border = 'none';
toggleButton.style.borderRadius = '4px'; // 添加4像素圆角
document.body.appendChild(toggleButton);


// 切换背景颜色和字体颜色
toggleButton.addEventListener('click', () => {
    if (isDarkMode) {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
    } else {
        document.body.style.backgroundColor = '#222';
        document.body.style.color = '#f5f5f5';
    }
    isDarkMode = !isDarkMode;
    renderSvgFiles(dataSource);
});

// 添加提示
function addHelp() {
    const div = document.createElement('div');
    div.style.position = 'absolute'
    div.style.top = '30px';
    div.style.right = '180px';
    div.style.fontSize = '12px';
    div.style.color = '#999';
    div.style.letterSpacing = '2px';
    div.innerText = '操作说明：鼠标左键双击复制，鼠标右键单击呼出菜单';
    document.body.appendChild(div);
}

addHelp();

window.addEventListener('beforeunload', function () {
    // 向 "/exit" 接口发送 POST 请求
    fetch('/exit', {
        method: 'POST'
    }).then(response => {
        // 打印响应结果
        console.log(response);
    }).catch(error => {
        // 打印错误信息
        console.error('Error:', error);
    });
});