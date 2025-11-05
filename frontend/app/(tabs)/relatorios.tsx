// Tela de Relatórios
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../src/components/GlassCard";
import { COLORS } from "../../src/constants/colors";

export default function RelatoriosScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Relatórios</Text>
          <Text style={styles.headerSubtitle}>
            Análises e métricas do negócio
          </Text>
        </View>

        {/* Relatório de Faturamento */}
        <TouchableOpacity
          onPress={() => router.push("/relatorio-faturamento")}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.reportCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash" size={48} color={COLORS.concluido} />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Relatório de Faturamento</Text>
              <Text style={styles.reportDescription}>
                Visualize o total faturado e os serviços que geraram receita
              </Text>
              <View style={styles.reportTags}>
                <View style={styles.tag}>
                  <Ionicons
                    name="calendar"
                    size={12}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.tagText}>Filtro temporal</Text>
                </View>
                <View style={styles.tag}>
                  <Ionicons
                    name="list"
                    size={12}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.tagText}>Lista detalhada</Text>
                </View>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={COLORS.textSecondary}
            />
          </GlassCard>
        </TouchableOpacity>

        {/* Relatório de Performance */}
        <TouchableOpacity
          onPress={() => router.push("/relatorio-performance")}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.reportCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="pie-chart" size={48} color={COLORS.comprovado} />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Relatório de Performance</Text>
              <Text style={styles.reportDescription}>
                Acompanhe a taxa de conversão e eficiência dos orçamentos
              </Text>
              <View style={styles.reportTags}>
                <View style={styles.tag}>
                  <Ionicons
                    name="trending-up"
                    size={12}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.tagText}>Taxa de conversão</Text>
                </View>
                <View style={styles.tag}>
                  <Ionicons
                    name="stats-chart"
                    size={12}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.tagText}>Gráficos</Text>
                </View>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={COLORS.textSecondary}
            />
          </GlassCard>
        </TouchableOpacity>

        {/* Info Card */}
        <GlassCard style={styles.infoCard}>
          <Ionicons
            name="information-circle"
            size={32}
            color={COLORS.lightest}
          />
          <Text style={styles.infoText}>
            Os relatórios são atualizados automaticamente com base nos
            orçamentos salvos. Use os filtros temporais para análises
            específicas.
          </Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginRight: 16,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  reportTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 4,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});
