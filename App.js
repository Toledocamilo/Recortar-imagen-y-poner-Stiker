import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
const PlaceholderImage = require('./assets/imagen/Chainsaw_Man.jpg');
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EmojiSticker from './components/EmojiSticker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export default function App() {
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const imageRef = useRef();

    //estados de los componentes 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [pickedEmoji, setPickedEmoji] = useState(null);

    if (status === null) {
        requestPermission();
    }
    const onSaveImageAsync = async () => {
        try {
            const localUri = await captureRef(imageRef, {
                height: 440,
                quality: 1,
            });

            await MediaLibrary.saveToLibraryAsync(localUri);
            if (localUri) {
                alert("Guardada!");
            }
        } catch (e) {
            console.log(e);
        }
    };


    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert('No se selecciono ninguna imagen.');
        }
    };

    const onReset = () => {
        setShowAppOptions(false);
    };
    //constructor de mostar modal
    const onAddSticker = () => {
        setIsModalVisible(true);
    };
    //constructor de cerrar modal
    const onModalClose = () => {
        setIsModalVisible(false);
    };


    return (

        <GestureHandlerRootView style={styles.container}>
            <View ref={imageRef} collapsable={false}>
                <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
                {pickedEmoji !== null ? (
                    <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
                ) : null}
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Reset" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button theme="primary" label="Elige una foto" onPress={pickImageAsync} />
                    <Button label="Usar stikers" onPress={() => setShowAppOptions(true)} />
                </View>
            )}
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
            </EmojiPicker>

            <StatusBar style="auto" />

        </GestureHandlerRootView>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
    footerContainer: {
        flex: 1 / 3,
        marginTop: 140,
        alignItems: 'center',
    },

    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    "assets": [
        {
            "assetId": null,
            "base64": null,
            "duration": null,
            "exif": null,
            "height": 4800,
            "rotation": null,
            "type": "image",
            "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%username%252Fsticker-smash-47-beta/ImagePicker/77c4e56f-4ccc-4c83-8634-fc376597b6fb.jpeg",
            "width": 3200
        }
    ],
    "canceled": false,
    "cancelled": false
});
