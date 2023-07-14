# aliyun-httpdns-reat-native

阿里云HTTPDNS官方ReactNative插件

## 一、快速入门

![](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/9990582161/p240714.png)

### 服务开通

请参考[快速入门](https://help.aliyun.com/document_detail/436513.html?spm=a2c4g.435229.0.0.4bf33e06bXgYZo#topic-2225340)的开通EMAS服务

1. [创建项目](https://help.aliyun.com/document_detail/436513.html?spm=a2c4g.435229.0.0.4bf33e06bXgYZo#70829a50604pv)。

2. [创建Native应用](https://help.aliyun.com/document_detail/436513.html?spm=a2c4g.435229.0.0.4bf33e06bXgYZo#975db46060rl2)。

3. 进入应用，顶部导航栏单击平台服务 > HTTPDNS > 概览，可获取Account ID。

![](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7901255861/p676959.png)

### 控制台添加域名

您需要将待解析的域名添加到HTTPDNS控制台的域名列表中，您只能解析域名列表中指定的域名。添加域名请参加[域名管理](https://help.aliyun.com/document_detail/435233.html?spm=a2c4g.435229.0.0.4bf33e06bXgYZo#topic-1994313)。

### 自定义解析域名

在HTTPDNS的基础上，引入自定义解析功能，您可以实现：

+ 客户端自定义参数输入。

+ 服务端结合自定义函数处理能力，支持实现复杂的自定义解析功能。

+ 返回自定义解析结果。

使用自定义域名解析请参见[概述](https://help.aliyun.com/document_detail/435236.html?spm=a2c4g.435229.0.0.4bf33e06bXgYZo#topic-1994316)。

### 快速验证

您可以对设置好的域名进行快速验证。

输入测试URL："https://203.107.1.33/100000/d?host=www.aliyun.com"

> 说明 实际使用中，请将accountId（100000）和域名（www.aliyun.com）替换成您控制台中对应的值。

预期返回类似下面的结果：

```
{
"host":"www.aliyun.com",
"ips":[
"10.0.0.1",
"10.0.0.2"
],
"ttl": 596,
"origin_ttl": 600,
"client_ip":"192.168.XX.XX",
"extra": "some-thing-send-to-user"
}
```

## 二、安装

```sh
npm install aliyun-httpdns-react-native
```

## 三、配置

### Android

#### 混淆配置

如果您的项目中使用Proguard等工具做了代码混淆，请在android模块中保留以下配置：

```txt
-keep class com.aliyun.ams.ipdetector.Inet64Util{*;}
-keep class com.alibaba.sdk.android.**{*;}
-keep class com.ut.**{*;}
-keep class com.ta.**{*;}

```

### iOS

使用Xcode打开ReactNative工程的iOS模块，需要做-ObjC配置，即应用的 TARGETS -> Build Settings -> Linking -> Other Linker Flags ，需添加上 -ObjC 这个属性

![](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/5193157061/p190457.png)

## 四、APIS

### `initWithAccountId`

初始化接口

`function initWithAccountId(accountId: string): Promise<HttpDnsResult>`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| accountId | string | 必选参数 |

返回值：

`Promise<HttpDnsResult>`

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例：

```javascript

AliyunHttpDns.initWithAccountId("*****").then((result) => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', "初始化HttpDNS成功👋")
    } else {
        Alert.alert('提示', `初始化HttpDNS失败: ${result.errorMsg}`);
    }
})
```


### `initWithAccountIdAndSk`

初始化并开启鉴权功能

`function initWithAccountIdAndSk(accountId: string, secretKey: string): Promise<HttpDnsResult>`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| accountId | string | 必选参数 |
| secretKey | string | 必选参数 |

返回值：

`Promise<HttpDnsResult>`

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例：

```javascript

AliyunHttpDns.initWithAccountIdAndSk("*****", "******").then((result) => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', "初始化HttpDNS成功👋")
    } else {
        Alert.alert('提示', `初始化HttpDNS失败: ${result.errorMsg}`);
    }
})
```

### `getIPv4ForHostAsync`

异步解析，获取host的单个IPv4地址

`function getIPv4ForHostAsync(host: string): Promise<HttpDnsResult>`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| host | string | 必选参数 |

返回值：

`Promise<HttpDnsResult>`

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息
+ `result`: v4地址

代码示例：

```javascript
AliyunHttpDns.getIPv4ForHostAsync(host).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        let v4 = result.result;
        setResolveResult(`IPv4结果:\n\n${v4}`);
    } else {
        Alert.alert('提示', `获取单个IPv4地址失败: ${result.errorMsg}`);
    }
});

```

### getIPv4ListForHostAsync

异步解析，获取host的IPv4地址列表

`function getIPv4ListForHostAsync(host: string): Promise<HttpDnsResult>`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| host | string | 必选参数 |

返回值：

`Promise<HttpDnsResult>`

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息
+ `result`: v4地址列表

代码示例:

```javascript
AliyunHttpDns.getIPv4ListForHostAsync(host).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        let v4List = result.result;
        setResolveResult(`IPv4结果:\n\n${v4List.join('\n')}`);
    } else {
        Alert.alert('提示', `获取多个IPv4地址失败: ${result.errorMsg}`);
    }
});
```

### getIPv6ForHostAsync

异步解析，获取host的单个IPv6地址

`function getIPv6ForHostAsync(host: string): Promise<HttpDnsResult>`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| host | string | 必选参数 |

返回值：

`Promise<HttpDnsResult>`

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息
+ `result`: v6地址

代码示例:

```javascript
AliyunHttpDns.getIPv6ForHostAsync(host).then(result => {    
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        let v6 = result.result;
        setResolveResult(`IPv6结果:\n\n${v6}`);
    } else {
        Alert.alert('提示', `获取单个IPv6地址失败: ${result.errorMsg}`);
    }
});
```

### getIPv6ListForHostAsync

异步解析，获取host的IPv6地址列表

`function getIPv6ListForHostAsync(host: string): Promise<HttpDnsResult>`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| host | string | 必选参数 |

返回值：

`Promise<HttpDnsResult>`

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息
+ `result`: v6地址列表

代码示例:

```javascript
AliyunHttpDns.getIPv6ListForHostAsync(host).then(result => {    
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        let v6List = result.result;
        setResolveResult(`IPv6结果:\n\n${v6List}`);
    } else {
        Alert.alert('提示', `获取多个IPv6地址失败: ${result.errorMsg}`);
    }
});
```

### getIPv4IPv6ListForHostAsync

异步解析，获取host的所有IPv4和IPv6地址

`function getIPv4IPv6ListForHostAsync(host: string): Promise<HttpDnsResult>`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| host | string | 必选参数 |

返回值：

`Promise<HttpDnsResult>`

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息
+ `result`: 包含v4地址列表和v6地址列表

代码示例:

```javascript
AliyunHttpDns.getIPv4IPv6ListForHostAsync(host).then(result => {    
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        let v4v6Map = result.result;
        let v4List = v4v6Map.ipv4;
        let v6List = v4v6Map.ipv6;
        setResolveResult(`IPv4结果:\n\n${v4List.join('\n')}\n\nIPv6结果:\n\n${v6List.join('\n')}`);
    } else {
        Alert.alert('提示', `获取IPv4和IPv6地址失败: ${result.errorMsg}`);
    }
});
```

### setHttpDnsLogEnabled

设置是否允许Native SDK打印日志

`function setHttpDnsLogEnabled(enabled: boolean)`

参数：

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| host | boolean | 必选参数 |

代码示例：

```javascript
AliyunHttpDns.setHttpDnsLogEnabled(enabled);
```

### setPreResolveHosts

设置预解析域名列表，默认解析v4

`function setPreResolveHosts(hostList: Array<string>): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | ---|
| hostList | Array\<string> | 必选参数 |

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例：

```javascript
AliyunHttpDns.setPreResolveHosts(hostList).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', `添加预解析${inputPreResolveHost}成功`)
    } else {
        Alert.alert('提示', `添加预解析${inputPreResolveHost}失败: ${result.errorMsg}`);
    }
})
```

### setPreResolveHostsWithIPType

设置预解析域名列表和解析的ip类型

`function setPreResolveHostsWithIPType(hostList: Array<string>, requestIpType: number): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 | 含义 | 
| --- | --- | ---| --- |
| hostList | Array\<string> | 必选参数 | |
| requestIpType | number | 必选参数 | 0 - v4, 1 - v6, 2 - both, 3 - auto |


返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例:

```javascript
AliyunHttpDns.setPreResolveHostsWithIPType(hostList, 0).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', `添加预解析${inputPreResolveHost}成功`)
    } else {
        Alert.alert('提示', `添加预解析${inputPreResolveHost}失败: ${result.errorMsg}`);
    }
})
```

### setCachedIPEnabled

设置是否持久化缓存IP

`function setCachedIPEnabled(enabled: boolean): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- | 
| enabled | boolean | 必选参数 |

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例:

```javascript
AliyunHttpDns.setCachedIPEnabled(enabled).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', '开启持久化缓存成功');
    } else if (code === AliyunHttpDns.kCodeInitFirst) {
        Alert.alert('提示', '请先初始化HttpDNS');
    } else {
        Alert.alert('提示', `开启持久化缓存失败: ${result.errorMsg}`);
    }
});
```

### setExpiredIPEnabled

设置是否允许返回超过ttl的IP

`function setExpiredIPEnabled(enabled: boolean): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- |
| enabled | boolean | 必选参数 |

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例:

```javascript
AliyunHttpDns.setExpiredIPEnabled(enabled).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', '允许过期IP成功');
    } else if (code === AliyunHttpDns.kCodeInitFirst) {
        Alert.alert('提示', '请先初始化HttpDNS');
    } else {
        Alert.alert('提示', `开启允许过期IP失败: ${result.errorMsg}`);
    }
});
```

### setHTTPSRequestEnabled

设置 HTTPDNS 域名解析请求类型 ( HTTP / HTTPS )

`function setHTTPSRequestEnabled(enabled: boolean)`


参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- |
| enabled | boolean | 必选参数 |

代码示例:

```javascript
AliyunHttpDns.setHTTPSRequestEnabled(enabled);
```

### setRegion

设置region节点，设置后，会按照region更新服务IP

`function setRegion(region: string): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- |
| region | string | 必选参数 |

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例:

```javascript
AliyunHttpDns.setRegion(region).then((result) => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', "设置Region成功")
    } else {
        Alert.alert('提示', `设置Region失败: ${result.errorMsg}`);
    }
);
```

### cleanHostCache

立即清除域名端侧内存和本地缓存

`function cleanHostCache(hostList: Array<string>): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- |
| hostList | Array\<string> | 必选参数 |

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例：

```javascript
AliyunHttpDns.cleanHostCache(hostList).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', `清除${inputCleanCacheHost}的缓存成功`)
    } else {
        Alert.alert('提示', `清除${inputCleanCacheHost}的缓存失败: ${result.errorMsg}`);
    }
})
```

### setIPRanking

设置IP优选

`function setIPRanking(ipRankingList: Array<IPRanking>): Promise<HttpDnsResult>`


参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- |
| ipRankingList | Array\<IPRanking> | 必选参数 |

`IPRanking`数据结构：

```javascript
interface IPRanking {
  hostName: string;
  port: number;
}
```

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例：

```javascript
let ipRankingList = [];
ipRankingList.push({
    hostName: inputIPRankingHost,
    port: +inputIPRankingPort
 });

AliyunHttpDns.setIPRanking(ipRankingList).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', `添加IP优选${inputIPRankingHost}:${inputIPRankingPort}成功`)
    } else {
        Alert.alert('提示', `添加IP优选${inputIPRankingHost}:${inputIPRankingPort}失败: ${result.errorMsg}`);
    }                        
})
```

### currentIPStack

获取当前网络栈

`function currentIPStack(): Promise<IPStackType>`

返回值：

`IPStackType`：

+ `IPStackType.IPv4`: IPv4-only网络
+ `IPStackType.IPv6`: IPv6-only网络
+ `IPStackType.Both`: 双栈网络
+ `IPStackType.Unknown`: 未检测出

代码示例：

```javascript
AliyunHttpDns.currentIPStack().then(result => {
    if (result === AliyunHttpDns.IPStackType.IPv4) {
        setCurrentIPStack("V4");
    } else if (result === AliyunHttpDns.IPStackType.IPv6) {
        setCurrentIPStack("V6");
    } else if (result === AliyunHttpDns.IPStackType.Both) {
        setCurrentIPStack("双栈");
    } else {
        setCurrentIPStack("未知");
    }
});
```

### setDegradationHost

设置降级的host列表

`function setDegradationHost(host: string): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- |
| host | string| 必选参数 |


返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例：

```javascript
AliyunHttpDns.setDegradationHost(inputDegradationHost).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', `添加降级域名${inputDegradationHost}成功`)
    } else {
        Alert.alert('提示', `添加降级域名${inputDegradationHost}失败: ${result.errorMsg}`);
    }
})
```

### getSessionId

获取会话Id

`function getSessionId(): Promise<HttpDnsResult>`

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息
+ `result`: sessionId

代码示例：

```javascript
AliyunHttpDns.getSessionId().then(result => {

});
```

### addTtlCache

添加自定义TTL域名

`function addTtlCache(host: string, ttl: number): Promise<HttpDnsResult>`

参数:

| 参数名 | 类型 | 是否必须 |
| --- | --- | --- |
| host | string| 必选参数 |
| ttl | number| 必选参数 - 秒为单位 |

返回值：

`HttpDnsResult`包含两个key值：

+ `code`: 错误码
+ `errorMsg`: 错误信息

代码示例：

```javascript
AliyunHttpDns.addTtlCache(inputTtlHost, +inputTtlTime).then(result => {
    let code = result.code;
    if (code === AliyunHttpDns.kCodeSuccess) {
        Alert.alert('提示', `添加自定义TTL${inputTtlHost} - ${inputTtlTime}秒成功`)
    } else {
        Alert.alert('提示', `添加自定义TTL${inputTtlHost} - ${inputTtlTime}秒 失败: ${result.errorMsg}`);
    }
})
```