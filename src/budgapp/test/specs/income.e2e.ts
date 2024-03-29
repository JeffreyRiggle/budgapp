import { Navigation } from '../pageobjects/navigation';
import { cleanup } from '../shared';
import { expect } from 'chai';

describe('Income', () => {
    beforeEach(async () => {
        await browser.reloadSession();
    });

    afterEach(async function() {
        await cleanup(this.currentTest);
    });

    it('should be able to add income', async () => {
        const nav = new Navigation();
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const incomePage = await nav.goToIncome();
        const addIncome = await incomePage.addIncome();
        await addIncome.addItem('500', 'Got paid');
        await addIncome.addItems();
        expect(await incomePage.getTotalIncome()).to.equal('Total earned $500.00');
    });

    it('should have income history', async () => {
        const nav = new Navigation();
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const incomePage = await nav.goToIncome();
        let addIncome = await incomePage.addIncome();
        await addIncome.addItem('2000', 'Got paid');
        await addIncome.addItems();

        addIncome = await incomePage.addIncome();
        await addIncome.addItemPreviousMonth('2000', 'Got paid');
        await addIncome.addItems();
        expect(await incomePage.getTotalIncome()).to.equal('Total earned $2000.00');
    });
});