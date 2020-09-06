const { General } = require('./general');
const { Income } = require('./income');

class Navigation {
    constructor(client) {
        this.client = client;
    }

    async goToGeneral() {
        const generalLink = await this.client.$('a[href="/"]');
        await generalLink.click();
        return new General(this.client);
    }

    async goToIncome() {
        const incomeLink = await this.client.$('a[href="/income"');
        await incomeLink.click();
        return new Income(this.client);
    }
}

module.exports = {
    Navigation
};
