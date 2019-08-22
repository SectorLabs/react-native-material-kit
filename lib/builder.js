//
// Boilerplate for styling MK Components
// - [Builder](#Builder)
// - [TextViewBuilder](#TextViewBuilder)
//
// Created by ywu on 15/7/16.
//
import { getTheme, } from './theme';
import { capitalize, } from './utils';
//
// ## <section id='Builder'>Builder</section>
// Base class of MK Component builder
//
export class Builder {
    constructor() {
        // Background color
        this.backgroundColor = undefined;
        // Accent color
        this.accent = undefined;
        // Style
        this.style = undefined;
        this.getTheme = getTheme;
    }
    // Define builder method `withXxx` for prop `xxx`
    static defineProp(name) {
        const methodName = `with${capitalize(name)}`;
        if (this.prototype[methodName]) {
            return;
        }
        Object.defineProperty(this.prototype, methodName, {
            enumerable: false,
            value(v) {
                this[name] = v;
                return this;
            },
        });
    }
    // Convenient util to define a builder method for each prop of the component
    // - {`object`} `propTypes` propTypes of the given component
    // - {`():boolean`} `filter` predictor to determine which prop would has a builder method
    static defineProps(propTypes, filter = (p) => true) {
        const self = this;
        Object.getOwnPropertyNames(propTypes).forEach((prop) => {
            if (!self.hasOwnProperty(prop) && filter(prop)) {
                Builder.defineProp.call(self, prop);
            }
        });
    }
    // Accent color
    withAccent(v) {
        this.accent = v;
        return this;
    }
    withBackgroundColor(color) {
        this.backgroundColor = color;
        return this;
    }
    withStyle(v) {
        this.style = this.style ? [this.style, v] : v;
        return this;
    }
    build() {
        // do nothing
    }
    toProps() {
        this.mergeStyle();
        return Object.assign({}, this);
    }
    getThemeColor() {
        return this.accent ? getTheme().accentColor : getTheme().primaryColor;
    }
    choseBackgroundColor() {
        this.backgroundColor = this.backgroundColor || this.getThemeColor();
    }
    mergeStyle() {
        this.mergeStyleWith({
            backgroundColor: this.backgroundColor,
        });
    }
    mergeStyleWith(base) {
        this.style = [].concat(base, this.style);
    }
}
//# sourceMappingURL=builder.js.map