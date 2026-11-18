type Imagens = {
    id: number;
    imagem_1: string;
    resposta_1: string;
    imagem_2: string;
    resposta_2: string;
    imagem_3: string;
    resposta_3: string;
};

type ResultadoVerificacao = {
    acertou: boolean;
    nomeResposta: string;
};

export async function buscarImagensSeq(): Promise<Imagens> {
    try {
        const resposta = await fetch("http://localhost:3000/imagens-sequencia");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar a sequência do dia");
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function verificarRespostaSeq(resposta: string, etapa: number): Promise<ResultadoVerificacao> {
    try {
        const respostaFetch = await fetch("http://localhost:3000/api/verificar-resposta-sequencia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ resposta, etapa }),
        });

        if (!respostaFetch.ok) {
            throw new Error("Não foi possível verificar a resposta");
        }

        const dados = await respostaFetch.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}