import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Order, OrderStatus } from "./tipos";
import { ordersService, mensajeDeError } from "./datos/ordersService";
import { ACCION_ESTADO, ESTADO_A_TAG, ETIQUETA_ESTADO, ETIQUETA_MODALIDAD, ETIQUETA_PAGO, getNextStatus } from "./estados";
import { cargoDomicilio, hora, numeroPedido } from "./formato";
import { usePolling } from "./usePolling";
import { Tag } from "./provisional/Tag";
import { Price } from "./provisional/Price";
import { Button } from "./provisional/Button";
import { colors, fonts, radius, spacing } from "./provisional/theme";

interface OrderDetailScreenProps {
  orderId: string;
  isFocused?: boolean;
}

// C3 — Detalle de pedido. NO hay prototipo C3 en design/: se arma solo con
// piezas que ya existen en styles.css (.panel, .dish-row, .tag, .btn--primary)
// y la descripción de CLAUDE.md §6 (desglose, modalidad, método de pago,
// total, botón grande para avanzar estado).
export function OrderDetailScreen({ orderId, isFocused = true }: OrderDetailScreenProps) {
  const [pedido, setPedido] = useState<Order | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const ultimaPeticion = useRef(0);

  const cargar = useCallback(async () => {
    const id = ++ultimaPeticion.current;
    try {
      const datos = await ordersService.getOrder(orderId);
      if (id !== ultimaPeticion.current) return;
      setPedido(datos);
      setErrorCarga(null);
    } catch (e) {
      if (id !== ultimaPeticion.current) return;
      setErrorCarga(mensajeDeError(e, "No se pudo cargar el pedido."));
    } finally {
      if (id === ultimaPeticion.current) setCargando(false);
    }
  }, [orderId]);

  // El detalle también se sincroniza: si alguien cambia el pedido desde la
  // web, se ve aquí sin salir de la pantalla.
  usePolling(cargar, undefined, isFocused);

  // Actualización optimista: el estado cambia al instante y se revierte si
  // el servidor lo rechaza (p. ej. otro usuario ya lo movió).
  const avanzar = useCallback(
    async (siguiente: OrderStatus) => {
      if (!pedido) return;
      const anterior = pedido;
      ultimaPeticion.current++; // descarta un sondeo en curso con datos viejos
      setGuardando(true);
      setErrorAccion(null);
      setPedido({ ...pedido, status: siguiente });

      const resultado = await ordersService.updateStatus(pedido.id, siguiente);
      setGuardando(false);
      if (!resultado.success) {
        setPedido(anterior);
        setErrorAccion(resultado.error ?? "No se pudo actualizar el pedido.");
      }
      void cargar(); // trae el estado real del servidor
    },
    [pedido, cargar]
  );

  if (cargando && !pedido) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.vino} />
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.emptyTitle}>{errorCarga ?? "No se encontró el pedido."}</Text>
      </View>
    );
  }

  const siguiente = getNextStatus(pedido.status);
  const cargo = cargoDomicilio(pedido);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Encabezado (.mobile-header) */}
      <View>
        <Text style={styles.eyebrow}>PEDIDO</Text>
        <View style={styles.headerRow}>
          <Text style={styles.num}>{numeroPedido(pedido.number)}</Text>
          <Tag status={ESTADO_A_TAG[pedido.status]}>{ETIQUETA_ESTADO[pedido.status]}</Tag>
        </View>
        <Text style={styles.meta}>
          <Text style={styles.mono}>{hora(pedido.createdAt)}</Text> · {ETIQUETA_MODALIDAD[pedido.deliveryType]}
        </Text>
      </View>

      {errorCarga && (
        <View style={styles.alert} accessibilityRole="alert">
          <Text style={styles.alertText}>{errorCarga} Se muestran los últimos datos.</Text>
        </View>
      )}

      {/* Desglose (.panel + .dish-row) */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>DESGLOSE</Text>
        {pedido.items.map((item) => (
          <FilaPrecio key={item.dishId} etiqueta={`${item.quantity} × ${item.dishName}`} monto={item.subtotal} />
        ))}
        {cargo > 0 && <FilaPrecio etiqueta="Envío a domicilio" monto={cargo} />}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Price amount={pedido.total} size="l" />
        </View>
      </View>

      {/* Datos del pedido */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>DATOS DEL PEDIDO</Text>
        <Dato etiqueta="Cliente" valor={pedido.customerName} />
        <Dato etiqueta="Modalidad" valor={ETIQUETA_MODALIDAD[pedido.deliveryType]} />
        <Dato etiqueta="Método de pago" valor={ETIQUETA_PAGO[pedido.paymentMethod]} />
        {pedido.customerPhone && <Dato etiqueta="Teléfono" valor={pedido.customerPhone} mono />}
        {pedido.deliveryAddress && <Dato etiqueta="Dirección" valor={pedido.deliveryAddress} />}
        {pedido.notes && <Dato etiqueta="Nota" valor={pedido.notes} />}
      </View>

      {errorAccion && (
        <View style={styles.alert} accessibilityRole="alert">
          <Text style={styles.alertText}>{errorAccion}</Text>
        </View>
      )}

      {siguiente ? (
        <Button large label={ACCION_ESTADO[siguiente]} onPress={() => void avanzar(siguiente)} loading={guardando} />
      ) : (
        <Text style={styles.final}>
          {pedido.status === "cancelado" ? "Este pedido fue cancelado." : "Este pedido ya fue entregado."}
        </Text>
      )}
    </ScrollView>
  );
}

// .dish-row: nombre · línea punteada · precio
function FilaPrecio({ etiqueta, monto }: { etiqueta: string; monto: number }) {
  return (
    <View style={styles.dishRow}>
      <Text style={styles.dishName} numberOfLines={2}>
        {etiqueta}
      </Text>
      <View style={styles.dots} />
      <Price amount={monto} />
    </View>
  );
}

function Dato({ etiqueta, valor, mono }: { etiqueta: string; valor: string; mono?: boolean }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.datoLabel}>{etiqueta}</Text>
      <Text style={[styles.datoValor, mono && styles.mono]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { paddingTop: spacing[6], paddingHorizontal: spacing[4], paddingBottom: spacing[8], gap: spacing[4] },
  center: { alignItems: "center", justifyContent: "center", padding: spacing[6] },
  eyebrow: { fontFamily: fonts.body, fontSize: 11, fontWeight: "700", letterSpacing: 0.88, color: colors.cobre, marginBottom: 2 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing[3] },
  num: { fontFamily: fonts.mono, fontWeight: "700", fontSize: 24, color: colors.cafe },
  meta: { fontFamily: fonts.body, fontSize: 14, color: colors.cafeClaro, marginTop: spacing[1] },
  mono: { fontFamily: fonts.mono },
  // .panel
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  panelTitle: { fontFamily: fonts.body, fontSize: 11, fontWeight: "700", letterSpacing: 0.55, color: colors.cafeClaro },
  dishRow: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
  dishName: { fontFamily: fonts.body, fontSize: 14, fontWeight: "600", color: colors.cafe, flexShrink: 1 },
  // .dish-row__dots: línea punteada guía (border-strong)
  dots: { flex: 1, minWidth: spacing[4], height: 0, borderWidth: 1, borderStyle: "dotted", borderColor: colors.borderStrong },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    paddingTop: spacing[3],
  },
  totalLabel: { fontFamily: fonts.display, fontWeight: "700", fontSize: 16, color: colors.cafe },
  dato: { flexDirection: "row", justifyContent: "space-between", gap: spacing[4] },
  datoLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.cafeClaro },
  datoValor: { fontFamily: fonts.body, fontSize: 14, fontWeight: "500", color: colors.cafe, flexShrink: 1, textAlign: "right" },
  alert: {
    backgroundColor: colors.vinoTinte,
    borderWidth: 1,
    borderColor: colors.vino,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  alertText: { fontFamily: fonts.body, fontSize: 14, color: colors.cafe },
  final: { fontFamily: fonts.body, fontSize: 14, color: colors.cafeClaro, textAlign: "center" },
  emptyTitle: { fontFamily: fonts.body, fontSize: 16, fontWeight: "600", color: colors.cafe, textAlign: "center" },
});
