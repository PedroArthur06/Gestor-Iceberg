import { Router } from "express";
import {
  getAllOrcamentos,
  createOrcamento,
  updateOrcamento,
  deleteOrcamento,
} from "../controllers/orcamentoController";

const router = Router();

router.get("/", getAllOrcamentos);
router.post("/", createOrcamento);
router.put("/:id", updateOrcamento);
router.delete("/:id", deleteOrcamento);

export default router;
