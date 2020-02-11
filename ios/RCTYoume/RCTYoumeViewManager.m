//
//  RCTYoumeViewManager.m
//  RCTYoume
//

#import "RCTYoumeViewManager.h"
#import "RCTYoumeVideoView.h"

@implementation RCTYoumeViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(zOrderMediaOverlay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(options, NSDictionary*)

- (UIView *)view {
    return [RCTYoumeVideoView new];
}


@end
