import db from "../database/database.js";

export function buscarImagem(){
  const imagens = db.prepare("SELECT id, nome, caminho FROM imagem_do_dia ORDER BY id ASC").all() as { id: number; nome: string; caminho: string }[];

  if(imagens.length ===0){return null}

const dataInicial= "2026-11-05";

const dataAtual = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const inicio = new Date(`${dataInicial}T00:00:00Z`);
const hoje = new Date(`${dataAtual}T00:00:00Z`);

const diasPassados = Math.floor(
  (hoje.getTime() - inicio.getTime()) / 86400000
);


const indiceImg = ((diasPassados % imagens.length) + imagens.length) % imagens.length;
const imagemEscolhida= imagens[indiceImg];

return{
    id: imagemEscolhida.id,
    caminho: imagemEscolhida.caminho,
   }

}

