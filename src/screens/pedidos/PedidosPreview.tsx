import { useEffect, useState } from "react";
import { BackHandler, Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { OrdersListScreen } from "./OrdersListScreen";
import { OrderDetailScreen } from "./OrderDetailScreen";
import { colors, fonts, spacing } from "./provisional/theme";

// SOLO PARA PROBAR en Expo Go mientras no exista la navegación de Persona 1.
// No forma parte del módulo: cuando exista src/navigation, se borra.
//
// Uso temporal (NO subir este cambio): en App.tsx
//   import { PedidosPreview } from "./src/screens/pedidos/PedidosPreview";
//   export default function App() { return <PedidosPreview />; }
export function PedidosPreview() {
  const [abierto, setAbierto] = useState<string | null>(null);

  // Botón "atrás" de Android: del detalle vuelve a la lista.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!abierto) return false;
      setAbierto(null);
      return true;
    });
    return () => sub.remove();
  }, [abierto]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      {abierto ? (
        <>
          <Pressable onPress={() => setAbierto(null)} accessibilityRole="button" style={styles.back} hitSlop={8}>
            <Text style={styles.backText}>‹ Pedidos</Text>
          </Pressable>
          <OrderDetailScreen orderId={abierto} />
        </>
      ) : (
        <OrdersListScreen onOpenOrder={setAbierto} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 50,
  },
  back: { paddingHorizontal: spacing[4], paddingTop: spacing[2] },
  backText: { fontFamily: fonts.body, fontSize: 16, fontWeight: "600", color: colors.vino },
});
