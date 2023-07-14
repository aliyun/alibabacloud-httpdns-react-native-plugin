package com.aliyunhttpdnsreatnative;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.alibaba.sdk.android.httpdns.CacheTtlChanger;
import com.alibaba.sdk.android.httpdns.DegradationFilter;
import com.alibaba.sdk.android.httpdns.HTTPDNSResult;
import com.alibaba.sdk.android.httpdns.HttpDns;
import com.alibaba.sdk.android.httpdns.HttpDnsService;
import com.alibaba.sdk.android.httpdns.InitConfig;
import com.alibaba.sdk.android.httpdns.InitConfig.Builder;
import com.alibaba.sdk.android.httpdns.NetType;
import com.alibaba.sdk.android.httpdns.RequestIpType;
import com.alibaba.sdk.android.httpdns.log.HttpDnsLog;
import com.alibaba.sdk.android.httpdns.net.HttpDnsNetworkDetector;
import com.alibaba.sdk.android.httpdns.probe.IPProbeItem;

import android.content.Context;
import android.text.TextUtils;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = AliyunHttpdnsReactNativeModule.NAME)
public class AliyunHttpdnsReactNativeModule extends ReactContextBaseJavaModule {
	public static final String NAME = "AliyunHttpdns";

	private static final String CODE_KEY = "code";
	private static final String ERROR_MSG_KEY = "errorMsg";

	private static final String RESULT_KEY = "result";

	/**
	 * 成功
	 */
	private static final String CODE_SUCCESS = "10000";

	/**
	 * 参数错误
	 */
	private static final String CODE_PARAM_ILLEGAL = "10001";

	/**
	 * 需要先初始化
	 */
	private static final String CODE_INIT_FIRST = "10002";

	/**
	 * 初始化失败
	 */
	private static final String CODE_INIT_FAILED = "10003";

	/**
	 * 获取的结果为空
	 */
	private static final String CODE_RESULT_EMPTY = "10004";



	private final Context mContext;
	private HttpDnsService mHttpDnsService;

	private final HashMap<String, Integer> mTtlCache = new HashMap<>();

	private final CacheTtlChanger mCacheTtlChanger = (host, requestIpType, ttl) -> {
		if (mTtlCache.containsKey(host)) {
			return mTtlCache.get(host);
		}
		return ttl;
	};

	private final List<String> mDegradationList = new ArrayList<>();
	private final DegradationFilter mDegradationFilter = mDegradationList::contains;

	public AliyunHttpdnsReactNativeModule(ReactApplicationContext reactContext) {
		super(reactContext);
		mContext = reactContext.getApplicationContext();
	}

	@Override
	@NonNull
	public String getName() {
		return NAME;
	}

	@ReactMethod
	public void initWithAccountId(String accountId, Promise promise) {
		if (TextUtils.isEmpty(accountId)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "accountId is illegal");
			promise.resolve(result);
			return;
		}

		InitConfig.Builder builder = new Builder().configCacheTtlChanger(mCacheTtlChanger);
		builder.buildFor(accountId);

		mHttpDnsService = HttpDns.getService(mContext, accountId);
		mHttpDnsService.setDegradationFilter(mDegradationFilter);
		WritableMap result = new WritableNativeMap();
		if (mHttpDnsService != null) {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
		} else {
			result.putString(CODE_KEY, CODE_INIT_FAILED);
			result.putString(ERROR_MSG_KEY, "init failed");
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void initWithAccountIdAndSk(String accountId, String secretKey, Promise promise) {
		if (TextUtils.isEmpty(accountId) || TextUtils.isEmpty(secretKey)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "accountId or secretKey is empty");
			promise.resolve(result);
			return;
		}
		InitConfig.Builder builder = new Builder().configCacheTtlChanger(mCacheTtlChanger);
		builder.buildFor(accountId);
		mHttpDnsService = HttpDns.getService(mContext, accountId, secretKey);
		mHttpDnsService.setDegradationFilter(mDegradationFilter);
		WritableMap result = new WritableNativeMap();
		if (mHttpDnsService != null) {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
		} else {
			result.putString(CODE_KEY, CODE_INIT_FAILED);
			result.putString(ERROR_MSG_KEY, "init failed");
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void getIPv4ForHostAsync(String host, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(host)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host is empty");
			promise.resolve(result);
			return;
		}

		String ipv4 = mHttpDnsService.getIpByHostAsync(host);
		WritableMap result = new WritableNativeMap();
		if (!TextUtils.isEmpty(ipv4)) {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
			result.putString(RESULT_KEY, ipv4);
		} else {
			result.putString(CODE_KEY, CODE_RESULT_EMPTY);
			result.putString(ERROR_MSG_KEY, "ipv4 result is empty");
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void getIPv4ListForHostAsync(String host, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(host)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host is empty");
			promise.resolve(result);
			return;
		}

		String[] ipv4List = mHttpDnsService.getIpsByHostAsync(host);
		WritableMap result = new WritableNativeMap();
		if (ipv4List == null || ipv4List.length == 0) {
			result.putString(CODE_KEY, CODE_RESULT_EMPTY);
			result.putString(ERROR_MSG_KEY, "ipv4 list result is empty");
		} else {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
			WritableArray array = new WritableNativeArray();
			for (String ipv4 : ipv4List) {
				array.pushString(ipv4);
			}
			result.putArray(RESULT_KEY, array);
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void getIPv6ForHostAsync(String host, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(host)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host is empty");
			promise.resolve(result);
			return;
		}

		String ipv6 = mHttpDnsService.getIPv6ByHostAsync(host);
		WritableMap result = new WritableNativeMap();
		if (!TextUtils.isEmpty(ipv6)) {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
			result.putString(RESULT_KEY, ipv6);
		} else {
			result.putString(CODE_KEY, CODE_RESULT_EMPTY);
			result.putString(ERROR_MSG_KEY, "ipv6 result is empty");
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void getIPv6ListForHostAsync(String host, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(host)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host is empty");
			promise.resolve(result);
			return;
		}

		String[] ipv6List = mHttpDnsService.getIPv6sByHostAsync(host);
		WritableMap result = new WritableNativeMap();
		if (ipv6List == null || ipv6List.length == 0) {
			result.putString(CODE_KEY, CODE_RESULT_EMPTY);
			result.putString(ERROR_MSG_KEY, "ipv6 list result is empty");
		} else {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
			WritableArray array = new WritableNativeArray();
			for (String ipv6 : ipv6List) {
				array.pushString(ipv6);
			}
			result.putArray(RESULT_KEY, array);
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void getIPv4IPv6ListForHostAsync(String host, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(host)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host is empty");
			promise.resolve(result);
			return;
		}

		HTTPDNSResult httpdnsResult = mHttpDnsService.getAllByHostAsync(host);
		WritableMap result = new WritableNativeMap();
		if (httpdnsResult == null) {
			result.putString(CODE_KEY, CODE_RESULT_EMPTY);
			result.putString(ERROR_MSG_KEY, "ipv4 and ipv6 list result is empty");
		} else {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
			WritableArray v4Array = new WritableNativeArray();
			WritableArray v6Array = new WritableNativeArray();

			String[] ipv4List = httpdnsResult.getIps();
			if (ipv4List != null && ipv4List.length > 0) {
				for (String ipv4 : ipv4List) {
					v4Array.pushString(ipv4);
				}
			}
			String[] ipv6List = httpdnsResult.getIpv6s();
			if (ipv6List != null && ipv6List.length > 0) {
				for (String ipv6 : ipv6List) {
					v6Array.pushString(ipv6);
				}
			}

			WritableMap writableMap = new WritableNativeMap();
			writableMap.putArray("ipv4", v4Array);
			writableMap.putArray("ipv6", v6Array);
			result.putMap(RESULT_KEY, writableMap);
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void setHttpDnsLogEnabled(boolean enabled) {
		HttpDnsLog.enable(enabled);
	}

	@ReactMethod
	public void setPreResolveHosts(ReadableArray hostList, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (hostList == null || hostList.size() == 0) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "preResolve host list is empty");
			promise.resolve(result);
			return;
		}

		ArrayList<String> list = new ArrayList<>();
		for (int i = 0; i < hostList.size(); i++) {
			String host = hostList.getString(i);
			list.add(host);
		}
		mHttpDnsService.setPreResolveHosts(list);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void setPreResolveHostsWithIPType(ReadableArray hostList, int requestType, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (hostList == null || hostList.size() == 0) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host list is empty");
			promise.resolve(result);
			return;
		}

		ArrayList<String> list = new ArrayList<>();
		for (int i = 0; i < hostList.size(); i++) {
			String host = hostList.getString(i);
			list.add(host);
		}

		if (requestType > 3) {
			requestType = 3;
		}
		RequestIpType ipType = RequestIpType.values()[requestType];

		mHttpDnsService.setPreResolveHosts(list, ipType);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void setCachedIPEnabled(boolean enabled, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		mHttpDnsService.setCachedIPEnabled(enabled);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);

	}

	@ReactMethod
	public void setExpiredIPEnabled(boolean enabled, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		mHttpDnsService.setExpiredIPEnabled(enabled);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void setHTTPSRequestEnabled(boolean enabled, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		mHttpDnsService.setHTTPSRequestEnabled(enabled);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void setRegion(String region, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(region)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "region is empty");
			promise.resolve(result);
			return;
		}

		mHttpDnsService.setRegion(region);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void cleanHostCache(ReadableArray hostList, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		ArrayList<String> list = new ArrayList<>();
		for (int i = 0; i < hostList.size(); i++) {
			String host = hostList.getString(i);
			list.add(host);
		}

		mHttpDnsService.cleanHostCache(list);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void setIPRanking(ReadableArray ipRankingList, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		List<IPProbeItem> ipProbeItemList = new ArrayList<>();
		for (int i = 0; i < ipRankingList.size(); i++) { {
			ReadableMap map = ipRankingList.getMap(i);
			String hostName = map.getString("hostName");
			int port = map.getInt("port");
			ipProbeItemList.add(new IPProbeItem(hostName, port));
		}}

		mHttpDnsService.setIPProbeList(ipProbeItemList);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void currentIPStack(Promise promise) {
		NetType netType = HttpDnsNetworkDetector.getInstance().getNetType(mContext);
		promise.resolve(netType.ordinal());
	}

	@ReactMethod
	public void setAuthCurrentTime(long time, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (time < 0) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "time is illegal");
			promise.resolve(result);
			return;
		}

		mHttpDnsService.setAuthCurrentTime(time);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void getSessionId(Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		String sessionId = mHttpDnsService.getSessionId();
		WritableMap result = new WritableNativeMap();
		if (TextUtils.isEmpty(sessionId)) {
			result.putString(CODE_KEY, CODE_RESULT_EMPTY);
			result.putString(ERROR_MSG_KEY, "sessionID is empty");
		} else {
			result.putString(CODE_KEY, CODE_SUCCESS);
			result.putString(ERROR_MSG_KEY, "success");
			result.putString(RESULT_KEY, sessionId);
		}
		promise.resolve(result);
	}

	@ReactMethod
	public void setDegradationHost(String host, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(host)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host is empty");
			promise.resolve(result);
			return;
		}
		mDegradationList.add(host);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}

	@ReactMethod
	public void addTtlCache(String host, int ttl, Promise promise) {
		if (mHttpDnsService == null) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_INIT_FIRST);
			result.putString(ERROR_MSG_KEY, "please call init method first");
			promise.resolve(result);
			return;
		}

		if (TextUtils.isEmpty(host)) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "host is empty");
			promise.resolve(result);
			return;
		}

		if (ttl < 0) {
			WritableMap result = new WritableNativeMap();
			result.putString(CODE_KEY, CODE_PARAM_ILLEGAL);
			result.putString(ERROR_MSG_KEY, "ttl is illegal");
			promise.resolve(result);
			return;
		}

		mTtlCache.put(host, ttl);
		WritableMap result = new WritableNativeMap();
		result.putString(CODE_KEY, CODE_SUCCESS);
		result.putString(ERROR_MSG_KEY, "success");
		promise.resolve(result);
	}
}
