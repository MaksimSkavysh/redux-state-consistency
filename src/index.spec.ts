import {
    stateConsistencyMiddleware,
    registerStoreConsistencyValidator,
    deleteStoreConsistencyValidator,
} from './index'
import { createStore, combineReducers, applyMiddleware } from "redux"
import get = Reflect.get

const ADD_TODO = 'ADD_TODO'
const FAKE_ACTION = 'FAKE_ACTION'
const DELETE_TODO_BROKEN = 'DELETE_TODO_BROKEN'

const byId = (state = {}, action) => {
    const { type, ...rest } = action
    switch (type) {
        case ADD_TODO:
            return {
                ...state,
                [rest.id]: rest,
            }
        case DELETE_TODO_BROKEN:
            return state // there error
        case FAKE_ACTION:
            return state // there error
        default:
            return state
    }
}

const order = (state = [], action) => {
    const { type, id } = action
    switch (type) {
        case ADD_TODO:
            return state.concat(id)
        case DELETE_TODO_BROKEN:
            return state.filter(item => item !== id)
        case FAKE_ACTION:
            return state
        default:
            return state
    }
}

const store = createStore(
    combineReducers({ byId, order }),
    {},
    applyMiddleware(stateConsistencyMiddleware())
)

const idsConsistency = (state, action) => {
    const { byId, order } = state
    return order.every(id => !!byId[id])
        || `Broken state consistency for ${action.type}`
}

const { dispatch, getState } = store

const item1 = { text: 'Read the docs', id: 1 }
const item2 = { text: 'dogs', id: 2 }

test('Test initial store value', () => {
    expect(store.getState()).toEqual({
        byId: {},
        order: [],
    })
})


test('Test positive store validation scenarios', () => {
    const mockedValidator = jest.fn((state, action) => true)
    const validatorId = registerStoreConsistencyValidator(mockedValidator)
    const action1 = { type: ADD_TODO, ...item1 }
    const action2 = { type: ADD_TODO, ...item2 }
    dispatch(action1)
    const state1 = getState()
    dispatch(action2)
    const state2 = getState()

    expect(mockedValidator.mock.calls.length).toBe(2);
    expect(mockedValidator.mock.calls[0][0]).toBe(state1)
    expect(mockedValidator.mock.calls[1][0]).toBe(state2)

    expect(getState()).toEqual({
        byId: { [item1.id]: item1, [item2.id]: item2 },
        order: [ item1.id, item2.id ],
    })

    dispatch({ type: FAKE_ACTION })
    expect(mockedValidator.mock.calls.length).toBe(3);
    deleteStoreConsistencyValidator(validatorId)
    dispatch({ type: FAKE_ACTION })
    expect(mockedValidator.mock.calls.length).toBe(3); // should not be changed
})

