

// script_operador.js

// Importamos a função de logging que criaremos na seção 2
// O ideal é que esta função seja importada de um data_manager, se necessário.
function adicionarEvento(descricao) {
    // Por enquanto, apenas loga no console.
    console.log(`[EVENTO NOVO] ${descricao}`); 
    renderizarEventos(); // Chama a função que renderiza os eventos
}


/**
 * Função principal para alternar o estado de uma cancela.
 * @param {number} numeroCancela - 1 ou 2.
 * @param {string} statusId - ID do elemento div.status.
 */
function acionarCancela(numeroCancela, statusId) {
    const statusDiv = document.getElementById(statusId);
    
    // Verifica o estado atual
    const estaAberta = statusDiv.classList.contains('aberta');

    if (estaAberta) {
        // Ação: Fechar
        statusDiv.classList.remove('aberta');
        statusDiv.classList.add('fechada');
        statusDiv.textContent = 'Fechada';
        
        adicionarEvento(`Fechamento manual da Cancela ${numeroCancela}`);
        
    } else {
        // Ação: Abrir
        statusDiv.classList.remove('fechada');
        statusDiv.classList.add('aberta');
        statusDiv.textContent = 'Aberta';
        
        adicionarEvento(`Abertura manual da Cancela ${numeroCancela}`);
    }

    // Você pode usar localStorage para persistir o estado da cancela, se necessário.
    // Ex: localStorage.setItem(`cancela${numeroCancela}Status`, estaAberta ? 'fechada' : 'aberta');
}

// Conecta os botões à função
document.getElementById('btnCancela1').addEventListener('click', () => {
    acionarCancela(1, 'statusCancela1');
});

document.getElementById('btnCancela2').addEventListener('click', () => {
    acionarCancela(2, 'statusCancela2');
});

// Nota: O código do gráfico (grafico.js) deve ser integrado neste arquivo ou carregado separadamente.
// script_operador.js (Continuação)

const LOG_KEY = 'operadorLog';
const listaEventosDiv = document.getElementById('lista-eventos');

// Função READ: Lê os logs
function getLogs() {
    const data = localStorage.getItem(LOG_KEY);
    return data ? JSON.parse(data) : [];
}

// Função CREATE: Adiciona um novo log
function adicionarEvento(descricao) {
    const logs = getLogs();
    
    const novoLog = {
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR'),
        descricao: descricao
    };

    // Adiciona o novo log no início do array
    logs.unshift(novoLog);
    
    // Mantém apenas os 10 logs mais recentes para não sobrecarregar
    logs.splice(10); 

    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
    renderizarEventos(); // Atualiza a tela após a criação
}

// Função READ: Renderiza os logs na tela
function renderizarEventos() {
    const logs = getLogs();
    listaEventosDiv.innerHTML = ''; // Limpa o conteúdo

    if (logs.length === 0) {
        listaEventosDiv.innerHTML = '<p style="text-align: center; color: #ccc;">Nenhum evento registrado.</p>';
        return;
    }

    logs.forEach(log => {
        const linha = document.createElement('div');
        linha.classList.add('linha');
        
        // Exibe data e hora do evento
        linha.innerHTML = `
            <span>${log.data} ${log.hora}</span>
            <span>${log.descricao}</span>
        `;
        listaEventosDiv.appendChild(linha);
    });
}

// Inicialização: Carrega os logs ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    // Integração: Adicionar eventos iniciais se a lista estiver vazia
    if (getLogs().length === 0) {
        adicionarEvento("Sistema inicializado");
        adicionarEvento("Fechamento manual da Cancela 2");
    }
    renderizarEventos();
});
const ctx = document.getElementById('meuGrafico').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Março', 'Abril', 'Maio', 'Junho'],
        datasets: [{
            label: 'Entradas',
            data: [12, 19, 7, 22],
            backgroundColor: [
                'rgba(0, 180, 255, 0.7)',
                'rgba(50, 130, 255, 0.7)',
                'rgba(80, 110, 255, 0.7)',
                'rgba(40, 80, 200, 0.9)'
            ],
            borderRadius: 6
        }]
    },
    options: {
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255,255,255,0.1)'
                }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});
