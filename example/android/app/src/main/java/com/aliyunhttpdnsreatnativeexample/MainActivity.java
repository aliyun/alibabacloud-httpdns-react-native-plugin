package com.aliyunhttpdnsreatnativeexample;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

	@Override
	protected String getMainComponentName() {
		return "AliyunHttpdnsReatNativeExample";
	}
	
	@Override
	protected ReactActivityDelegate createReactActivityDelegate() {
		return new DefaultReactActivityDelegate(
			this,
			getMainComponentName(),
			// If you opted-in for the New Architecture, we enable the Fabric Renderer.
			DefaultNewArchitectureEntryPoint.getFabricEnabled());
	}
}
