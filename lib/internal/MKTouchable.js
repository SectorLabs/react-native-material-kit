"use strict";
//
// Touchable view, for listening to touch events, but not intercept them.
//
// Created by ywu on 15/9/22.
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
const ramda_1 = require("ramda");
const utils_1 = require("../utils");
//
// ## <section id='MKTouchable'>MKTouchable</section>
//
const MKTouchable = react_1.forwardRef((props, ref) => react_1.default.createElement(NativeTouchable, Object.assign({ ref: ref }, props, { onChange: ramda_1.partial(onTouch, [props]) })));
function onTouch(props, event) {
    if (props.onTouch) {
        const evt = event.nativeEvent;
        evt.x = utils_1.convertCoordinate(evt.x);
        evt.y = utils_1.convertCoordinate(evt.y);
        props.onTouch(evt);
    }
}
// @ts-ignore ComponentInterface requires `propTypes`
const NativeTouchable = react_native_1.requireNativeComponent('MKTouchable', MKTouchable, {
    nativeOnly: {
        nativeBackgroundAndroid: true,
        nativeForegroundAndroid: true,
    },
});
// ## Public interface
exports.default = MKTouchable;
