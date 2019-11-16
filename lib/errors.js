"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stateConsistencyError = /** @class */ (function (_super) {
    __extends(stateConsistencyError, _super);
    function stateConsistencyError(props) {
        var _this = _super.call(this, props.message) || this;
        _this.errors = props.errors;
        return _this;
    }
    stateConsistencyError.prototype.toString = function () {
        return "State consistency error: " + this.message;
    };
    return stateConsistencyError;
}(Error));
exports.stateConsistencyError = stateConsistencyError;
