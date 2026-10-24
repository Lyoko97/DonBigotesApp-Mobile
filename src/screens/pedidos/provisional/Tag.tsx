import { StyleSheet, Text, View } from "react-native";
import type { TagStatus } from "../estados";
import { colors, fonts, orderStatusColors, radius, spacing } from "./theme";

// PROVISIONAL — mismo contrato que `Tag` del plan base (status + children).
// .tag de styles.css: fondo tintado, borde del color de estado y texto
// siempre en café.
export function Tag({ status, children }: { status: TagStatus; children: string }) {
  const c = orderStatusColors[status];
  return (
    <View style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={styles.text}>{children.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 3,
    paddingHorizontal: spacing[2],
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.44, // 0.04em
    lineHeight: 15,
    color: colors.cafe,
  },
});
