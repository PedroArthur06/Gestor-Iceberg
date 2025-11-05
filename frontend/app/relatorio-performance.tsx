// Relatório de Performance
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { useOrcamentoStore } from "../src/store/orcamentoStore";
import { GlassCard } from "../src/components/GlassCard";
import { COLORS } from "../src/constants/colors";
import { obterEstatisticas } from "../src/utils/calculations";

const { width } = Dimensions.get("window");

const PERIODOS = [
  { label: "Esta Semana", dias: 7 },
  { label: "Este Mês", dias: 30 },
  { label: "Últimos 3 Meses", dias: 90 },
  { label: "Este Ano", dias: 365 },
];

export default function RelatorioPerformanceScreen() {
  const orcamentos = useOrcamentoStore((state) => state.orcamentos);
  const [periodoSelecionado, setPeriodoSelecionado] = useState(PERIODOS[1]);

  const stats = useMemo(
    () => obterEstatisticas(orcamentos, periodoSelecionado.dias),
    [orcamentos, periodoSelecionado]
  );

  const chartData = useMemo(() => {
    const total = stats.totalConcluidos + stats.totalRecusados;

    if (total === 0) {
      return [];
    }

    return [
      {
        value: stats.totalConcluidos,
        color: COLORS.concluido,
        text: `${stats.totalConcluidos}`,
        label: "Concluídos",
      },
      {
        value: stats.totalRecusados,
        color: COLORS.recusado,
        text: `${stats.totalRecusados}`,
        label: "Recusados",
      },
    ];
  }, [stats]);

  const temDados = stats.totalConcluidos + stats.totalRecusados > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtros de Período */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterTitle}>Período</Text>
          <View style={styles.filtersContainer}>
            {PERIODOS.map((periodo) => (
              <TouchableOpacity
                key={periodo.label}
                onPress={() => setPeriodoSelecionado(periodo)}
                activeOpacity={0.7}
                style={styles.filterButtonContainer}
              >
                <View
                  style={[
                    styles.filterChip,
                    periodoSelecionado.label === periodo.label &&
                      styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      periodoSelecionado.label === periodo.label &&
                        styles.filterTextActive,
                    ]}
                  >
                    {periodo.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Taxa de Conversão */}
        <GlassCard style={styles.conversionCard}>
          <View style={styles.conversionHeader}>
            <Ionicons name="trending-up" size={48} color={COLORS.comprovado} />
          </View>
          <Text style={styles.conversionLabel}>Taxa de Conversão</Text>
          <Text style={styles.conversionValue}>
            {stats.taxaConversao.toFixed(1)}%
          </Text>
          <Text style={styles.conversionSubtext}>
            {stats.totalConcluidos} concluídos de{" "}
            {stats.totalConcluidos + stats.totalRecusados} finalizados
          </Text>
        </GlassCard>

        {/* Métricas */}
        <View style={styles.metricsGrid}>
          <GlassCard style={styles.metricCard}>
            <Ionicons
              name="checkmark-circle"
              size={32}
              color={COLORS.concluido}
            />
            <Text style={styles.metricValue}>{stats.totalConcluidos}</Text>
            <Text style={styles.metricLabel}>Concluídos</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
            <Ionicons name="close-circle" size={32} color={COLORS.recusado} />
            <Text style={styles.metricValue}>{stats.totalRecusados}</Text>
            <Text style={styles.metricLabel}>Recusados</Text>
          </GlassCard>
        </View>

        {/* Gráfico de Pizza */}
        <GlassCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribuição de Orçamentos</Text>

          {temDados ? (
            <>
              <View style={styles.chartContainer}>
                <PieChart
                  data={chartData}
                  donut
                  radius={width * 0.3}
                  innerRadius={width * 0.18}
                  centerLabelComponent={() => (
                    <View style={styles.centerLabel}>
                      <Text style={styles.centerLabelValue}>
                        {stats.totalConcluidos + stats.totalRecusados}
                      </Text>
                      <Text style={styles.centerLabelText}>Total</Text>
                    </View>
                  )}
                />
              </View>

              <View style={styles.legend}>
                {chartData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons
                name="pie-chart-outline"
                size={64}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>Sem dados para exibir</Text>
              <Text style={styles.emptySubtext}>
                Não há orçamentos finalizados no período selecionado
              </Text>
            </View>
          )}
        </GlassCard>

        {/* Insights */}
        {temDados && (
          <GlassCard style={styles.insightsCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={24} color={COLORS.lightest} />
              <Text style={styles.insightTitle}>Insights</Text>
            </View>

            <View style={styles.insightsList}>
              {stats.taxaConversao >= 70 && (
                <View style={styles.insightItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.concluido}
                  />
                  <Text style={styles.insightText}>
                    Excelente! Sua taxa de conversão está acima de 70%
                  </Text>
                </View>
              )}

              {stats.taxaConversao < 50 && stats.totalRecusados > 0 && (
                <View style={styles.insightItem}>
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color={COLORS.pendente}
                  />
                  <Text style={styles.insightText}>
                    Atenção: Taxa de conversão abaixo de 50%. Revise seus
                    orçamentos.
                  </Text>
                </View>
              )}

              {stats.totalConcluidos === 0 && stats.totalRecusados > 0 && (
                <View style={styles.insightItem}>
                  <Ionicons name="warning" size={20} color={COLORS.recusado} />
                  <Text style={styles.insightText}>
                    Todos os orçamentos foram recusados. Considere ajustar
                    valores.
                  </Text>
                </View>
              )}
            </View>
          </GlassCard>
        )}

        <View style={{ height: 32 }} />
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
  filtersSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  filterButtonContainer: {
    width: "50%",
    padding: 4,
  },
  filterChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  filterTextActive: {
    color: COLORS.text,
  },
  conversionCard: {
    alignItems: "center",
    padding: 24,
    marginBottom: 16,
  },
  conversionHeader: {
    marginBottom: 16,
  },
  conversionLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  conversionValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.comprovado,
    marginBottom: 8,
  },
  conversionSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  metricsGrid: {
    flexDirection: "row",
    marginBottom: 16,
    marginHorizontal: -6,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 6,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  chartCard: {
    padding: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  centerLabel: {
    alignItems: "center",
  },
  centerLabelValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
  },
  centerLabelText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  legend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendLabel: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  legendValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  emptyChart: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  insightsCard: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 12,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});
