"use strict";
//
// MDL-style Radio button component.
//
// - @see [MDL Radio Button](http://www.getmdl.io/components/index.html#toggles-section/radio)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/10/12.
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
const MKColor_1 = __importDefault(require("../MKColor"));
const theme_1 = require("../theme");
const utils = __importStar(require("../utils"));
const Ripple_1 = __importDefault(require("./Ripple"));
const DEFAULT_EXTRA_RIPPLE_RADII = 16;
//
// ## <section id='RadioButton'>RadioButton</section>
// The `RadioButton` component.
class RadioButton extends react_1.Component {
    constructor(props) {
        super(props);
        this.theme = theme_1.getTheme();
        this.animatedSize = new react_native_1.Animated.Value(0);
        this.animatedRadius = new react_native_1.Animated.Value(0);
        this.onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
            if (width === this.state.width && height === this.state.height) {
                return;
            }
            const padding = this.props.extraRippleRadius || DEFAULT_EXTRA_RIPPLE_RADII;
            this.setState({
                height: height + padding,
                width: width + padding,
            });
        };
        // Touch events handling
        this.onTouch = ({ type }) => {
            if (type === 'TOUCH_UP') {
                if (!this.state.checked) {
                    this.confirmToggle();
                }
            }
        };
        this.state = {
            checked: false,
            height: 0,
            width: 0,
        };
    }
    componentWillMount() {
        this.group = this.props.group;
        this.initView(this.props.checked);
        this.group && this.group.add(this);
    }
    componentWillReceiveProps(nextProps) {
        if (this.group !== nextProps.group) {
            this.group && this.group.remove(this);
            this.group = nextProps.group;
            this.group && this.group.add(this);
        }
        if (nextProps.checked !== this.props.checked) {
            this.initView(nextProps.checked);
        }
    }
    componentWillUnmount() {
        this.group && this.group.remove(this);
    }
    // When a toggle action (from the given state) is confirmed.
    confirmToggle() {
        const prevState = this.state.checked;
        const newState = !prevState;
        this.setState({ checked: newState }, () => this.emitCheckedChange(newState));
        // update state of the other buttons in the group
        this.group && this.group.onChecked(this, newState);
        this.aniChecked(newState);
    }
    confirmUncheck() {
        this.setState({ checked: false }, () => this.emitCheckedChange(false));
        this.aniChecked(false);
    }
    render() {
        const defaultStyle = this.theme.radioStyle;
        const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, [
            'borderOnColor',
            'borderOffColor',
            'fillColor',
            'rippleColor',
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
                        RadioButton.defaultProps.style,
                        { borderColor },
                        this.props.style,
                    ], onLayout: this.onLayout },
                    react_1.default.createElement(react_native_1.Animated.View, { style: {
                            backgroundColor: mergedStyle.fillColor,
                            borderRadius: this.animatedRadius,
                            height: this.animatedSize,
                            width: this.animatedSize,
                        } })))));
    }
    initView(checked = false) {
        this.setState({ checked });
        this.aniChecked(checked);
    }
    emitCheckedChange(checked) {
        this.props.onCheckedChange && this.props.onCheckedChange({ checked });
    }
    // animate the checked state, by scaling the inner circle
    aniChecked(checked) {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animatedRadius, {
                duration: 220,
                toValue: checked ? 5 : 0,
            }),
            react_native_1.Animated.timing(this.animatedSize, {
                duration: 220,
                toValue: checked ? 10 : 0,
            }),
        ]).start();
    }
}
// ## <section id='defaults'>Defaults</section>
RadioButton.defaultProps = {
    maskColor: MKColor_1.default.Transparent,
    pointerEvents: 'box-only',
    style: {
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        height: 20,
        justifyContent: 'center',
        width: 20,
    },
};
exports.default = RadioButton;
