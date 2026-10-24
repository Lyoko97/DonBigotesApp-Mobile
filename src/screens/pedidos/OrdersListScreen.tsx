import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Order, OrderStatus } from "./tipos";
import { ordersService, mensajeDeError } from "./datos/ordersService";
import { ETIQUETA_ESTADO, FILTROS_ESTADO, MOSTRAR_CANCELADOS_EN_LISTA } from "./estados";
import { fechaLarga } from "./formato";
import { usePolling } from "./usePolling";
import { Chip } from "./provisional/Chip";
import { OrderCard } from "./provisional/OrderCard";
import { colors, fonts, radius, spacing } from "./provisional/theme";

type Filtro = OrderStatus | "todos";

interface OrdersListScreenProps {
  onOpenOrder: (id: string) => void;
  // false cuando la pantalla no está visible (otra pestaña o el detalle encima):
  // así se pausa el sondeo. Con React Navigation: useIsFocused().
  isFocused?: boolean;
}

// C2 — Lista de pedidos (design/C2-pedidos.html).
export function OrdersListScreen({ onOpenOrder, isFocused = true }: OrdersListScreenProps) {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [cargando, setCargando] = useState(true);
  const [deslizando, setDeslizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si dos peticiones se cruzan, solo se aplica la más reciente.
  const ultimaPeticion = useRef(0);

  const cargar = useCallback(async () => {
    const id = ++ultimaPeticion.current;
    try {
      const deHoy = await ordersService.listOrders({ date: "today" });
      if (id !== ultimaPeticion.current) return;
      const visibles = MOSTRAR_CANCELADOS_EN_LISTA ? deHoy : deHoy.filter((p) => p.status !== "cancelado");
      // Como el prototipo: en el orden en que llegaron (más antiguo arriba).
      setPedidos([...visibles].sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
      setError(null);
    } catch (e) {
      if (id !== ultimaPeticion.current) return;
      // Se conservan los últimos datos buenos y solo se avisa.
      setError(mensajeDeError(e, "No se pudieron actualizar los pedidos."));
    } finally {
      if (id === ultimaPeticion.current) setCargando(false);
    }
  }, []);

  usePolling(cargar, undefined, isFocused);

  const alDeslizar = useCallback(async () => {
    setDeslizando(true);
    await cargar();
    setDeslizando(false);
  }, [cargar]);

  const filtrados = useMemo(
    () => (filtro === "todos" ? pedidos : pedidos.filter((p) => p.status === filtro)),
    [pedidos, filtro]
  );

  const renderItem = useCallback(
    ({ item }: { item: Order }) => <OrderCard order={item} onPress={onOpenOrder} />,
    [onOpenOrder]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PEDIDOS</Text>
        <View style={styles.headerRow}>
          <Text style={styles.date}>{fechaLarga()}</Text>
          <Text style={styles.counter}>{pedidos.length} hoy</Text>
        </View>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          accessibilityRole="tablist"
          accessibilityLabel="Filtrar por estado"
        >
          {FILTROS_ESTADO.map((valor) => (
            <Chip
              key={valor}
              label={valor === "todos" ? "Todos" : ETIQUETA_ESTADO[valor]}
              active={filtro === valor}
              onPress={() => setFiltro(valor)}
            />
          ))}
        </ScrollView>
      </View>

      {error && (
        <View style={styles.error} accessibilityRole="alert">
          <Text style={styles.errorText}>{error} Se reintentará automáticamente.</Text>
        </View>
      )}

      {cargando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.vino} />
        </View>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(p) => p.id}
          renderItem={renderItem}
          contentContainerStyle={filtrados.length ? styles.list : styles.listEmpty}
          ItemSeparatorComponent={Separador}
          refreshControl={
            <RefreshControl refreshing={deslizando} onRefresh={alDeslizar} tintColor={colors.vino} colors={[colors.vino]} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>
                {filtro === "todos" ? "Todavía no hay pedidos hoy." : `No hay pedidos "${ETIQUETA_ESTADO[filtro]}".`}
              </Text>
              <Text style={styles.emptyHint}>Desliza hacia abajo para actualizar.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const Separador = () => <View style={{ height: spacing[3] }} />;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  // .mobile-header
  header: { paddingTop: spacing[6], paddingHorizontal: spacing[4], paddingBottom: spacing[3] },
  eyebrow: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.88, // 0.08em
    color: colors.cobre,
    marginBottom: 2,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: spacing[3] },
  date: { flex: 1, fontFamily: fonts.display, fontWeight: "800", fontSize: 20, lineHeight: 23, color: colors.cafe },
  // .mobile-counter
  counter: {
    fontFamily: fonts.mono,
    fontWeight: "700",
    fontSize: 14,
    color: colors.vino,
    backgroundColor: colors.vinoTinte,
    borderWidth: 1,
    borderColor: colors.vino,
    borderRadius: radius.md,
    paddingVertical: 4,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  // .chip-row
  chipRow: { gap: 6, paddingHorizontal: spacing[3], paddingBottom: spacing[3] },
  // .order-list (sin los 100 px de abajo del prototipo: ahí va la tab bar, que la pone la navegación)
  list: { paddingHorizontal: spacing[4], paddingBottom: spacing[6] },
  listEmpty: { flexGrow: 1, paddingHorizontal: spacing[4] },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing[2], padding: spacing[6] },
  emptyTitle: { fontFamily: fonts.body, fontSize: 16, fontWeight: "600", color: colors.cafe, textAlign: "center" },
  emptyHint: { fontFamily: fonts.body, fontSize: 14, color: colors.cafeClaro, textAlign: "center" },
  error: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    backgroundColor: colors.vinoTinte,
    borderWidth: 1,
    borderColor: colors.vino,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.cafe },
});
