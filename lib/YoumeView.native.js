"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_native_1 = require("react-native");
/**
 * Import NativeYoumeView from native binding.
 *
 * This @object is used to bridge native layer between react layer.
 */
const NativeYoumeView = react_native_1.requireNativeComponent("RCTYoumeView");
/**
 * YoumeView is the render layer for rendering video
 *
 * This class is used to rendering native sdk video
 *
 * @props {@link YoumeViewProps}
 */
class YoumeView extends react_1.default.Component {
    /**
     * render
     *
     * It would render view for VideoStream
     */
    render() {
        return (react_1.default.createElement(NativeYoumeView, Object.assign({}, this.getAllProps())));
    }
    /**
     * getAllProps
     *
     * get youme view props
     */
    getAllProps() {
        let allProps = {};
        for (let key in this.props) {
            allProps[key] = this.props[key];
        }
        return allProps;
    }
}
exports.default = YoumeView;
//# sourceMappingURL=YoumeView.native.js.map