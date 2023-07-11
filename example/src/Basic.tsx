import React, { useState } from "react";
import { View, Switch, StyleSheet, Text, ScrollView, Alert, Button, Pressable, Modal } from "react-native";
import { RadioButton } from 'react-native-paper';
import Dialog from "react-native-dialog";

import * as AliyunHttpDns from 'aliyun-httpdns-reat-native';

export default function Basic() {
    const [enableExpiredIP, setExpiredIPEnabled] = useState(false);
    const [enableCacheIP, setCachedIPEnabled] = useState(false);
    const [enableHTTPS, setHTTPSRequestEnabled] = useState(false);
    const [enableLog, setHttpDnsLogEnabled] = useState(false);

    const [regionModalVisible, setRegionModalVisible] = useState(false);
    const [radioRegion, setRadioRegion] = React.useState('cn');
    const [finalRegion, setFinalRegion] = React.useState('cn');

    //清除指定域名缓存
    const [cleanHostCacheVisible, setCleanHostCacheVisible] = React.useState(false);
    const [inputCleanCacheHost, setInputCleanCacheHost] = React.useState("");

    //添加预解析
    const [addPreResolveVisible, setAddPreResolveVisible] = React.useState(false);
    const [inputPreResolveHost, setInputPreReslveHost] = React.useState("");

    const toggleExpiredIP = () => {
        AliyunHttpDns.setExpiredIPEnabled(!enableExpiredIP).then((result) => {

            let code = result.code;
            if (code === AliyunHttpDns.kCodeSuccess) {
                setExpiredIPEnabled(previousState => !previousState);
            } else if (code === AliyunHttpDns.kCodeInitFirst) {
                Alert.alert('提示', '请先初始化HttpDNS');
            } else {
                Alert.alert('提示', `setExpiredIPEnabled failed: ${result.errorMsg}`);
            }
        })
    }
    const toggleCachedIP = () => setCachedIPEnabled(previousState => !previousState);
    const toggleHTTPS = () => setHTTPSRequestEnabled(previousState => !previousState);
    const toggleLog = () => setHttpDnsLogEnabled(previousState => !previousState);


    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.btn}>
                <Button
                    title="初始化HttpDNS"
                    onPress={() => {
                        AliyunHttpDns.initWithAccountId("").then((result) => {
                            let code = result.code;
                            if (code === AliyunHttpDns.kCodeSuccess) {
                                Alert.alert('提示', "初始化HttpDNS成功👋")
                            } else {
                                Alert.alert('提示', `初始化HttpDNS失败: ${result.errorMsg}`);
                            }
                        })
                    }}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>
                    允许过期IP
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={enableExpiredIP ? "#1B58F4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleExpiredIP}
                    value={enableExpiredIP}
                />
            </View>

            <View style={styles.container}>
                <Text style={styles.text}>
                    持久化缓存
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={enableCacheIP ? "#1B58F4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleCachedIP}
                    value={enableCacheIP}
                />
            </View>

            <View style={styles.container}>
                <Text style={styles.text}>
                    开启HTTPS
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={enableHTTPS ? "#1B58F4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleHTTPS}
                    value={enableHTTPS}
                />
            </View>

            <View style={styles.container}>
                <Text style={styles.text}>
                    允许SDK打印日志
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={enableLog ? "#1B58F4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleLog}
                    value={enableLog}
                />
            </View>

            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={regionModalVisible}
                    onRequestClose={() => {
                        setRegionModalVisible(!regionModalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.radioRow}>
                                <Text style={styles.modalText}>中国</Text>
                                <RadioButton
                                    value="cn"
                                    status={radioRegion === 'cn' ? 'checked' : 'unchecked'}
                                    onPress={() => setRadioRegion('cn')}
                                />
                            </View>
                            <View style={styles.radioRow}>
                                <Text style={styles.modalText}>中国香港</Text>
                                <RadioButton
                                    value="hk"
                                    status={radioRegion === 'hk' ? 'checked' : 'unchecked'}
                                    onPress={() => setRadioRegion('hk')}
                                />
                            </View>
                            <View style={styles.radioRow}>
                                <Text style={styles.modalText}>新加坡</Text>
                                <RadioButton
                                    value="sg"
                                    status={radioRegion === 'sg' ? 'checked' : 'unchecked'}
                                    onPress={() => setRadioRegion('sg')}
                                />
                            </View>
                            <View style={{ width: 100, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button
                                    title="取消"
                                    onPress={() => {
                                        setRegionModalVisible(!regionModalVisible);
                                    }}
                                />
                                <Button
                                    title="确认"
                                    onPress={() => {
                                        setRegionModalVisible(!regionModalVisible);
                                        AliyunHttpDns.setRegion(radioRegion).then((result) => {
                                            let code = result.code;
                                            if (code === AliyunHttpDns.kCodeSuccess) {
                                                setFinalRegion(radioRegion);
                                                Alert.alert('提示', "设置Region成功")
                                            } else {
                                                Alert.alert('提示', `设置Region失败: ${result.errorMsg}`);
                                            }
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                </Modal>

                <Pressable
                    onPress={() => {
                        setRegionModalVisible(true);
                    }}
                    style={({ pressed }) => [
                        {
                            flex: 1,
                            backgroundColor: pressed
                                ? 'rgb(210, 230, 255)'
                                : 'white'
                        },
                    ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>
                            Region
                        </Text>

                        <Text style={styles.text}>
                            {getRegionText(finalRegion)}
                        </Text>
                    </View>
                </Pressable>

            </View>
            <View style={styles.container}>
                <Dialog.Container visible={cleanHostCacheVisible}>
                    <Dialog.Title>清空制定域名缓存</Dialog.Title>
                    <Dialog.Input label="请输入要清空缓存的域名" onChangeText={text => setInputCleanCacheHost(text)}>
                    </Dialog.Input>
                    <Dialog.Button label="取消" onPress={() => {
                        setCleanHostCacheVisible(false);
                    }} />
                    <Dialog.Button label="确定" onPress={() => {
                        setCleanHostCacheVisible(false);
                        let hostList = [];
                        hostList.push(inputCleanCacheHost);
                        AliyunHttpDns.cleanHostCache(hostList).then(result => {
                            let code = result.code;
                            if (code === AliyunHttpDns.kCodeSuccess) {
                                Alert.alert('提示', `清除${inputCleanCacheHost}的缓存成功`)
                            } else {
                                Alert.alert('提示', `清除${inputCleanCacheHost}的缓存失败: ${result.errorMsg}`);
                            }
                            setInputCleanCacheHost("");
                        })
                    }} />
                </Dialog.Container>
                <Pressable
                    onPress={() => {
                        setCleanHostCacheVisible(true);
                    }}
                    style={({ pressed }) => [
                        {
                            flex: 1,
                            backgroundColor: pressed
                                ? 'rgb(210, 230, 255)'
                                : 'white'
                        },
                    ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>
                            清空指定域名缓存
                        </Text>
                    </View>
                </Pressable>
            </View>

            <View style={styles.container}>
                <Dialog.Container visible={addPreResolveVisible}>
                    <Dialog.Title>添加预解析域名</Dialog.Title>
                    <Dialog.Input label="请输入要预解析的域名" onChangeText={text => setInputPreReslveHost(text)}>
                    </Dialog.Input>
                    <Dialog.Button label="取消" onPress={() => {
                        setAddPreResolveVisible(false);
                    }} />
                    <Dialog.Button label="确定" onPress={() => {
                        setAddPreResolveVisible(false);
                        let hostList = [];
                        hostList.push(inputPreResolveHost);
                        AliyunHttpDns.setPreResolveHosts(hostList).then(result => {
                            let code = result.code;
                            if (code === AliyunHttpDns.kCodeSuccess) {
                                Alert.alert('提示', `添加预解析${inputPreResolveHost}成功`)
                            } else {
                                Alert.alert('提示', `添加预解析${inputPreResolveHost}失败: ${result.errorMsg}`);
                            }
                            setInputPreReslveHost("");
                        })
                    }} />
                </Dialog.Container>
                <Pressable
                    onPress={() => {
                        setAddPreResolveVisible(true);
                    }}
                    style={({ pressed }) => [
                        {
                            flex: 1,
                            backgroundColor: pressed
                                ? 'rgb(210, 230, 255)'
                                : 'white'
                        },
                    ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>
                            添加预解析域名
                        </Text>
                    </View>
                </Pressable>
            </View>

        </ScrollView>
    )
}

function getRegionText(code: string): string {
    if ('hk' === code) {
        return "中国香港";
    } else if ("sg" === code) {
        return "新加坡";
    } else {
        return "中国";
    }
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginHorizontal: 15,
    },
    btn: {
        marginTop: 10,
        marginHorizontal: 15,
    },

    text: {
        paddingVertical: 15,
        fontSize: 18,
        color: 'black'
    },

    scrollView: {
        backgroundColor: 'white'
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    radioRow: {
        width: 200,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        marginVertical: 5
    },
    modalText: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight: 30,
        fontSize: 18
    },
    modalOk: {
        marginTop: 15,
    },
    okText: {
        fontSize: 22,
        fontWeight: 'bold'
    }

});
