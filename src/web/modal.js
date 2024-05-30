class Modal {
    constructor() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.classList.add('modal-container');
        this.modalBackground = document.createElement('div');
        this.modalBackground.classList.add('modal-background');
        this.modalContainer.appendChild(this.modalBackground);
        this.modalContent = document.createElement('div');
        this.modalContent.classList.add('modal-content');
        this.modalContainer.appendChild(this.modalContent);

        document.body.appendChild(this.modalContainer);
    }

    // 显示提示框
    alert(message) {
        this.modalContent.innerHTML = `
            <div class="modal-header">
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">${message}</div>
            <div class="modal-footer">
                <button class="modal-btn">确定</button>
            </div>
        `;
        this.showModal();

        const closeButton = this.modalContent.querySelector('.modal-close');
        const okButton = this.modalContent.querySelector('.modal-btn');
        closeButton.addEventListener('click', () => {
            this.hideModal();
        });
        okButton.addEventListener('click', () => {
            this.hideModal();
        });
    }

    // 显示确认框
    confirm(message, callback) {
        this.modalContent.innerHTML = `
            <div class="modal-header">
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">${message}</div>
            <div class="modal-footer">
                <button class="modal-btn modal-cancel">取消</button>
                <button class="modal-btn modal-ok">确定</button>
            </div>
        `;
        this.showModal();

        const closeButton = this.modalContent.querySelector('.modal-close');
        const cancelButton = this.modalContent.querySelector('.modal-cancel');
        const okButton = this.modalContent.querySelector('.modal-ok');
        closeButton.addEventListener('click', () => {
            this.hideModal();
            callback(false);
        });
        cancelButton.addEventListener('click', () => {
            this.hideModal();
            callback(false);
        });
        okButton.addEventListener('click', () => {
            this.hideModal();
            callback(true);
        });
    }

    // 显示输入框
    prompt(message, defaultValue, callback) {
        this.modalContent.innerHTML = `
            <div class="modal-header">
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <input type="text" class="modal-input" value="${defaultValue}">
            </div>
            <div class="modal-footer">
                <button class="modal-btn modal-cancel">取消</button>
                <button class="modal-btn modal-ok">确定</button>
            </div>
        `;
        this.showModal();

        const closeButton = this.modalContent.querySelector('.modal-close');
        const cancelButton = this.modalContent.querySelector('.modal-cancel');
        const okButton = this.modalContent.querySelector('.modal-ok');
        const inputField = this.modalContent.querySelector('.modal-input');
        closeButton.addEventListener('click', () => {
            this.hideModal();
            callback(null);
        });
        cancelButton.addEventListener('click', () => {
            this.hideModal();
            callback(null);
        });
        okButton.addEventListener('click', () => {
            const value = inputField.value;
            this.hideModal();
            callback(value);
        });
    }

    // 显示弹窗
    showModal() {
        this.modalContainer.style.display = 'flex';
        this.modalContainer.style.opacity = '0';
        setTimeout(() => {
            this.modalContainer.style.opacity = '1';
        }, 0);

        const closeButton = this.modalContent.querySelector('.modal-close');
        if (closeButton) {
            closeButton.style.position = 'absolute';
            closeButton.style.top = '8px';
            closeButton.style.right = '16px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '24px';
        }

        const modalBody = this.modalContent.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.display = 'flex';
            modalBody.style.alignItems = 'center';
            modalBody.style.margin = '16px 0';
        }

        const inputField = this.modalContent.querySelector('.modal-input');
        if (inputField) {
            inputField.style.flex = '1';
            inputField.style.marginLeft = '8px';
        }

        const modalFooter = this.modalContent.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.style.display = 'flex';
            modalFooter.style.justifyContent = 'flex-end';
            modalFooter.style.gap = '8px';
        }

        document.body.style.overflow = 'hidden'; // 隐藏页面滚动条
    }

    // 隐藏弹窗
    hideModal() {
        this.modalContainer.style.opacity = '0';
        setTimeout(() => {
            this.modalContainer.style.display = 'none';
            document.body.style.overflow = ''; // 恢复页面滚动条
        }, 300);
    }
}

