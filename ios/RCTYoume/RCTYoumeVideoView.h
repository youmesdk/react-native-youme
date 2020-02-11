//
//  RCTYoumeVideoView.h
//  RCTYoume
//

#import <UIKit/UIKit.h>
#import "YoumeConst.h"
#import "YMVoiceService.h"

@interface RCTYoumeVideoView : UIView

@property (strong, nonatomic) YMVoiceService *engine;

@property (nonatomic) BOOL zOrderMediaOverlay;
@property (nonatomic, retain) NSString *options;

@property (nonatomic, retain) NSString *userid;
@property (nonatomic, retain) UIView   *glView;
@property (nonatomic, assign) BOOL hide;
@property (nonatomic, assign) BOOL mask;

@end
