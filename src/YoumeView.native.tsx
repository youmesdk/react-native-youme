import React from 'react';
import {
    requireNativeComponent,
} from 'react-native'

import {
    YoumeViewProps
} from "./types";

/**
 * Import NativeYoumeView from native binding.
 *
 * This @object is used to bridge native layer between react layer.
 */

const NativeYoumeView = requireNativeComponent("RCTYoumeView");

/**
 * YoumeView is the render layer for rendering video
 *
 * This class is used to rendering native sdk video
 *
 * @props {@link AgoraViewProps}
 */
export default class YoumeView extends React.Component<YoumeViewProps> {
    /**
     * render
     *
     * It would render view for VideoStream
     */
    public render(): JSX.Element {
        return (
            <NativeYoumeView { ...this.getAllProps() } />
        )
    }

    /**
     * getAllProps
     *
     * get youme view props
     */
    private getAllProps(): YoumeViewProps {
        let allProps = {} as YoumeViewProps;
        for (let key in this.props) {
            allProps[key] = this.props[key];
        }
        return allProps;
    }
}

