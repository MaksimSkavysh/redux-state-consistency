import * as t from 'runtypes'

const LEVELS = { error: 'error', throw: 'throw' }

type checkFn = (state: any, action: object) => void
const levelsType = t.Union(t.Literal(LEVELS.error), t.Literal(LEVELS.throw))

const checkFunctions = new Map()
let lastId = (new Date()).valueOf()

export const registerStoreConsistencyValidator = (checker: checkFn) => {
    checker = t.Function.check(checker)
    lastId = lastId + 1
    checkFunctions.set(lastId, checker)
    return lastId
}

export const deleteStoreConsistencyValidator = (validatorId : string | number) => {
    return checkFunctions.delete(validatorId)
}

const checkStateConsistencyCreator = ({ level = LEVELS.error } = {}): checkFn => (state, action) => {
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
