"use strict";
//
// MDL-style Icon Toggle component.
//
// - @see [MDL Icon Toggle](http://bit.ly/1OUYzem)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/10/07.
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
// Check if the `stateChecked` prop matches the `isChecked` state.
function isViewForState(view, isChecked) {
    if (!view)
        return false;
    // @ts-ignore
    const props = view.hasOwnProperty('props') ? view.props : {};
    return (props.stateChecked && isChecked) || !(props.stateChecked || isChecked);
}
//
// ## <section id='IconToggle'>IconToggle</section>
// The `IconToggle` component.
class IconToggle extends react_1.Component {
    constructor(props) {
        super(props);
        this.theme = theme_1.getTheme();
        // Select a child element to show for the current toggle status.
        //
        // @see [State List](http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList) in Android development
        this.renderChildren = () => react_1.Children.map(this.props.children, child => (child && isViewForState(child, this.state.checked)) ? child : undefined);
        // Touch events handling
        this.onTouch = ({ type }) => {
            if (type === 'TOUCH_UP') {
                this.confirmToggle();
            }
        };
        this.state = { checked: false };
    }
    componentWillMount() {
        this.setState({ checked: this.props.checked || false });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked) {
            this.setState({ checked: nextProps.checked || false });
        }
    }
    render() {
        const mergedStyle = Object.assign({}, this.theme.iconToggleStyle, utils.compact({
            rippleColor: this.props.rippleColor,
        }));
        return (react_1.default.createElement(react_native_1.TouchableWithoutFeedback, Object.assign({}, utils.extractTouchableProps(this)),
            react_1.default.createElement(Ripple_1.default, Object.assign({}, this.props, { rippleColor: mergedStyle.rippleColor, style: [IconToggle.defaultProps.style, this.props.style], maskBorderRadiusInPercent: 50, rippleLocation: "center", onTouch: this.onTouch }), this.renderChildren())));
    }
    // When a toggle action (from the given state) is confirmed.
    confirmToggle() {
        const prevState = this.state.checked;
        this.setState({ checked: !prevState }, () => {
            if (this.props.onCheckedChange) {
                this.props.onCheckedChange({ checked: this.state.checked });
            }
        });
    }
}
// ## <section id='defaults'>Defaults</section>
IconToggle.defaultProps = {
    checked: false,
    enabled: true,
    maskColor: MKColor_1.default.Transparent,
    pointerEvents: 'box-only',
    style: {
        height: 56,
        width: 56,
        alignItems: 'center',
        borderColor: 'rgba(0,0,0,.54)',
        justifyContent: 'center',
    },
};
exports.default = IconToggle;
