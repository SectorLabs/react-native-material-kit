"use strict";
//
// MDL style switch component.
//
// <image src="http://bit.ly/1OF6Z96" width="400"/>
//
// - @see [MDL Switch](http://bit.ly/1IcHMPo)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/7/28.
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
const theme_1 = require("../theme");
const utils = __importStar(require("../utils"));
const SwitchThumb_1 = __importDefault(require("./SwitchThumb"));
const defaultThumbRadius = 14;
const defaultTrackLength = 48;
const defaultTrackSize = 20;
// ## <section id='switch'>Switch</section>
// The `Switch` component. Which is made up of a `Track` and a [`Thumb`](#thumb).
class Switch extends react_1.Component {
    constructor(props) {
        super(props);
        this.theme = theme_1.getTheme();
        this.thumbRef = react_1.createRef();
        this.animatedThumbLeft = new react_native_1.Animated.Value(0);
        this.onPress = (event) => {
            this.confirmToggle();
            this.props.onPress && this.props.onPress(event);
        };
        this.onPressIn = (event) => {
            this.startToggle();
            this.props.onPressIn && this.props.onPressIn(event);
        };
        this.onPressOut = (event) => {
            this.endToggle();
            this.props.onPressOut && this.props.onPressOut(event);
        };
        this.state = {
            checked: false,
            thumbFrame: {
                padding: 0, r: 0, rippleRadii: 0, x: 0,
            },
            trackLength: 0,
            trackMargin: 0,
            trackRadii: 0,
            trackSize: 0,
        };
    }
    componentWillMount() {
        this.initLayout(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.initLayout(nextProps);
    }
    // Rendering the `Switch`
    render() {
        const touchProps = {
            delayLongPress: this.props.delayLongPress,
            delayPressIn: this.props.delayPressIn,
            delayPressOut: this.props.delayPressOut,
            onLongPress: this.props.onLongPress,
        };
        const mergedStyle = Object.assign({}, this.theme.switchStyle, utils.compact({
            offColor: this.props.offColor,
            onColor: this.props.onColor,
            rippleColor: this.props.rippleColor,
            thumbOffColor: this.props.thumbOffColor,
            thumbOnColor: this.props.thumbOnColor,
        }));
        const thumbFrame = this.state.thumbFrame;
        const thumbProps = {
            checked: this.state.checked,
            offColor: mergedStyle.thumbOffColor,
            onColor: mergedStyle.thumbOnColor,
            radius: this.props.thumbRadius,
            rippleAniDuration: this.props.rippleAniDuration,
            rippleColor: mergedStyle.rippleColor,
            rippleRadius: thumbFrame.rippleRadii,
            style: {
                left: this.animatedThumbLeft,
                top: 0,
            },
            thumbStyle: {
                borderRadius: this.props.thumbRadius,
                left: thumbFrame.padding,
                top: thumbFrame.padding,
                height: (this.props.thumbRadius || defaultThumbRadius) * 2,
                width: (this.props.thumbRadius || defaultThumbRadius) * 2,
            },
        };
        return (react_1.default.createElement(react_native_1.TouchableWithoutFeedback, Object.assign({}, touchProps, { onPress: this.onPress, onPressIn: this.onPressIn, onPressOut: this.onPressOut }),
            react_1.default.createElement(react_native_1.View, { pointerEvents: "box-only", style: this.props.style },
                react_1.default.createElement(react_native_1.View // the 'track' part
                , { style: {
                        backgroundColor: this.getBgColor(mergedStyle),
                        borderRadius: this.state.trackRadii,
                        height: this.props.trackSize,
                        margin: this.state.trackMargin,
                        width: this.props.trackLength,
                    } }),
                react_1.default.createElement(SwitchThumb_1.default // the 'thumb' part
                , Object.assign({ ref: this.thumbRef }, thumbProps)))));
    }
    // Un-boxing the `Thumb` node from `AnimatedComponent`,
    // in order to access the component functions defined in `Thumb`
    get thumb() {
        const animatedThumb = this.thumbRef.current;
        return animatedThumb && animatedThumb.getNode();
    }
    getBgColor(theme) {
        const onColor = this.props.onColor || theme.onColor;
        const offColor = this.props.offColor || theme.offColor;
        return this.state.checked ? onColor : offColor;
    }
    // Layout the thumb according to the size of the track
    layoutThumb(checked, thumbRadius, trackLength, trackSize) {
        trackSize = trackSize || defaultTrackSize;
        trackLength = trackLength || defaultTrackLength;
        const thumbRadii = thumbRadius || defaultThumbRadius;
        const rippleRadii = trackLength - trackSize;
        const trackRadii = trackSize / 2;
        const trackMargin = rippleRadii - trackRadii; // make room for ripple
        const thumbLeft = checked ? trackMargin + trackRadii : 0;
        this.animatedThumbLeft.setValue(thumbLeft);
        return {
            thumbFrame: {
                padding: rippleRadii - thumbRadii,
                r: thumbRadii,
                rippleRadii,
                x: thumbLeft,
            },
            trackLength,
            trackMargin,
            trackRadii,
            trackSize,
        };
    }
    // init layout according to the props
    initLayout(props) {
        const nextState = this.layoutThumb(props.checked, props.thumbRadius, props.trackLength, props.trackSize);
        this.setState(Object.assign({}, nextState, { checked: props.checked || false }));
    }
    // Move the thumb left or right according to the current state
    translateThumb() {
        this.animatedThumbLeft.setValue(this.state.thumbFrame.x);
        const newX = this.computeThumbX(this.state.checked);
        react_native_1.Animated.timing(this.animatedThumbLeft, {
            duration: this.props.thumbAniDuration || 300,
            toValue: newX,
        }).start(() => {
            this.state.thumbFrame.x = newX;
        });
    }
    // Calc the next position (x-axis) of the thumb
    computeThumbX(toChecked) {
        if (!this.state.thumbFrame.r) {
            return 0;
        }
        const { trackLength, trackSize } = this.state;
        const dx = (toChecked ? 1 : -1) * (trackLength - trackSize);
        return this.state.thumbFrame.x + dx;
    }
    // When a toggle action started.
    startToggle() {
        this.thumb && this.thumb.startToggle();
    }
    // When a toggle action is confirmed.
    confirmToggle() {
        const prevState = this.state.checked;
        this.setState({ checked: !prevState }, () => {
            this.thumb && this.thumb.confirmToggle(prevState);
            this.translateThumb();
            if (this.props.onCheckedChange) {
                this.props.onCheckedChange({ checked: this.state.checked });
            }
        });
    }
    // When a toggle action is finished (confirmed or canceled).
    endToggle() {
        this.thumb && this.thumb.endToggle();
    }
}
// ## <section id='defaults'>Defaults</section>
Switch.defaultProps = {
    checked: false,
    thumbRadius: defaultThumbRadius,
    trackLength: defaultTrackLength,
    trackSize: defaultTrackSize,
};
exports.default = Switch;
