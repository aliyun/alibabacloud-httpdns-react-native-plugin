#import "AliyunHttpdnsReatNative.h"

#import <AlicloudHttpDNS/AlicloudHttpDNS.h>
#import <AlicloudUtils/AlicloudIPv6Adapter.h>

static NSString* const KEY_CODE = @"code";
static NSString* const KEY_ERROR_MSG = @"errorMsg";
static NSString* const KEY_RESULT = @"result";

/**
* 成功
*/
static NSString* const CODE_SUCCESS = @"10000";

/**
* 参数错误
*/
static NSString* const CODE_PARAM_ILLEGAL = @"10001";

/**
* 需要先初始化
*/
static NSString* const CODE_INIT_FIRST = @"10002";

/**
* 初始化失败
*/
static NSString* const CODE_INIT_FAILED = @"10003";

/**
* 获取的结果为空
*/
static NSString* const CODE_RESULT_EMPTY = @"10004";

@interface AliyunHttpdns ()<HttpDNSDegradationDelegate, HttpdnsTTLDelegate>

@end

@implementation AliyunHttpdns {
    HttpDnsService* _dnsService;
    NSMutableDictionary<NSString *,  NSNumber *>* _ttlCache;
    NSMutableArray* _degradationList;
}
RCT_EXPORT_MODULE()

- (id) init {
    self = [super init];
    _ttlCache = [[NSMutableDictionary alloc] init];
    _degradationList = [[NSMutableArray alloc] init];
    return self;
}



RCT_REMAP_METHOD(initWithAccountId,
                 accountId:(NSString *)accountId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!accountId || [accountId intValue] <= 0) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"accountId is illegal"});
        return;
    }
    

    _dnsService = [[HttpDnsService alloc] initWithAccountID:[accountId intValue] secretKey:nil];
    [_dnsService setDelegateForDegradationFilter:self];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(initWithAccountIdAndSk,
                 accountId:(NSString *)accountId
                 secretKey:(NSString *)secretKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!accountId || [accountId intValue] <= 0) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"accountId is illegal"});
        return;
    }
    
    if (!secretKey || [secretKey isEqual: @""]) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"secretKey is illegal"});
        return;
    }
    
    _dnsService = [[HttpDnsService alloc] initWithAccountID:[accountId intValue] secretKey:nil];
    [_dnsService setDelegateForDegradationFilter:self];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(getIPv4ForHostAsync,
                 v4WithHost:(NSString *)host
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!host || [host isEqual:@""]) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"host is empty"});
        return;
    }
    
    NSString* ipv4 = [_dnsService getIpByHostAsync:host];
    if (ipv4) {
        resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success", KEY_RESULT: ipv4});
    } else {
        resolve(@{KEY_CODE:CODE_RESULT_EMPTY, KEY_ERROR_MSG: @"ipv4 result is empty"});
    }
    
}

RCT_REMAP_METHOD(getIPv4ListForHostAsync,
                 v4ListWithHost:(NSString *)host
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!host || [host isEqual:@""]) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"host is empty"});
        return;
    }
    
    NSArray* ipv4List = [_dnsService getIpsByHostAsync:host];
    if (ipv4List && ipv4List.count > 0) {
        resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success", KEY_RESULT: ipv4List});
    } else {
        resolve(@{KEY_CODE:CODE_RESULT_EMPTY, KEY_ERROR_MSG: @"ipv4 list result is empty"});
    }
}

RCT_REMAP_METHOD(getIPv6ForHostAsync,
                 v6WithHost:(NSString *)host
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!host || [host isEqual:@""]) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"host is empty"});
        return;
    }
    
    NSString* ipv6 = [_dnsService getIPv6ByHostAsync:host];
    if (ipv6) {
        resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success", KEY_RESULT: ipv6});
    } else {
        resolve(@{KEY_CODE:CODE_RESULT_EMPTY, KEY_ERROR_MSG: @"ipv6 result is empty"});
    }
    
}

RCT_REMAP_METHOD(getIPv6ListForHostAsync,
                 v6ListWithHost:(NSString *)host
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!host || [host isEqual:@""]) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"host is empty"});
        return;
    }
    
    NSArray* ipv6List = [_dnsService getIPv6sByHostAsync:host];
    if (ipv6List && ipv6List.count > 0) {
        resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success", KEY_RESULT: ipv6List});
    } else {
        resolve(@{KEY_CODE:CODE_RESULT_EMPTY, KEY_ERROR_MSG: @"ipv6 list result is empty"});
    }
}

RCT_REMAP_METHOD(getIPv4IPv6ListForHostAsync,
                 v4v6ListWithHost:(NSString *)host
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!host || [host isEqual:@""]) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"host is empty"});
        return;
    }
    
    NSDictionary* v4v6Dict = [_dnsService getIPv4_v6ByHostAsync:host];
    if (!v4v6Dict || v4v6Dict.count == 0) {
        resolve(@{KEY_CODE:CODE_RESULT_EMPTY, KEY_ERROR_MSG: @"ipv4 and ipv6 list result is empty"});
        return;
    }
    
    NSMutableDictionary<NSString*, NSArray*>* v4v6Result = [[NSMutableDictionary alloc] init];
    
    NSArray* v4List = [v4v6Dict valueForKey:ALICLOUDHDNS_IPV4];
    NSArray* v6List = [v4v6Dict valueForKey:ALICLOUDHDNS_IPV6];
    
    [v4v6Result setValue:v4List forKey:@"ipv4"];
    [v4v6Result setValue:v6List forKey:@"ipv6"];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success", KEY_RESULT: v4v6Result});
}

RCT_REMAP_METHOD(setHttpDnsLogEnabled, logWithEnabled:(BOOL) enabled) {
    [[HttpDnsService sharedInstance] setLogEnabled:enabled];
}

RCT_REMAP_METHOD(setPreResolveHosts,
                 preResolveWithHost:(NSArray *)hostList
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!hostList || hostList.count == 0) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"preResolve host list is empty"});
        return;
    }
    
    [_dnsService setPreResolveHosts:hostList];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(setPreResolveHostsWithIPType,
                 preResolveIPTypeWithHost:(NSArray *)hostList
                 preResolveIPTypeWithType:(NSNumber *)requestIpType
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject
                 ) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!hostList || hostList.count == 0) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"preResolve host list is empty"});
        return;
    }
    
    AlicloudHttpDNS_IPType ipType;
    if ([requestIpType intValue] == 0) {
        ipType = AlicloudHttpDNS_IPTypeV4;
    } else if ([requestIpType intValue] == 1) {
        ipType = AlicloudHttpDNS_IPTypeV6;
    } else if ([requestIpType intValue] == 2) {
        ipType = AlicloudHttpDNS_IPTypeV64;
    } else {
        //iOS没有自动，默认v4
        ipType = AlicloudHttpDNS_IPTypeV4;
    }
    
    [_dnsService setPreResolveHosts:hostList queryIPType:ipType];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(setCachedIPEnabled,
                 cachedIPWithEnabled:(BOOL)enabled
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    [_dnsService setCachedIPEnabled:enabled];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(setExpiredIPEnabled,
                 expiredIPWithEnabled:(BOOL)enabled
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    [_dnsService setExpiredIPEnabled:enabled];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(setHTTPSRequestEnabled,
                 httpsWithEnabled:(BOOL)enabled
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    [_dnsService setHTTPSRequestEnabled:enabled];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
    
}

RCT_REMAP_METHOD(setRegion,
                 withRegion:(NSString *)region
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    if (!region) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"region is empty"});
        return;
    }
    
    [_dnsService setRegion:region];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(cleanHostCache,
                 cleanWithHost:(NSArray *)hostList
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!hostList || hostList.count == 0) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"host list is empty"});
        return;
    }
    
    [_dnsService cleanHostCache:hostList];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(setIPRanking,
                 withIPRankList:(NSArray *)ipRankingList
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!ipRankingList || ipRankingList.count == 0) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"ipRanking list is empty"});
        return;
    }
    
    NSMutableDictionary* dataSource = [[NSMutableDictionary alloc]init];
    for(NSDictionary *dict in ipRankingList) {
        NSString* host = [dict valueForKey:@"hostName"];
        NSNumber* port = [dict valueForKey:@"port"];
        [dataSource setValue:port forKey:host];
    }
    
    [_dnsService setIPRankingDatasource:dataSource];
    
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(currentIPStack,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    AlicloudIPStackType ipStackType = [[HttpDnsService sharedInstance] currentIpStack];
    if (ipStackType == kAlicloudIPv4only) {
        resolve([NSNumber numberWithInt:1]);
    } else if (ipStackType == kAlicloudIPv6only) {
        resolve([NSNumber numberWithInt:2]);
    } else if (ipStackType == kAlicloudIPdual) {
        resolve([NSNumber numberWithInt:3]);
    } else {
        resolve([NSNumber numberWithInt:0]);
    }
}


RCT_REMAP_METHOD(setAuthCurrentTime,
                 withAuthTime:(NSNumber *)time
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!time || [time longValue] < 0) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"time is illegal"});
        return;
    }
    
    [_dnsService setAuthCurrentTime:[time longValue]];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(enableIPv6,
                 withEnableIPv6:(BOOL)enabled
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    [_dnsService enableIPv6:enabled];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
}

RCT_REMAP_METHOD(setDegradationHost,
                 degradationWithHost: (NSString *)host
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject
                 ) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    if (!host || [host isEqual:@""]) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"host is empty"});
        return;
    }
    
    [_degradationList addObject:host];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
    
}

RCT_REMAP_METHOD(getSessionId,
                 sessionIdwithResolver:(RCTPromiseResolveBlock)resolve
                 sessionIdwithRejecter:(RCTPromiseRejectBlock)reject) {
    if (!_dnsService) {
        resolve(@{KEY_CODE:CODE_INIT_FIRST, KEY_ERROR_MSG: @"please call init method first"});
        return;
    }
    
    NSString* sessionId = [_dnsService getSessionId];
    if (sessionId) {
        resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success", KEY_RESULT: sessionId});
    } else {
        resolve(@{KEY_CODE:CODE_RESULT_EMPTY, KEY_ERROR_MSG: @"sessionID is empty"});
    }
    
}

RCT_REMAP_METHOD(addTtlCache,
                 ttlWithHost: (NSString *)host
                 ttlWithTtl: (NSNumber *) ttl
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject
                 ) {
    if (!host) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"host is empty"});
        return;
    }
    
    if (!ttl || [ttl intValue] < 0) {
        resolve(@{KEY_CODE:CODE_PARAM_ILLEGAL, KEY_ERROR_MSG: @"ttl is empty or illegal"});
        return;
    }
    
    [_ttlCache setValue:ttl forKey:host];
    resolve(@{KEY_CODE:CODE_SUCCESS, KEY_ERROR_MSG: @"success"});
        
}


// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAliyunHttpdnsReatNativeSpecJSI>(params);
}
#endif

- (BOOL)shouldDegradeHTTPDNS:(NSString *)hostName {
    if ([_degradationList containsObject:hostName]) {
        return YES;
    }
    return NO;
}

- (int64_t)httpdnsHost:(NSString *)host ipType:(AlicloudHttpDNS_IPType)ipType ttl:(int64_t)ttl {
    if ([_ttlCache objectForKey:host]) {
        return [[_ttlCache valueForKey:host] intValue];
    }
    return ttl;
}


@end
