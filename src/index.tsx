import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'aliyun-httpdns-reat-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AliyunHttpdns = NativeModules.AliyunHttpdns
  ? NativeModules.AliyunHttpdns
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export const kCodeSuccess = "10000";

export const kCodeParamIllegal = "10001";

export const kCodeInitFirst = "10002";

export const kCodeInitFailed = "10003";

export const kCodeResultEmpty = "10004";

export const kCodeOnlySupportIOS = "10005";

interface IPRanking {
  hostName: string;
  port: number;
}

export enum IPStackType {
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

/**
 * 初始化
 * @param accountId 
 */
export function initWithAccountId(accountId: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.initWithAccountId(accountId);
}

/**
 * 启用鉴权功能的初始化接口
 * @param accountId 
 * @param secretKey 
 */
export function initWithAccountIdAndSk(accountId: string, secretKey: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.initWithAccountIdAndSk(accountId, secretKey);
}

/**
 * 异步解析，获取IPv4
 * @param host 
 * @returns 单个IPv4值
 */
export function getIPv4ForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.getIPv4ForHostAsync(host);
}

/**
 * 异步解析，获取IPv4
 * @param host 
 * @returns IPv4列表
 */
export function getIPv4ListForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.getIPv4ListForHostAsync(host);
}

/**
 * 异步解析，获取IPv6
 * @param host 
 * @returns 单个IPv6值
 */
export function getIPv6ForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.getIPv6ForHostAsync(host);
}

/**
 * 异步解析，获取IPv6
 * @param host IPv6列表
 */
export function getIPv6ListForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.getIPv6ListForHostAsync(host);
}

/**
 * 异步解析，获取IPv4 + IPv6
 * @param host 
 * @returns 
 */
export function getIPv4IPv6ListForHostAsync(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.getIPv4IPv6ListForHostAsync(host);
}

/**
 * 设置是否允许Native SDK打印日志
 * @param enabled 
 * @returns 
 */
export function setHttpDnsLogEnabled(enabled: boolean) {
  AliyunHttpdns.setHttpDnsLogEnabled(enabled);
}

/**
 * 设置预解析域名列表，默认解析v4
 * @param hostList 
 */
export function setPreResolveHosts(hostList: Array<string>): Promise<HttpDnsResult> {
  return AliyunHttpdns.setPreResolveHosts(hostList);
}

/**
 * 设置预解析域名列表和解析的ip类型
 * @param hostList 
 * @param requestIpType 0 - v4, 1 - v6, 2 - both, 3 - auto
 */
export function setPreResolveHostsWithIPType(hostList: Array<string>, requestIpType: number): Promise<HttpDnsResult> {
  return AliyunHttpdns.setPreResolveHostsWithIPType(hostList, requestIpType)
}

/**
 * 设置是否持久化缓存IP
 * @param enabled 
 */
export function setCachedIPEnabled(enabled: boolean): Promise<HttpDnsResult> {
  return AliyunHttpdns.setCachedIPEnabled(enabled);
}

/**
 * 设置是否允许返回超过ttl的IP
 * @param enabled 
 */
export function setExpiredIPEnabled(enabled: boolean): Promise<HttpDnsResult> {
  return AliyunHttpdns.setExpiredIPEnabled(enabled);
}

/**
 * 设置 HTTPDNS 域名解析请求类型 ( HTTP / HTTPS )
 * @param enabled 
 */
export function setHTTPSRequestEnabled(enabled: boolean) {
  AliyunHttpdns.setHTTPSRequestEnabled(enabled);
}

/**
 * 设置region节点，设置后，会按照region更新服务IP
 * @param region 
 */
export function setRegion(region: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.setRegion(region);
}

/**
 * 立即清除域名端侧内存和本地缓存
 * @param hostList 
 */
export function cleanHostCache(hostList: Array<string>): Promise<HttpDnsResult> {
  return AliyunHttpdns.cleanHostCache(hostList);
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

  return AliyunHttpdns.setIPRanking(list);
}

/**
 * 获取当前网络栈
 * @returns 
 */
export async function currentIPStack(): Promise<IPStackType> {
  let ipStackNum = await AliyunHttpdns.currentIPStack();
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
  return AliyunHttpdns.setAuthCurrentTime(time);
}

/**
 * 开启IPv6，只对iOS有效
 * @param enabled 
 */
export function enableIPv6(enabled: boolean): Promise<HttpDnsResult> {
  if (Platform.OS !== 'ios') {
    let result = {
      code: kCodeOnlySupportIOS,
      errorMsg: 'Only Support iOS',
    };
    return new Promise((resolve, _) => {
      resolve(result);
    });
  }
  return AliyunHttpdns.enableIPv6(enabled);
}

/**
 * 设置降级的host列表
 * @param hostList 
 */
export function setDegradationHost(host: string): Promise<HttpDnsResult> {
  return AliyunHttpdns.setDegradationHost(host);
}

/**
 * 获取会话Id
 * @returns 
 */
export function getSessionId(): Promise<HttpDnsResult> {
  return AliyunHttpdns.getSessionId();
}

/**
 * 添加域名
 * @param host 
 * @param ttl 
 * @returns 
 */
export function addTtlCache(host: string, ttl: number): Promise<HttpDnsResult> {
  return AliyunHttpdns.addTtlCache(host, ttl);
}