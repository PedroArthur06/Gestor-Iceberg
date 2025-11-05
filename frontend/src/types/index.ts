export type StatusOrcamento =
  | "Pendente"
  | "Aprovado"
  | "Concluído"
  | "Recusado";

export interface ItemServico {
  id: string;
  descricao: string;
  valor: number;
}

export interface Orcamento {
  id: string;
  cliente: string;
  endereco: string;
  telefone: string;
  data: string; // ISO string
  status: StatusOrcamento;
  itensServico: ItemServico[];
  observacoes: string;
  dataConclusao?: string; // ISO string
}

export interface FiltroTemporal {
  label: string;
  dias: number;
}
