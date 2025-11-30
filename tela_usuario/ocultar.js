// script_carteira.js - Arquivo consolidado

// Chaves de LocalStorage
const STORAGE_SALDO_KEY = 'carteiraSaldo';
const STORAGE_HISTORICO_KEY = 'carteiraHistorico';

// Referências DOM
const valorSaldoDisplay = document.getElementById("valorSaldo");
const historicoContainer = document.getElementById("historico-transacoes");
const mensagemVazioHistorico = document.getElementById("mensagem-vazio-historico");
const botao = document.getElementById("botaoOlho");

// --- FUNÇÕES DE ARMAZENAMENTO BASE ---

function getSaldo() {
    // Retorna o saldo, ou R$ 100.00 se for o primeiro acesso
    const saldo = localStorage.getItem(STORAGE_SALDO_KEY);
    return saldo ? parseFloat(saldo) : 100.00; 
}

function saveSaldo(saldo) {
    localStorage.setItem(STORAGE_SALDO_KEY, saldo.toFixed(2));
}

function getHistorico() {
    const historico = localStorage.getItem(STORAGE_HISTORICO_KEY);
    return historico ? JSON.parse(historico) : [];
}

/**
 * Adiciona uma nova transação ao histórico (CREATE)
 * @param {string} data - Data da transação (Ex: '26/11/2025').
 * @param {number} valor - Valor da transação (negativo para despesa).
 * @param {string} descricao - Descrição da transação.
 */
function adicionarTransacao(data, valor, descricao) {
    let historico = getHistorico();
    
    const novaTransacao = {
        data: data,
        valor: valor,
        descricao: descricao
    };

    // Adiciona a transação no início do array (para aparecer primeiro)
    historico.unshift(novaTransacao); 
    
    // Atualiza o histórico
    localStorage.setItem(STORAGE_HISTORICO_KEY, JSON.stringify(historico));

    // Atualiza o saldo
    const saldoAtual = getSaldo();
    saveSaldo(saldoAtual + valor);
    
    renderizarCarteira(); // Atualiza a tela imediatamente
}


// --- FUNÇÃO DE RENDERIZAÇÃO PRINCIPAL (READ) ---

function renderizarCarteira() {
    const saldo = getSaldo();
    const historico = getHistorico();

    // 1. Renderiza o Saldo (incluindo o caso de estar oculto)
    let oculto = valorSaldoDisplay.innerText === "•••••";
    if (!oculto) {
        valorSaldoDisplay.innerText = `R$ ${saldo.toFixed(2).replace('.', ',')}`;
    }

    // 2. Renderiza o Histórico de Transações (READ)
    historicoContainer.innerHTML = ''; // Limpa o conteúdo atual

    if (historico.length === 0) {
        // Recria o elemento para garantir que o estilo seja mantido
        const p = document.createElement('p');
        p.id = "mensagem-vazio-historico";
        p.style.cssText = "text-align: center; color: #ccc;";
        p.textContent = "Nenhuma transação registrada.";
        historicoContainer.appendChild(p);
        return;
    }
    
    historico.forEach(item => {
        const divItem = document.createElement('div');
        divItem.classList.add('item');

        const isNegativo = item.valor < 0;
        // Formata o valor com R$ e vírgula, e adiciona sinal de + se for positivo
        const valorFormatado = (isNegativo ? '' : '+') + `R$ ${Math.abs(item.valor).toFixed(2).replace('.', ',')}`;

        divItem.innerHTML = `
            <span class="data">${item.data}</span>
            <span class="valor-hist ${isNegativo ? 'negativo' : 'positivo'}">${valorFormatado}</span>
            <p class="desc">${item.descricao}</p>
        `;

        historicoContainer.appendChild(divItem);
    });
}


// --- LÓGICA DE OCULTAR SALDO ---

let oculto = false; // Estado inicial

botao.addEventListener("click", () => {
    if (oculto) {
        // Revela o saldo, buscando o valor atual
        valorSaldoDisplay.innerText = `R$ ${getSaldo().toFixed(2).replace('.', ',')}`; 
        botao.innerText = "👁️";
        oculto = false;
    } else {
        // Oculta o saldo
        valorSaldoDisplay.innerText = "•••••";
        botao.innerText = "🙈";
        oculto = true;
    }
});


// --- INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o saldo no localStorage se for a primeira vez
    if (localStorage.getItem(STORAGE_SALDO_KEY) === null) {
        saveSaldo(100.00); // Saldo inicial de R$ 100,00
    }
    
    // Exemplo de como inicializar o histórico se estiver vazio:
    if (getHistorico().length === 0) {
        adicionarTransacao(new Date().toLocaleDateString('pt-BR'), 50.00, 'Recarga via PIX Inicial');
        adicionarTransacao(new Date().toLocaleDateString('pt-BR'), -7.00, 'Pagamento de estacionamento (Teste)');
    }

    // Renderiza a carteira ao carregar a página
    renderizarCarteira();
});
