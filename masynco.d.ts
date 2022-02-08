/**
 * Returns a new Array formed by applying a given function to each element of input array.
 *
 * @param input - Input Array to process.
 * @param fn - Function `(value, index)` that is called for every element of input array. It returns new value that is inserted into output array.
 * @param limit - Optional limit function for concurrency control.
 * @returns Promise resolving new Array.
 */
export default function masynco (input: any[], fn: (value: any, key: any) => any, limit?: any): Promise<[]>;

/**
 * Returns a new Object formed by applying a given function to each element of input.
 *
 * @param input - Input Object to process.
 * @param fn - Function `(value, key)` that is called for every element of input object. It returns new value that is inserted into output object.
 * @param limit - Optional limit function for concurrency control.
 * @returns Promise resolving new Object.
 */
export default function masynco (input: any, fn: (value: any, key: any) => any, limit?: any): Promise<any>;
