// Funções de cálculo
import { Orcamento, ItemServico } from "../types";
import {
  parseISO,
  isAfter,
  isBefore,
  startOfMonth,
  endOfMonth,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";

export const calcularTotal = (itens: ItemServico[]): number => {
  return itens.reduce((total, item) => total + item.valor, 0);
};

export const calcularTaxaConversao = (
  concluidos: number,
  recusados: number
): number => {
  const total = concluidos + recusados;
  if (total === 0) return 0;
  return (concluidos / total) * 100;
};

export const filtrarPorPeriodo = (
  orcamentos: Orcamento[],
  dias: number
): Orcamento[] => {
  const hoje = new Date();
  const dataInicio = startOfDay(subDays(hoje, dias));

  return orcamentos.filter((orc) => {
    const dataOrc = parseISO(orc.data);
    return (
      isAfter(dataOrc, dataInicio) || dataOrc.getTime() === dataInicio.getTime()
    );
  });
};

export const calcularFaturamento = (
  orcamentos: Orcamento[],
  dias: number
): number => {
  const orcamentosFiltrados = filtrarPorPeriodo(orcamentos, dias);
  const concluidos = orcamentosFiltrados.filter(
    (orc) => orc.status === "Concluído"
  );

  return concluidos.reduce(
    (total, orc) => total + calcularTotal(orc.itensServico),
    0
  );
};

export const obterEstatisticas = (orcamentos: Orcamento[], dias: number) => {
  const orcamentosFiltrados = filtrarPorPeriodo(orcamentos, dias);
  const concluidos = orcamentosFiltrados.filter(
    (orc) => orc.status === "Concluído"
  );
  const recusados = orcamentosFiltrados.filter(
    (orc) => orc.status === "Recusado"
  );

  return {
    totalConcluidos: concluidos.length,
    totalRecusados: recusados.length,
    taxaConversao: calcularTaxaConversao(concluidos.length, recusados.length),
    faturamento: concluidos.reduce(
      (total, orc) => total + calcularTotal(orc.itensServico),
      0
    ),
  };
};
