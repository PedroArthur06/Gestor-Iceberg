// Tela de Início - Dashboard
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOrcamentoStore } from "../../src/store/orcamentoStore";
import { OrcamentoCard } from "../../src/components/OrcamentoCard";
import { GlassCard } from "../../src/components/GlassCard";
import { COLORS } from "../../src/constants/colors";
import { formatarMoeda } from "../../src/utils/formatters";
import { obterEstatisticas } from "../../src/utils/calculations";

export default function InicioScreen() {
  const router = useRouter();
  const orcamentos = useOrcamentoStore((state) => state.orcamentos);

  // Estatísticas do mês atual
  const stats = useMemo(() => obterEstatisticas(orcamentos, 30), [orcamentos]);

  // Últimos 5 orçamentos
  const ultimosOrcamentos = useMemo(() => {
    return [...orcamentos]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
  }, [orcamentos]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Visão geral do seu negócio</Text>
        </View>

        {/* Cards de estatísticas */}
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <Ionicons name="cash-outline" size={32} color={COLORS.concluido} />
            <Text style={styles.statValue}>
              {formatarMoeda(stats.faturamento)}
            </Text>
            <Text style={styles.statLabel}>Faturamento (30d)</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={32}
              color={COLORS.comprovado}
            />
            <Text style={styles.statValue}>{stats.totalConcluidos}</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Ionicons
              name="trending-up-outline"
              size={32}
              color={COLORS.lightest}
            />
            <Text style={styles.statValue}>
              {stats.taxaConversao.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>Taxa de Conversão</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Ionicons
              name="document-text-outline"
              size={32}
              color={COLORS.pendente}
            />
            <Text style={styles.statValue}>{orcamentos.length}</Text>
            <Text style={styles.statLabel}>Total de Orçamentos</Text>
          </GlassCard>
        </View>

        {/* Ações rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/novo")}
              activeOpacity={0.7}
            >
              <GlassCard style={styles.actionCard}>
                <Ionicons name="add-circle" size={40} color={COLORS.lightest} />
                <Text style={styles.actionText}>Novo Orçamento</Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/relatorio-faturamento")}
              activeOpacity={0.7}
            >
              <GlassCard style={styles.actionCard}>
                <Ionicons name="analytics" size={40} color={COLORS.concluido} />
                <Text style={styles.actionText}>Faturamento</Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/relatorio-performance")}
              activeOpacity={0.7}
            >
              <GlassCard style={styles.actionCard}>
                <Ionicons
                  name="pie-chart"
                  size={40}
                  color={COLORS.comprovado}
                />
                <Text style={styles.actionText}>Performance</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>

        {/* Últimos orçamentos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos Orçamentos</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/orcamentos")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {ultimosOrcamentos.length > 0 ? (
            ultimosOrcamentos.map((orcamento) => (
              <OrcamentoCard
                key={orcamento.id}
                orcamento={orcamento}
                onPress={() => router.push(`/detalhes/${orcamento.id}`)}
              />
            ))
          ) : (
            <GlassCard>
              <Text style={styles.emptyText}>Nenhum orçamento ainda</Text>
              <Text style={styles.emptySubtext}>
                Clique em "Novo" para criar seu primeiro orçamento
              </Text>
            </GlassCard>
          )}
        </View>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    margin: "1%",
    alignItems: "center",
    padding: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.lightest,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionCard: {
    alignItems: "center",
    padding: 16,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
