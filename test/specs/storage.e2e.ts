import { Navigation } from '../pageobjects/navigation';
import { cleanup } from '../shared';
import { PasswordView } from '../pageobjects/password';
import { expect } from 'chai';

describe('Storage', () => {
    beforeEach(async () => {
        await browser.reloadSession();
    });

    afterEach(async function() {
        await cleanup();
    });

    it('should handle simple saves', async () => {
        let nav = new Navigation();
        let generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();
        await generalPage.setStorageOptions();

        await browser.reloadSession();

        nav = new Navigation();
        generalPage = await nav.goToGeneral();
        expect(await generalPage.getIncome()).to.equal('2000.00');
    });

    it('should handle password protect', async () => {
        let nav = new Navigation();
        let generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();

        const storageView = await generalPage.setStorageOptions();
        await storageView.setPassword('pass');
        await storageView.apply();

        await browser.reloadSession();

        const passwordView = new PasswordView();
        nav = await passwordView.login('pass');
        generalPage = await nav.goToGeneral();
        expect(await generalPage.getIncome()).to.equal('2000.00');
    });
});