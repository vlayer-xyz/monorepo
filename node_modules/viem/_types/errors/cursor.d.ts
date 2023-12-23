import { BaseError } from './base.js';
export type NegativeOffsetErrorType = NegativeOffsetError & {
    name: 'NegativeOffsetError';
};
export declare class NegativeOffsetError extends BaseError {
    name: string;
    constructor({ offset }: {
        offset: number;
    });
}
export type PositionOutOfBoundsErrorType = PositionOutOfBoundsError & {
    name: 'PositionOutOfBoundsError';
};
export declare class PositionOutOfBoundsError extends BaseError {
    name: string;
    constructor({ length, position }: {
        length: number;
        position: number;
    });
}
//# sourceMappingURL=cursor.d.ts.map