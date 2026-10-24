import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, radius, spacing } from "./theme";

// PROVISIONAL — mismo contrato que `Button` del plan base (variant, label,
// onPress, disabled). .btn, .btn--primary y .btn--secondary de styles.css.
// `large` es el "botón grande para avanzar estado" de C3.
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  large?: boolean;
}

export function Button({ label, onPress, variant = "primary", disabled, loading, large }: ButtonProps) {
  const primary = variant === "primary";
  const inactivo = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        large && styles.large,
        pressed && styles.pressed,
        inactivo && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? colors.paper : colors.cafe} />
      ) : (
        <Text style={[styles.label, large && styles.labelLarge, { color: primary ? colors.paper : colors.cafe }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.vino, borderColor: colors.vino },
  secondary: { backgroundColor: "transparent", borderColor: colors.borderStrong },
  large: { minHeight: 52, paddingVertical: spacing[4] },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  label: { fontFamily: fonts.body, fontSize: 14, fontWeight: "600" },
  labelLarge: { fontSize: 16 },
});
