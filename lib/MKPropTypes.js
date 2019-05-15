"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// Common PropTypes definition
//
// Created by ywu on 15/7/16.
//
const prop_types_1 = __importDefault(require("prop-types"));
const react_native_1 = require("react-native");
// -----------
// ## Data types
// <section id="dimen">Dimension</section>
exports.dimen = prop_types_1.default.shape({
    height: prop_types_1.default.number,
    width: prop_types_1.default.number,
});
// <section id="font">Font</section>
exports.font = prop_types_1.default.shape({
    color: prop_types_1.default.string,
    fontFamily: prop_types_1.default.string,
    fontSize: prop_types_1.default.number,
    // @ts-ignore
    fontStyle: react_native_1.Text.propTypes.style.fontStyle,
    // @ts-ignore
    fontWeight: react_native_1.Text.propTypes.style.fontWeight,
});
// <section id="rippleLocation">Ripple hot-spot location</section>
exports.rippleLocation = prop_types_1.default.oneOf([
    'tapLocation',
    'center',
]);
