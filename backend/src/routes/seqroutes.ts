import { buscarImgSeq } from "../services/seqfuncionamento.js";
import {Router} from "express";

const router = Router();

router.get("/imagens-sequencia", (req,res) => {
    const sequenciadoDia = buscarImgSeq();
    if (!sequenciadoDia) {
        return res.status(404).json ({erro: "Nenhuma sequência encontrada para hoje"})
    }
    return res.json(sequenciadoDia)
}
)