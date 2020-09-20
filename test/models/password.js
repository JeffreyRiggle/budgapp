const { Navigation } = require("./navigation");

class PasswordView {
    constructor(client) {
        this.client = client;
    }

    async login(password) {
        const passwordInput = await this.client.$('.password-field');
        await passwordInput.setValue(password);

        const submit = await this.client.$('.submit-btn');
        await submit.click();
        return new Navigation(this.client);
    }
}

module.exports = {
    PasswordView
};
