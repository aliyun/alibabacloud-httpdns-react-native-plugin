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


export function multiply(a: number, b: number): Promise<number> {
  return AliyunHttpdnsReatNative.multiply(a, b);
}

/**
 * 异步解析，获取IPv4
 * @param host 
 * @returns 单个IPv4值
 */
export function getIPv4ForHostAsync(host: string): Promise<string> {
  return AliyunHttpdnsReatNative.getIPv4ForHostAsync(host);
}

/**
 * 异步解析，获取IPv4
 * @param host 
 * @returns IPv4列表
 */
export function getIPv4ListForHostAsync(host: string): Promise<Array<string>> {
  return AliyunHttpdnsReatNative.getIPv4ListForHostAsync(host);
}

/**
 * 异步解析，获取IPv6
 * @param host 
 * @returns 单个IPv6值
 */
export function getIPv6ForHostAsync(host: string): Promise<string> {
  return AliyunHttpdnsReatNative.getIPv4ForHostAsync(host);
}

/**
 * 异步解析，获取IPv6
 * @param host IPv6列表
 */
export function getIPv6ListForHostAsync(host: string): Promise<string> {
  return AliyunHttpdnsReatNative.getIPv6ListForHostAsync(host);
}

export function getIPv4IPv6ListForHostAsync(host: string): Promise<{}> {
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
export function setPreResolveHosts(hostList: Array<string>) {
  AliyunHttpdnsReatNative.setPreResolveHosts(hostList);
}

/**
 * 设置预解析域名列表和解析的ip类型
 * @param hostList 
 * @param requestIpType 
 */
export function setPreResolveHostsWithIPType(hostList: Array<string>, requestIpType: number) {
  AliyunHttpdnsReatNative.setPreResolveHostsWithIPType(hostList, requestIpType)
}





