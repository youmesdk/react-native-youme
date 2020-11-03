import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

import {
  InitOption,
  JoinOption,
  LeaveOption,
  StreamOption,
  YOUME_REACT_NATIVE_EVENT,
  YOUME_USER_ROLE,
  YOUME_ERROR_CODE,
} from './types';

const { Youme } = NativeModules;
const YoumeEventEmitter = new NativeEventEmitter(Youme);

/**
 * YoumeVideoEngine is the react native javascript interface for Youme Video SDK
 */
class YoumeVideoEngine {
  private static eventTypes: Set<string> = new Set<string>();

  public static init(options: InitOption): Promise<any> {
    return Youme.init(options);
  }

  public static joinChannel(options: JoinOption): Promise<any> {
    return Youme.joinChannel(options);
  }

  public static on(
    reactNativeEvent: string,
    listener: (...args: any[]) => any
  ) {
    this.eventTypes.add(reactNativeEvent);
    YoumeEventEmitter.addListener(reactNativeEvent, listener);
  }

  public static off(reactNativeEvent: string) {
    YoumeEventEmitter.removeAllListeners(reactNativeEvent);
    this.eventTypes.delete(reactNativeEvent);
  }

  public static removeAllListeners() {
    for (let eventType of this.eventTypes) {
      YoumeEventEmitter.removeAllListeners(eventType);
    }
    this.eventTypes.clear();
  }

  public static leaveChannel(options: LeaveOption): Promise<any> {
    return Youme.leaveChannel(options);
  }

  public static setLocalVideoPreviewMirror(isMirror: boolean) {
    Youme.setLocalVideoPreviewMirror(isMirror);
  }

  public static setMicrophoneMute(mute: boolean) {
    Youme.setMicrophoneMute(mute);
  }

  public static setSpeakerMute(mute: boolean) {
    Youme.setSpeakerMute(mute);
  }

  public static startCapturer(switchWithHeightIfLandscape: boolean) {
    Youme.startCapturer(switchWithHeightIfLandscape);
  }

  /**
   * 通知SDK，屏幕发生旋转
   */
  public static screenRotationChange() {
    Youme.screenRotationChange();
  }

  public static stopCapturer() {
    Youme.stopCapturer();
  }

  public static keepScreenOn() {
    Youme.keepScreenOn();
  }

  public static cancelScreenOn() {
    Youme.cancelScreenOn();
  }

  public static switchCamera() {
    Youme.switchCamera();
  }

  public static outputToSpeaker(outputToSpeaker: boolean) {
    Youme.outputToSpeaker(outputToSpeaker);
  }

  public static setAutoSendStatus(sync: boolean) {
    Youme.setAutoSendStatus(sync);
  }

  public static setOtherMicMute(userid: string, mute: boolean) {
    Youme.setOtherMicMute(userid, mute);
  }

  public static maskVideoByUserId(userid: string, block: boolean) {
    Youme.maskVideoByUserId(userid, block);
  }

  public static setListenOtherVoice(userid: string, listen: boolean) {
    Youme.setListenOtherVoice(userid, listen);
  }

  public static setUsersVideoInfo(usersStreamInfo: StreamOption[]) {
    Youme.setUsersVideoInfo(usersStreamInfo);
  }

  public static setVideoNetAdjustmode(adjustMode: number) {
    Youme.setVideoNetAdjustmode(adjustMode);
  }

  public static setAVStatisticInterval(interval: number) {
    Youme.setAVStatisticInterval(interval);
  }

  public static applicationInBackground() {
    Youme.applicationInBackground();
  }

  public static applicationInFront() {
    Youme.applicationInFront();
  }

  public static kickOtherFromChannel(
    userid: string,
    channel: string,
    forbidSeconds: number
  ) {
    Youme.kickOtherFromChannel(userid, channel, forbidSeconds);
  }

  /**
   * 设置sdk 是否开启美颜，true为开启，false为关闭，初始化成功后，进频道前设置
   * @param isOpen 是否开启美颜
   */
  public static openBeautify(isOpen: boolean) {
    Youme.openBeautify(isOpen);
  }

  /**
   * 设置sdk 美颜等级，初始化成功后，进频道前后设置
   * @param level 美颜等级，0.0 - 1.0
   */
  public static setBeautyLevel(level: number) {
    Youme.setBeautyLevel(level);
  }

  /**
   * 开始屏幕录制
   */
  public static startScreenRecorder(): Promise<any> {
    return Youme.startScreenRecorder();
  }

  /**
   * 停止屏幕录制
   */
  public static stopScreenRecorder() {
    Youme.stopScreenRecorder();
  }

  /**
   * 设置视频网络传输分辨率
   */
  public static setVideoNetResolution(
    sendWidth: number,
    sendHeight: number
  ): void {
    return Youme.setVideoNetResolution(sendWidth, sendHeight);
  }

  /**
   * 设置屏幕共享网络传输分辨率
   */
  public static setVideoNetResolutionForShare(
    shareWidth: number,
    shareHeight: number
  ): void {
    return Youme.setVideoNetResolutionForShare(shareWidth, shareHeight);
  }

  /**
   * 设置视频本地预览分辨率
   */
  public static setVideoLocalResolution(
    sendWidth: number,
    sendHeight: number
  ): void {
    return Youme.setVideoLocalResolution(sendWidth, sendHeight);
  }

  /**
   * 获取 SDK 版本号
   */
  public static sdkVersion = Youme.sdkVersion + '';
}

export default YoumeVideoEngine;
