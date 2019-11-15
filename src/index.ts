import * as t from 'runtypes'

type checkFn = (state: any, action: object) => void

const checkFunctions: checkFn[] = []

export const checkStoreConsistency = (checkers: checkFn[]) => {
    checkers = t.Array(t.Function).check(checkers)
    checkFunctions.push(...checkers)
}

const checkStateConsistency : checkFn = (state, action) => {
    const errors = checkFunctions.map((f) => f(state, action))
}

export const stateConsistencyMiddleware = (params: { debounce: number }) => {
    return ({getState}) => next => action => {
        const result = next(action)
        const state = getState()
        checkStateConsistency(state, action)
        return result
    }
}
