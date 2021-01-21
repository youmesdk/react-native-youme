//
//  RCTYoume.m
//  RCTYoume
//

#import "RCTYoume.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTView.h>
#import "YoumeConst.h"

@interface RCTYoume ()

@property (strong, nonatomic) YMVoiceService *engine;
@property (retain, atomic) NSMutableArray<NSArray*>* sdkInitPromise;
@property (retain, atomic) NSMutableArray<NSArray*>* joinPromise;
@property (retain, atomic) NSMutableArray<NSArray*>* leavePromise;

@end

@implementation RCTYoume

RCT_EXPORT_MODULE();

+(BOOL)requiresMainQueueSetup {
    return YES;
}

@synthesize bridge = _bridge;

- (id) init {
    self = [super init];
    self.sdkInitPromise = [[NSMutableArray alloc] init];
    self.joinPromise    = [[NSMutableArray alloc] init];
    self.leavePromise   = [[NSMutableArray alloc] init];
    return self;
}

//销毁引擎实例
- (void)dealloc {
    [[YMVoiceService getInstance] unInit];
}

//导出常量
- (NSDictionary *)constantsToExport {
    
    NSString* sdkVersion = [[YMVoiceService getInstance] getSdkVersion];
    
    return @{
        @"sdkVersion": [NSString stringWithFormat:@"%@", sdkVersion]  //SDK 版本号
    };
}

- (NSError *) makeNSError:(NSDictionary *)options {
    NSError *error = [NSError errorWithDomain:@"RCTYoumeErrorDomain"
                                         code:[options[@"code"] integerValue]
                                     userInfo:options[@"message"]];
    return error;
}

RCT_EXPORT_METHOD(init:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if([options[@"serverMode"] integerValue] > 0)
    {
        int serverMode = (int)[options[@"serverMode"] integerValue];
        [[YMVoiceService getInstance] setServerMode:serverMode];
        if(serverMode == 7 || serverMode == 4)
        {
            [[YMVoiceService getInstance] setServerIP: options[@"serverIP"] port:(int)[options[@"serverPort"] integerValue]];
        }
    }
    
    if([options[@"testServer"] boolValue]) [[YMVoiceService getInstance] setTestServer:true];
    [YoumeConst share].engine    = [YMVoiceService getInstance];
    [YoumeConst share].appKey    = options[@"appKey"];
    [YoumeConst share].secretKey = options[@"secretKey"];
    [YoumeConst share].region    = (int)[options[@"region"] integerValue];
    [YoumeConst share].extRegion = options[@"regionExt"] != nil ? options[@"regionExt"] : @"";
    
    self.engine = [YMVoiceService getInstance];
    int code = [self.engine initSDK:self
                  appkey:[YoumeConst share].appKey 
               appSecret:[YoumeConst share].secretKey 
                regionId:[YoumeConst share].region 
        serverRegionName:[YoumeConst share].extRegion];
    if (code != 0) {
        reject([NSString stringWithFormat:@"%d",code], @"init error", [self makeNSError:@{
                                                                                          @"code": @(code),
                                                                                          @"message":@{
                                                                                                  @"success": @(NO),
                                                                                                  @"value":[NSNumber numberWithInteger:code]
                                                                                                  }
                                                                                          }]);
    }else{
        NSArray* promise = [[NSArray alloc] initWithObjects:resolve, reject, nil];
        [self.sdkInitPromise addObject:promise];
    }
}

//加入房间
RCT_EXPORT_METHOD(joinChannel:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    //保存一下uid 在自定义视图使用
    [YoumeConst share].localUid = options[@"userid"];
    NSString *channelID         = options[@"channel"];
    NSString *token             = options[@"token"];
    int      role               = (int)[options[@"role"] integerValue];
    BOOL     checkRoomExist     = [options[@"checkRoomExist"] boolValue];
    int      fps                = options[@"fps"] != nil ? (int)[options[@"fps"] integerValue] : 15;
    int      previewFps         = options[@"previewFps"] != nil ? (int)[options[@"previewFps"] integerValue] : 30;
    int      previewHeight      = options[@"previewHeight"] != nil ? (int)[options[@"previewHeight"] integerValue] : 640;
    int      previewWidth       = options[@"previewWidth"] != nil ? (int)[options[@"previewWidth"] integerValue] : 480;
    int      sendWidth          = options[@"sendWidth"] != nil ? (int)[options[@"sendWidth"] integerValue] : 480;
    int      sendHeight         = options[@"sendHeight"] != nil ? (int)[options[@"sendHeight"] integerValue] : 640;
    int      secondStreamWidth  = (int)[options[@"secondStreamWidth"] integerValue];
    int      secondStreamHeight = (int)[options[@"secondStreamHeight"] integerValue];
    
    int      bitRateMin         = (int)[options[@"bitRateMin"] integerValue];
    int      bitRateMax         = (int)[options[@"bitRateMax"] integerValue];
    int      bitRateForSecondMin= (int)[options[@"secondStreamBitRateMin"] integerValue];
    int      bitRateForSecondMax= (int)[options[@"secondStreamBitRateMax"] integerValue];
    int      fpsForSecond       = options[@"secondStreamFPS"] != nil ? (int)[options[@"secondStreamFPS"] integerValue] : fps;
    BOOL     VBR                = [options[@"VBR"] boolValue];
    BOOL     secondStreamVBR    = [options[@"secondStreamVBR"] boolValue];
    BOOL     autoRecvStream     = [options[@"autoRecvStream"] boolValue];
    

    [self.engine setVideoFps:fps];
    [self.engine setVideoLocalResolutionWidth:previewWidth height:previewHeight];
    [self.engine setVideoNetResolutionWidth:sendWidth height:sendHeight];
    [self.engine setVideoNetResolutionWidthForSecond:secondStreamWidth height:secondStreamHeight];
    [self.engine setVideoPreviewFps:previewFps];
    // 设置音视频质量统计数据的回调频率
    [self.engine setAVStatisticInterval: 5000];
    // 设置视频无渲染帧超时等待时间，单位毫秒
    [self.engine setVideoNoFrameTimeout: 5000];
    // 开启自动同步本地状态给其它成员
    [self.engine setAutoSendStatus: true ];
    //[self.engine setVideoNetAdjustmode: 1];
    
    [self.engine setVBR: VBR ? true: false];
    [self.engine setVBRForSecond: secondStreamVBR ? true : false];
    [self.engine setVideoCodeBitrateForSecond:bitRateForSecondMax minBitrate:bitRateForSecondMin];
    [self.engine setVideoFpsForSecond: fpsForSecond];
    [self.engine setVideoCodeBitrate: bitRateMax minBitrate: bitRateMin];

    //开启讲话音量回调
    [self.engine setMicLevelCallback:10];
    //开启远端语音音量回调
    [self.engine setFarendVoiceLevelCallback:10];

    if(token != nil)
    {
        [self.engine setToken: token];
    }
    
    int code = [self.engine joinChannelSingleMode:[YoumeConst share].localUid channelID:channelID userRole:role autoRecv: autoRecvStream ? true : false];
    if (code != 0) {
        reject([NSString stringWithFormat:@"%d",code], @"call join fail", [self makeNSError:@{
                                                                                          @"code": @(code),
                                                                                          @"message":@{
                                                                                                  @"success": @(NO),
                                                                                                  @"value":[NSNumber numberWithInteger:code]
                                                                                                  }
                                                                                          }]);
    }else{
        NSArray* promise = [[NSArray alloc] initWithObjects:resolve, reject, nil];
        [self.joinPromise addObject:promise];
    }
    
}

//切换前置/后置摄像头
RCT_EXPORT_METHOD(switchCamera){
    [self.engine switchCamera];
}

//开启视频模式
RCT_EXPORT_METHOD(startCapturer:(BOOL) switchWithHeightIfLandscape){
    // 不需要再调用，改为sdk内部集成
    //if(switchWithHeightIfLandscape) [self.engine screenRotationChange];//横竖屏分辨率交换自动设置
    [self.engine startCapture];
}

//关闭摄像头
RCT_EXPORT_METHOD(stopCapturer){
    [self.engine stopCapture];
}

RCT_EXPORT_METHOD(screenRotationChange){
    [self.engine screenRotationChange];
}

RCT_EXPORT_METHOD(applicationInFront){

}

RCT_EXPORT_METHOD(applicationInBackground){
    
}

RCT_EXPORT_METHOD(outputToSpeaker:(BOOL) enableSpeaker){
    [self.engine setOutputToSpeaker:enableSpeaker];
}

RCT_EXPORT_METHOD(setLocalVideoPreviewMirror:(BOOL) isMirror){
    [self.engine setLocalVideoPreviewMirror: isMirror];
}

RCT_EXPORT_METHOD(setMicrophoneMute:(BOOL) mute){
    [self.engine setMicrophoneMute: mute];
}

RCT_EXPORT_METHOD(setSpeakerMute:(BOOL) mute){
    [self.engine setSpeakerMute: mute];
}

RCT_EXPORT_METHOD(setAutoSendStatus:(BOOL) sync){
    [self.engine setAutoSendStatus: sync];
}

RCT_EXPORT_METHOD(setTCP:(BOOL) userTcp){
    [self.engine setTCPMode: userTcp];
}

RCT_EXPORT_METHOD(setOtherMicMute:(NSString *) userid mute:(BOOL)mute){
    [self.engine setOtherMicMute:userid mute:mute];
}

RCT_EXPORT_METHOD(maskVideoByUserId:(NSString *) userid block:(BOOL)block){
    [self.engine maskVideoByUserId:userid mask:block];
}

RCT_EXPORT_METHOD(setListenOtherVoice:(NSString *) userid listen:(BOOL)listen){
    [self.engine setListenOtherVoice:userid isOn:listen];
}

RCT_EXPORT_METHOD(setUsersVideoInfo:(NSArray *) usersStreamInfo){
    NSMutableArray* userIds = [NSMutableArray new];
    NSMutableArray* streamIds = [NSMutableArray new];
    for(int i=0; i< usersStreamInfo.count; i++)
    {
        NSDictionary* userInfo = usersStreamInfo[i];
        [userIds addObject:userInfo[@"userID"]];
        [streamIds addObject:[userInfo[@"streamID"] stringValue]];
        NSLog(@"setUsersVideoInfo: %@ %@", userInfo[@"userID"], [userInfo[@"streamID"] stringValue]);
    }
    if(userIds.count >0 && streamIds.count == userIds.count) {
        [self.engine setUsersVideoInfo:userIds resolutionArray:streamIds];
    }else{
        NSLog(@"setUsersVideoInfo error %d %d", userIds.count, streamIds.count);
    }
}

//关闭视频
RCT_EXPORT_METHOD(leaveChannel:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
    int code = [self.engine leaveChannelAll];
    if (code != 0) {
        resolve (@{@"eventType": @(YOUME_EVENT_LEAVED_ALL),
                   @"code":@(code),
                   @"channel": @"",
                   @"param": @""});
    }else{
        NSArray* promise = [[NSArray alloc] initWithObjects:resolve, reject, nil];
        [self.leavePromise addObject:promise];
    }
}

RCT_EXPORT_METHOD(keepScreenOn){
    [UIApplication sharedApplication].idleTimerDisabled = YES;
}

RCT_EXPORT_METHOD(cancelScreenOn){
    [UIApplication sharedApplication].idleTimerDisabled = NO;
}

RCT_EXPORT_METHOD(openBeautify:(BOOL) open){
    [self.engine openBeautify: open];
}

RCT_EXPORT_METHOD(setBeautyLevel:(float) level){
    [self.engine beautifyChanged: level];
}

RCT_EXPORT_METHOD(setVideoNetAdjustmode:(int) adjustMode){
    [self.engine setVideoNetAdjustmode: adjustMode];
}

RCT_EXPORT_METHOD(setAVStatisticInterval:(int) interval){
    [self.engine setAVStatisticInterval: interval];
}

RCT_EXPORT_METHOD(setVideoNetResolution:(int) sendWidth sendHeight:(int) sendHeight){
    [self.engine setVideoNetResolutionWidth:sendWidth height:sendHeight];
}

RCT_EXPORT_METHOD(setVideoNetResolutionForShare:(int) shareWidth shareHeight:(int) shareHeight){
    
}

//设置大流fps
RCT_EXPORT_METHOD(setVideoFps:(int) fps){
    [self.engine setVideoFps:fps];
}

//设置小流fps
RCT_EXPORT_METHOD(setVideoFpsForSecond:(int) fps){
   [self.engine setVideoFpsForSecond: fps];
}

//设置预览fps
RCT_EXPORT_METHOD(setVideoPreviewFps:(int) fps){
    [self.engine setVideoPreviewFps:fps];
}

RCT_EXPORT_METHOD(setShareFps:(int) fps){
    
}

RCT_EXPORT_METHOD(setVideoLocalResolution:(int) sendWidth sendHeight:(int) sendHeight){
    [self.engine setVideoLocalResolutionWidth:sendWidth height:sendHeight];
}

//设置红外感应，贴近屏幕黑屏，远离屏幕亮屏
RCT_EXPORT_METHOD(acquireWakeLock){
    [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
}

//取消红外感应
RCT_EXPORT_METHOD(releaseWakeLock){
    [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
}

#pragma mark - <VoiceEngineCallback>
/**
 *  功能描述: 一般事件通知
 *  @param eventType 事件类型
 *  @param iErrorCode 错误码
 *  @param roomid 时间发生的房间号
 *  @param param 其他参数，根据eventType不同而不同
 */
- (void)onYouMeEvent:(YouMeEvent_t)eventType errcode:(YouMeErrorCode_t)iErrorCode roomid:(NSString *)roomid param:(NSString *)param
{
    NSString* copyedRoomID = [roomid copy];
    NSString* copyParam = [param copy];
    dispatch_async (dispatch_get_main_queue (), ^{
        switch (eventType) {
            case YOUME_EVENT_INIT_OK:
            {
                if(self.sdkInitPromise.count > 0)
                {
                    NSArray* promise = [self.sdkInitPromise objectAtIndex:0];
                    [self.sdkInitPromise removeObjectAtIndex:0];
                    if(promise.count > 0) ((RCTPromiseResolveBlock)(promise[0]))(@{@"eventType": @(eventType),
                                                                                   @"code":@(iErrorCode),
                                                                                   @"channel": copyedRoomID,
                                                                                   @"param":copyParam});
                }
            }
                break;
            case YOUME_EVENT_INIT_FAILED:
            {
                if(self.sdkInitPromise.count > 0)
                {
                    NSArray* promise = [self.sdkInitPromise objectAtIndex:0];
                    [self.sdkInitPromise removeObjectAtIndex:0];
                    if(promise.count > 1) ((RCTPromiseRejectBlock)(promise[1]))([NSString stringWithFormat:@"%d",iErrorCode], @"init failed", [self makeNSError:@{
                                                                                                                                                                @"code": @(iErrorCode),
                                                                                                                                                                @"message":@{
                                                                                                                                                                        @"success": @(NO),
                                                                                                                                                                        @"value":[NSNumber numberWithInteger:iErrorCode]
                                                                                                                    }
                                                                                                                    }]);
                }
            }
                break;
            case YOUME_EVENT_JOIN_OK:
            {
                if(self.joinPromise.count > 0)
                {
                    NSArray* promise = [self.joinPromise objectAtIndex:0];
                    [self.joinPromise removeObjectAtIndex:0];
                    if(promise.count > 0) ((RCTPromiseResolveBlock)(promise[0]))(@{@"eventType": @(eventType),
                                                                                   @"code":@(iErrorCode),
                                                                                   @"channel": copyedRoomID,
                                                                                   @"param":copyParam});
                }
            }
                break;
            case YOUME_EVENT_JOIN_FAILED:
            {
                if(self.joinPromise.count > 0)
                {
                    NSArray* promise = [self.joinPromise objectAtIndex:0];
                    [self.joinPromise removeObjectAtIndex:0];
                    if(promise.count > 1) ((RCTPromiseRejectBlock)(promise[1]))([NSString stringWithFormat:@"%d",iErrorCode], [NSString stringWithFormat:@"join failed:%@", copyedRoomID], [self makeNSError:@{
                                                                                                                                                                  @"code": @(iErrorCode),
                                                                                                                                                                  @"message":@{
                                                                                                                                                                          @"success": @(NO),
                                                                                                                                                                          @"value":[NSNumber numberWithInteger:iErrorCode]
                                                                                                                                                                          }
                                                                                                                }]);
                }
            }
                break;
            case YOUME_EVENT_LEAVED_ALL:
            {
                [[YMVoiceService getInstance] deleteAllRender];
                [[YMVoiceService getInstance] removeAllOverlayVideo];
                if(self.leavePromise.count > 0)
                {
                    NSArray* promise = [self.leavePromise objectAtIndex:0];
                    [self.leavePromise removeObjectAtIndex:0];
                    if(promise.count > 0) ((RCTPromiseResolveBlock)(promise[0]))(@{@"eventType": @(eventType),
                                                                                   @"code":@(iErrorCode),
                                                                                   @"channel": copyedRoomID,
                                                                                   @"param":copyParam});
                }
            }
                break;
            case YOUME_EVENT_OTHERS_VIDEO_ON:
            {
                /* 非自动接收模式不需要再做这个hack
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.100 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    //NSLog(@"init count: %@ %d",copyParam, [self.engine getRenderCount:copyParam]);
                    if([self.engine getRenderCount:copyParam] == 0)
                    {
                        if([YoumeConst share].currentShareUserId == nil || ![[YoumeConst share].currentShareUserId isEqualToString:copyParam] ){
                            [self.engine maskVideoByUserId:copyParam mask:true];
                            NSLog(@"mask user video: %@", copyParam);
                        }else{
                            NSLog(@"user id: %@ is in share, do not mask", copyParam);
                        }
                    }else{
                        NSLog(@"already bunded");
                    }
                });
                */
            }
            default:
                {
                if(eventType == 223 && param.length > 6 ){ //YOUME_EVENT_OTHERS_SHARE_INPUT_START
                    [YoumeConst share].currentShareUserId = [param substringToIndex:(param.length - 6)];
                    [self.engine maskVideoByUserId:[YoumeConst share].currentShareUserId mask:false]; //接收开启屏幕共享的用户的流量
                }else if(eventType == 224){ //YOUME_EVENT_OTHERS_SHARE_INPUT_STOP
                    [YoumeConst share].currentShareUserId = nil;
                }
                NSMutableDictionary *params = @{}.mutableCopy;
                params[@"eventType"] = [NSNumber numberWithInteger:eventType];
                     params[@"code"] = [NSNumber numberWithInteger:iErrorCode];
                  params[@"channel"] = copyedRoomID;
                    params[@"param"] = copyParam;
                    [self sendEvent:YOUME_ON_EVENT params:params];
                }
                break;
        }
    });
    
}

/**
 *  功能描述:RestAPI回调
 *  @param requestID 调用查询时返回的requestID，可以用于标识一个查询
 *  @param iErrorCode 查询结果的错误码
 *  @param strQuery 查询的请求,json字符串
 *  @param strResult 查询的结果，json字符串
 */
- (void)onRequestRestAPI: (int)requestID iErrorCode:(YouMeErrorCode_t) iErrorCode  query:(NSString*) strQuery  result:(NSString*) strResult 
{
    NSString* strQueryCopy  = [strQuery copy];
    NSString* strResultCopy = [strResult copy];
    dispatch_async (dispatch_get_main_queue (), ^{
        NSMutableDictionary *params = @{}.mutableCopy;
        params[@"code"] = [NSNumber numberWithInteger:iErrorCode];
        params[@"query"] = strQueryCopy;
        params[@"result"] = strResultCopy;
        [self sendEvent:YOUME_ON_RESTAPI params:params];
    });
}

/**
 *  功能描述:获取频道用户列表回调
 *  @param channelID 频道号
 *  @param changeList 更改列表,NSArray<MemberChangeOC*>*
 *  @param isUpdate true-表示进房间后，有人进出的通知，false表示进房间时的当前user列表。
 */
- (void)onMemberChange:(NSString*) channelID changeList:(NSArray<MemberChangeOC*>*) changeList isUpdate:(bool) isUpdate
{
    NSLog(@"onMemberChange");
    dispatch_async (dispatch_get_main_queue (), ^{
        NSMutableDictionary *params = @{}.mutableCopy;
        params[@"code"] = [NSNumber numberWithInteger:0];
        params[@"channel"] = channelID;
        params[@"isUpdate"] = [NSNumber numberWithBool:isUpdate];
        NSMutableArray<NSMutableDictionary*> *memberList = [[NSMutableArray alloc] initWithCapacity: 10];
        for (int i = 0; i < [changeList count]; i++) {
            NSMutableDictionary *member = @{}.mutableCopy;
            member[@"userid"] = [changeList[i].userID copy];
            member[@"isJoin"] = [NSNumber numberWithBool: changeList[i].isJoin];
            [memberList addObject:member];
        }
        params[@"memberList"] = memberList;
        [self sendEvent:YOUME_ON_MEMBER_CHANGE params:params];
    });
}


/**
 *  功能描述:房间内广播消息回调
 */
- (void)onBroadcast:(YouMeBroadcast_t)bc strChannelID:(NSString*)channelID strParam1:(NSString*)param1 strParam2:(NSString*)param2 strContent:(NSString*)content
{}


/**
 *  功能描述: 音视频通话码率、丢包率回调，目前主要用于检测某个用户的网络状况
 *  @param avType     统计数据类型
 *  @param userID   对应的用户ID
 *  @param value    统计数据数值
 */
- (void) onAVStatistic:(YouMeAVStatisticType_t)avType  userID:(NSString*)userID  value:(int) value
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSMutableDictionary *params = @{}.mutableCopy;
        switch(avType){
            case YOUME_AVS_AUDIO_PACKET_UP_LOSS_HALF:       //音频上行的服务器丢包率，千分比
            case YOUME_AVS_VIDEO_PACKET_UP_LOSS_HALF:       //视频上行的服务器丢包率，千分比
            case YOUME_AVS_AUDIO_PACKET_DOWN_LOSS_RATE:     //音频下行丢包率,千分比
            case YOUME_AVS_VIDEO_PACKET_DOWN_LOSS_RATE:     //视频下行丢包率,千分比
            case YOUME_AVS_RECV_DATA_STAT:     //下行带宽,单位Bps
            case YOUME_AVS_VIDEO_BLOCK:        //视频卡顿
                params[@"avType"] = [NSNumber numberWithInteger:avType];
                params[@"userId"] =  [NSString stringWithString:userID];
                params[@"value"] = [NSNumber numberWithInteger:value];
                [self sendEvent:YOUME_ON_STATISTIC_UPDATE params:params];
                break;
            case YOUME_AVS_VIDEO_DELAY_MS:
                {
                    if(value > 900)
                    {
                        NSLog(@"for set resolution to 480p rtt: %d", value);
                        [self.engine setVideoNetResolutionWidth:480 height:640];
                        [self.engine setVideoNetResolutionWidthForSecond:240 height:320];
                    }
                }
                break;
            default:
                break;
        }
        



    });
}
/**
 *  新版数据统计回调（待启用）
 */
- (void) onAVStatisticNew:(YouMeAVStatisticType_t)avType  userID:(NSString*)userID  value:(int) value strParam:(NSString*)strParam
{

}

///合流相关音视频数据回调
/**
 *  功能描述: 音频数据回调
 */
- (void)onAudioFrameCallback: (NSString*)userId data:(void*) data len:(int)len timestamp:(uint64_t)timestamp
{
    
}
/**
 *  功能描述: 音频合流数据回调
 */
- (void)onAudioFrameMixedCallback: (void*)data len:(int)len timestamp:(uint64_t)timestamp
{
    
}
/**
 *  功能描述: 视频数据回调
 */
- (void)onVideoFrameCallback: (NSString*)userId data:(void*) data len:(int)len width:(int)width height:(int)height fmt:(int)fmt timestamp:(uint64_t)timestamp
{
    
}
/**
 *  功能描述: 视频合流数据回调(需要设置了合流画面和本地视频参与合流)
 */
- (void)onVideoFrameMixedCallback: (void*) data len:(int)len width:(int)width height:(int)height fmt:(int)fmt timestamp:(uint64_t)timestamp
{
    
}

- (void)onVideoFrameCallbackForGLES:(NSString*)userId  pixelBuffer:(CVPixelBufferRef)pixelBuffer timestamp:(uint64_t)timestamp
{
    
}

- (void)onVideoFrameMixedCallbackForGLES:(CVPixelBufferRef)pixelBuffer timestamp:(uint64_t)timestamp
{
    
}

/**
 *  功能描述: 视频渲染回调，添加自定义滤镜
 */
- (int)onVideoRenderFilterCallback:(int)textureId width:(int)width height:(int)height rotation:(int)rotation mirror:(int)mirror
{
    return 0;
}

- (void)onCustomDataCallback: (const void*)data len:(int)len timestamp:(uint64_t)timestamp
{
    
}

/**
 *  功能描述: 接收到声音的PCM回调，用于外部播放
 */
- (void)onPcmData: (int)channelNum samplingRateHz:(int)samplingRateHz bytesPerSample:(int)bytesPerSample data:(void*) data dataSizeInByte:(int)dataSizeInByte
{
    
}


- (void) sendEvent:(NSString *)name params:(NSDictionary *)params {
    [self sendEventWithName:name body:params];
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
             YOUME_ON_RESTAPI,
             YOUME_ON_EVENT,
             YOUME_ON_MEMBER_CHANGE,
             YOUME_ON_STATISTIC_UPDATE
             ];
}

@end

