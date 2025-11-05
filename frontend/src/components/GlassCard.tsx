// Componente de Card com efeito Liquid Glass
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../constants/colors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    shadowColor: COLORS.lightest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
