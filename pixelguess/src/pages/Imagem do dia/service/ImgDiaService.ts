type Imagem = {
    id: number;
    caminho: string;
};

type ResultadoResposta= {
    acertou:boolean;
    nomeResposta: string;
    idImagem: number;
}

export async function buscarImagemDoDia(): Promise<Imagem>{
    try { const resposta = await fetch("http://localhost:3000/api/imagem-do-dia");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar a imagem do dia");
        }
        const dados = await resposta.json();
        return(dados);

    } catch (erro) {
        console.error(erro);
        throw erro
    }}

export async function verificarResposta(resposta: string): Promise<ResultadoResposta> {
    try {
        const response = await fetch("http://localhost:3000/api/verificar-resposta", {
            method: "POST",
            headers: {"Content-Type": "application/json", },
            body: JSON.stringify({ resposta: resposta }),
        });

        if (!response.ok) {
            throw new Error("Erro ao validar resposta");
        }
        const dados = await response.json();
        return dados;

    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}