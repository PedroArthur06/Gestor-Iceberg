// Tela de Novo Orçamento
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOrcamentoStore } from "../../src/store/orcamentoStore";
import { GlassCard } from "../../src/components/GlassCard";
import { ItemServico } from "../../src/types";
import { COLORS } from "../../src/constants/colors";
import { formatarMoeda } from "../../src/utils/formatters";
import { calcularTotal } from "../../src/utils/calculation";

export default function NovoScreen() {
  const router = useRouter();
  const adicionarOrcamento = useOrcamentoStore(
    (state) => state.adicionarOrcamento
  );

  const [cliente, setCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itensServico, setItensServico] = useState<ItemServico[]>([
    { id: "1", descricao: "", valor: 0 },
  ]);

  const adicionarItem = () => {
    setItensServico([
      ...itensServico,
      { id: Date.now().toString(), descricao: "", valor: 0 },
    ]);
  };

  const removerItem = (id: string) => {
    if (itensServico.length > 1) {
      setItensServico(itensServico.filter((item) => item.id !== id));
    }
  };

  const atualizarItem = (
    id: string,
    campo: "descricao" | "valor",
    valor: string
  ) => {
    setItensServico(
      itensServico.map((item) => {
        if (item.id === id) {
          if (campo === "descricao") {
            return { ...item, descricao: valor };
          } else {
            const valorNumerico =
              parseFloat(valor.replace(/[^0-9.]/g, "")) || 0;
            return { ...item, valor: valorNumerico };
          }
        }
        return item;
      })
    );
  };

  const validarFormulario = (): boolean => {
    if (!cliente.trim()) {
      Alert.alert("Erro", "Por favor, informe o nome do cliente");
      return false;
    }
    if (!endereco.trim()) {
      Alert.alert("Erro", "Por favor, informe o endereço");
      return false;
    }
    if (!telefone.trim()) {
      Alert.alert("Erro", "Por favor, informe o telefone");
      return false;
    }

    const itensValidos = itensServico.filter(
      (item) => item.descricao.trim() && item.valor > 0
    );
    if (itensValidos.length === 0) {
      Alert.alert(
        "Erro",
        "Por favor, adicione pelo menos um serviço com descrição e valor"
      );
      return false;
    }

    return true;
  };

  const salvarOrcamento = async () => {
    if (!validarFormulario()) return;

    try {
      const itensValidos = itensServico.filter(
        (item) => item.descricao.trim() && item.valor > 0
      );

      await adicionarOrcamento({
        cliente: cliente.trim(),
        endereco: endereco.trim(),
        telefone: telefone.trim(),
        data: new Date().toISOString(),
        status: "Pendente",
        itensServico: itensValidos,
        observacoes: observacoes.trim(),
      });

      Alert.alert("Sucesso", "Orçamento criado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            // Limpar formulário
            setCliente("");
            setEndereco("");
            setTelefone("");
            setObservacoes("");
            setItensServico([{ id: "1", descricao: "", valor: 0 }]);
            router.push("/(tabs)/inicio");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o orçamento");
    }
  };

  const total = calcularTotal(itensServico);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Dados do Cliente */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Cliente</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Cliente *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João Silva"
              placeholderTextColor={COLORS.textSecondary}
              value={cliente}
              onChangeText={setCliente}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Rua das Flores, 123"
              placeholderTextColor={COLORS.textSecondary}
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: (11) 98765-4321"
              placeholderTextColor={COLORS.textSecondary}
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
          </View>
        </GlassCard>

        {/* Serviços */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Serviços</Text>
            <TouchableOpacity onPress={adicionarItem} style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color={COLORS.lightest} />
            </TouchableOpacity>
          </View>

          {itensServico.map((item, index) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Serviço {index + 1}</Text>
                {itensServico.length > 1 && (
                  <TouchableOpacity onPress={() => removerItem(item.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={COLORS.recusado}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Instalação Ar Condicionado Split 12.000 BTUs"
                  placeholderTextColor={COLORS.textSecondary}
                  value={item.descricao}
                  onChangeText={(text) =>
                    atualizarItem(item.id, "descricao", text)
                  }
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor (R$) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  placeholderTextColor={COLORS.textSecondary}
                  value={item.valor > 0 ? item.valor.toString() : ""}
                  onChangeText={(text) => atualizarItem(item.id, "valor", text)}
                  keyboardType="decimal-pad"
                />
              </View>

              {index < itensServico.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatarMoeda(total)}</Text>
          </View>
        </GlassCard>

        {/* Observações */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Adicione observações sobre o orçamento..."
            placeholderTextColor={COLORS.textSecondary}
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={4}
          />
        </GlassCard>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={salvarOrcamento}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          <Text style={styles.saveButtonText}>Salvar Orçamento</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  itemContainer: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.lightest,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginTop: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
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
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightest,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginLeft: 8,
  },
});
