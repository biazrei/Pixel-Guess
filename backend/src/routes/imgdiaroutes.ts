import { buscarImagem } from "../services/imgDiafuncionamento.js";
import db from "../database/database.js";
import {Router} from "express";

const router = Router();

router.post("/api/verificar-resposta", (req, res) => {  
    const {resposta} = req.body;
    if (!resposta) {
        return res.status(400).json ({ erro: "nenhuma resposta foi enviada"})
    }

    const imagemDoDia = buscarImagem ();
    if(!imagemDoDia) {
        return res.status(404).json ({ erro: "Nenhuma imagem encontrada para hoje"})
    }

    const registroBanco= db.prepare("SELECT nome FROM imagem_do_dia WHERE id = ?").get(imagemDoDia.id) as {nome: string}
    if (!registroBanco) {
        return res.status(404).json ({ erro: "Resposta não encontrada"})
    }
    
    const respostaFormato= resposta.trim().toLowerCase();
    const respostaReal = registroBanco.nome.trim().toLowerCase();

    const acertou = respostaFormato === respostaReal;

    return res.json({acertou})
})

export default router;
