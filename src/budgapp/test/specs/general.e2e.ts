import { Navigation } from '../pageobjects/navigation';
import { cleanup } from '../shared';
import { expect } from 'chai';

describe('General', () => {
    beforeEach(async () => {
        await browser.reloadSession();
    });

    afterEach(async function() {
        await cleanup(this.currentTest);
    });

    it('should be able to set income', async () => {
        const nav = new Navigation();
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const incomePage = await nav.goToIncome();
        expect(await incomePage.getTargetIncome()).to.equal('Target $2000.00')
    });

    it('should be able to set Categories', async () => {
        const nav = new Navigation();
        const generalPage = await nav.goToGeneral();
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();
        expect(await category.getAmount()).to.equal('500.00');
    });
});