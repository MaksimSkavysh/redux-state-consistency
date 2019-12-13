"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("runtypes");
var errors_1 = require("./errors");
var LEVELS = { error: 'error', throw: 'throw' };
var levelsType = t.Union(t.Literal(LEVELS.error), t.Literal(LEVELS.throw));
var logErrors = function (message, errors) {
    console.groupCollapsed && console.groupCollapsed(message);
    errors.forEach(function (error) { return console.error(error); });
    console.groupEnd && console.groupEnd();
};
var checkFunctions = new Map();
var lastId = (new Date()).valueOf();
exports.registerStoreConsistencyValidator = function (validator) {
    validator = t.Function.check(validator);
    lastId = lastId + 1;
    checkFunctions.set(lastId, validator);
    return lastId;
};
exports.deleteStoreConsistencyValidator = function (validatorId) {
    return checkFunctions.delete(validatorId);
};
exports.registerSomeStoreConsistencyValidators = function (validators) {
    return validators.map(exports.registerStoreConsistencyValidator);
};
exports.deleteSomeStoreConsistencyValidators = function (validators) {
    return validators.map(exports.deleteStoreConsistencyValidator);
};
var checkStateConsistencyCreator = function (params) { return function (state, action) {
    var level = params.level;
    var errors = Array.from(checkFunctions.values())
        .map(function (f) { return f(state, action); })
        .filter(function (error) { return error !== true || (!!error && typeof error === "string"); });
    if (errors.length > 0) {
        var message = "State consistency error, last action: " + action.type;
        if (level === LEVELS.throw) {
            console.log('throw');
            throw new errors_1.stateConsistencyError({ message: message, errors: errors });
        }
        else {
            logErrors(message, errors);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTZCO0FBRTdCLG1DQUE4QztBQUc5QyxJQUFNLE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFBO0FBSWpELElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtBQUU1RSxJQUFNLFNBQVMsR0FBRyxVQUFDLE9BQWUsRUFBRSxNQUFhO0lBQzdDLE9BQU8sQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6RCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFBO0lBQzdDLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQzFDLENBQUMsQ0FBQTtBQUVELElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFaEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEIsUUFBQSxpQ0FBaUMsR0FBRyxVQUFDLFNBQXNCO0lBQ3BFLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN2QyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQTtJQUNuQixjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUNyQyxPQUFPLE1B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