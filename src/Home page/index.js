import React, { useState } from "react";
import { Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native";
import { View, Text, TouchableOpacity, Image, Modal, Platform, PermissionsAndroid, StyleSheet } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Card } from 'react-native-elements';
import storageRef from '@react-native-firebase/storage';


const Home = () => {
    const [imageUri, setImageUri] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const captureImage = async (isCamera) => {
        let options = {
            mediaType: 'photo',
        };

        let isPermissionGranted = false;

        if (isCamera) {
            isPermissionGranted = await requestCameraPermission();
            if (!isPermissionGranted) return;
        }

        let imagePickerFunction = isCamera ? launchCamera : launchImageLibrary;

        imagePickerFunction(options, (response) => {
            console.log(JSON.parse(JSON.stringify(response)));
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode == 'camera_unavailable') {
                console.log('Camera not available on device');
            } else if (response.errorCode == 'permission') {
                console.log('Permission not satisfied');
            } else if (response.errorCode == 'others') {
                console.log(response.errorMessage);
            } else {
                setImageUri(response.assets[0].uri);
                setModalVisible(false);
            }
        });
    };

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const submit = async () => {
        const upload = imageUri;
        let filename = upload.substring(upload.lastIndexOf('/') + 1);
        try {
            await storageRef().ref(filename).putFile(upload);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d5f5ee' }}>
            {imageUri && <TouchableOpacity onPress={() => submit()}>
                <Card containerStyle={{ width: '70%', marginLeft: '15%', backgroundColor: '#a1eddd' }}>
                    <Text style={{ textAlign: 'center' }}>
                        Click&upload
                    </Text>
                </Card>
            </TouchableOpacity>}
            <View
                style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}>
                    <Card containerStyle={{ borderRadius: 10, backgroundColor: '#a1eddd' }}>
                        <Text
                            style={{ fontSize: 15, fontWeight: 'bold' }}>
                            Open
                        </Text>
                    </Card>
                </TouchableOpacity>

                {imageUri !== '' && imageUri !== null && (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ height: "81%", width: "93%", borderRadius: 10, borderWidth: 2, borderColor: 'black' }}
                    />
                )}

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View
                        style={styles.centeredView}>
                        <View
                            style={styles.modalView}>
                            <TouchableOpacity
                                onPress={() => captureImage(true)}>
                                <Text
                                    style={styles.modalText}>
                                    Open Camera
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => captureImage(false)}>
                                <Text
                                    style={styles.modalText}>
                                    Open Gallery
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.bottomLinks}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com')} style={{ marginLeft: 10 }}>
                    <Text style={[styles.text, { color: '#e02495ed' }]}>
                        Instagram
                    </Text>
                </TouchableOpacity >
                <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com')}>
                    <Text style={[styles.text, { color: '#1717e8' }]}>
                        Facebook
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.gmail.com')}>
                    <Text style={[styles.text, { color: '#f7020f' }]}>
                        Gmail
                    </Text>
                </TouchableOpacity >
                <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com')}>
                    <Text style={[styles.text, { color: '#f7020f' }]}>
                        Youtube
                    </Text>
                </TouchableOpacity>
            </View>
            {/* <View style={{ top: 530 }}>
                <TouchableOpacity style={{ marginTop: 10, marginLeft: '80%' }} onPress={() => Linking.openURL('https://www.google.com/search?q=how+to+upload+profile+picture+&sca_esv=567266337&rlz=1C1ONGR_en-GBIN1068IN1068&ei=gj8MZc3cF9bt-AbIraHoBg&ved=0ahUKEwjNpc2g4ruBAxXWNt4KHchWCG0Q4dUDCBA&uact=5&oq=how+to+upload+profile+picture+&gs_lp=Egxnd3Mtd2l6LXNlcnAiHmhvdyB0byB1cGxvYWQgcHJvZmlsZSBwaWN0dXJlIDIHEAAYigUYQzIFEAAYgAQyBRAAGIAEMgUQABiABDIHEAAYigUYQzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESNEUUIIFWJkLcAJ4AZABAJgBpAGgAeQDqgEDMC40uAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICChAAGIoFGLADGEPiAwQYACBBiAYBkAYJ&sclient=gws-wiz-serp')}>
                    <Text>
                        Help?
                    </Text>
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    );
}
export default Home;

const styles = StyleSheet.create({
    centeredView: {
        height: '50%',
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "#a1eddd",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18
    },
    text: {
        marginLeft: '10%',
        fontSize: 15,
        fontWeight: 'bold'
    },
    bottomLinks: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 40,
        width: '100%',
        backgroundColor: '#d5f5ee'
    }
});



