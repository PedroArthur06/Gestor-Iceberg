# 📱 Gestor Iceberg - Frontend Mobile

## 🎯 Visão Geral

Aplicativo mobile desenvolvido em **React Native (Expo)** + **TypeScript** para gestão de orçamentos de serviços de ar condicionado. Interface moderna com **Liquid Glass Effect** e paleta de cores azul.

---

## 🎨 Design

### Paleta de Cores

```typescript
- Primary: #021024 (Azul escuro)
- Secondary: #052659 (Azul médio)
- Accent: #548383 (Verde-azulado)
- Light: #7DA0CA (Azul claro)
- Lightest: #C1E8FF (Azul muito claro)

Status:
- Pendente: #FFA500 (Laranja)
- Comprovado: #4169E1 (Azul royal)
- Concluído: #22C55E (Verde)
- Recusado: #EF4444 (Vermelho)
```

### Estilo Visual

- **Liquid Glass Effect**: Cards com transparência, bordas arredondadas e sombras suaves
- **Ícones**: Expo Vector Icons (Ionicons)
- **Tipografia**: System fonts com pesos variados
- **Navegação**: Bottom Tab Navigation com 4 abas principais

---

## 📂 Estrutura do Projeto

```
frontend/
├── app/                          # Rotas (Expo Router)
│   ├── _layout.tsx              # Layout raiz
│   ├── index.tsx                # Tela de boas-vindas
│   ├── (tabs)/                  # Navegação por abas
│   │   ├── _layout.tsx         # Layout das tabs
│   │   ├── inicio.tsx          # Dashboard
│   │   ├── orcamentos.tsx      # Lista de orçamentos
│   │   ├── novo.tsx            # Criar novo orçamento
│   │   └── relatorios.tsx      # Menu de relatórios
│   ├── detalhes/
│   │   └── [id].tsx            # Detalhes do orçamento
│   ├── relatorio-faturamento.tsx
│   └── relatorio-performance.tsx
│
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── GlassCard.tsx       # Card com efeito glass
│   │   ├── StatusBadge.tsx     # Badge de status
│   │   └── OrcamentoCard.tsx   # Card de orçamento
│   │
│   ├── constants/               # Constantes do app
│   │   ├── colors.ts           # Paleta de cores
│   │   └── mockData.ts         # Dados de exemplo
│   │
│   ├── store/                   # Gerenciamento de estado
│   │   └── orcamentoStore.ts   # Zustand store
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   │
│   └── utils/                   # Funções utilitárias
│       ├── formatters.ts       # Formatação (moeda, data)
│       ├── calculations.ts     # Cálculos (total, conversão)
│       └── whatsapp.ts         # Integração WhatsApp
│
├── package.json
└── app.json
```

---

## 🚀 Funcionalidades Implementadas

### ✅ 1. Tela de Boas-vindas

- Logo redondo com ícone de iceberg
- Título "Gestor Iceberg"
- Botão "Entrar" com animação
- Background com círculos decorativos

### ✅ 2. Dashboard (Início)

- **Cards de estatísticas**:
  - Faturamento (30 dias)
  - Orçamentos concluídos
  - Taxa de conversão
  - Total de orçamentos
- **Ações rápidas**: Novo orçamento, Faturamento, Performance
- **Últimos 5 orçamentos**

### ✅ 3. Lista de Orçamentos

- **Busca** por cliente, endereço ou telefone
- **Filtros** por status (Todos, Pendente, Comprovado, Concluído, Recusado)
- **Cards informativos** com:
  - Nome do cliente
  - Data
  - Valor total
  - Status visual
  - Número de serviços

### ✅ 4. Novo Orçamento

- **Formulário completo**:
  - Dados do cliente (Nome, Endereço, Telefone)
  - Serviços dinâmicos (adicionar/remover)
  - Descrição e valor por serviço
  - Cálculo automático do total
  - Campo de observações
- **Validação** de campos obrigatórios
- **Salvamento** com status inicial "Pendente"

### ✅ 5. Detalhes do Orçamento

- Visualização completa de todos os dados
- **Alterar status** com ActionSheet/Alert
- **Data de conclusão automática** quando status = "Concluído"
- **Compartilhar no WhatsApp**:
  - Texto formatado com todos os dados
  - Abre WhatsApp automaticamente
- **Excluir orçamento** com confirmação

### ✅ 6. Relatório de Faturamento

- **Filtros temporais**: Esta Semana, Este Mês, Últimos 3 Meses, Este Ano
- **Card de total faturado** (grande e destacado)
- **Lista detalhada** de orçamentos concluídos:
  - Cliente
  - Data de conclusão
  - Valor total
  - Lista de serviços

### ✅ 7. Relatório de Performance

- **Filtros temporais** (mesmos do faturamento)
- **Taxa de conversão** em destaque
- **Métricas**:
  - Número de concluídos
  - Número de recusados
- **Gráfico de pizza/donut**:
  - Verde: Concluídos
  - Vermelho: Recusados
  - Legenda com valores
- **Insights automáticos**:
  - Parabéns se conversão > 70%
  - Alerta se conversão < 50%
  - Avisos específicos

---

## 🔧 Tecnologias Utilizadas

### Core

- **React Native**: 0.79.5
- **Expo**: 54.0.22
- **TypeScript**: 5.8.3
- **Expo Router**: 5.1.4 (navegação file-based)

### Navegação

- **@react-navigation/native**: 7.1.6
- **@react-navigation/bottom-tabs**: 7.3.10
- **@react-navigation/native-stack**: 7.6.2

### Estado e Dados

- **Zustand**: 5.0.8 (gerenciamento de estado)
- **AsyncStorage**: 2.2.0 (persistência local)

### UI e Componentes

- **expo-vector-icons**: 14.1.0 (ícones)
- **expo-linear-gradient**: 15.0.7 (gradientes)
- **react-native-gifted-charts**: 1.4.64 (gráficos)
- **react-native-svg**: 15.14.0 (renderização de gráficos)

### Utilitários

- **date-fns**: 4.1.0 (manipulação de datas)
- **expo-linking**: 7.1.7 (abrir WhatsApp)

---

## 💾 Gerenciamento de Estado

### Zustand Store (`orcamentoStore.ts`)

```typescript
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
```

**Persistência**: AsyncStorage (`@GestorIceberg:orcamentos`)

---

## 📊 Modelo de Dados

```typescript
type StatusOrcamento = "Pendente" | "Comprovado" | "Concluído" | "Recusado";

interface ItemServico {
  id: string;
  descricao: string;
  valor: number;
}

interface Orcamento {
  id: string;
  cliente: string;
  endereco: string;
  telefone: string;
  data: string; // ISO string
  status: StatusOrcamento;
  itensServico: ItemServico[];
  observacoes: string;
  dataConclusao?: string; // ISO string - preenchido automaticamente
}
```

---

## 🔌 Integração com Backend (Preparado)

O frontend está preparado para se conectar ao seu backend Node.js. Atualmente usa:

- **AsyncStorage** para persistência local
- **Dados mock** para demonstração

### Para conectar ao backend:

1. **Configure a URL do backend** em `.env`:

```env
EXPO_PUBLIC_API_URL=http://seu-backend:porta
```

2. **Crie um serviço de API** (`src/services/api.ts`):

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const orcamentosAPI = {
  listar: () => api.get("/orcamentos"),
  criar: (data) => api.post("/orcamentos", data),
  atualizar: (id, data) => api.put(`/orcamentos/${id}`, data),
  deletar: (id) => api.delete(`/orcamentos/${id}`),
};
```

3. **Atualize o Zustand store** para usar a API em vez do AsyncStorage.

---

## 📱 Integração WhatsApp

### Função `compartilharWhatsApp()`

Gera texto formatado e abre WhatsApp automaticamente:

```typescript
*ORÇAMENTO - GESTOR ICEBERG*

*Cliente:* João Silva
*Endereço:* Rua das Flores, 123
*Telefone:* (11) 98765-4321
*Data:* 01/07/2025
*Status:* Concluído

*SERVIÇOS:*
1. Instalação Ar Condicionado Split 12.000 BTUs
   R$ 800,00
2. Mão de obra
   R$ 200,00

*TOTAL: R$ 1.000,00*

*Observações:* Cliente preferiu instalação pela manhã
```

**Suporte**:

- ✅ iOS: `whatsapp://send?text=...`
- ✅ Android: `whatsapp://send?text=...`
- ✅ Web/Fallback: `https://wa.me/?text=...`

---

## 🎯 Cálculos Automáticos

### 1. Total do Orçamento

```typescript
calcularTotal(itensServico); // Soma de todos os valores
```

### 2. Taxa de Conversão

```typescript
calcularTaxaConversao(concluidos, recusados);
// (concluídos / (concluídos + recusados)) * 100
```

### 3. Faturamento

```typescript
calcularFaturamento(orcamentos, dias);
// Soma dos totais de orçamentos "Concluídos" no período
```

### 4. Filtro por Período

```typescript
filtrarPorPeriodo(orcamentos, dias);
// Retorna orçamentos dos últimos N dias
```

---

## 📦 Dados Mock Incluídos

4 orçamentos de exemplo com diferentes status:

1. ✅ Concluído - João Silva (R$ 1.000)
2. 🟡 Pendente - Maria Santos (R$ 300)
3. 🔵 Comprovado - Pedro Oliveira (R$ 2.050)
4. ❌ Recusado - Ana Costa (R$ 250)

---

## 🚀 Como Executar

### Desenvolvimento

```bash
cd /app/frontend
yarn start
```

### Web Preview

```bash
yarn web
```

### Testar no dispositivo físico

1. Instale o app **Expo Go** no seu celular
2. Escaneie o QR code exibido no terminal
3. O app será carregado no seu dispositivo

---

## 📝 Próximos Passos (Backend)

Para completar a aplicação, você precisará implementar no backend:

### Endpoints Necessários

```
GET    /api/orcamentos          # Listar todos
GET    /api/orcamentos/:id      # Obter por ID
POST   /api/orcamentos          # Criar novo
PUT    /api/orcamentos/:id      # Atualizar
DELETE /api/orcamentos/:id      # Deletar

# Relatórios (opcional - pode calcular no frontend)
GET    /api/relatorios/faturamento?dias=30
GET    /api/relatorios/performance?dias=30
```

### Modelo MongoDB

```javascript
const OrcamentoSchema = new Schema({
  cliente: { type: String, required: true },
  endereco: { type: String, required: true },
  telefone: { type: String, required: true },
  data: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pendente", "Comprovado", "Concluído", "Recusado"],
    default: "Pendente",
  },
  itensServico: [
    {
      descricao: { type: String, required: true },
      valor: { type: Number, required: true },
    },
  ],
  observacoes: String,
  dataConclusao: Date,
});
```

---

## 🎨 Customização

### Alterar Cores

Edite `/app/frontend/src/constants/colors.ts`

### Adicionar Novos Status

1. Atualize o type `StatusOrcamento` em `src/types/index.ts`
2. Adicione a cor em `colors.ts` (função `getStatusColor`)
3. Os filtros e UI se adaptarão automaticamente

### Modificar Períodos dos Relatórios

Edite o array `PERIODOS` em:

- `app/relatorio-faturamento.tsx`
- `app/relatorio-performance.tsx`

---

## ⚡ Performance

- **Zustand**: Store leve e rápido (10x menor que Redux)
- **useMemo**: Cálculos otimizados que só recalculam quando necessário
- **AsyncStorage**: Persistência local rápida
- **Lazy Loading**: Componentes carregados sob demanda com Expo Router

---

## 📱 Compatibilidade

- ✅ **iOS**: 13+
- ✅ **Android**: 6.0+ (API 23+)
- ✅ **Web**: Navegadores modernos (via Expo Web)

---

## 🐛 Debug

### Ver logs do Expo

```bash
sudo tail -f /var/log/supervisor/expo.out.log
sudo tail -f /var/log/supervisor/expo.err.log
```

### Limpar cache

```bash
cd /app/frontend
npx expo start --clear
```

---

## 📄 Licença

Projeto desenvolvido para fins educacionais e comerciais.

---

## 👤 Autor

**Gestor Iceberg** - Sistema de Gestão de Orçamentos
Desenvolvido com ❤️ em React Native + Expo

---

🎉 **Frontend 100% completo e funcional!**
Agora você pode implementar o backend Node.js e conectar à API.
