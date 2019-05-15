"use strict";
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
// ## <section id='thumb'>Thumb</section>
// `Thumb` component of the [`Switch`](#switch).
// Which is displayed as a circle with shadow and ripple effect.
class Thumb extends react_1.Component {
    constructor(props) {
        super(props);
        this.animatedRippleScale = new react_native_1.Animated.Value(0);
        this.animatedRippleAlpha = new react_native_1.Animated.Value(0);
        this.state = {
            checked: props.checked,
        };
    }
    // componentWillMount() {
    //   this.setState({checked: this.props.checked});
    // }
    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.state.checked) {
            this.setState({ checked: nextProps.checked });
        }
    }
    // When a toggle action started.
    startToggle() {
        this.showRipple();
    }
    // When a toggle action is finished (confirmed or canceled).
    endToggle() {
        this.hideRipple();
    }
    // When a toggle action (from the given state) is confirmed.
    // - {`boolean`} `fromState` the previous state
    confirmToggle(fromState) {
        this.setState({ checked: !fromState });
    }
    // Start the ripple effect
    showRipple() {
        // scaling up the ripple layer
        this.rippleAni = react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animatedRippleAlpha, {
                duration: this.props.rippleAniDuration,
                toValue: 1,
            }),
            react_native_1.Animated.timing(this.animatedRippleScale, {
                duration: this.props.rippleAniDuration,
                toValue: 1,
            }),
        ]);
        this.rippleAni.start(() => {
            this.rippleAni = undefined;
            // if any pending animation, do it
            if (this.pendingRippleAni) {
                this.pendingRippleAni();
            }
        });
    }
    // Stop the ripple effect
    hideRipple() {
        this.pendingRippleAni = () => {
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(this.animatedRippleScale, {
                    duration: this.props.rippleAniDuration || 250,
                    toValue: 0,
                }),
                react_native_1.Animated.timing(this.animatedRippleAlpha, {
                    duration: this.props.rippleAniDuration || 250,
                    toValue: 0,
                }),
            ]).start();
            this.pendingRippleAni = undefined;
        };
        if (!this.rippleAni) {
            // previous ripple animation is done, good to go
            this.pendingRippleAni();
        }
    }
    // Rendering the `Thumb`
    render() {
        const rippleSize = this.props.rippleRadius * 2;
        return (react_1.default.createElement(react_native_1.View, { style: [this.props.style, {
                    backgroundColor: MKColor_1.default.Transparent,
                    height: rippleSize,
                    position: 'absolute',
                    width: rippleSize,
                }] },
            react_1.default.createElement(react_native_1.View // the circle
            , { style: [
                    Thumb.defaultProps.style,
                    this.props.thumbStyle,
                    { backgroundColor: this.state.checked ? this.props.onColor : this.props.offColor },
                ] }),
            react_1.default.createElement(react_native_1.Animated.View // the ripple layer
            , { style: {
                    height: rippleSize,
                    left: 0,
                    top: 0,
                    width: rippleSize,
                    backgroundColor: this.props.rippleColor,
                    borderRadius: this.props.rippleRadius,
                    opacity: this.animatedRippleAlpha,
                    position: 'absolute',
                    transform: [
                        { scale: this.animatedRippleScale },
                    ],
                } })));
    }
}
// Default props of `Thumb`
Thumb.defaultProps = {
    checked: false,
    pointerEvents: 'none',
    rippleAniDuration: 250,
    rippleRadius: 14,
    style: {
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: {
            height: 1,
            width: 0,
        },
        shadowOpacity: 0.7,
        shadowRadius: 1,
    },
};
exports.Thumb = Thumb;
// Enable animations on `Thumb`
const AnimatedThumb = react_native_1.Animated.createAnimatedComponent(Thumb);
exports.default = AnimatedThumb;
