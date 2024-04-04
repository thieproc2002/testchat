import { View, FlatList, StyleSheet, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { getImageMessage } from '../../../../redux/selector';
import { TouchableOpacity } from 'react-native';
import { handleFileExtension } from '../../../../utils/filePathConfig';
import { Video, Audio } from 'expo-av';

function ChildImageScreen() {
    const allImage = useSelector(getImageMessage);
    const videos = allImage.join(',').split(',');
    let listVideo = [];

    for (let image of videos) {
        if (image != "") {
            const fileEx = handleFileExtension(image);
            if (fileEx === 'mp4') {
                listVideo.push({
                    image: image,
                });
            }
        }
    }
    //UI
    return (
        <>
            {listVideo.length > 0 ? (
                <View style={styles.container}>
                    <FlatList
                        key={'*'}
                        data={listVideo}
                        keyExtractor={(item, index) => '*' + index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity>
                                <Video
                                    style={styles.imageThumbnail}
                                    source={{ uri: item.image }}
                                    useNativeControls
                                    resizeMode="contain"
                                    isLooping
                                    volume={1.0}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            ) : (
                <View style ={{width:"100%", height: "100%", alignItems:'center', justifyContent:"center"}}>
                    <Text style={{fontSize: 16}}>Chưa có video</Text>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    imageThumbnail: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 150,
    },
});
export default ChildImageScreen;
