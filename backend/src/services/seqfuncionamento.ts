import db from "../database/database.js";

export function buscarImgSeq(){
    const imagensSeq = db.prepare ("SELECT id, imagem_1, imagem_2, imagem_3 FROM sequencia_diaria ORDER BY id ASC").all() as { id: number; imagem_1: string; imagem_2: string; imagem_3: string }[];

    if (imagensSeq.length === 0){return null}

    const dataInicial = "2026-11-05";
    const dataAtual = new Intl.DateTimeFormat ("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());

    const inicio = new Date (`${dataInicial}T00:00:00Z`);
    const hoje = new Date (`${dataAtual}T00:00:00Z`);

    let diasPassados = Math.floor((hoje.getTime() - inicio.getTime()) / 86400000)
    const indiceImgSeq = ((diasPassados % imagensSeq.length) + imagensSeq.length) % imagensSeq.length;

    const imgsSeqEscolhidas = imagensSeq[indiceImgSeq];

    return{
       id: imgsSeqEscolhidas.id,
       imagem_1: imgsSeqEscolhidas.imagem_1,
       imagem_2: imgsSeqEscolhidas.imagem_2,
       imagem_3: imgsSeqEscolhidas.imagem_3,

    }



}