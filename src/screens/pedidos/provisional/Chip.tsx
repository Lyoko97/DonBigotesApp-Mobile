import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, radius } from "./theme";

// PROVISIONAL — mismo contrato que `Chip` del plan base (label, active, onPress).
// .chip y .chip--active de styles.css.
export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      hitSlop={6}
      style={[styles.chip, active && styles.active]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  active: { borderColor: colors.vino, backgroundColor: colors.vinoTinte },
  label: { fontFamily: fonts.body, fontSize: 11, fontWeight: "600", color: colors.cafeClaro },
  labelActive: { color: colors.vino },
});
