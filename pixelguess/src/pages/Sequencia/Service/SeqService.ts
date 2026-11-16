type Imagens = {
    id:number;
    imagem_1: string;
    imagem_2: string;
    imagem_3: string;
}

export async function buscarImagensSeq(): Promise<Imagens> {
    try {const resposta = await fetch("http://localhost:3000/imagens-sequencia");

        if (!resposta.ok) {
            throw new Error ("Não foi possível buscar a sequência do dia");
        }
        const dados = await resposta.json();
        return(dados);
} catch (erro) {
    console.error(erro);
    throw erro
}}

