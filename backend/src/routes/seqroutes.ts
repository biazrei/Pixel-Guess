import { buscarImgSeq } from "../services/seqfuncionamento.js";
import {Router} from "express";
import db from "../database/database.js";

const router = Router();

router.get("/imagens-sequencia", (req,res) => {
    const sequenciadoDia = buscarImgSeq();
    if (!sequenciadoDia) {
        return res.status(404).json ({erro: "Nenhuma sequência encontrada para hoje"})
    }
    return res.json(sequenciadoDia)
})
router.post ("/api/verificar-resposta-sequencia", (req, res) => {  
    const { resposta, idImagem } = req.body;
    
    if (!resposta) {
        return res.status(400).json({ erro: "Nenhuma resposta foi enviada" });
    }

    if (!idImagem) {
        return res.status(400).json({ erro: "ID da imagem não foi informado" });
    }

    const registroBanco = db.prepare("SELECT nome FROM imagens_sequencia WHERE id = ?").get(idImagem) as { nome: string };
    
    if (!registroBanco) {
        return res.status(404).json({ erro: "Resposta não encontrada" });
    }
    
    const respostaFormato = resposta.trim().toLowerCase();
    const respostaReal = registroBanco.nome.trim().toLowerCase();

    const acertou = respostaFormato === respostaReal;

    return res.json({
        acertou,
        nomeResposta: registroBanco.nome, 
        idImagem
    });
});
export default router