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
);

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
      transform: (doc: any, ret: any) => {
        // 1. Converte o ObjectId `_id` para uma string em `id`
        ret.id = ret._id.toString();

        // 2. Tipar `ret` como `any` nos permite usar o delete
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
