import { Router } from "express";
import { buscarImagensMultiplayer } from "../services/Multiplayer/multiplayerfuncionamento.js";
const router = Router();

router.get("/imagens-multiplayer", (req, res) => {
    const imagens = buscarImagensMultiplayer();

    if (imagens.length === 0) {
        return res.status(404).json({
            erro: "Nenhuma imagem cadastrada para o Multiplayer"
        });
    }

    return res.json(imagens);
});

export default router;