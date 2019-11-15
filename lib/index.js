"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("runtypes");
var checkFunctions = [];
exports.checkStoreConsistency = function (checkers) {
    checkers = t.Array(t.Function).check(checkers);
    checkFunctions.push.apply(checkFunctions, checkers);
};
var checkStateConsistency = function (state, action) {
    var errors = checkFunctions.map(function (f) { return f(state, action); });
};
exports.stateConsistencyMiddleware = function (params) {
    return function (_a) {
        var getState = _a.getState;
        return function (next) { return function (action) {
            var result = next(action);
            var state = getState();
            checkStateConsistency(state, action);
            return result;
        }; };
    };
};
