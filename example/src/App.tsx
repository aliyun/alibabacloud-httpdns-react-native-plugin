import * as React from 'react';

import { Platform, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Basic from './Basic';
import Resolve from './Resolve';


const renderScene = SceneMap({
  first: Basic,
  second: Resolve,
});

export default function App() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: '基础设置' },
    { key: 'second', title: 'HttpDNS解析' },
  ]);

  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </SafeAreaView>
    )
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

