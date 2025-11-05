import { Request, Response } from "express";
import Orcamento, { IOrcamento } from "../models/Orcamento";

// GET /api/orcamentos
export const getAllOrcamentos = async (req: Request, res: Response) => {
  try {
    const orcamentos = await Orcamento.find().sort({ data: -1 });
    res.json(orcamentos);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// POST /api/orcamentos
export const createOrcamento = async (req: Request, res: Response) => {
  // O body já vem tipado do frontend (Omit<Orcamento, "id">)
  const orcamento = new Orcamento(req.body);
  try {
    const novoOrcamento = await orcamento.save();
    res.status(201).json(novoOrcamento);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// PUT /api/orcamentos/:id
export const updateOrcamento = async (req: Request, res: Response) => {
  try {
    const orcamentoAtualizado = await Orcamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!orcamentoAtualizado)
      return res.status(404).json({ message: "Orçamento não encontrado" });
    res.json(orcamentoAtualizado);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// DELETE /api/orcamentos/:id
export const deleteOrcamento = async (req: Request, res: Response) => {
  try {
    const orcamentoDeletado = await Orcamento.findByIdAndDelete(req.params.id);
    if (!orcamentoDeletado)
      return res.status(404).json({ message: "Orçamento não encontrado" });
    res.json({ message: "Orçamento deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
