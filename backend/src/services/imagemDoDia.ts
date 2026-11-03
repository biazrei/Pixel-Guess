import db from "../database/database.js";

export function buscarImagem(){
  const imagens = db.prepare("SELECT id, caminho FROM imagem_do_dia ORDER BY id ASC").all() as { id: number; caminho: string }[];

  if(imagens.length ===0){return null}

const dataInicial= new Date ("2026-11-03");
const dataAtual= new Date ();
const diferencaEmMs = dataAtual.getTime() - dataInicial.getTime()
const diasPassados = Math.floor(diferencaEmMs / 86400000)
const indiceImg= diasPassados % imagens.length;
const imagemEscolhida= imagens[indiceImg];

return imagemEscolhida;

}

