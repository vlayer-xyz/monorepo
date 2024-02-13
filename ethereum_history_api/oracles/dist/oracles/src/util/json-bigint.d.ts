export declare const stringify: {
    (value: any, replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number | undefined): string;
    (value: any, replacer?: (string | number)[] | null | undefined, space?: string | number | undefined): string;
}, parse: (text: string, reviver?: ((this: any, key: string, value: any) => any) | undefined) => any;
