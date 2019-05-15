"use strict";
//
// Reusable Ripple layout
//
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/8/2.
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
const MKTouchable_1 = __importDefault(require("../internal/MKTouchable"));
const UIManager = react_native_1.NativeModules.UIManager;
//
// ## <section id='Ripple'>Ripple</section>
// Reusable `Ripple` effect.
//
class Ripple extends react_1.Component {
    constructor(props) {
        super(props);
        this.containerRef = react_1.createRef();
        this.maskRef = react_1.createRef();
        this.rippleRef = react_1.createRef();
        this._animatedAlpha = new react_native_1.Animated.Value(0);
        this._animatedRippleScale = new react_native_1.Animated.Value(0);
        this._onLayout = (evt) => {
            this._onLayoutChange(evt.nativeEvent.layout);
            this.props.onLayout && this.props.onLayout(evt);
        };
        // Touch events handling
        this._onTouchEvent = (evt) => {
            if (this.props.disabled)
                return;
            switch (evt.type) {
                case 'TOUCH_DOWN':
                    this._onPointerDown(evt);
                    break;
                case 'TOUCH_UP':
                case 'TOUCH_CANCEL':
                    this._onPointerUp();
                    break;
                default:
                    break;
            }
            if (this.props.onTouch) {
                this.props.onTouch(evt);
            }
        };
        // [Android] set initial size > 0 to avoid NPE
        // at `ReactViewBackgroundDrawable.drawRoundedBackgroundWithBorders`
        // @see https://github.com/facebook/react-native/issues/3069
        this.state = {
            height: 1,
            width: 1,
            maskBorderRadius: 0,
            ripple: { radii: 0, dia: 0, offset: { top: 0, left: 0 } },
            shadowOffsetY: 1,
        };
    }
    measure(cb) {
        return this.containerRef.current &&
            UIManager.measure(react_native_1.findNodeHandle(this.containerRef.current), cb);
    }
    // Start the ripple effect
    showRipple() {
        this._animatedAlpha.setValue(1);
        this._animatedRippleScale.setValue(0.3);
        // scaling up the ripple layer
        this._rippleAni = react_native_1.Animated.timing(this._animatedRippleScale, {
            duration: this.props.rippleDuration || 200,
            toValue: 1,
            useNativeDriver: true,
        });
        // enlarge the shadow, if enabled
        if (this.props.shadowAniEnabled) {
            this.setState({ shadowOffsetY: 1.5 });
        }
        this._rippleAni.start(() => {
            this._rippleAni = undefined;
            // if any pending animation, do it
            if (this._pendingRippleAni) {
                this._pendingRippleAni();
            }
        });
    }
    // Stop the ripple effect
    hideRipple() {
        this._pendingRippleAni = () => {
            // hide the ripple layer
            react_native_1.Animated.timing(this._animatedAlpha, {
                duration: this.props.maskDuration || 200,
                toValue: 0,
                useNativeDriver: true,
            }).start();
            // scale down the shadow
            if (this.props.shadowAniEnabled) {
                this.setState({ shadowOffsetY: 1 });
            }
            this._pendingRippleAni = undefined;
        };
        if (!this._rippleAni) {
            // previous ripple animation is done, good to go
            this._pendingRippleAni();
        }
    }
    render() {
        const shadowStyle = {};
        if (this.props.shadowAniEnabled) {
            shadowStyle.shadowOffset = {
                height: this.state.shadowOffsetY,
                width: 0,
            };
        }
        return (react_1.default.createElement(MKTouchable_1.default, Object.assign({ ref: this.containerRef }, this.props, { style: [this.props.style, shadowStyle], onTouch: this._onTouchEvent, onLayout: this._onLayout }),
            this.props.children,
            react_1.default.createElement(react_native_1.Animated.View, { ref: this.maskRef, style: {
                    height: this.state.height,
                    width: this.state.width,
                    left: -(this.props.borderWidth || 0),
                    top: -(this.props.borderWidth || 0),
                    backgroundColor: this.props.maskColor,
                    borderRadius: this.state.maskBorderRadius,
                    opacity: this._animatedAlpha,
                    overflow: this.props.maskEnabled ? 'hidden' : 'visible',
                    position: 'absolute',
                } },
                react_1.default.createElement(react_native_1.Animated.View, { ref: this.rippleRef, style: Object.assign({ height: this.state.ripple.dia, width: this.state.ripple.dia }, this.state.ripple.offset, { backgroundColor: this.props.rippleColor, borderRadius: this.state.ripple.radii, transform: [
                            { scale: this._animatedRippleScale },
                        ] }) }))));
    }
    _onLayoutChange({ width, height }) {
        if (width === this.state.width && height === this.state.height) {
            return;
        }
        this.setState(Object.assign({}, this._calcMaskLayer(width, height), { height,
            width }));
    }
    // update Mask layer's dimen
    _calcMaskLayer(width, height) {
        const maskRadiiPercent = this.props.maskBorderRadiusInPercent;
        let maskBorderRadius = this.props.maskBorderRadius || 0;
        if (maskRadiiPercent) {
            maskBorderRadius = Math.min(width, height) * maskRadiiPercent / 100;
        }
        return { maskBorderRadius };
    }
    // update Ripple layer's dimen
    _calcRippleLayer(x0, y0) {
        const { width, height, maskBorderRadius } = this.state;
        const maskRadiusPercent = this.props.maskBorderRadiusInPercent || 0;
        let radii;
        let hotSpotX = x0;
        let hotSpotY = y0;
        if (this.props.rippleLocation === 'center') {
            hotSpotX = width / 2;
            hotSpotY = height / 2;
        }
        const offsetX = Math.max(hotSpotX, (width - hotSpotX));
        const offsetY = Math.max(hotSpotY, (height - hotSpotY));
        // FIXME Workaround for Android not respect `overflow`
        // @see https://github.com/facebook/react-native/issues/3198
        if (react_native_1.Platform.OS === 'android'
            && this.props.rippleLocation === 'center'
            && this.props.maskEnabled && maskRadiusPercent > 0) {
            // limit ripple to the bounds of mask
            radii = maskBorderRadius;
        }
        else {
            radii = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        }
        return {
            ripple: {
                dia: radii * 2,
                offset: {
                    left: hotSpotX - radii,
                    top: hotSpotY - radii,
                },
                radii,
            },
        };
    }
    _onPointerDown(evt) {
        this.setState(Object.assign({}, this._calcRippleLayer(evt.x, evt.y)));
        this.showRipple();
    }
    _onPointerUp() {
        this.hideRipple();
    }
}
// ## <section id='defaults'>Defaults</section>
Ripple.defaultProps = {
    borderWidth: 0,
    disabled: false,
    maskBorderRadius: 2,
    maskBorderRadiusInPercent: 0,
    maskColor: 'rgba(255,255,255,0.15)',
    maskDuration: 200,
    maskEnabled: true,
    rippleColor: 'rgba(255,255,255,0.2)',
    rippleDuration: 200,
    rippleLocation: 'tapLocation',
    shadowAniEnabled: true,
};
exports.default = Ripple;
