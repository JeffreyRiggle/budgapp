declare module '@jeffriggle/ipc-bridge-client' {
    declare interface IClient {
        available: boolean;
        availableChanged: string;
        on(eventName: string, callback: (available: boolean) => void): void;
        removeListener(eventName: string, callback: (available: boolean) => void): void;
        sendMessage<TData, TResult>(eventName: string, data: TData): Promise<T>;
    }

    declare const client: IClient;
}

declare module '@budgapp/income' {
    declare class IncomeManager {
        addIncome(items: any): void;
        getMonthIncome(date: string | Date): any;
        getMonthRangeIncome(request: any): any[];
        fromSimpleObject(obj: any): void;
        toSimpleObject(): any
        expectedIncome: number;
    }
}

declare module '@budgapp/budget' {
    declare class CategoryManager {
        constructor(budgetManager: BudgetManager)
        addCategory(request: any): void;
        updateCategoriesFromItems(items: any[]): void;
        updateCategory(newCategories: any[]): void;
        getMonthCategories(date: string | Date | number): any[];
        getMonthCategory(request: any): any;
        fromSimpleObject(obj: any): void;
        toSimpleObject(): any
    }

    declare class BudgetManager {

    }
}