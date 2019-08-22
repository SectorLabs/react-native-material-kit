//
// Touchable view, for listening to touch events, but not intercept them.
//
// Created by ywu on 15/9/22.
//
import React, { forwardRef, } from 'react';
import { requireNativeComponent, } from 'react-native';
import { partial } from 'ramda';
import { convertCoordinate } from '../utils';
//
// ## <section id='MKTouchable'>MKTouchable</section>
//
const MKTouchable = forwardRef((props, ref) => <NativeTouchable ref={ref} {...props} onChange={partial(onTouch, [props])}/>);
function onTouch(props, event) {
    if (props.onTouch) {
        const evt = event.nativeEvent;
        evt.x = convertCoordinate(evt.x);
        evt.y = convertCoordinate(evt.y);
        props.onTouch(evt);
    }
}
// @ts-ignore ComponentInterface requires `propTypes`
const NativeTouchable = requireNativeComponent('MKTouchable', MKTouchable, {
    nativeOnly: {
        nativeBackgroundAndroid: true,
        nativeForegroundAndroid: true,
    },
});
// ## Public interface
export default MKTouchable;
//# sourceMappingURL=MKTouchable.js.map