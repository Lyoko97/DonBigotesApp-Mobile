import { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { useAppFonts } from './src/theme/useAppFonts';
import { colors, typography } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Placeholder temporal: se reemplaza por RootNavigator en el checkpoint 5.
// Por ahora solo confirma que tokens.ts y la carga de fuentes funcionan.
export default function App() {
  const [fontsLoaded, fontsError] = useAppFonts();

  const onLayout = useCallback(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  useEffect(() => {
    onLayout();
  }, [onLayout]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={typography.eyebrow}>Pedidos</Text>
      <Text style={typography.screenTitle}>Viernes 28 de agosto</Text>
      <Text style={typography.monoBoldL}>$51.50</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
