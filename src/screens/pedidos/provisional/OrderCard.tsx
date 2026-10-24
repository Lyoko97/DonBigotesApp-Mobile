import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Order } from "../tipos";
import { ESTADO_A_TAG, ETIQUETA_ESTADO, ETIQUETA_MODALIDAD } from "../estados";
import { hora, numeroPedido, resumenPlatillos } from "../formato";
import { colors, fonts, radius, spacing } from "./theme";
import { Tag } from "./Tag";
import { Price } from "./Price";

// PROVISIONAL — mismo contrato que `OrderCard` del plan base (order, onPress).
// .order-card de styles.css / design/C2-pedidos.html.
// TODO: agregar el ícono SVG de la modalidad cuando se apruebe react-native-svg.
function OrderCardBase({ order, onPress }: { order: Order; onPress: (id: string) => void }) {
  return (
    <Pressable
      onPress={() => onPress(order.id)}
      accessibilityRole="button"
      accessibilityLabel={`Pedido ${numeroPedido(order.number)}, ${ETIQUETA_ESTADO[order.status]}`}
      accessibilityHint="Abre el detalle del pedido"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <Text style={styles.num}>{numeroPedido(order.number)}</Text>
        <Tag status={ESTADO_A_TAG[order.status]}>{ETIQUETA_ESTADO[order.status]}</Tag>
      </View>
      <Text style={styles.dishes}>{resumenPlatillos(order)}</Text>
      <View style={styles.bottom}>
        <View style={styles.meta}>
          <Text style={[styles.metaText, styles.mono]}>{hora(order.createdAt)}</Text>
          <Text style={styles.metaText}>{ETIQUETA_MODALIDAD[order.deliveryType]}</Text>
        </View>
        <Price amount={order.total} />
      </View>
    </Pressable>
  );
}

export const OrderCard = memo(OrderCardBase);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing[4],
    gap: spacing[2],
  },
  pressed: { backgroundColor: colors.paper },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  num: { fontFamily: fonts.mono, fontWeight: "700", fontSize: 16, color: colors.cafe },
  dishes: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.cafeClaro },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  metaText: { fontFamily: fonts.body, fontSize: 12, color: colors.cafeClaro },
  mono: { fontFamily: fonts.mono },
});
