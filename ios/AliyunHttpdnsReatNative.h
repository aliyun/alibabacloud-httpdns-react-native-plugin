
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAliyunHttpdnsReatNativeSpec.h"

@interface AliyunHttpdnsReatNative : NSObject <NativeAliyunHttpdnsReatNativeSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AliyunHttpdnsReatNative : NSObject <RCTBridgeModule>
#endif

@end
