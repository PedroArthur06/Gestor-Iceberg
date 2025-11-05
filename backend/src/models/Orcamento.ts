import mongoose, { Document, Schema, Model } from "mongoose";

export type StatusOrcamento =
  | "Pendente"
  | "Comprovado"
  | "Concluído"
  | "Recusado";

export interface IItemServico {
  descricao: string;
  valor: number;
}

// Interface para o documento Mongoose (inclui o 'id' do frontend)
export interface IOrcamento extends Document {
  id: string; // Mapeado do _id
  cliente: string;
  endereco: string;
  telefone: string;
  data: string; // ISO string
  status: StatusOrcamento;
  itensServico: IItemServico[];
  observacoes: string;
  dataConclusao?: string; // ISO string
}

// Schema do Mongoose
const ItemServicoSchema = new Schema<IItemServico>(
  {
    descricao: { type: String, required: true },
    valor: { type: Number, required: true },
  },
  { _id: false }
); // Não gere _id para subdocumentos

const OrcamentoSchema = new Schema<IOrcamento>(
  {
    cliente: { type: String, required: true },
    endereco: { type: String, required: true },
    telefone: { type: String, required: true },
    data: { type: String, default: () => new Date().toISOString() },
    status: {
      type: String,
      enum: ["Pendente", "Comprovado", "Concluído", "Recusado"],
      default: "Pendente",
    },
    itensServico: [ItemServicoSchema],
    observacoes: { type: String, default: "" },
    dataConclusao: { type: String, default: null },
  },
  {
    // Configura a transformação do JSON para mapear _id para id
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Orcamento: Model<IOrcamento> = mongoose.model(
  "Orcamento",
  OrcamentoSchema
);
export default Orcamento;
