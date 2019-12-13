"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var T = require("runtypes");
var errors_1 = require("./errors");
var LEVELS = { error: 'error', throw: 'throw' };
var levelsType = T.Union(T.Literal(LEVELS.error), T.Literal(LEVELS.throw));
var validatorFunctions = new Map();
var lastId = (new Date()).valueOf();
exports.registerStoreConsistencyValidator = function (validator) {
    validator = T.Function.check(validator);
    lastId = lastId + 1;
    validatorFunctions.set(lastId, validator);
    return lastId;
};
exports.deleteStoreConsistencyValidator = function (validatorId) {
    return validatorFunctions.delete(validatorId);
};
var checkStateConsistencyCreator = function (params) { return function (state, action) {
    var level = params.level;
    var errors = Array.from(validatorFunctions.values())
        .map(function (validator) { return validator(state, action); })
        .filter(function (error) { return error !== true || (!!error && typeof error === "string"); });
    if (errors.length > 0) {
        var message = "State consistency error, last action: " + action.type;
        errors_1.logErrors(message, errors);
        if (level === LEVELS.throw) {
            throw new errors_1.stateConsistencyError({ message: message, errors: errors });
        }
    }
}; };
exports.stateConsistencyMiddleware = function (level) {
    if (level === void 0) { level = LEVELS.error; }
    level = levelsType.check(level);
    // debounce =  T.Number.withConstraint(n => n >= 0 || "debounce should be not negative integer").check(debounce)
    var checkStateConsistency = checkStateConsistencyCreator({ level: level });
    return function (_a) {
        var getState = _a.getState;
        return function (next) { return function (action) {
            if (T.Function.guard(action)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTZCO0FBRTdCLG1DQUEyRDtBQUczRCxJQUFNLE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFBO0FBR2pELElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtBQUU1RSxJQUFNLGtCQUFrQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFcEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEIsUUFBQSxpQ0FBaUMsR0FBRyxVQUFDLFNBQXNCO0lBQ3BFLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN2QyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQTtJQUNuQixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBQ3pDLE9BQU8sTUFBTSxDQUFBO0FBQ2pCLENBQUMsQ0FBQTtBQUVZLFFBQUEsK0JBQStCLEdBQUcsVUFBQyxXQUFvQjtJQUNoRSxPQUFPLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNqRCxDQUFDLENBQUE7QUFFRCxJQUFNLDRCQUE0QixHQUFHLFVBQUMsTUFBMEIsSUFBa0IsT0FBQSxVQUFDLEtBQUssRUFBRSxNQUFNO0lBQ3BGLElBQUEsb0JBQUssQ0FBVztJQUN4QixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2pELEdBQUcsQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQXhCLENBQXdCLENBQUM7U0FDNUMsTUFBTSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLEVBQXhELENBQXdELENBQUMsQ0FBQTtJQUM5RSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLElBQU0sT0FBTyxHQUFHLDJDQUF5QyxNQUFNLENBQUMsSUFBTSxDQUFBO1FBQ3RFLGtCQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzFCLElBQUksS0FBSyxLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDeEIsTUFBTSxJQUFJLDhCQUFxQixDQUFDLEVBQUUsT0FBTyxTQUFBLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQyxDQUFBO1NBQ3ZEO0tBQ0o7QUFDTCxDQUFDLEVBWmlGLENBWWpGLENBQUE7QUFFWSxRQUFBLDBCQUEwQixHQUFHLFVBQUMsS0FBb0I7SUFBcEIsc0JBQUEsRUFBQSxRQUFRLE1BQU0sQ0FBQyxLQUFLO0lBQzNELEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQy9CLGdIQUFnSDtJQUNoSCxJQUFNLHFCQUFxQixHQUFHLDRCQUE0QixDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFBO0lBQ3JFLE9BQU8sVUFBQyxFQUFpQjtZQUFmLHNCQUFRO1FBQVksT0FBQSxVQUFDLElBQVMsSUFBSyxPQUFBLFVBQUMsTUFBaUI7WUFDM0QsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxvRkFBb0YsQ0FBQyxDQUFBO2dCQUNuRyxPQUFNO2FBQ1Q7WUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDM0IsSUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUE7WUFDeEIscUJBQXFCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQ3BDLE9BQU8sTUFBTSxDQUFBO1FBQ2pCLENBQUMsRUFUNEMsQ0FTNUM7SUFUNkIsQ0FTN0IsQ0FBQTtBQUNMLENBQUMsQ0FBQSJ9