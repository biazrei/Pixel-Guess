import db from "../database/database.js";

export function cadastroImgDia() {
  db.prepare(`
    INSERT OR IGNORE INTO imagem_do_dia (nome, caminho)
    VALUES
    ('maçã', 'imagens/imgdia/img_00.png'),
    ('zebra', 'imagens/imgdia/img_01.png'),
    ('graviola', 'imagens/imgdia/img_02.png'),
    ('anta', 'imagens/imgdia/img_03.png'),
    ('morsa', 'imagens/imgdia/img_04.png'),
    ('caminhão', 'imagens/imgdia/img_05.png'),
    ('dardo', 'imagens/imgdia/img_06.jpg'),
    ('yakisoba', 'imagens/imgdia/img_07.jpg'),
    ('galinha', 'imagens/imgdia/img_08.png'),
    ('pinha', 'imagens/imgdia/img_09.jpg'),
    ('livro', 'imagens/imgdia/img_10.jpg'),
    ('carambola', 'imagens/imgdia/img_11.png'),
    ('trator', 'imagens/imgdia/img_12.jpg'),
    ('kart', 'imagens/imgdia/img_13.jpg'),
    ('pato', 'imagens/imgdia/img_14.png'),
    ('pipoca', 'imagens/imgdia/img_15.png'),
    ('pinguim', 'imagens/imgdia/img_16.png'),
    ('grua', 'imagens/imgdia/img_17.jpg'),
    ('candelabro', 'imagens/imgdia/img_18.jpg'),
    ('golfinho', 'imagens/imgdia/img_19.png'),
    ('hiena', 'imagens/imgdia/img_20.png'),
    ('armadura', 'imagens/imgdia/img_21.jpg'),
    ('kombi', 'imagens/imgdia/img_22.jpg'),
    ('bonde', 'imagens/imgdia/img_23.jpg'),
    ('esfiha', 'imagens/imgdia/img_24.jpg'),
    ('cofre', 'imagens/imgdia/img_25.jpg'),
    ('albatroz', 'imagens/imgdia/img_26.png'),
    ('pedra', 'imagens/imgdia/img_27.jpg'),
    ('melão', 'imagens/imgdia/img_28.png'),
    ('elefante', 'imagens/imgdia/img_29.png'),
    ('cuscuz', 'imagens/imgdia/img_30.jpg')
  `).run();
}