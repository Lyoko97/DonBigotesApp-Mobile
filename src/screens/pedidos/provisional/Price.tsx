import { StyleSheet, Text, View } from "react-native";
import { partesPrecio } from "../formato";
import { colors, fonts } from "./theme";

// PROVISIONAL — mismo contrato que `Price` del plan base (amount, size).
// Entero grande + centavos en superíndice al 62 % (sup de styles.css).
const TAMANOS = { m: 16, l: 24 } as const; // m: .order-card__total · l: total del detalle

interface PriceProps {
  amount: number;
  size?: keyof typeof TAMANOS;
  color?: string;
}

export function Price({ amount, size = "m", color = colors.vino }: PriceProps) {
  const { entero, centavos } = partesPrecio(amount);
  const grande = TAMANOS[size];
  const chico = Math.round(grande * 0.62);
  return (
    <View style={styles.row} accessible accessibilityLabel={`${entero}${centavos}`}>
      <Text style={[styles.text, { fontSize: grande, lineHeight: Math.round(grande * 1.2), color }]}>{entero}</Text>
      <Text style={[styles.text, { fontSize: chico, lineHeight: Math.round(chico * 1.2), color }]}>{centavos}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start" },
  text: { fontFamily: fonts.mono, fontWeight: "700" },
});
