export class StorageView {
    async setPassword(password) {
        const passwordToggle = await $('[data-testid="local-file-password-checkbox"]');
        await passwordToggle.click();

        const passwordInput = await $('[data-testid="local-file-password-input"]');
        await passwordInput.setValue(password);

        const setPasswordButton = await $('[data-testid="local-file-set-password"]');
        await setPasswordButton.click();
        return this;
    }

    async apply() {
        const applyButton = await $('.apply-changes button');
        await applyButton.click();
        return this;
    }
}
