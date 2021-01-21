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
    static setLocalVideoPreviewMirror(isMirror) {
        Youme.setLocalVideoPreviewMirror(isMirror);
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
    static setAVStatisticInterval(interval) {
        Youme.setAVStatisticInterval(interval);
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
    /**
     * 开始屏幕录制
     */
    static startScreenRecorder() {
        return Youme.startScreenRecorder();
    }
    /**
     * 停止屏幕录制
     */
    static stopScreenRecorder() {
        Youme.stopScreenRecorder();
    }
    /**
     * 设置视频网络传输分辨率
     */
    static setVideoNetResolution(sendWidth, sendHeight) {
        return Youme.setVideoNetResolution(sendWidth, sendHeight);
    }
    /**
     * 设置视频网络传输大流帧率
     */
    static setVideoFps(fps) {
        Youme.setVideoFps(fps);
    }
    /**
     * 设置视频网络传输小流帧率
     */
    static setVideoFpsForSecond(fps) {
        Youme.setVideoFpsForSecond(fps);
    }
    /**
     * 设置视频本地预览帧率
     */
    static setVideoPreviewFps(fps) {
        Youme.setVideoPreviewFps(fps);
    }
    /**
     * 设置屏幕共享网络传输分辨率
     */
    static setVideoNetResolutionForShare(shareWidth, shareHeight) {
        return Youme.setVideoNetResolutionForShare(shareWidth, shareHeight);
    }
    /**
     * 设置屏幕共享网络传输帧率
     */
    static setShareFps(fps) {
        Youme.setShareFps(fps);
    }
    /**
     * 设置视频本地预览分辨率
     */
    static setVideoLocalResolution(sendWidth, sendHeight) {
        return Youme.setVideoLocalResolution(sendWidth, sendHeight);
    }
    /**
     * 设置贴近屏幕息屏
     */
    static acquireWakeLock() {
        Youme.acquireWakeLock();
    }
    /**
     * 释放贴近屏幕息屏
     */
    static releaseWakeLock() {
        Youme.releaseWakeLock();
    }
    /**
     * 设置 Android 10 及以上通知中心标题
     */
    static setScreenRecorderNotification(title) {
        if (react_native_1.Platform.OS === 'android') {
            Youme.setScreenRecorderNotification(title);
        }
    }
    /**
     * 获取摄像头个数
     */
    static getCameraCount() {
        if (react_native_1.Platform.OS === 'android') {
            return Youme.getCameraCount();
        }
        else {
            return 2;
        }
    }
    /**
     * 判断是否有前置摄像头
     */
    static hasFrontCamera() {
        if (react_native_1.Platform.OS === 'android') {
            return Youme.hasFrontCamera();
        }
        else {
            return true;
        }
    }
    /**
     * 判断是否有后置摄像头
     */
    static hasBackCamera() {
        if (react_native_1.Platform.OS === 'android') {
            return Youme.hasBackCamera();
        }
        else {
            return true;
        }
    }
    /**
     * 获取当前打开的摄像头
     */
    static getCurrentOpenCamera() {
        if (react_native_1.Platform.OS === 'android') {
            return Youme.getCurrentOpenCamera();
        }
        else {
            return 0;
        }
    }
    /**
     * 更改当前打开的摄像头
     */
    static setOpenCamera(cameraId) {
        if (react_native_1.Platform.OS === 'android') {
            Youme.setOpenCamera(cameraId);
        }
    }
}
YoumeVideoEngine.eventTypes = new Set();
/**
 * 获取 SDK 版本号
 */
YoumeVideoEngine.sdkVersion = Youme.sdkVersion + '';
exports.default = YoumeVideoEngine;
//# sourceMappingURL=YoumeVideoEngine.native.js.map