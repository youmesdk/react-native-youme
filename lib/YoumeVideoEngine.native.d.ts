import { InitOption, JoinOption, LeaveOption, StreamOption } from './types';
/**
 * YoumeVideoEngine is the react native javascript interface for Youme Video SDK
 */
declare class YoumeVideoEngine {
    private static eventTypes;
    static init(options: InitOption): Promise<any>;
    static joinChannel(options: JoinOption): Promise<any>;
    static on(reactNativeEvent: string, listener: (...args: any[]) => any): void;
    static off(reactNativeEvent: string): void;
    static removeAllListeners(): void;
    static leaveChannel(options: LeaveOption): Promise<any>;
    static setLocalVideoPreviewMirror(isMirror: boolean): void;
    static setMicrophoneMute(mute: boolean): void;
    static setSpeakerMute(mute: boolean): void;
    static startCapturer(switchWithHeightIfLandscape: boolean): void;
    /**
     * 通知SDK，屏幕发生旋转
     */
    static screenRotationChange(): void;
    static stopCapturer(): void;
    static keepScreenOn(): void;
    static cancelScreenOn(): void;
    static switchCamera(): void;
    static outputToSpeaker(outputToSpeaker: boolean): void;
    static setAutoSendStatus(sync: boolean): void;
    static setOtherMicMute(userid: string, mute: boolean): void;
    static maskVideoByUserId(userid: string, block: boolean): void;
    static setListenOtherVoice(userid: string, listen: boolean): void;
    static setUsersVideoInfo(usersStreamInfo: StreamOption[]): void;
    static setVideoNetAdjustmode(adjustMode: number): void;
    static setAVStatisticInterval(interval: number): void;
    static applicationInBackground(): void;
    static applicationInFront(): void;
    static kickOtherFromChannel(userid: string, channel: string, forbidSeconds: number): void;
    /**
     * 设置sdk 是否开启美颜，true为开启，false为关闭，初始化成功后，进频道前设置
     * @param isOpen 是否开启美颜
     */
    static openBeautify(isOpen: boolean): void;
    /**
     * 设置sdk 美颜等级，初始化成功后，进频道前后设置
     * @param level 美颜等级，0.0 - 1.0
     */
    static setBeautyLevel(level: number): void;
    /**
     * 开始屏幕录制
     */
    static startScreenRecorder(): Promise<any>;
    /**
     * 停止屏幕录制
     */
    static stopScreenRecorder(): void;
    /**
     * 设置视频网络传输分辨率
     */
    static setVideoNetResolution(sendWidth: number, sendHeight: number): void;
    /**
     * 设置视频网络传输大流帧率
     */
    static setVideoFps(fps: number): void;
    /**
     * 设置视频网络传输小流帧率
     */
    static setVideoFpsForSecond(fps: number): void;
    /**
     * 设置视频本地预览帧率
     */
    static setVideoPreviewFps(fps: number): void;
    /**
     * 设置屏幕共享网络传输分辨率
     */
    static setVideoNetResolutionForShare(shareWidth: number, shareHeight: number): void;
    /**
     * 设置屏幕共享网络传输帧率
     */
    static setShareFps(fps: number): void;
    /**
     * 设置视频本地预览分辨率
     */
    static setVideoLocalResolution(sendWidth: number, sendHeight: number): void;
    /**
     * 设置贴近屏幕息屏
     */
    static acquireWakeLock(): void;
    /**
     * 释放贴近屏幕息屏
     */
    static releaseWakeLock(): void;
    /**
     * 设置 Android 10 及以上通知中心标题
     */
    static setScreenRecorderNotification(title: string): void;
    /**
     * 获取摄像头个数
     */
    static getCameraCount(): number;
    /**
     * 判断是否有前置摄像头
     */
    static hasFrontCamera(): boolean;
    /**
     * 判断是否有后置摄像头
     */
    static hasBackCamera(): boolean;
    /**
     * 获取当前打开的摄像头
     */
    static getCurrentOpenCamera(): number;
    /**
     * 更改当前打开的摄像头
     */
    static setOpenCamera(cameraId: number): void;
    /**
     * 获取 SDK 版本号
     */
    static sdkVersion: string;
}
export default YoumeVideoEngine;
