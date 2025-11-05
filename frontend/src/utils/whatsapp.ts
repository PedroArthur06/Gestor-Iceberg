// Integração com WhatsApp
import { Linking } from "react-native";
import { Orcamento } from "../types";
import { formatarMoeda, formatarData } from "./formatters";
import { calcularTotal } from "./calculation";

export const gerarTextoOrcamento = (orcamento: Orcamento): string => {
  const total = calcularTotal(orcamento.itensServico);

  let texto = `*ORÇAMENTO - GESTOR ICEBERG*\n\n`;
  texto += `*Cliente:* ${orcamento.cliente}\n`;
  texto += `*Endereço:* ${orcamento.endereco}\n`;
  texto += `*Telefone:* ${orcamento.telefone}\n`;
  texto += `*Data:* ${formatarData(orcamento.data)}\n`;
  texto += `*Status:* ${orcamento.status}\n\n`;

  texto += `*SERVIÇOS:*\n`;
  orcamento.itensServico.forEach((item, index) => {
    texto += `${index + 1}. ${item.descricao}\n`;
    texto += `   ${formatarMoeda(item.valor)}\n`;
  });

  texto += `\n*TOTAL: ${formatarMoeda(total)}*\n`;

  if (orcamento.observacoes) {
    texto += `\n*Observações:* ${orcamento.observacoes}\n`;
  }

  return texto;
};

export const compartilharWhatsApp = async (
  orcamento: Orcamento
): Promise<void> => {
  const texto = gerarTextoOrcamento(orcamento);
  const url = `whatsapp://send?text=${encodeURIComponent(texto)}`;

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback para web
      const webUrl = `https://wa.me/?text=${encodeURIComponent(texto)}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error("Erro ao abrir WhatsApp:", error);
    throw error;
  }
};
