declare type checkFn = (state: any, action: object) => void;
export declare const checkStoreConsistency: (checkers: checkFn[]) => void;
export declare const stateConsistencyMiddleware: (params: {
    debounce: number;
}) => ({ getState }: {
    getState: any;
}) => (next: any) => (action: any) => any;
export {};
