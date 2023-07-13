
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAliyunHttpdnsReatNativeSpec.h"

@interface AliyunHttpdns : NSObject <NativeAliyunHttpdnsReatNativeSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AliyunHttpdns : NSObject <RCTBridgeModule>
#endif

@end
