import { AnyAction } from "redux";
declare type validatorFn = (state: any, action: AnyAction) => void;
export declare const registerStoreConsistencyValidator: (validator: validatorFn) => number;
export declare const deleteStoreConsistencyValidator: (validatorId: number) => boolean;
export declare const stateConsistencyMiddleware: (level?: string) => ({ getState }: any) => (next: any) => (action: AnyAction) => any;
export {};
