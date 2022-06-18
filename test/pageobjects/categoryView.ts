export class CategoryView {
    async getTarget() {
        const target = await $('span[data-testid="category-target"]');
        return await target.getText();
    }

    async getTotal() {
        const total = await $('[data-testid="category-spend"]');
        return await total.getText();
    }
}
