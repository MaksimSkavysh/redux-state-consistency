export declare class stateConsistencyError extends Error {
    private errors;
    constructor(props: {
        message: string;
        errors: any[];
        [key: string]: any;
    });
    toString(): string;
}
export declare const logErrors: (message: string, errors: any[]) => void;
