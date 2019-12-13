import { AnyAction } from "redux";
declare type actionType = {
    type: string;
    [key: string]: any;
};
declare type validatorFn = (state: any, action: actionType) => void;
export declare const registerStoreConsistencyValidator: (validator: validatorFn) => number;
export declare const deleteStoreConsistencyValidator: (validatorId: number) => boolean;
export declare const registerSomeStoreConsistencyValidators: (validators: validatorFn[]) => number[];
export declare const deleteSomeStoreConsistencyValidators: (validators: number[]) => boolean[];
export declare const stateConsistencyMiddleware: ({ debounce, level }?: {
    debounce?: number | undefined;
    level?: string | undefined;
}) => ({ getState }: any) => (next: any) => (action: AnyAction) => any;
export {};
