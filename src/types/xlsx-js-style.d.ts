declare module 'xlsx-js-style' {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    export const utils: any;
    export const writeFile: (wb: any, filename: string) => any;
    export const read: (data: any, opts?: any) => any;
    export const write: (wb: any, opts?: any) => any;
    export function book_new(): any;
    export function book_append_sheet(wb: any, ws: any, name: string): void;
    // Add other exports as needed
    const xlsx: any;
    export default xlsx;
}
