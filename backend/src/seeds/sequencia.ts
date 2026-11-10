import db from "../database/database.js";

type ImagemSequencia ={
    nome: string
    extensao: string
}

const imagens: ImagemSequencia[] = [
  {nome: "leão", extensao: "png"},
  {nome: "raia", extensao: "png"},
  {nome: "caneta", extensao:"jpg"},
  {nome: "empilhadeira", extensao:"jpg"},
  {nome: "lasanha", extensao:"jpg"},
  {nome: "pretzel", extensao:"jpg"},
  {nome: "planador", extensao:"jpg"},
  {nome: "jacaré", extensao:"png"},
  {nome: "lanterna", extensao:"jpeg"},
  {nome: "limousine", extensao:"jpg"},
  {nome: "tiramisu", extensao:"jpg"},
  {nome: "polvo", extensao:"png"},
  {nome: "abajur", extensao:"jpg"},
  {nome: "bicicleta", extensao:"jpg"},
  {nome: "harpa", extensao:"jpg"},
  {nome: "capivara", extensao:"png"},
  {nome: "guincho", extensao:"jpg"},
  {nome: "flamingo", extensao:"png"},
  {nome: "submarino", extensao:"jpg"},
  {nome: "jipe", extensao:"jpg"},
  {nome: "microfone", extensao:"jpg"},
  {nome: "búfalo", extensao:"png"},
  {nome: "caiaque", extensao:"jpg"},
  {nome: "tartaruga", extensao:"png"},
  {nome: "ambulância", extensao:"jpg"},
  {nome: "harpia", extensao:"png"},
  {nome: "locomotiva", extensao:"jpg"},
  {nome: "tridente", extensao:"jpg"},
  {nome: "cachorro", extensao:"png"},
  {nome: "quadriciclo", extensao:"jpg"},
  {nome: "avestruz", extensao:"png"},
  {nome: "gado", extensao:"png"},
  {nome: "drone", extensao:"jpg"},
  {nome: "almofada", extensao:"png"},
  {nome: "tucano", extensao:"png"},
  {nome: "motorhome", extensao:"jpg"},
  {nome: "tesoura", extensao:"jpg"},
  {nome: "fusca", extensao:"jpg"},
  {nome: "caranguejo", extensao:"png"},
  {nome: "caminhonete", extensao:"jpg"},
  {nome: "kiwi", extensao:"png"},
  {nome: "bigorna", extensao:"jpg"},
  {nome: "lancha", extensao:"jpg"},
  {nome: "coala", extensao:"png"},
  {nome: "vitrola", extensao:"jpeg"},
]; 

export function cadastroImgSequencia(){
    imagens.forEach(({nome, extensao}, index) =>{
    const numero = index.toString().padStart(2, "0")
    const caminho = (`imagens/sequencia/img_${numero}.${extensao}`)

    db.prepare(`
        INSERT OR IGNORE INTO imagens_sequencia (nome, caminho)
        VALUES(?, ?)
    `).run(nome, caminho);
});
}
