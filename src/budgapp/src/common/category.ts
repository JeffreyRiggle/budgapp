export interface Category {
    /** The name of this category. */
    name: string;
    /** The amount of money in cents (proper integer) allocated to this category. */
    allocated: number;
    /** If this category rolls over from month to month. */
    rollover: boolean;
}
