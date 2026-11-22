import db from "../database/database.js";

const criarSalas = db.prepare(`
    INSERT INTO salas_multiplayer (codigo, tipo)
    VALUES (?, ?)
`);

const verificarSalas = db.prepare(`
    SELECT COUNT(*) as total
    FROM salas_multiplayer
    WHERE tipo = ?
`);

const gerarCodigo = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

for (const tipo of ["publica", "privada"] as const) {
    const resultado = verificarSalas.get(tipo) as { total: number };

    for (let i = resultado.total; i < 10; i++) {
        let codigo = gerarCodigo();

        while (
            db.prepare("SELECT id FROM salas_multiplayer WHERE codigo = ?").get(codigo)
        ) {
            codigo = gerarCodigo();
        }

        criarSalas.run(codigo, tipo);
    }
}

console.log("Salas multiplayer verificadas!");