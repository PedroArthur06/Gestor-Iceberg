// Store Zustand para gerenciamento de estado
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Orcamento, ItemServico } from "../types";
import { MOCK_ORCAMENTOS } from "../constants/mockData";

interface OrcamentoStore {
  orcamentos: Orcamento[];
  carregando: boolean;
  carregarOrcamentos: () => Promise<void>;
  adicionarOrcamento: (orcamento: Omit<Orcamento, "id">) => Promise<void>;
  atualizarOrcamento: (
    id: string,
    orcamento: Partial<Orcamento>
  ) => Promise<void>;
  obterOrcamento: (id: string) => Orcamento | undefined;
  deletarOrcamento: (id: string) => Promise<void>;
}

const STORAGE_KEY = "@GestorIceberg:orcamentos";

export const useOrcamentoStore = create<OrcamentoStore>((set, get) => ({
  orcamentos: [],
  carregando: false,

  carregarOrcamentos: async () => {
    set({ carregando: true });
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        set({ orcamentos: JSON.parse(data), carregando: false });
      } else {
        // Primeira vez - usar dados mock
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(MOCK_ORCAMENTOS)
        );
        set({ orcamentos: MOCK_ORCAMENTOS, carregando: false });
      }
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
      set({ orcamentos: MOCK_ORCAMENTOS, carregando: false });
    }
  },

  adicionarOrcamento: async (novoOrcamento) => {
    const id = Date.now().toString();
    const orcamento: Orcamento = { ...novoOrcamento, id };
    const novosOrcamentos = [...get().orcamentos, orcamento];

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosOrcamentos));
      set({ orcamentos: novosOrcamentos });
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error);
      throw error;
    }
  },

  atualizarOrcamento: async (id, atualizacao) => {
    const orcamentos = get().orcamentos;
    const novosOrcamentos = orcamentos.map((orc) =>
      orc.id === id ? { ...orc, ...atualizacao } : orc
    );

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosOrcamentos));
      set({ orcamentos: novosOrcamentos });
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      throw error;
    }
  },

  obterOrcamento: (id) => {
    return get().orcamentos.find((orc) => orc.id === id);
  },

  deletarOrcamento: async (id) => {
    const novosOrcamentos = get().orcamentos.filter((orc) => orc.id !== id);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosOrcamentos));
      set({ orcamentos: novosOrcamentos });
    } catch (error) {
      console.error("Erro ao deletar orçamento:", error);
      throw error;
    }
  },
}));
