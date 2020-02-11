"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const { Youme } = react_native_1.NativeModules;
const YoumeEventEmitter = new react_native_1.NativeEventEmitter(Youme);
/**
 * YoumeVideoEngine is the react native javascript interface for Youme Video SDK
 */
class YoumeVideoEngine {
    static init(options) {
        return Youme.init(options);
    }
    static joinChannel(options) {
        return Youme.joinChannel(options);
    }
    static on(reactNativeEvent, listener) {
        this.eventTypes.add(reactNativeEvent);
        YoumeEventEmitter.addListener(reactNativeEvent, listener);
    }
    static off(reactNativeEvent) {
        YoumeEventEmitter.removeAllListeners(reactNativeEvent);
        this.eventTypes.delete(reactNativeEvent);
    }
    static removeAllListeners() {
        for (let eventType of this.eventTypes) {
            YoumeEventEmitter.removeAllListeners(eventType);
        }
        this.eventTypes.clear();
    }
    static leaveChannel(options) {
        return Youme.leaveChannel(options);
    }
    static setMicrophoneMute(mute) {
        Youme.setMicrophoneMute(mute);
    }
    static setSpeakerMute(mute) {
        Youme.setSpeakerMute(mute);
    }
    static startCapturer(switchWithHeightIfLandscape) {
        Youme.startCapturer(switchWithHeightIfLandscape);
    }
    /**
     * 通知SDK，屏幕发生旋转
     */
    static screenRotationChange() {
        Youme.screenRotationChange();
    }
    static stopCapturer() {
        Youme.stopCapturer();
    }
    static keepScreenOn() {
        Youme.keepScreenOn();
    }
    static cancelScreenOn() {
        Youme.cancelScreenOn();
    }
    static switchCamera() {
        Youme.switchCamera();
    }
    static outputToSpeaker(outputToSpeaker) {
        Youme.outputToSpeaker(outputToSpeaker);
    }
    static setAutoSendStatus(sync) {
        Youme.setAutoSendStatus(sync);
    }
    static setOtherMicMute(userid, mute) {
        Youme.setOtherMicMute(userid, mute);
    }
    static maskVideoByUserId(userid, block) {
        Youme.maskVideoByUserId(userid, block);
    }
    static setListenOtherVoice(userid, listen) {
        Youme.setListenOtherVoice(userid, listen);
    }
    static setUsersVideoInfo(usersStreamInfo) {
        Youme.setUsersVideoInfo(usersStreamInfo);
    }
    static setVideoNetAdjustmode(adjustMode) {
        Youme.setVideoNetAdjustmode(adjustMode);
    }
    static applicationInBackground() {
        Youme.applicationInBackground();
    }
    static applicationInFront() {
        Youme.applicationInFront();
    }
    static kickOtherFromChannel(userid, channel, forbidSeconds) {
        Youme.kickOtherFromChannel(userid, channel, forbidSeconds);
    }
    /**
     * 设置sdk 是否开启美颜，true为开启，false为关闭，初始化成功后，进频道前设置
     * @param isOpen 是否开启美颜
     */
    static openBeautify(isOpen) {
        Youme.openBeautify(isOpen);
    }
    /**
     * 设置sdk 美颜等级，初始化成功后，进频道前后设置
     * @param level 美颜等级，0.0 - 1.0
     */
    static setBeautyLevel(level) {
        Youme.setBeautyLevel(level);
    }
}
YoumeVideoEngine.eventTypes = new Set();
exports.default = YoumeVideoEngine;
//# sourceMappingURL=YoumeVideoEngine.native.js.map