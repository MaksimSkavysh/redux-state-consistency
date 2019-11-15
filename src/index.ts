import * as t from 'runtypes'

type checkFn = (state: object, action: object) => void

const checkFunctions = []

export const checkStoreConsistency = (checkers: checkFn[]) => {
    checkFunctions.push(...checkers)
}

const checkStateConsistency : checkFn = (state, action) => {
    console.log('checkStateConsistency', action)
    const errors = checkFunctions.map((f) => f(state, action))
    console.error(errors)
}

export const stateConsistencyMiddleware = (params: { debounce: number }) => {
    return ({getState}) => next => action => {
        const result = next(action)
        const state = getState()
        checkStateConsistency(state, action)
        return result
    }
}
