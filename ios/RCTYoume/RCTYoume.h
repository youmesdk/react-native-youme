//
//  RCTYoume.h
//  RCTYoume
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "YMVoiceService.h"

@interface RCTYoume : RCTEventEmitter<RCTBridgeModule , VoiceEngineCallback>

@end
