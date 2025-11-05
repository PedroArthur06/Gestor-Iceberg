// Badge de status
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusOrcamento } from "../types";
import { getStatusColor } from "../constants/colors";

interface StatusBadgeProps {
  status: StatusOrcamento;
  size?: "small" | "medium" | "large";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "medium",
}) => {
  const color = getStatusColor(status);
  const sizeStyle =
    size === "small"
      ? styles.small
      : size === "large"
      ? styles.large
      : styles.medium;

  return (
    <View
      style={[
        styles.container,
        sizeStyle,
        { backgroundColor: `${color}20`, borderColor: color },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
