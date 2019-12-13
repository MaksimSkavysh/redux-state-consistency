import * as T from 'runtypes'

import { logErrors, stateConsistencyError } from './errors'
import { AnyAction } from "redux"

const LEVELS = { error: 'error', throw: 'throw' }

type validatorFn = (state: any, action: AnyAction) => void
const levelsType = T.Union(T.Literal(LEVELS.error), T.Literal(LEVELS.throw))

const validatorFunctions = new Map()

let lastId = (new Date()).valueOf()
export const registerStoreConsistencyValidator = (validator: validatorFn) => {
    validator = T.Function.check(validator)
    lastId = lastId + 1
    validatorFunctions.set(lastId, validator)
    return lastId
}

export const deleteStoreConsistencyValidator = (validatorId : number) => {
    return validatorFunctions.delete(validatorId)
}

const checkStateConsistencyCreator = (params : { level: string }): validatorFn => (state, action) => {
    const { level } = params
    const errors = Array.from(validatorFunctions.values())
        .map((validator) => validator(state, action))
        .filter(error => error !== true || (!!error && typeof error === "string"))
    if (errors.length > 0) {
        const message = `State consistency error, last action: ${action.type}`
        logErrors(message, errors)
        if (level === LEVELS.throw) {
            throw new stateConsistencyError({ message, errors })
        }
    }
}

export const stateConsistencyMiddleware = (level = LEVELS.error) => {
    level = levelsType.check(level)
    // debounce =  T.Number.withConstraint(n => n >= 0 || "debounce should be not negative integer").check(debounce)
    const checkStateConsistency = checkStateConsistencyCreator({ level })
    return ({ getState }: any) => (next: any) => (action: AnyAction) => {
        if (T.Function.guard(action)) {
            console.error("Action is function, please place stateConsistencyMiddleware after thunk middleware")
            return
        }
        const result = next(action)
        const state = getState()
        checkStateConsistency(state, action)
        return result
    }
}
