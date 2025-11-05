// Relatório de Faturamento
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrcamentoStore } from "../src/store/orcamentoStore";
import { GlassCard } from "../src/components/GlassCard";
import { COLORS } from "../src/constants/colors";
import { formatarMoeda, formatarData } from "../src/utils/formatters";
import {
  calcularFaturamento,
  filtrarPorPeriodo,
  calcularTotal,
} from "../src/utils/calculations";

const PERIODOS = [
  { label: "Esta Semana", dias: 7 },
  { label: "Este Mês", dias: 30 },
  { label: "Últimos 3 Meses", dias: 90 },
  { label: "Este Ano", dias: 365 },
];

export default function RelatorioFaturamentoScreen() {
  const orcamentos = useOrcamentoStore((state) => state.orcamentos);
  const [periodoSelecionado, setPeriodoSelecionado] = useState(PERIODOS[1]);

  const dadosRelatorio = useMemo(() => {
    const orcamentosFiltrados = filtrarPorPeriodo(
      orcamentos,
      periodoSelecionado.dias
    );
    const concluidos = orcamentosFiltrados.filter(
      (orc) => orc.status === "Concluído"
    );
    const faturamentoTotal = calcularFaturamento(
      orcamentos,
      periodoSelecionado.dias
    );

    return {
      faturamentoTotal,
      totalOrcamentos: concluidos.length,
      orcamentosConcluidos: concluidos.sort(
        (a, b) =>
          new Date(b.dataConclusao || b.data).getTime() -
          new Date(a.dataConclusao || a.data).getTime()
      ),
    };
  }, [orcamentos, periodoSelecionado]);

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

        {/* Card de Faturamento Total */}
        <GlassCard style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <Ionicons name="cash" size={48} color={COLORS.concluido} />
          </View>
          <Text style={styles.totalLabel}>Faturamento Total</Text>
          <Text style={styles.totalValue}>
            {formatarMoeda(dadosRelatorio.faturamentoTotal)}
          </Text>
          <Text style={styles.totalSubtext}>
            {dadosRelatorio.totalOrcamentos}{" "}
            {dadosRelatorio.totalOrcamentos === 1
              ? "orçamento concluído"
              : "orçamentos concluídos"}
          </Text>
        </GlassCard>

        {/* Lista de Orçamentos Concluídos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços Faturados</Text>

          {dadosRelatorio.orcamentosConcluidos.length > 0 ? (
            dadosRelatorio.orcamentosConcluidos.map((orcamento) => {
              const total = calcularTotal(orcamento.itensServico);
              return (
                <GlassCard key={orcamento.id} style={styles.orcamentoCard}>
                  <View style={styles.orcamentoHeader}>
                    <View style={styles.clienteInfo}>
                      <Ionicons
                        name="person"
                        size={20}
                        color={COLORS.lightest}
                      />
                      <Text style={styles.clienteNome}>
                        {orcamento.cliente}
                      </Text>
                    </View>
                    <Text style={styles.valorTotal}>
                      {formatarMoeda(total)}
                    </Text>
                  </View>

                  <View style={styles.orcamentoInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="calendar"
                        size={14}
                        color={COLORS.textSecondary}
                      />
                      <Text style={styles.infoText}>
                        {formatarData(
                          orcamento.dataConclusao || orcamento.data
                        )}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.servicosList}>
                    {orcamento.itensServico.map((item, index) => (
                      <View key={item.id} style={styles.servicoItem}>
                        <Text style={styles.servicoDescricao} numberOfLines={1}>
                          {index + 1}. {item.descricao}
                        </Text>
                        <Text style={styles.servicoValor}>
                          {formatarMoeda(item.valor)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              );
            })
          ) : (
            <GlassCard style={styles.emptyCard}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>Nenhum faturamento</Text>
              <Text style={styles.emptySubtext}>
                Não há orçamentos concluídos no período selecionado
              </Text>
            </GlassCard>
          )}
        </View>

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
  totalCard: {
    alignItems: "center",
    padding: 24,
    marginBottom: 24,
  },
  totalHeader: {
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.concluido,
    marginBottom: 8,
  },
  totalSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  orcamentoCard: {
    marginBottom: 12,
  },
  orcamentoHeader: {
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
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.concluido,
    marginLeft: 12,
  },
  orcamentoInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  servicosList: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  servicoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  servicoDescricao: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  servicoValor: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.lightest,
  },
  emptyCard: {
    alignItems: "center",
    padding: 32,
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
});
