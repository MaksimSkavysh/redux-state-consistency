"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("runtypes");
var errors_1 = require("./errors");
var utils_1 = require("./utils");
var LEVELS = { error: 'error', throw: 'throw' };
var levelsType = t.Union(t.Literal(LEVELS.error), t.Literal(LEVELS.throw));
var checkFunctions = new Map();
var lastId = (new Date()).valueOf();
exports.registerStoreConsistencyValidator = function (validator) {
    validator = t.Function.check(validator);
    lastId = lastId + 1;
    checkFunctions.set(lastId, validator);
    return lastId;
};
exports.registerSomeStoreConsistencyValidators = function (validators) {
    return validators.map(exports.registerStoreConsistencyValidator);
};
exports.deleteStoreConsistencyValidator = function (validatorId) {
    return checkFunctions.delete(validatorId);
};
var checkStateConsistencyCreator = function (params) { return function (state, action) {
    var level = params.level;
    var errors = Array.from(checkFunctions.values())
        .map(function (f) { return f(state, action); })
        .filter(function (error) { return !!error && typeof error === "string"; });
    if (errors.length > 0) {
        var message = "State consistency error, last action: " + action.type;
        if (level === LEVELS.throw) {
            console.log('throw');
            throw new errors_1.stateConsistencyError({ message: message, errors: errors });
        }
        else {
            utils_1.logErrors(message, errors);
        }
    }
}; };
exports.stateConsistencyMiddleware = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.debounce, debounce = _c === void 0 ? 0 : _c, _d = _b.level, level = _d === void 0 ? LEVELS.error : _d;
    level = levelsType.check(level);
    debounce = t.Number.withConstraint(function (n) { return n >= 0 || "debounce should be not negative integer"; }).check(debounce);
    var checkStateConsistency = checkStateConsistencyCreator({ level: level });
    return function (_a) {
        var getState = _a.getState;
        return function (next) { return function (action) {
            if (t.Function.guard(action)) {
                console.error("Action is function, please place stateConsistencyMiddleware after thunk middleware");
                return;
            }
            var result = next(action);
            var state = getState();
            checkStateConsistency(state, action);
            return result;
        }; };
    };
};
