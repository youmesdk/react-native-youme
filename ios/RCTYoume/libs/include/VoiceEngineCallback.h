//
//  VoiceEngineCallback.h
//  VoiceTest
//
//  Created by kilo on 16/7/12.
//  Copyright © 2016年 kilo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YouMeConstDefine.h"

@interface MemberChangeOC: NSObject
//用户ID
@property (nonatomic, retain) NSString* userID ;
//true,表示加入，false表示离开
@property (nonatomic, assign) bool  isJoin;
@end

@protocol VoiceEngineCallback <NSObject>
/**
 *  功能描述: 一般事件通知
 *  @param eventType 事件类型
 *  @param iErrorCode 错误码
 *  @param roomid 时间发生的房间号
 *  @param param 其他参数，根据eventType不同而不同
 */
- (void)onYouMeEvent:(YouMeEvent_t)eventType errcode:(YouMeErrorCode_t)iErrorCode roomid:(NSString *)roomid param:(NSString *)param;

/**
 *  功能描述:RestAPI回调
 *  @param requestID 调用查询时返回的requestID，可以用于标识一个查询
 *  @param iErrorCode 查询结果的错误码
 *  @param strQuery 查询的请求,json字符串
 *  @param strResult 查询的结果，json字符串
 */
- (void)onRequestRestAPI: (int)requestID iErrorCode:(YouMeErrorCode_t) iErrorCode  query:(NSString*) strQuery  result:(NSString*) strResult ;

/**
 *  功能描述:获取频道用户列表回调
 *  @param channelID 频道号
 *  @param changeList 更改列表,NSArray<MemberChangeOC*>*
 *  @param isUpdate true-表示进房间后，有人进出的通知，false表示进房间时的当前user列表。
 */
- (void)onMemberChange:(NSString*) channelID changeList:(NSArray*) changeList isUpdate:(bool) isUpdate ;


/**
 *  功能描述:房间内广播消息回调
 */
- (void)onBroadcast:(YouMeBroadcast_t)bc strChannelID:(NSString*)channelID strParam1:(NSString*)param1 strParam2:(NSString*)param2 strContent:(NSString*)content;


- (void) onAVStatistic:(YouMeAVStatisticType_t)type  userID:(NSString*)userID  value:(int) value ;

- (void) onAVStatisticNew:(YouMeAVStatisticType_t)type  userID:(NSString*)userID  value:(int) value  strParam:(NSString*)strParam;

///合流相关音视频数据回调
/**
 *  功能描述: 音频数据回调
 */
- (void)onAudioFrameCallback: (NSString*)userId data:(void*) data len:(int)len timestamp:(uint64_t)timestamp;
/**
 *  功能描述: 音频合流数据回调
 */
- (void)onAudioFrameMixedCallback: (void*)data len:(int)len timestamp:(uint64_t)timestamp;
/**
 *  功能描述: 视频数据回调
 */
- (void)onVideoFrameCallback: (NSString*)userId data:(void*) data len:(int)len width:(int)width height:(int)height fmt:(int)fmt timestamp:(uint64_t)timestamp;
/**
 *  功能描述: 视频合流数据回调(需要设置了合流画面和本地视频参与合流)
 */
- (void)onVideoFrameMixedCallback: (void*) data len:(int)len width:(int)width height:(int)height fmt:(int)fmt timestamp:(uint64_t)timestamp;

- (void)onVideoFrameCallbackForGLES:(NSString*)userId  pixelBuffer:(CVPixelBufferRef)pixelBuffer timestamp:(uint64_t)timestamp;

- (void)onVideoFrameMixedCallbackForGLES:(CVPixelBufferRef)pixelBuffer timestamp:(uint64_t)timestamp;

/**
 *  功能描述: 视频渲染回调，添加自定义滤镜
 */
- (int)onVideoRenderFilterCallback:(int)textureId width:(int)width height:(int)height rotation:(int)rotation mirror:(int)mirror;


- (void)onCustomDataCallback: (const void*)data len:(int)len timestamp:(uint64_t)timestamp;

- (void)onTranslateTextComplete:(YouMeErrorCode_t)errorcode requestID:(unsigned int)requestID  text:(NSString*)text  srcLangCode:(YouMeLanguageCode_t)srcLangCode destLangCode:(YouMeLanguageCode_t)destLangCode;

//功能描述: 接收到声音的PCM回调，用于外部播放
//远端数据回调
- (void)onPcmDataRemote: (int)channelNum samplingRateHz:(int)samplingRateHz bytesPerSample:(int)bytesPerSample data:(void*) data dataSizeInByte:(int)dataSizeInByte;
//录音数据回调
- (void)onPcmDataRecord: (int)channelNum samplingRateHz:(int)samplingRateHz bytesPerSample:(int)bytesPerSample data:(void*) data dataSizeInByte:(int)dataSizeInByte;
//远端和录音的混合数据回调
- (void)onPcmDataMix: (int)channelNum samplingRateHz:(int)samplingRateHz bytesPerSample:(int)bytesPerSample data:(void*) data dataSizeInByte:(int)dataSizeInByte;

- (void)onVideoPreDecodeDataForUser:(const char *)userId data:(const void*)data len:(int)dataSizeInByte ts:(uint64_t)timestamp;

@end
