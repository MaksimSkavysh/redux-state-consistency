import * as t from 'runtypes'

const LEVELS = { error: 'error', throw: 'throw' }

type validatorFn = (state: any, action: object) => void
const levelsType = t.Union(t.Literal(LEVELS.error), t.Literal(LEVELS.throw))

const checkFunctions = new Map()
let lastId = (new Date()).valueOf()

export const registerStoreConsistencyValidator = (validator: validatorFn) => {
    validator = t.Function.check(validator)
    lastId = lastId + 1
    checkFunctions.set(lastId, validator)
    return lastId
}

export const registerSomeStoreConsistencyValidators = (validators: validatorFn[]) => {
    return validators.map(registerStoreConsistencyValidator)
}

export const deleteStoreConsistencyValidator = (validatorId : string | number) => {
    return checkFunctions.delete(validatorId)
}

const checkStateConsistencyCreator = ({ level = LEVELS.error } = {}): validatorFn => (state, action) => {
    levelsType.check(level)
    const errors = Array.from(checkFunctions.values()).map((f) => f(state, action))
}

export const stateConsistencyMiddleware = ({ debounce = 0, level = LEVELS.error } = {}) => {
    const checkStateConsistency = checkStateConsistencyCreator({ level })
    return ({getState}) => next => action => {
        const result = next(action)
        const state = getState()
        checkStateConsistency(state, action)
        return result
    }
}
