import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { initSentry } from './src/lib/sentry';

// M0 has zero user-facing screens or product features (see the M0 spec) —
// app shell, navigation and real screens are M1's SHELL-1..4. This file is
// deliberately a placeholder beyond wiring the M0 infra libs that need to
// initialize at app startup.
initSentry();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>SponTRIP — M0 scaffold. App shell arrives in M1.</Text>
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
