//
//  RCTYoumeVideoView.m
//  RCTYoume
//

#import "RCTYoumeVideoView.h"

@implementation RCTYoumeVideoView

- (instancetype)init{
    
    if (self == [super init]) {
        _engine = [YoumeConst share].engine;
        _glView = nil;
    }
    
    return self;
}

- (void)dealloc
{
    NSLog(@"RCTYoumeVideoView dealloc %@",self.userid);
    if(self.userid){
        [self.engine deleteRender:self.userid glView:(OpenGLESView*)self.glView];
        NSLog(@"count: %@ %d",self.userid, [self.engine getRenderCount:self.userid]);
        if(self.mask && [self.engine getRenderCount:self.userid] == 0)
        {
            if([YoumeConst share].currentShareUserId == nil || ![[YoumeConst share].currentShareUserId isEqualToString:self.userid]){
                [self.engine maskVideoByUserId:self.userid mask:true];
            }
        }
    }
}

- (void)setZOrderMediaOverlay:(BOOL)zOrderMediaOverlay {
  // do nothing
    _zOrderMediaOverlay = zOrderMediaOverlay;
}

-(void)setOptions:(NSDictionary*)options {
    NSString * uid = options[@"userID"];
    self.hide   = options[@"hide"] != nil ? [options[@"hide"] boolValue] : NO; 
    self.mask   = options[@"autoMask"] != nil ? [options[@"autoMask"] boolValue] : NO;
    
    if(uid != nil && ![uid isEqualToString:@""])
    {
        if(options[@"hd"] != nil)
        {
            BOOL hd   = [options[@"hd"] boolValue];
            NSMutableArray* userIds = [NSMutableArray new];
            NSMutableArray* streamIds = [NSMutableArray new];
            [userIds addObject:uid];
            [streamIds addObject: hd ? @"0" : @"1"];
            [self.engine setUsersVideoInfo:userIds resolutionArray:streamIds];
        }
        if(self.userid && [uid isEqualToString:self.userid] && self.glView != nil){
            NSLog(@"RCTYoumeVideoView ignore self create %@",uid);
        }else{
            NSLog(@"RCTYoumeVideoView create new user render:%@",uid);
            if(![uid isEqualToString:self.userid]){
                [self.engine deleteRender:self.userid glView:(OpenGLESView*)self.glView];
            }
            self.userid = uid;
            self.glView = [self.engine createRender:self.userid parentView:self singleMode:NO];
            self.glView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
            //共享用户渲染画面适应屏幕，不裁剪拉伸
            if([self.userid containsString:@"share"]){
               [self.engine setRenderMode:self.userid mode:YOUME_VIDEO_RENDER_MODE_FIT];
            }
        }
        [self.glView setHidden:self.hide];
        [self setHide: self.hide];
        [self.engine maskVideoByUserId:uid mask:false];
    }else{
        NSLog(@"userid is empty");
    }
}

@end
