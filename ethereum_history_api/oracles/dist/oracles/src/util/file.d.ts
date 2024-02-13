export declare function writeObject(object: object, filePath: string): Promise<void>;
export declare function readObject<T>(filePath: string): Promise<T>;
export declare function withTempFile<T>(callback: (path: string) => Promise<T>): Promise<T>;
