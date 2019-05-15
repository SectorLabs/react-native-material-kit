"use strict";
//
// MDL-style Button component.
//
// - @see [MDL Button](http://www.getmdl.io/components/index.html#buttons-section)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/7/2.
//
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const MKColor_1 = __importDefault(require("../MKColor"));
const theme_1 = require("../theme");
const utils = __importStar(require("../utils"));
const Ripple_1 = __importDefault(require("./Ripple"));
//
// ## <section id='Button'>Button</section>
// The `Button` component. With configurable shadow, ripple effect, and FAB style.
//
class Button extends react_1.Component {
    constructor(props) {
        super(props);
        this._onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
            if (width !== this.state.width || height !== this.state.height) {
                this.setState({
                    height,
                    width,
                });
            }
        };
        this.theme = theme_1.getTheme();
        this.state = {
            height: 0,
            width: 0,
        };
    }
    render() {
        const touchableProps = {};
        if (this.props.enabled) {
            Object.assign(touchableProps, utils.extractTouchableProps(this));
        }
        // fix #57 applying `onLayout` to <Ripple>, <TouchableXXX> clones `onLayout` to it's child
        touchableProps.onLayout = this._onLayout;
        const fabStyle = {};
        const maskProps = {};
        if (this.props.fab) {
            maskProps.maskBorderRadiusInPercent = 50;
            if (this.state.width > 0 || this.state.height > 0) {
                let size = Math.min(this.state.width, this.state.height);
                if (!size || size <= 0) {
                    size = Math.max(this.state.width, this.state.height);
                }
                fabStyle.width = size;
                fabStyle.height = size;
                fabStyle.borderRadius = size / 2;
            }
        }
        return (react_1.default.createElement(react_native_1.TouchableWithoutFeedback, Object.assign({}, touchableProps),
            react_1.default.createElement(Ripple_1.default, Object.assign({}, this.props, maskProps, { style: [
                    this.props.style,
                    fabStyle,
                ] }))));
    }
}
// ## <section id='defaults'>Defaults</section>
Button.defaultProps = Object.assign({}, Ripple_1.default.defaultProps, { enabled: true, fab: false, pointerEvents: 'box-only' });
exports.default = Button;
// --------------------------
// Pre-defined button variances.
exports.RaisedButton = props => customizedButton(raisedButton(), props);
exports.ColoredRaisedButton = props => customizedButton(coloredRaisedButton(), props);
exports.AccentRaisedButton = props => customizedButton(accentRaisedButton(), props);
exports.FlatButton = props => customizedButton(flatButton(), props);
exports.Fab = props => customizedButton(fab(), props);
exports.ColoredFab = props => customizedButton(coloredFab(), props);
exports.AccentFab = props => customizedButton(accentFab(), props);
// Factory method to create a button variance
function customizedButton(_a, _b) {
    var { style: baseStyle } = _a, baseProps = __rest(_a, ["style"]);
    var { style: customStyle } = _b, customProps = __rest(_b, ["style"]);
    return react_1.default.createElement(Button, Object.assign({}, baseProps, customProps, { style: [baseStyle, customStyle] }));
}
// (Most of them are defined as functions, in order to lazy-resolve the theme)
// default button props
const button = {
    style: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
};
// Text style for buttons, default color is `black`
function buttonText(theme = theme_1.getTheme(), color = 'black') {
    return {
        color: color,
        fontSize: theme.fontSize,
        fontWeight: 'bold',
    };
}
// Text style for colored buttons
function coloredButtonText(theme = theme_1.getTheme()) {
    return buttonText(theme, 'white');
}
// Text style using primary color
function buttonTextPrimary(theme = theme_1.getTheme()) {
    return buttonText(theme, theme.primaryColor);
}
// Text style using accent color
function buttonTextAccent(theme = theme_1.getTheme()) {
    return buttonText(theme, theme.accentColor);
}
// Props for default raised button
function raisedButton(theme = theme_1.getTheme()) {
    return Object.assign({}, coloredRaisedButton(theme, MKColor_1.default.Silver), { maskColor: theme.bgPlain, rippleColor: theme.bgPlain });
}
// Props for colored raised button
function coloredRaisedButton(theme = theme_1.getTheme(), backgroundColor = theme.primaryColor) {
    const { style } = button, props = __rest(button, ["style"]);
    return Object.assign({}, props, { style: [style, {
                backgroundColor: backgroundColor,
                borderRadius: 2,
                elevation: 4,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: 0.7,
                shadowRadius: 1,
            }] });
}
function accentRaisedButton(theme = theme_1.getTheme()) {
    return coloredRaisedButton(theme, theme.accentColor);
}
function flatButton(theme = theme_1.getTheme(), rippleColor = theme.bgPlain) {
    const { style } = button, props = __rest(button, ["style"]);
    return Object.assign({}, props, { maskColor: rippleColor, rippleColor: rippleColor, shadowAniEnabled: false, style: [style, {
                backgroundColor: MKColor_1.default.Transparent,
                borderRadius: 2,
            }] });
}
function coloredFab(theme = theme_1.getTheme(), backgroundColor = theme.primaryColor) {
    const { style } = button, props = __rest(button, ["style"]);
    return Object.assign({}, props, { rippleLocation: 'center', style: [style, {
                backgroundColor: backgroundColor,
                elevation: 4,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: 0.4,
                shadowRadius: 1,
                borderRadius: 24,
                height: 48,
                width: 48,
            }] });
}
function accentFab(theme = theme_1.getTheme()) {
    return coloredFab(theme, theme.accentColor);
}
function fab(theme = theme_1.getTheme()) {
    return Object.assign({}, coloredFab(theme, MKColor_1.default.Silver), { maskColor: theme.bgPlain, rippleColor: theme.bgPlain });
}
// Pre-defined Button props/styles for common cases
exports.ButtonStyles = {
    buttonText,
    buttonTextAccent,
    buttonTextPrimary,
    coloredButtonText,
};
