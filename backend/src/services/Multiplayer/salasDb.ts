import db from "../../database/database.js"; // ajusta o caminho relativo se o database estiver noutro nível
import type { TipoSala } from "./types.js";

export function resetarStatusSalas(): void {
    db.prepare(`
        UPDATE salas_multiplayer
        SET status = 'disponivel'
    `).run();
}

export function codigoSalaExiste(codigo: string): boolean {
    const row = db
        .prepare("SELECT id FROM salas_multiplayer WHERE codigo = ?")
        .get(codigo);

    return Boolean(row);
}

export function buscarSalaDisponivel(tipo: TipoSala): { id: number } | undefined {
    return db
        .prepare(`
            SELECT id FROM salas_multiplayer
            WHERE tipo = ? AND status = 'disponivel'
            LIMIT 1
        `)
        .get(tipo) as { id: number } | undefined;
}

export function atualizarSalaAguardando(id: number, codigo: string): void {
    db.prepare(`
        UPDATE salas_multiplayer
        SET codigo = ?, status = 'aguardando'
        WHERE id = ?
    `).run(codigo, id);
}

export function atualizarSalaEmAndamento(id: number): void {
    db.prepare(`
        UPDATE salas_multiplayer
        SET status = 'em_andamento'
        WHERE id = ?
    `).run(id);
}

export function atualizarSalaDisponivel(id: number): void {
    db.prepare(`
        UPDATE salas_multiplayer
        SET status = 'disponivel'
        WHERE id = ?
    `).run(id);
}