import { Text, View } from 'react-native';
import Header from '../../../components/Header';
import { WebView } from 'react-native-webview';
import Loading from '../../../components/Loading';
import { useState } from 'react';
function ViewFileScreen({ route }) {
    const { link } = route.params;
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Header />
            <View style={{ width: '100%', height: '100%' }}>
                <View style={{ width: '100%', height: '100%' }}>
                    {loading ? (
                        <Loading />
                    ) : (
                        <WebView
                            source={{ uri: link }}
                            onLoad={() => setLoading(true)}
                            onLoadEnd={() => setLoading(false)}
                        />
                    )}
                </View>
            </View>
        </>
    );
}

export default ViewFileScreen;
