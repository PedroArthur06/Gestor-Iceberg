// Tela de Orçamentos - Lista completa
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOrcamentoStore } from "../../src/store/orcamentoStore";
import { OrcamentoCard } from "../../src/components/OrcamentoCard";
import { GlassCard } from "../../src/components/GlassCard";
import { StatusOrcamento } from "../../src/types";
import { COLORS } from "../../src/constants/colors";

export default function OrcamentosScreen() {
  const router = useRouter();
  const orcamentos = useOrcamentoStore((state) => state.orcamentos);
  const [filtroStatus, setFiltroStatus] = useState<StatusOrcamento | "Todos">(
    "Todos"
  );
  const [busca, setBusca] = useState("");

  const statusOptions: (StatusOrcamento | "Todos")[] = [
    "Todos",
    "Pendente",
    "Comprovado",
    "Concluído",
    "Recusado",
  ];

  // Filtrar orçamentos
  const orcamentosFiltrados = useMemo(() => {
    let resultado = [...orcamentos];

    // Filtro por status
    if (filtroStatus !== "Todos") {
      resultado = resultado.filter((orc) => orc.status === filtroStatus);
    }

    // Filtro por busca
    if (busca.trim()) {
      const buscaLower = busca.toLowerCase();
      resultado = resultado.filter(
        (orc) =>
          orc.cliente.toLowerCase().includes(buscaLower) ||
          orc.endereco.toLowerCase().includes(buscaLower) ||
          orc.telefone.includes(busca)
      );
    }

    // Ordenar por data (mais recente primeiro)
    return resultado.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [orcamentos, filtroStatus, busca]);

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente, endereço ou telefone..."
            placeholderTextColor={COLORS.textSecondary}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros de status */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFiltroStatus(status)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.filterChip,
                filtroStatus === status && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filtroStatus === status && styles.filterTextActive,
                ]}
              >
                {status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de orçamentos */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {orcamentosFiltrados.length > 0 ? (
          <>
            <Text style={styles.resultCount}>
              {orcamentosFiltrados.length}{" "}
              {orcamentosFiltrados.length === 1 ? "orçamento" : "orçamentos"}
            </Text>
            {orcamentosFiltrados.map((orcamento) => (
              <OrcamentoCard
                key={orcamento.id}
                orcamento={orcamento}
                onPress={() => router.push(`/detalhes/${orcamento.id}`)}
              />
            ))}
          </>
        ) : (
          <GlassCard style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={64}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>Nenhum orçamento encontrado</Text>
            <Text style={styles.emptySubtext}>
              {busca || filtroStatus !== "Todos"
                ? "Tente ajustar os filtros"
                : 'Crie seu primeiro orçamento na aba "Novo"'}
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
});
