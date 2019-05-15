"use strict";
/* eslint react/prefer-stateless-function:0 */
//
// The `tick` used in `Checkbox`, for internal use only
//
// - [Props](#props)
//
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
;
// @ts-ignore ComponentInterface requires `propTypes`
const NativeTick = react_native_1.requireNativeComponent('TickView', Tick);
//
// ## <section id='Tick'>Tick</section>
// The `Tick` used in `Checkbox` component.
//
// Note: `createAnimatedComponent` does not support SFC
//
class Tick extends react_1.Component {
    constructor() {
        super(...arguments);
        this.render = () => react_1.default.createElement(NativeTick, Object.assign({}, this.props, { fillColor: react_native_1.processColor(this.props.fillColor) }));
    }
}
exports.default = Tick;
exports.AnimatedTick = react_native_1.Animated.createAnimatedComponent(Tick);
