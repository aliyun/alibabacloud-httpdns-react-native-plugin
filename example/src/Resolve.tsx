import React from "react";
import { Alert, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Button, Text } from "react-native-paper";

import * as AliyunHttpDns from 'aliyun-httpdns-reat-native';

export default function Resolve() {

    const [host, setHost] = React.useState("");
    const [resolveResult, setResolveResult] = React.useState("");

    const resolveHttpdns = (type: number) => {
        if (host === '') {
            Alert.alert('提示', '域名不能为空');
            return;
        }

        let regex = /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/;
        if (!regex.test(host)) {
            Alert.alert('提示', '请输入正确的域名');
            return;
        }
        switch (type) {
            case 0:
                //单v4
                AliyunHttpDns.getIPv4ForHostAsync(host).then(result => {
                    let code = result.code;
                    if (code === AliyunHttpDns.kCodeSuccess) {
                        let v4 = result.result;
                        setResolveResult(`IPv4结果:\n\n${v4}`);
                    } else {
                        Alert.alert('提示', `获取单个IPv4地址失败: ${result.errorMsg}`);
                    }
                });
                break;
            case 1:
                //多v4
                AliyunHttpDns.getIPv4ListForHostAsync(host).then(result => {
                    let code = result.code;
                    if (code === AliyunHttpDns.kCodeSuccess) {
                        let v4List = result.result;
                        setResolveResult(`IPv4结果:\n\n${v4List.join('\n')}`);
                    } else {
                        Alert.alert('提示', `获取多个IPv4地址失败: ${result.errorMsg}`);
                    }
                });
                break;
            case 2:
                //单v6
                AliyunHttpDns.getIPv6ForHostAsync(host).then(result => {
                    let code = result.code;
                    if (code === AliyunHttpDns.kCodeSuccess) {
                        let v6 = result.result;
                        setResolveResult(`IPv6结果:\n\n${v6}`);
                    } else {
                        Alert.alert('提示', `获取单个IPv6地址失败: ${result.errorMsg}`);
                    }
                });
                break;
            case 3:
                //多v6
                AliyunHttpDns.getIPv6ListForHostAsync(host).then(result => {
                    let code = result.code;
                    if (code === AliyunHttpDns.kCodeSuccess) {
                        let v6List = result.result;
                        setResolveResult(`IPv6结果:\n\n${v6List.join('\n')}`);
                    } else {
                        Alert.alert('提示', `获取多个IPv6地址失败: ${result.errorMsg}`);
                    }
                });
                break;
            case 4:
                //双栈
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
                break;
        }
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.indicate}>
                    请输入要解析的域名
                </Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setHost(text)}
                    value={host}
                />
            </View>

            <View style={styles.rowContainer}>
                <Button style={styles.btn} mode="text" textColor="#1B58F4" onPress={() => { resolveHttpdns(0) }}>
                    单个IPv4地址
                </Button>

                <Button style={styles.btn} mode="text" textColor="#1B58F4" onPress={() => { resolveHttpdns(1) }}>
                    多个IPv4地址
                </Button>

                <Button style={styles.btn} mode="text" textColor="#1B58F4" onPress={() => { resolveHttpdns(2) }}>
                    单个IPv6地址
                </Button>

                <Button style={styles.btn} mode="text" textColor="#1B58F4" onPress={() => { resolveHttpdns(3) }}>
                    多个IPv6地址
                </Button>

                <Button style={styles.btn} mode="text" textColor="#1B58F4" onPress={() => { resolveHttpdns(4) }}>
                    IPv4地址 + IPv6地址
                </Button>

            </View>

            <View style={styles.container}>
                <Text style={styles.indicate}>
                    解析结果：
                </Text>

                <Text style={styles.result}>
                    {resolveResult}
                </Text>

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'white'
    },

    container: {
        marginHorizontal: 15,
        marginVertical: 10
    },

    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },

    indicate: {
        color: 'black',
        fontSize: 16,
        marginVertical: 10
    },

    btn: {
        marginHorizontal: 5
    },

    result: {
        flex: 1,
        flexWrap: 'wrap',
        borderColor: 'black',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10
    }
});