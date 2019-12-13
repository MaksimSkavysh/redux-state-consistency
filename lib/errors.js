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
exports.logErrors = function (message, errors) {
    console.groupCollapsed && console.groupCollapsed(message);
    errors.forEach(function (error) { return console.error(error); });
    console.groupEnd && console.groupEnd();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtJQUEyQyx5Q0FBSztJQUc1QywrQkFBWSxLQUE0RDtRQUF4RSxZQUNJLGtCQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FFdkI7UUFERyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7O0lBQzlCLENBQUM7SUFFRCx3Q0FBUSxHQUFSO1FBQ0ksT0FBTyw4QkFBNEIsSUFBSSxDQUFDLE9BQVMsQ0FBQTtJQUNyRCxDQUFDO0lBQ0wsNEJBQUM7QUFBRCxDQUFDLEFBWEQsQ0FBMkMsS0FBSyxHQVcvQztBQVhZLHNEQUFxQjtBQWFyQixRQUFBLFNBQVMsR0FBRyxVQUFDLE9BQWUsRUFBRSxNQUFhO0lBQ3BELE9BQU8sQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6RCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFBO0lBQzdDLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQzFDLENBQUMsQ0FBQSJ9