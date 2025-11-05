import { create } from "zustand";
import { Orcamento } from "../types";
import api from "../services/api";

interface OrcamentoStore {
  orcamentos: Orcamento[];
  carregando: boolean;
  carregarOrcamentos: () => Promise<void>;
  adicionarOrcamento: (
    orcamento: Omit<Orcamento, "id" | "dataConclusao">
  ) => Promise<void>;
  atualizarOrcamento: (
    id: string,
    orcamento: Partial<Orcamento>
  ) => Promise<void>;
  obterOrcamento: (id: string) => Orcamento | undefined;
  deletarOrcamento: (id: string) => Promise<void>;
}

export const useOrcamentoStore = create<OrcamentoStore>((set, get) => ({
  orcamentos: [],
  carregando: false,

  carregarOrcamentos: async () => {
    set({ carregando: true });
    try {
      const response = await api.get<Orcamento[]>("/orcamentos");
      set({ orcamentos: response.data || [], carregando: false });
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
      set({ carregando: false, orcamentos: [] });
    }
  },

  adicionarOrcamento: async (novoOrcamento) => {
    try {
      // O 'data' já está sendo setado no frontend ou no backend (default)
      const response = await api.post<Orcamento>("/orcamentos", novoOrcamento);
      const orcamentoCriado = response.data;
      set((state) => ({
        orcamentos: [...state.orcamentos, orcamentoCriado],
      }));
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error);
      throw error;
    }
  },

  atualizarOrcamento: async (id, atualizacao) => {
    try {
      const response = await api.put<Orcamento>(
        `/orcamentos/${id}`,
        atualizacao
      );
      const orcamentoAtualizado = response.data;

      set((state) => ({
        orcamentos: state.orcamentos.map((orc) =>
          orc.id === id ? orcamentoAtualizado : orc
        ),
      }));
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      throw error;
    }
  },

  obterOrcamento: (id) => {
    return get().orcamentos.find((orc) => orc.id === id);
  },

  deletarOrcamento: async (id) => {
    try {
      await api.delete(`/orcamentos/${id}`);
      set((state) => ({
        orcamentos: state.orcamentos.filter((orc) => orc.id !== id),
      }));
    } catch (error) {
      console.error("Erro ao deletar orçamento:", error);
      throw error;
    }
  },
}));
