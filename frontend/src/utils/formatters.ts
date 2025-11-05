// Funções utilitárias de formatação
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export const formatarData = (dataISO: string): string => {
  try {
    return format(parseISO(dataISO), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "-";
  }
};

export const formatarDataCompleta = (dataISO: string): string => {
  try {
    return format(parseISO(dataISO), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  } catch {
    return "-";
  }
};

export const formatarTelefone = (telefone: string): string => {
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
      7
    )}`;
  }
  return telefone;
};
