# 游密实时通话 React native 插件



## 运行 example

1. 安装依赖

   `npm install`

   or

   `yarn`

   RN >= 0.60

   安装 CocoaPods 依赖（iOS Only）

   iOS: `npx pod-install` or `cd ios && pod install`

   RN <= 0.59

   `react-native link`

2. 编译运行

   Android: `react-native run-android`

   iOS: `react-native run-ios`

3. 打包 Android APK

   `pushd android && ./gradlew clean && ./gradlew assembleRelease && popd`

   打包输出路径: example/android/app/build/outputs/apk/release/
   
   

## API 文档

### YoumeVideoEngine.init(options)

初始化 SDK

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| :-- | :-- | --- |
| options | <code>object</code> | 初始化参数 |
| [options.appKey] | <code>string</code> | 从游密申请到的 app key, 这个是你们应用程序的唯一标识。 |
| [options.secretKey] | <code>string</code> | 对应 appKey 的私钥, 这个需要妥善保存，不要暴露给其他人 |
| [options.region] | <code>number</code> | 设置首选连接服务器的区域码 |
| [options.regionExt] | <code>string</code> | 自定义的扩展的服务器区域名 |



### YoumeVideoEngine.joinChannel(options)

加入频道（单频道模式，每个时刻只能在一个频道里面）

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| options | <code>object</code> | 加入频道参数 |
| [options.userid] | <code>string</code> | 用户标识 |
| [options.channel] | <code>string</code> | 频道标识 |
| [options.token] | <code>string</code> | 身份验证用token |
| [options.role] | <code>number</code> | 用户在语音频道里面的角色 |
| [options.checkRoomExist] | <code>boolean</code> | 检查频道是否存在，**deprecated** |
| [options.fps] | <code>number</code> | 视频网络传输大流帧率 |
| [options.previewWidth] | <code>number</code> | 视频本地预览分辨率宽度 |
| [options.previewHeight] | <code>number</code> | 视频本地预览分辨率高度 |
| [options.sendWidth] | <code>number</code> | 视频网络传输分辨率宽度 |
| [options.sendHeight] | <code>number</code> | 视频网络传输分辨率高度 |
| [options.secondStreamWidth] | <code>number</code> | 视频网络传输小流分辨率宽度 |
| [options.secondStreamHeight] | <code>number</code> | 视频网络传输小流分辨率高度 |
| [options.autoRecvStream] | <code>boolean</code> | 是否自动接收频道内其他有人的视频，true表示自动接收，如果为false，需要调用 |
| [options.secondStreamFPS] | <code>number</code> | 视频网络传输小流帧率 |
| [options.VBR] | <code>boolean</code> | 是否使用VBR动态码率模式，默认 false，尽可能保持码率平稳，true 允许一定范围的波动，可以提高移动时的画面稳定性 |
| [options.secondStreamVBR] | <code>boolean</code> | 是否使用VBR动态码率模式，默认false，尽可能保持码率平稳，true 允许一定范围的波动，可以提高移动时的画面稳定性 |



### YoumeVideoEngine.on(reactNativeEvent,listener)

设置指定事件监听器

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| reactNativeEvent | <code>string</code> | 事件名称 |
| listener | <code>Function</code> | 事件监听回调 |



### YoumeVideoEngine.off(reactNativeEvent)

移除指定事件监听器

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| reactNativeEvent | <code>string</code> | 事件名称 |



### YoumeVideoEngine.removeAllListeners()

移除所有监听器

**类型:** 静态方法（method）



### YoumeVideoEngine.leaveChannel(options)

退出指定的频道

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| options | <code>object</code> | 退出频道参数，目前为空对象 |



### YoumeVideoEngine.setLocalVideoPreviewMirror(isMirror)

设置预览本地采集数据镜像模式，在加入房间之前设置

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| isMirror | <code>boolean</code> | true: 开启镜像功能，false: 关闭镜像功能 |



### YoumeVideoEngine.setMicrophoneMute(mute)

设置麦克风状态

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| mute | <code>boolean</code> | true: 关闭麦克风，false: 开启麦克风 |



### YoumeVideoEngine.setSpeakerMute(mute)

设置扬声器状态

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| mute | <code>boolean</code> | true: 关闭扬声器，false: 开启扬声器 |



### YoumeVideoEngine.startCapturer()

开启摄像头

**类型:** 静态方法（method）



### YoumeVideoEngine.stopCapturer()

关闭摄像头

**类型:** 静态方法（method）



### YoumeVideoEngine.screenRotationChange()

通知 SDK，屏幕发生旋转

**类型:** 静态方法（method）



### YoumeVideoEngine.keepScreenOn()

设置屏幕常亮

**类型:** 静态方法（method）



### YoumeVideoEngine.cancelScreenOn()

取消屏幕常亮

**类型:** 静态方法（method）



### YoumeVideoEngine.switchCamera()

切换前后置摄像头

**类型:** 静态方法（method）



### YoumeVideoEngine.outputToSpeaker(outputToSpeaker)

切换语音输出设备

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| outputToSpeaker | <code>boolean</code> | true: 输出到扬声器，false: 输出到听筒 |



### YoumeVideoEngine.setAutoSendStatus(sync)

设置是否通知别人麦克风和扬声器的开关

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| sync | <code>boolean</code> | 是否通知别人,自己麦克风和扬声器的开关状态 |



### YoumeVideoEngine.setOtherMicMute(userid, mute)

控制他人麦克风

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| userid | <code>string</code> | 要控制的用户ID |
| mute | <code>boolean</code> | 是否静音。true: 静音别人的麦克风，false：开启别人的麦克风 |



### YoumeVideoEngine.maskVideoByUserId(userid, block)

向服务器发送屏蔽请求，屏蔽指定用户或者解除屏蔽

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| userid | <code>string</code> | 要控制的用户ID |
| block | <code>boolean</code> | true: 屏蔽, false: 恢复不屏蔽 |



### YoumeVideoEngine.setUsersVideoInfo(usersStreamInfo)

一次性订阅远端多个用户大流还是小流。如果设置了不支持的流，则采用默认的第一路流

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| usersStreamInfo | <code>object[]</code> | 订阅用户视频流参数 |
| [usersStreamInfo.userID] | <code>string</code> | 用户ID |
| [usersStreamInfo.streamID] | <code>number</code> | true: 屏蔽, false: 恢复不屏蔽 |



### YoumeVideoEngine.setListenOtherVoice(userid, listen)

设置是否听某人的语音

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| userid | <code>string</code> | 用户ID |
| listen | <code>boolean</code> | true:表示开启接收指定用户的语音，false:表示屏蔽指定用户的语音 |



### YoumeVideoEngine.setVideoNetAdjustmode(adjustmode)

设置网络适配模式，进频道前设置

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| adjustmode | <code>number</code> | 1 为手动适配模式，0 是自动适配模式，默认为0 |



### YoumeVideoEngine.setAVStatisticInterval(interval)

设置 SDK 数据统计间隔

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| interval | <code>number</code> | 统计间隔 |



### YoumeVideoEngine.applicationInBackground()

通知 SDK 应用已切至后台

**类型:** 静态方法（method）



### YoumeVideoEngine.applicationInFront()

通知 SDK 应用已切至前台

**类型:** 静态方法（method）



### YoumeVideoEngine.kickOtherFromChannel(userid,channel,forbidSeconds)

设置 SDK 数据统计间隔

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| userid | <code>string</code> | 用户ID |
| channel | <code>string</code> | 用户所处频道号 |
| forbidSeconds | <code>number</code> | 踢出后，多长时间内不允许再次进入（单位：秒） |



### YoumeVideoEngine.openBeautify(isOpen)

设置 SDK 是否开启美颜，初始化成功后，进频道前设置

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| isOpen | <code>boolean</code> | 是否开启美颜，true: 开启，false: 关闭 |



### YoumeVideoEngine.setBeautyLevel(level)

设置sdk 美颜等级，初始化成功后，进频道前后设置

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| level | <code>number</code> | 美颜等级，0.0 - 1.0 |



### YoumeVideoEngine.startScreenRecorder()

开始屏幕录制，Android Only

**类型:** 静态方法（method）



### YoumeVideoEngine.stopScreenRecorder()

停止屏幕录制，Android Only

**类型:** 静态方法（method）



### YoumeVideoEngine.setVideoNetResolution(sendWidth,sendHeight)

设置视频网络传输分辨率

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| shareWidth | <code>number</code> | 分辨率宽度 |
| shareHeight | <code>number</code> | 分辨率高度 |



### YoumeVideoEngine.setVideoNetResolutionForShare(sendWidth,sendHeight)

设置屏幕共享网络传输分辨率

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| shareWidth | <code>number</code> | 分辨率宽度 |
| shareHeight | <code>number</code> | 分辨率高度 |



### YoumeVideoEngine.setVideoLocalResolution(sendWidth,sendHeight)

设置视频本地预览分辨率

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| shareWidth | <code>number</code> | 分辨率宽度 |
| shareHeight | <code>number</code> | 分辨率高度 |



### YoumeVideoEngine.setVideoFps(fps)

设置视频网络传输大流帧率

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| fps | <code>number</code> | 帧率 |



### YoumeVideoEngine.setVideoFpsForSecond(fps)

设置视频网络传输小流帧率

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| fps | <code>number</code> | 帧率 |



### YoumeVideoEngine.setVideoPreviewFps(fps)

设置视频本地预览帧率

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| fps | <code>number</code> | 帧率 |



### YoumeVideoEngine.setShareFps(fps)

设置屏幕共享网络传输帧率，Android Only

**类型:** 静态方法（method）

**参数说明:**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| fps | <code>number</code> | 帧率 |



### YoumeVideoEngine.acquireWakeLock()

设置贴近屏幕息屏

**类型:** 静态方法（method）



### YoumeVideoEngine.releaseWakeLock()

释放贴近屏幕息屏

**类型:** 静态方法（method）



### YoumeVideoEngine.getCameraCount()

获取摄像头个数，Android Only

**类型:** 静态方法（method）

**返回值:** <code>number</code> - 摄像头个数



### YoumeVideoEngine.hasFrontCamera()

判断是否有前置摄像头，Android Only

**类型:** 静态方法（method）

**返回值:** <code>boolean</code> - 是否有前置摄像头



### YoumeVideoEngine.hasBackCamera()

判断是否有后置摄像头，Android Only

**类型:** 静态方法（method）

**返回值:** <code>boolean</code> - 是否有后置摄像头



### YoumeVideoEngine.getCurrentOpenCamera()

获取当前打开的摄像头，Android Only

**类型:** 静态方法（method）

**返回值:**  <code>number</code> - 当前打开的摄像头ID



### YoumeVideoEngine.sdkVersion()

获取 SDK 版本号

**类型:** 静态属性（property）