import { General } from './general';
import { Income } from './income';
import { Budget } from './budget';
import { History } from './history';

export class Navigation {
    async goToGeneral(): General {
        const generalLink = await $('a[href="/"]');
        await generalLink.click();
        return new General();
    }

    async goToIncome(): Income {
        const incomeLink = await $('a[href="/income"');
        await incomeLink.click();
        return new Income();
    }

    async goToBudget(): Budget {
        const budgetLink = await $('a[href="/budget"');
        await budgetLink.click();
        return new Budget();
    }

    async goToHistory(): History {
        const historyLink = await $('a[href="/history"');
        await historyLink.click();
        return new History();
    }
}
