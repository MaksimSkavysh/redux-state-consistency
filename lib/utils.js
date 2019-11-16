"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrors = function (message, errors) {
    console.groupCollapsed && console.groupCollapsed(message);
    errors.forEach(function (error) { return console.error(error); });
    console.groupEnd && console.groupEnd();
};
