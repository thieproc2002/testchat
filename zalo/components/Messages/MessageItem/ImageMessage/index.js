import { View, Text, Image, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import ImageView from 'react-native-image-viewing';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
function ImageMessage({ imageURI, content, images }) {
    const [visible, setVisible] = useState(false);
    const [url, setUrl] = useState('');

    const handleViewingImage = (link) => {
        setVisible(true);
        setUrl(link);
    };
    return (
        <>
            <View style={[images?.length > 1 ? styles.body : null]}>
                {images?.length > 1 ? (
                    images.map((link, index) => {
                        return link.split('.')[link.split('.').length - 1] === 'mp4' ? (
                            <Video
                                key={link}
                                style={[images?.length > 1 ? styles.imagesMessage : styles.imageMessage]}
                                source={{ uri: link }}
                                useNativeControls
                                resizeMode="contain"
                                isLooping
                                volume={1.0}
                            />
                        ) : (
                            <TouchableOpacity
                                key={link}
                                onPress={() => {
                                    handleViewingImage(link);
                                }}
                            >
                                <Image
                                    source={{ uri: link }}
                                    style={[images?.length > 1 ? styles.imagesMessage : styles.imageMessage]}
                                    resizeMode="stretch"
                                />
                            </TouchableOpacity>
                        );
                    })
                ) : imageURI.split('.')[imageURI.split('.').length - 1] === 'mp4' ? (
                    <Video
                        style={styles.imageMessage}
                        source={{ uri: imageURI }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        volume={1.0}
                    />
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            handleViewingImage(imageURI);
                        }}
                    >
                        <Image source={{ uri: imageURI }} style={styles.imageMessage} resizeMode="stretch" />
                    </TouchableOpacity>
                )}
                {content && <Text style={[styles.message]}>{content}</Text>}
            </View>

            <ImageView
                images={[{ uri: url }]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        alignContent: 'space-around',
        flexWrap: 'wrap',
    },
    message: {
        paddingTop: 8,
    },
    imageMessage: {
        width: 275,
        height: 350,
    },
    imagesMessage: {
        width: 133,
        height: 180,
        margin: 2,
    },
});
export default ImageMessage;
