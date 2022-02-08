/**
 * Masynco resolves new object or array.
 */
type MasyncoResult = any[]

/**
 * Returns a new iterable formed by applying a given function to each element of input iterable.
 *
 * @param iterable - Input Array or Object to process. Function returns array when input is array and object otherwise.
 * @param fn - Function that is called for every element of input iterable. It receives original `value` and `key` and returns new value that is inserted into output iterable.
 * @param limit - Optional limit function for concurrency control.
 * @returns Promise resolving new Object or Array.
 */
export default function masynco (iterable: Iterable<any> | Object, fn: (value: any, key: any) => any, limit?: any): Promise<MasyncoResult>
