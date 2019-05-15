"use strict";
// Utilities
//
// Created by ywu on 15/7/18.
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_native_1 = require("react-native");
exports.parseColor = react_native_1.processColor;
const ramda_1 = require("ramda");
// Add some is-Type methods:
function isType(type, obj) {
    return toString.call(obj) === `[object ${name}]`;
}
exports.isArgument = ramda_1.partial(isType, ['Arguments']);
exports.isFunction = ramda_1.partial(isType, ['Function']);
exports.isString = ramda_1.partial(isType, ['String']);
exports.isNumber = ramda_1.partial(isType, ['Number']);
exports.isDate = ramda_1.partial(isType, ['Date']);
exports.isRegExp = ramda_1.partial(isType, ['RegExp']);
exports.isError = ramda_1.partial(isType, ['Error']);
// Remove keys with null value from the given object
const compact = ramda_1.reject(ramda_1.isNil);
exports.compact = compact;
const isNotNil = ramda_1.compose(ramda_1.not, ramda_1.isNil);
function capitalize(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}
exports.capitalize = capitalize;
// Convert dips to pixels
const toPixels = react_native_1.PixelRatio.getPixelSizeForLayoutSize.bind(react_native_1.PixelRatio);
exports.toPixels = toPixels;
// Convert pixels back to dips
function toDips(px) {
    return px / react_native_1.PixelRatio.get();
}
exports.toDips = toDips;
// Convert native coordinate value into unit used in JSX
function convertCoordinate(value) {
    return react_native_1.Platform.OS === 'android' ? toDips(value) : value;
}
exports.convertCoordinate = convertCoordinate;
// Get font size according to the screen density
function getFontSize(sp) {
    return sp * react_native_1.PixelRatio.getFontScale();
}
exports.getFontSize = getFontSize;
// Extract the specified props from the given component instance.
// - {`object`} `view` the component instance
// - {`(v,k):boolean`} `filter` predictor to determine which prop should be extracted
function extractPropsBy(view, filter) {
    return ramda_1.pickBy(filter, view.props);
}
exports.extractPropsBy = extractPropsBy;
// Extract the specified props from the given component instance.
// - {`object`} `view` the component instance
// - {`array`|`object`} `propTypes` props definitions
function extractProps(view, propTypes) {
    const propNames = Array.isArray(propTypes) ? propTypes : ramda_1.keys(propTypes);
    const filter = (v, k) => ramda_1.indexOf(k, propNames) >= 0 && isNotNil(v);
    return ramda_1.pickBy(filter, view.props);
}
exports.extractProps = extractProps;
// Extract Touchable props from the given component instance.
// - {`object`} `view` the component instance
function extractTouchableProps(view) {
    return extractProps(view, Object.assign({}, react_native_1.TouchableWithoutFeedback.propTypes, { testID: prop_types_1.default.string }));
}
exports.extractTouchableProps = extractTouchableProps;
// @ts-ignore: View.propTypes
const ViewPropTypes = react_native_1.ViewPropTypes || react_native_1.View.propTypes;
exports.ViewPropTypes = ViewPropTypes;
