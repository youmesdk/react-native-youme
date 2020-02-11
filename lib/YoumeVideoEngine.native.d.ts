import { InitOption, JoinOption, LeaveOption, StreamOption } from "./types";
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
}
export default YoumeVideoEngine;
