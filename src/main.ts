import * as t from 'runtypes'

import {stateConsistencyError} from './errors'

const LEVELS = { error: 'error', throw: 'throw' }

type actionType = { type: string, [key: string] : any }
type validatorFn = (state: any, action: actionType) => void
const levelsType = t.Union(t.Literal(LEVELS.error), t.Literal(LEVELS.throw))

const logErrors = (message: string, errors: any[]) => {
    console.groupCollapsed && console.groupCollapsed(message)
    errors.forEach(error => console.error(error))
    console.groupEnd && console.groupEnd()
}

const checkFunctions = new Map()

let lastId = (new Date()).valueOf()
export const registerStoreConsistencyValidator = (validator: validatorFn) => {
    validator = t.Function.check(validator)
    lastId = lastId + 1
    checkFunctions.set(lastId, validator)
    return lastId
}

export const deleteStoreConsistencyValidator = (validatorId : number) => {
    return checkFunctions.delete(validatorId)
}

export const registerSomeStoreConsistencyValidators = (validators: validatorFn[]) => {
    return validators.map(registerStoreConsistencyValidator)
}

export const deleteSomeStoreConsistencyValidators = (validators: number[]) => {
    return validators.map(deleteStoreConsistencyValidator)
}


const checkStateConsistencyCreator = (params : { level: string }): validatorFn => (state, action) => {
    const { level } = params
    const errors = Array.from(checkFunctions.values())
        .map((f) => f(state, action))
        .filter(error => error !== true || (!!error && typeof error === "string"))
    if (errors.length > 0) {
        const message = `State consistency error, last action: ${action.type}`
        if (level === LEVELS.throw) {
            console.log('throw')
            throw new stateConsistencyError({ message, errors })
        } else {
            logErrors(message, errors)
        }
    }
}

export const stateConsistencyMiddleware = ({ debounce = 0, level = LEVELS.error } = {}) => {
    level = levelsType.check(level)
    debounce =  t.Number.withConstraint(n => n >= 0 || "debounce should be not negative integer").check(debounce)
    const checkStateConsistency = checkStateConsistencyCreator({ level })
    return ({getState}) => next => action => {
        if (t.Function.guard(action)) {
            console.error("Action is function, please place stateConsistencyMiddleware after thunk middleware")
            return
        }
        const result = next(action)
        const state = getState()
        checkStateConsistency(state, action)
        return result
    }
}
