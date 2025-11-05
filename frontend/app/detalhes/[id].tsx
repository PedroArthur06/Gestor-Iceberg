// Tela de Detalhes do Orçamento
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOrcamentoStore } from "../../src/store/orcamentoStore";
import { GlassCard } from "../../src/components/GlassCard";
import { StatusBadge } from "../../src/components/StatusBadge";
import { StatusOrcamento } from "../../src/types";
import { COLORS } from "../../src/constants/colors";
import {
  formatarData,
  formatarMoeda,
  formatarTelefone,
} from "../../src/utils/formatters";
import { calcularTotal } from "../../src/utils/calculations";
import { compartilharWhatsApp } from "../../src/utils/whatsapp";

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const obterOrcamento = useOrcamentoStore((state) => state.obterOrcamento);
  const atualizarOrcamento = useOrcamentoStore(
    (state) => state.atualizarOrcamento
  );
  const deletarOrcamento = useOrcamentoStore((state) => state.deletarOrcamento);

  const orcamento = obterOrcamento(id!);

  if (!orcamento) {
    return (
      <View style={styles.container}>
        <GlassCard style={styles.errorCard}>
          <Ionicons name="alert-circle" size={64} color={COLORS.recusado} />
          <Text style={styles.errorText}>Orçamento não encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    );
  }

  const total = calcularTotal(orcamento.itensServico);

  const statusOptions: StatusOrcamento[] = [
    "Pendente",
    "Comprovado",
    "Concluído",
    "Recusado",
  ];

  const handleMudarStatus = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", ...statusOptions],
          cancelButtonIndex: 0,
          title: "Alterar Status",
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const novoStatus = statusOptions[buttonIndex - 1];
            atualizarStatus(novoStatus);
          }
        }
      );
    } else {
      // Android - usar Alert
      Alert.alert(
        "Alterar Status",
        "Escolha o novo status do orçamento:",
        statusOptions
          .map((status) => ({
            text: status,
            onPress: () => atualizarStatus(status),
          }))
          .concat([{ text: "Cancelar", style: "cancel" }])
      );
    }
  };

  const atualizarStatus = async (novoStatus: StatusOrcamento) => {
    try {
      const atualizacao: any = { status: novoStatus };

      // Se o status for "Concluído", salvar a data de conclusão
      if (novoStatus === "Concluído" && !orcamento.dataConclusao) {
        atualizacao.dataConclusao = new Date().toISOString();
      }

      await atualizarOrcamento(orcamento.id, atualizacao);
      Alert.alert("Sucesso", `Status alterado para "${novoStatus}"`);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status");
    }
  };

  const handleCompartilhar = async () => {
    try {
      await compartilharWhatsApp(orcamento);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp");
    }
  };

  const handleDeletar = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarOrcamento(orcamento.id);
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o orçamento");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Status */}
        <GlassCard style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.clienteName}>{orcamento.cliente}</Text>
            <StatusBadge status={orcamento.status} size="large" />
          </View>
          <Text style={styles.dataText}>{formatarData(orcamento.data)}</Text>
        </GlassCard>

        {/* Informações do Cliente */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Cliente</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={COLORS.lightest} />
            <Text style={styles.infoText}>{orcamento.endereco}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={COLORS.lightest} />
            <Text style={styles.infoText}>
              {formatarTelefone(orcamento.telefone)}
            </Text>
          </View>
        </GlassCard>

        {/* Serviços */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços</Text>

          {orcamento.itensServico.map((item, index) => (
            <View key={item.id} style={styles.servicoItem}>
              <View style={styles.servicoHeader}>
                <Text style={styles.servicoNumero}>{index + 1}</Text>
                <Text style={styles.servicoDescricao}>{item.descricao}</Text>
              </View>
              <Text style={styles.servicoValor}>
                {formatarMoeda(item.valor)}
              </Text>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatarMoeda(total)}</Text>
          </View>
        </GlassCard>

        {/* Observações */}
        {orcamento.observacoes && (
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.observacoesText}>{orcamento.observacoes}</Text>
          </GlassCard>
        )}

        {/* Data de Conclusão */}
        {orcamento.dataConclusao && (
          <GlassCard style={styles.section}>
            <View style={styles.infoRow}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.concluido}
              />
              <Text style={styles.infoText}>
                Concluído em {formatarData(orcamento.dataConclusao)}
              </Text>
            </View>
          </GlassCard>
        )}

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.statusButton]}
            onPress={handleMudarStatus}
          >
            <Ionicons name="swap-horizontal" size={24} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Alterar Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleCompartilhar}
          >
            <Ionicons name="logo-whatsapp" size={24} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeletar}
        >
          <Ionicons name="trash" size={24} color={COLORS.text} />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Excluir Orçamento
          </Text>
        </TouchableOpacity>

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
  headerCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clienteName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
  dataText: {
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  servicoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  servicoHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  servicoNumero: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.lightest,
    marginRight: 8,
  },
  servicoDescricao: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  servicoValor: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.lightest,
    marginLeft: 12,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: COLORS.lightest,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.concluido,
  },
  observacoesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  statusButton: {
    backgroundColor: COLORS.comprovado,
  },
  shareButton: {
    backgroundColor: COLORS.concluido,
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.recusado,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: COLORS.recusado,
  },
  errorCard: {
    alignItems: "center",
    padding: 32,
    margin: 16,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.lightest,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});
