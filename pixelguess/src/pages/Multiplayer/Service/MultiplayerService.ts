export interface ImagemMultiplayer {
    id: number;
    nome: string;
    caminho: string;
}

export async function buscarImagensMultiplayer(): Promise<ImagemMultiplayer[]> {
    const resposta = await fetch("http://localhost:3000/imagens-multiplayer");

    if (!resposta.ok) {
        throw new Error("Erro ao buscar imagens do Multiplayer");
    }

    return await resposta.json();
}