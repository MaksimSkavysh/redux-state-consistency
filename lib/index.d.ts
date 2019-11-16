declare type actionType = {
    type: string;
    [key: string]: any;
};
declare type validatorFn = (state: any, action: actionType) => void;
export declare const registerStoreConsistencyValidator: (validator: validatorFn) => number;
export declare const registerSomeStoreConsistencyValidators: (validators: validatorFn[]) => number[];
export declare const deleteStoreConsistencyValidator: (validatorId: string | number) => boolean;
export declare const stateConsistencyMiddleware: ({ debounce, level }?: {
    debounce?: number;
    level?: string;
}) => ({ getState }: {
    getState: any;
}) => (next: any) => (action: any) => any;
export {};
