// Card de orçamento na lista
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "./GlassCard";
import { StatusBadge } from "./StatusBadge";
import { Orcamento } from "../types";
import { formatarData, formatarMoeda } from "../utils/formatters";
import { calcularTotal } from "../utils/calculation";
import { COLORS } from "../constants/colors";

interface OrcamentoCardProps {
  orcamento: Orcamento;
  onPress: () => void;
}

export const OrcamentoCard: React.FC<OrcamentoCardProps> = ({
  orcamento,
  onPress,
}) => {
  const total = calcularTotal(orcamento.itensServico);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.clienteInfo}>
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={COLORS.lightest}
            />
            <Text style={styles.clienteNome}>{orcamento.cliente}</Text>
          </View>
          <StatusBadge status={orcamento.status} size="small" />
        </View>

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoText}>{formatarData(orcamento.data)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="cash-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.valorText}>{formatarMoeda(total)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {orcamento.itensServico.length}{" "}
            {orcamento.itensServico.length === 1 ? "serviço" : "serviços"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.textSecondary}
          />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clienteInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  info: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  valorText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.lightest,
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
