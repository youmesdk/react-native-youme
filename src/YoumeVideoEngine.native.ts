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

  /**
   * 初始化 SDK
   * @param options 初始化参数
   */
  public static init(options: InitOption): Promise<any> {
    return Youme.init(options);
  }

  /**
   * 加入频道（单频道模式，每个时刻只能在一个频道里面）
   * @param options 加入频道参数
   */
  public static joinChannel(options: JoinOption): Promise<any> {
    return Youme.joinChannel(options);
  }

  /**
   * 设置指定事件监听器
   * @param reactNativeEvent 事件名称
   * @param listener 事件监听回调
   */
  public static on(
    reactNativeEvent: string,
    listener: (...args: any[]) => any
  ) {
    this.eventTypes.add(reactNativeEvent);
    YoumeEventEmitter.addListener(reactNativeEvent, listener);
  }

  /**
   * 移除指定事件监听器
   * @param reactNativeEvent 事件名称
   */
  public static off(reactNativeEvent: string) {
    YoumeEventEmitter.removeAllListeners(reactNativeEvent);
    this.eventTypes.delete(reactNativeEvent);
  }

  /**
   * 移除所有监听器
   */
  public static removeAllListeners() {
    for (let eventType of this.eventTypes) {
      YoumeEventEmitter.removeAllListeners(eventType);
    }
    this.eventTypes.clear();
  }

  /**
   * 退出指定的频道
   * @param options 退出频道所需参数，目前为空对象
   */
  public static leaveChannel(options: LeaveOption): Promise<any> {
    return Youme.leaveChannel(options);
  }

  /**
   * 设置预览本地采集数据镜像模式，在加入房间之前设置
   * @param isMirror 预览是否开启镜像功能
   */
  public static setLocalVideoPreviewMirror(isMirror: boolean) {
    Youme.setLocalVideoPreviewMirror(isMirror);
  }

  /**
   * 设置麦克风状态
   * @param mute true——关闭麦克风，false——开启麦克风
   */
  public static setMicrophoneMute(mute: boolean) {
    Youme.setMicrophoneMute(mute);
  }

  /**
   * 设置扬声器状态
   * @param mute true——关闭扬声器，false——开启扬声器
   */
  public static setSpeakerMute(mute: boolean) {
    Youme.setSpeakerMute(mute);
  }

  /**
   * 开启摄像头
   */
  public static startCapturer(switchWithHeightIfLandscape: boolean) {
    Youme.startCapturer(switchWithHeightIfLandscape);
  }

  /**
   * 通知 SDK，屏幕发生旋转
   */
  public static screenRotationChange() {
    Youme.screenRotationChange();
  }

  /**
   * 关闭摄像头
   */
  public static stopCapturer() {
    Youme.stopCapturer();
  }

  /**
   * 设置屏幕常亮
   */
  public static keepScreenOn() {
    Youme.keepScreenOn();
  }

  /**
   * 取消屏幕常亮
   */
  public static cancelScreenOn() {
    Youme.cancelScreenOn();
  }

  /**
   * 切换前后置摄像头
   */
  public static switchCamera() {
    Youme.switchCamera();
  }

  /**
   * 切换语音输出设备
   * @param outputToSpeaker true——输出到扬声器，false——输出到听筒
   */
  public static outputToSpeaker(outputToSpeaker: boolean) {
    Youme.outputToSpeaker(outputToSpeaker);
  }

  /**
   * 设置是否通知别人麦克风和扬声器的开关
   * @param sync 是否通知别人,自己麦克风和扬声器的开关状态
   */
  public static setAutoSendStatus(sync: boolean) {
    Youme.setAutoSendStatus(sync);
  }

  /**
   * 控制他人麦克风
   * @param userid 要控制的用户ID
   * @param mute 是否静音。true:静音别人的麦克风，false：开启别人的麦克风
   */
  public static setOtherMicMute(userid: string, mute: boolean) {
    Youme.setOtherMicMute(userid, mute);
  }

  /**
   * 向服务器发送屏蔽请求，屏蔽指定用户或者解除屏蔽
   * @param userid 用户ID
   * @param block true - 屏蔽, false - 恢复不屏蔽
   */
  public static maskVideoByUserId(userid: string, block: boolean) {
    Youme.maskVideoByUserId(userid, block);
  }

  /**
   * 设置是否听某人的语音
   * @param userid 要控制的用户ID
   * @param listen true表示开启接收指定用户的语音，false表示屏蔽指定用户的语音。
   */
  public static setListenOtherVoice(userid: string, listen: boolean) {
    Youme.setListenOtherVoice(userid, listen);
  }

  /**
   * 一次性订阅远端多个用户大流还是小流。如果设置了不支持的流，则采用默认的第一路流
   * @param usersStreamInfo 订阅用户视频流参数
   */
  public static setUsersVideoInfo(usersStreamInfo: StreamOption[]) {
    Youme.setUsersVideoInfo(usersStreamInfo);
  }

  /**
   * 设置网络适配模式，进频道前设置
   * @param adjustmode 1 为手动适配模式，0 是自动适配模式，默认为0
   */
  public static setVideoNetAdjustmode(adjustMode: number) {
    Youme.setVideoNetAdjustmode(adjustMode);
  }

  /**
   * 设置 SDK 数据统计间隔
   * @param interval 统计间隔
   */
  public static setAVStatisticInterval(interval: number) {
    Youme.setAVStatisticInterval(interval);
  }

  /**
   * 通知 SDK 应用已切至后台
   */
  public static applicationInBackground() {
    Youme.applicationInBackground();
  }

  /**
   * 通知 SDK 应用已切至前台
   */
  public static applicationInFront() {
    Youme.applicationInFront();
  }

  /**
   * 踢出指定 userid
   * @param userid 用户 Id
   * @param channel 用户所处频道号
   * @param forbidSeconds 踢出后，多长时间内不允许再次进入（单位：秒）
   */
  public static kickOtherFromChannel(
    userid: string,
    channel: string,
    forbidSeconds: number
  ) {
    Youme.kickOtherFromChannel(userid, channel, forbidSeconds);
  }

  /**
   * 设置 SDK 是否开启美颜，初始化成功后，进频道前设置
   * @param isOpen 是否开启美颜，true为开启，false为关闭，
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
   * @param shareWidth 分辨率宽度
   * @param shareHeight 分辨率高度
   */
  public static setVideoNetResolution(
    sendWidth: number,
    sendHeight: number
  ): void {
    return Youme.setVideoNetResolution(sendWidth, sendHeight);
  }

  /**
   * 设置视频网络传输大流帧率
   * @param fps 帧率
   */
  public static setVideoFps(fps: number): void {
    Youme.setVideoFps(fps);
  }

  /**
   * 设置视频网络传输小流帧率
   * @param fps 帧率
   */
  public static setVideoFpsForSecond(fps: number): void {
    Youme.setVideoFpsForSecond(fps);
  }

  /**
   * 设置视频本地预览帧率
   * @param fps 帧率
   */
  public static setVideoPreviewFps(fps: number): void {
    Youme.setVideoPreviewFps(fps);
  }

  /**
   * 设置屏幕共享网络传输分辨率
   * @param shareWidth 分辨率宽度
   * @param shareHeight 分辨率高度
   */
  public static setVideoNetResolutionForShare(
    shareWidth: number,
    shareHeight: number
  ): void {
    return Youme.setVideoNetResolutionForShare(shareWidth, shareHeight);
  }

  /**
   * 设置屏幕共享网络传输帧率
   * @param fps 帧率
   */
  public static setShareFps(fps: number): void {
    Youme.setShareFps(fps);
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
   * 设置贴近屏幕息屏
   */
  public static acquireWakeLock() {
    Youme.acquireWakeLock();
  }

  /**
   * 释放贴近屏幕息屏
   */
  public static releaseWakeLock() {
    Youme.releaseWakeLock();
  }

  /**
   * 设置 Android 10 及以上通知中心标题（Android Only）
   * @param title 通知中心标题
   */
  public static setScreenRecorderNotification(title: string) {
    if (Platform.OS === 'android') {
      Youme.setScreenRecorderNotification(title);
    }
  }

  /**
   * 获取摄像头个数（Android Only）
   */
  public static getCameraCount(): number {
    if (Platform.OS === 'android') {
      return Youme.getCameraCount();
    } else {
      return 2;
    }
  }

  /**
   * 判断是否有前置摄像头（Android Only）
   */
  public static hasFrontCamera(): boolean {
    if (Platform.OS === 'android') {
      return Youme.hasFrontCamera();
    } else {
      return true;
    }
  }

  /**
   * 判断是否有后置摄像头（Android Only）
   */
  public static hasBackCamera(): boolean {
    if (Platform.OS === 'android') {
      return Youme.hasBackCamera();
    } else {
      return true;
    }
  }

  /**
   * 获取当前打开的摄像头（Android Only）
   */
  public static getCurrentOpenCamera(): number {
    if (Platform.OS === 'android') {
      return Youme.getCurrentOpenCamera();
    } else {
      return 0;
    }
  }

  /**
   * 更改当前打开的摄像头（Android Only）
   * @param cameraId 摄像头 Id
   */
  public static setOpenCamera(cameraId: number): void {
    if (Platform.OS === 'android') {
      Youme.setOpenCamera(cameraId);
    }
  }

  /**
   * 获取 SDK 版本号
   */
  public static sdkVersion = Youme.sdkVersion + '';
}

export default YoumeVideoEngine;
