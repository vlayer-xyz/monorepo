export declare function mock<T extends object>(methodFilter: (method: string) => boolean, methodHandler: (method: string, args: object) => object): T;
