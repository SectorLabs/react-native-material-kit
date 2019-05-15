"use strict";
//
// MDL-style Checkbox component.
//
// - @see [MDL Checkbox](http://www.getmdl.io/components/index.html#toggles-section/checkbox)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/12/13.
//
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
const Tick_1 = require("../internal/Tick");
const MKColor_1 = __importDefault(require("../MKColor"));
const theme_1 = require("../theme");
const utils = __importStar(require("../utils"));
const Ripple_1 = __importDefault(require("./Ripple"));
const DEFAULT_EXTRA_RIPPLE_RADII = 5;
//
// ## <section id='Checkbox'>Checkbox</section>
// The `Checkbox` component.
class Checkbox extends react_1.Component {
    constructor(props) {
        super(props);
        this.theme = theme_1.getTheme();
        this.animatedTickAlpha = new react_native_1.Animated.Value(0);
        this.onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
            if (width === this.state.width && height === this.state.height) {
                return;
            }
            const size = Math.min(width, height);
            const rippleRadii = size * Math.SQRT2 / 2 + (this.props.extraRippleRadius
                || DEFAULT_EXTRA_RIPPLE_RADII);
            this.setState({
                rippleRadii,
                height: rippleRadii * 2,
                width: rippleRadii * 2,
            });
        };
        // Touch events handling
        this.onTouch = ({ type }) => {
            if (type === 'TOUCH_UP' && this.props.editable) {
                this.confirmToggle();
            }
        };
        this.state = {
            checked: false,
            height: 0,
            rippleRadii: 0,
            width: 0,
        };
    }
    componentWillMount() {
        this.initView(this.props.checked);
    }
    // componentWillReceiveProps(nextProps: CheckboxProps) {
    //   if (nextProps.checked !== this.props.checked) {
    //     this.initView(nextProps.checked);
    //   }
    // }
    // On iPhone X - iOS 12, at times the checkbox doesn't changes it's state. This 
    // will fix that.
    componentDidUpdate(prevProps) {
        if (prevProps.checked !== this.props.checked) {
            this._initView(this.props.checked);
        }
    }
    render() {
        const defaultStyle = this.theme.checkboxStyle;
        const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, [
            'borderOnColor',
            'borderOffColor',
            'fillColor',
            'rippleColor',
            'inset',
        ]));
        const borderColor = this.state.checked ? mergedStyle.borderOnColor : mergedStyle.borderOffColor;
        return (react_1.default.createElement(react_native_1.TouchableWithoutFeedback, Object.assign({}, utils.extractTouchableProps(this)),
            react_1.default.createElement(Ripple_1.default, Object.assign({}, this.props, { maskBorderRadiusInPercent: 50, rippleLocation: "center", rippleColor: mergedStyle.rippleColor, onTouch: this.onTouch, style: {
                    alignItems: 'center',
                    height: this.state.height,
                    justifyContent: 'center',
                    width: this.state.width,
                } }),
                react_1.default.createElement(react_native_1.View, { style: [
                        Checkbox.defaultProps.style,
                        this.props.style,
                        {
                            alignItems: 'stretch',
                            borderColor,
                        },
                    ], onLayout: this.onLayout },
                    react_1.default.createElement(Tick_1.AnimatedTick, { inset: mergedStyle.inset, fillColor: mergedStyle.fillColor, style: {
                            flex: 1,
                            opacity: this.animatedTickAlpha,
                        } })))));
    }
    initView(checked = false) {
        this.setState({ checked });
        this.aniToggle(checked);
    }
    // animate the checked state, by scaling the inner circle
    aniToggle(checked) {
        react_native_1.Animated.timing(this.animatedTickAlpha, {
            duration: 220,
            toValue: checked ? 1 : 0,
        }).start();
    }
    // When a toggle action (from the given state) is confirmed.
    confirmToggle() {
        const prevState = this.state.checked;
        const newState = !prevState;
        this.setState({ checked: newState }, () => {
            if (this.props.onCheckedChange) {
                this.props.onCheckedChange({ checked: this.state.checked });
            }
        });
        this.aniToggle(newState);
    }
}
// ## <section id='defaults'>Defaults</section>
Checkbox.defaultProps = {
    checked: false,
    editable: true,
    maskColor: MKColor_1.default.Transparent,
    pointerEvents: 'box-only',
    style: {
        height: 20,
        width: 20,
        overflow: "hidden",
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 2,
        justifyContent: 'center',
    },
};
exports.default = Checkbox;
