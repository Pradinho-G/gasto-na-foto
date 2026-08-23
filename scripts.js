/*
========================================
GASTO NA FOTO - VERSÃO 2.0
========================================
*/

let total = 0;

let categorias = {};


// ========================================
// ORIENTAÇÃO ENVIADA PARA A IA
// ========================================

let pedido = `
Olhe a foto deste comprovante.

Responda seguindo EXATAMENTE este formato:

CATEGORIA|ESTABELECIMENTO|ITEMS|TOTAL

As categorias possíveis são:

🛒 Mercado
🚗 Transporte
🍔 Comida
💊 Saúde
🎉 Lazer
🏠 Casa
💸 Outros

No campo ITEMS, coloque cada produto separado por ;.

Cada produto deve seguir este formato:

Nome do produto: R$ 0.00

O TOTAL deve conter somente o número,
com ponto decimal e duas casas.

Exemplo:

🍔 Comida|Padaria Pão Quente|Pão: R$ 5.00;Leite: R$ 4.50;Café: R$ 3.00|12.50

Não escreva nenhuma explicação.
`;


// ========================================
// FUNÇÃO PARA LER A FOTO
// ========================================

async function lerFoto() {

    // Pega a foto selecionada
    let foto = document.querySelector(".foto").files[0];

    // Se não tiver foto, não faz nada
    if (!foto) {
        return;
    }


    // ========================================
    // MOSTRA O STATUS
    // ========================================

    document.querySelector(".status").innerHTML =
        "🤖 Analisando comprovante...";


    // ========================================
    // ENVIA A FOTO PARA A IA
    // ========================================

    let resposta = await puter.ai.chat(pedido, foto);


    // ========================================
    // PEGA A RESPOSTA
    // ========================================

    let texto = resposta.message.content;

    console.log("Resposta da IA:");
    console.log(texto);


    // ========================================
    // SEPARA AS INFORMAÇÕES
    // ========================================

    let partes = texto.split("|");

    console.log("Partes:");
    console.log(partes);


    // Verifica se a IA respondeu corretamente
    if (partes.length < 4) {

        document.querySelector(".status").innerHTML =
            "❌ Não foi possível analisar o comprovante.";

        return;
    }


    // ========================================
    // PEGA AS INFORMAÇÕES
    // ========================================

    let categoria = partes[0];

    let estabelecimento = partes[1];

    let itensTexto = partes[2];

    let valorTexto = partes[3];


    // ========================================
    // CONVERTE O VALOR
    // ========================================

    let valor = Number(valorTexto);


    if (isNaN(valor)) {

        document.querySelector(".status").innerHTML =
            "❌ Não foi possível identificar o valor.";

        return;
    }

    // ========================================
    // ATUALIZA O RESUMO DA CATEGORIA
    // ========================================

    if (categorias[categoria]) {

        categorias[categoria] += valor;

    } else {

        categorias[categoria] = valor;

    }

    // ========================================
    // TRANSFORMA OS ITENS EM LISTA
    // ========================================

    let itens = itensTexto.split(";");

    let listaItens = "";


    itens.forEach(function (item) {

        listaItens += `
            <div class="item">
                ${item}
            </div>
        `;

    });


    // ========================================
    // COLOCA O COMPROVANTE NA TELA
    // ========================================

    document.querySelector(".lista").innerHTML += `

        <div class="comprovante">

            <div class="categoria">
                ${categoria}
            </div>

            <h3>
                ${estabelecimento}
            </h3>

            <div class="itens">
                ${listaItens}
            </div>

            <div class="total-nota">
                Total da nota:
                R$ ${valor.toFixed(2)}
            </div>

        </div>

    `;


    // ========================================
    // ATUALIZA O TOTAL GERAL
    // ========================================

    total += valor;

    document.querySelector(".total-gasto").innerHTML =
        "R$ " + total.toFixed(2);

        atualizarResumo();


    // ========================================
    // FINALIZA O STATUS
    // ========================================

    document.querySelector(".status").innerHTML =
        "✅ Comprovante analisado!";
}

// ========================================
// LIMPAR TODOS OS GASTOS
// ========================================

function limparGastos() {

    // Zera o total
    total = 0;

    // Zera as categorias
    categorias = {};

    // Atualiza o total
    document.querySelector(".total-gasto").innerHTML =
        "R$ 0,00";

    // Apaga os comprovantes
    document.querySelector(".lista").innerHTML = "";

    // Limpa o status
    document.querySelector(".status").innerHTML = "";

    // Limpa o resumo
    atualizarResumo();
}

// ========================================
// MOSTRAR RESUMO DAS CATEGORIAS
// ========================================

function atualizarResumo() {

    let areaCategorias =
        document.querySelector(".categorias");


    // Limpa o resumo atual

    areaCategorias.innerHTML = "";


    // Passa por cada categoria

    for (let categoria in categorias) {

        let valor = categorias[categoria];


        areaCategorias.innerHTML += `

            <div class="categoria-resumo">

                <span>
                    ${categoria}
                </span>

                <span class="valor-categoria">
                    R$ ${valor.toFixed(2)}
                </span>

            </div>

        `;
    }
}