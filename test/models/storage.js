class StorageView {
    constructor(client) {
        this.client = client;
    }

    async setPassword(password) {
        const passwordToggle = await this.client.$('[data-testid="local-file-password-checkbox"]');
        await passwordToggle.click();

        const passwordInput = await this.client.$('[data-testid="local-file-password-input"]');
        await passwordInput.setValue(password);

        const setPasswordButton = await this.client.$('[data-testid="local-file-set-password"]');
        await setPasswordButton.click();
        return this;
    }

    async apply() {
        const applyButton = await this.client.$('.apply-changes button');
        await applyButton.click();
        return this;
    }
}

module.exports = {
    StorageView
};
