import { View, Image, FlatList, StyleSheet, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFileMessage } from '../../../../redux/selector';
import { TouchableOpacity } from 'react-native';
import { iconExtends, icons, handleFileExtension, handleFileName } from '../../../../utils/filePathConfig';
import { Linking } from 'react-native';

function ChildImageScreen({ navigation }) {
    const allFile = useSelector(getFileMessage);
    let listFile = [];

    // Open file
    const handleOpenFile = async (fileUri) => {
        if (Platform.OS === 'ios') navigation.navigate('ViewFileScreen', { link: fileUri });
        else {
            const supported = await Linking.canOpenURL(fileUri);

            if (supported) {
                await Linking.openURL(fileUri);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }
    };

    for (let file of allFile) {
        if (file) {
            const fileEx = handleFileExtension(file);
            const fileName = handleFileName(file);

            listFile.push({
                fileEx: fileEx,
                fileName: fileName,
                fileUri: file,
            });
        }
    }

    //UI
    return (
        <>
            {listFile.length > 0 ? (
                <View style={styles.container}>
                    <FlatList
                        key={'#'}
                        data={listFile}
                        keyExtractor={(item) => '#' + item.fileUri + Math.random()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.file}
                                onPress={() => {
                                    handleOpenFile(item.fileUri);
                                }}
                            >
                                <Image
                                    source={iconExtends.includes(item.fileEx) ? icons[item.fileEx] : icons['blank']}
                                    style={styles.icon}
                                />
                                <Text style={styles.fileName}>{item.fileName}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            ) : (
                <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16 }}>Chưa có file</Text>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    file: {
        margin: 5,
        width: 250,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 70,
        height: 70,
    },
    fileName: {
        width: '80%',
        height: '100%',
        padding: 8,
        fontWeight: 'bold',
    },
});
export default ChildImageScreen;
