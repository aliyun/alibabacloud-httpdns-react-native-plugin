import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'aliyun-httpdns-reat-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AliyunHttpdnsReatNative = NativeModules.AliyunHttpdnsReatNative
  ? NativeModules.AliyunHttpdnsReatNative
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

interface IPRanking {
  hostName: string;
  port: number;
}

enum IPStackType {
  Unknown,

  IPv4,

  IPv6,

  Both
}

interface HttpDnsResult {
  code: string;
  errorMsg: string;
  result?: any
}

export function multiply(a: number, b: number): Promise<number> {
  return AliyunHttpdnsReatNative.multiply(a, b);
}

/**
 * 初始化
 * @param accountId 
 */
export function initWithAccountId(accountId: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.initWithAccountId(accountId);
}

/**
 * 启用鉴权功能的初始化接口
 * @param accountId 
 * @param secretKey 
 */
export function initWithAccountIdAndSk(accountId: string, secretKey: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.initWithAccountIdAndSk(accountId, secretKey);
}

/**
 * 异步解析，获取IPv4
 * @param host 
 * @returns 单个IPv4值
 */
export function getIPv4ForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.getIPv4ForHostAsync(host);
}

/**
 * 异步解析，获取IPv4
 * @param host 
 * @returns IPv4列表
 */
export function getIPv4ListForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.getIPv4ListForHostAsync(host);
}

/**
 * 异步解析，获取IPv6
 * @param host 
 * @returns 单个IPv6值
 */
export function getIPv6ForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.getIPv4ForHostAsync(host);
}

/**
 * 异步解析，获取IPv6
 * @param host IPv6列表
 */
export function getIPv6ListForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.getIPv6ListForHostAsync(host);
}

export function getIPv4IPv6ListForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.getIPv4IPv6ListForHostAsync(host);
}

/**
 * 设置是否允许Native SDK打印日志
 * @param enabled 
 * @returns 
 */
export function setHttpDnsLogEnabled(enabled: boolean) {
  AliyunHttpdnsReatNative.setHttpDnsLogEnabled(enabled);
}

/**
 * 设置预解析域名列表，默认解析v4
 * @param hostList 
 */
export function setPreResolveHosts(hostList: Array<string>): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.setPreResolveHosts(hostList);
}

/**
 * 设置预解析域名列表和解析的ip类型
 * @param hostList 
 * @param requestIpType 0 - v4, 1 - v6, 2 - both, 3 - auto
 */
export function setPreResolveHostsWithIPType(hostList: Array<string>, requestIpType: number): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.setPreResolveHostsWithIPType(hostList, requestIpType)
}

/**
 * 设置是否持久化缓存IP
 * @param enabled 
 */
export function setCachedIPEnabled(enabled: boolean): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.setCachedIPEnabled(enabled);
}

/**
 * 设置是否允许返回超过ttl的IP
 * @param enabled 
 */
export function setExpiredIPEnabled(enabled: boolean): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.setExpiredIPEnabled(enabled);
}

/**
 * 设置 HTTPDNS 域名解析请求类型 ( HTTP / HTTPS )
 * @param enabled 
 */
export function setHTTPSRequestEnabled(enabled: boolean) {
  AliyunHttpdnsReatNative.setHTTPSRequestEnabled(enabled);
}

/**
 * 设置region节点，设置后，会按照region更新服务IP
 * @param region 
 */
export function setRegion(region: string): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.setRegion(region);
}

/**
 * 立即清除域名端侧内存和本地缓存
 * @param hostList 
 */
export function cleanHostCache(hostList: Array<string>): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.cleanHostCache(hostList);
}

/**
 * 设置IP优选
 * @param ipRankingList 
 */
export function setIPRanking(ipRankingList: Array<IPRanking>): Promise<HttpDnsResult> {
  let list: any[] = [];
  ipRankingList.forEach((e) => {
    list.push({
      "hostName": e.hostName,
      "port": e.port
    });
  })

  return AliyunHttpdnsReatNative.setIPRanking(list);
}

/**
 * 获取当前网络栈
 * @returns 
 */
export async function currentIPStack(): Promise<IPStackType> {
  let ipStackNum = await AliyunHttpdnsReatNative.currentIPStack();
  switch (ipStackNum) {
    case 1:
      return new Promise((resolve, _) => {
        resolve(IPStackType.IPv4);
      });
    case 2:
      return new Promise((resolve, _) => {
        resolve(IPStackType.IPv6);
      });
    case 3:
      return new Promise((resolve, _) => {
        resolve(IPStackType.Both);
      });
    default:
      return new Promise((resolve, _) => {
        resolve(IPStackType.Unknown);
      });
  }
}

/**
 * 校正 App 签名时间
 * @param time 
 */
export function setAuthCurrentTime(time: number): Promise<HttpDnsResult> {
  AliyunHttpdnsReatNative.setAuthCurrentTime(time);
}

/**
 * 开启IPv6，只对iOS有效
 * @param enabled 
 */
export function enableIPv6(enabled: boolean) {
  if (Platform.OS !== 'ios') {
    return;
  }
  AliyunHttpdnsReatNative.enableIPv6(enabled);
}

/**
 * 设置降级的host列表
 * @param hostList 
 */
export function setDegradationHost(hostList: Array<string>): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.setDegradationHost(hostList);
}

/**
 * 获取会话Id
 * @returns 
 */
export function getSessionId(): Promise<HttpDnsResult> {
  return AliyunHttpdnsReatNative.getSessionId();
}