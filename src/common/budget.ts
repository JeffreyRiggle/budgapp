export interface BudgetItem {
    /** The unique identifier for this transaction. */
    id?: number;
    /**
     * In the case that this value is a number
     * The amount would be in cents. This should be a proper integer.
     * 
     * In the case that this is a string
     * The amount should be one of the following
     * "xxx" or "xxx.x" or "xxx.xx"
     * */
    amount: number | string;
    /** The category name this item is associated to. */
    category: string;
    /** The date this transaction was made. */
    date: string | Date;
    /** Any information about this transaction. */
    detail?: string;
}