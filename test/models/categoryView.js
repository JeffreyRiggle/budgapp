class CategoryView {
    constructor(client) {
        this.client = client;
    }

    async getTarget() {
        const target = await this.client.$('span[data-testid="category-target"]');
        return await target.getText();
    }

    async getTotal() {
        const total = await this.client.$('[data-testid="category-spend"]');
        return await total.getText();
    }
}

module.exports = {
    CategoryView
};
