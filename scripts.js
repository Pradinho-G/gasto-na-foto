let pedido = `Olhe a foto deste comprovante e responda em UMA linha, sem escrever mais nada, com 2 pedaços separados por |.

Primeiro pedaço: o emoji da categoria, o nome do estabelecimento dentro de <strong>, e depois cada item comprado com seu valor, um por linha usando <br>.

Segundo pedaço: o total pago, só o número, com ponto e sempre com duas casas decimais.

As categorias são: 🛒 Mercado, 🚗 Transporte, 🍔 Comida, 💊 Saúde, 🎉 Lazer, 🏠 Casa, 💸 Outros.

Exemplo de resposta:
🍔 <strong>Padaria Pão Quente</strong><br>Pão — R$ 5,00<br>Leite — R$ 4,50|9.50`;

let total = 0;


async function lerFoto() {

    const input = document.querySelector(".foto");
    const foto = input.files[0];

    if (!foto) {
        return;
    }

    const lista = document.querySelector(".lista");


    // Mostra carregamento

    lista.innerHTML = `
        <div class="comprovante">

            <div class="total-nota">
                ⏳ Lendo o comprovante...
            </div>

        </div>
    `;


    try {

        console.log("Foto selecionada:", foto);
        console.log("Nome:", foto.name);
        console.log("Tipo:", foto.type);
        console.log("Tamanho:", foto.size);


        // Verifica se o Puter carregou

        if (typeof puter === "undefined") {

            throw new Error(
                "O Puter não foi carregado."
            );

        }


        console.log("Puter carregado.");
        console.log("Enviando foto para a IA...");


        // Envia a foto diretamente para a IA

        const resposta = await puter.ai.chat(
            pedido,
            foto
        );


        console.log(
            "Resposta completa da IA:",
            resposta
        );


        // Verifica a resposta

        if (!resposta || !resposta.message) {

            throw new Error(
                "A IA não retornou uma resposta."
            );

        }


        let texto = resposta.message.content;


        if (typeof texto !== "string") {

            throw new Error(
                "A resposta da IA não veio em texto."
            );

        }


        console.log(
            "Texto recebido:",
            texto
        );


        // Divide a resposta pelo |

        const partes = texto.split("|");


        if (partes.length < 2) {

            throw new Error(
                "A IA respondeu em um formato inesperado."
            );

        }


        // Informações do comprovante

        const informacoes =
            partes[0].trim();


        // Valor da compra

        const valorTexto =
            partes[1]
                .trim()
                .replace(",", ".")
                .replace(/[^\d.]/g, "");


        const valor =
            Number(valorTexto);


        if (isNaN(valor)) {

            throw new Error(
                "Não consegui identificar o valor da nota."
            );

        }


        console.log(
            "Valor identificado:",
            valor
        );


        // Mostra o comprovante

        lista.innerHTML = `
            <div class="comprovante">

                <div class="total-nota">

                    ${informacoes}

                    <br><br>

                    Total da nota:
                    R$ ${valor
                .toFixed(2)
                .replace(".", ",")}

                </div>

            </div>
        `;


        // Soma ao total

        total += valor;


        // Atualiza o total

        document.querySelector(
            ".total-gasto"
        ).innerHTML =
            "R$ " +
            total
                .toFixed(2)
                .replace(".", ",");


        console.log(
            "Total acumulado:",
            total
        );


    } catch (erro) {

        console.error(
            "ERRO:",
            erro
        );


        lista.innerHTML = `
            <div class="comprovante">

                <div class="total-nota">

                    ❌ Não foi possível ler
                    o comprovante.

                    <br><br>

                    <small>
                        ${erro.message}
                    </small>

                </div>

            </div>
        `;

    }

}