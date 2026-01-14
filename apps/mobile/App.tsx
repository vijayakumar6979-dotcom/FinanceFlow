import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SHARED_CONSTANT } from '@financeflow/shared';

export default function App() {
    return (
        <View style={styles.container}>
            <Text>FinanceFlow Mobile App</Text>
            <Text>{SHARED_CONSTANT}</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
