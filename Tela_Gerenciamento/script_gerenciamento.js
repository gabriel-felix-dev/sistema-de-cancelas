// script_gerenciamento.js

// 1. Variáveis Globais e Funções Base de LocalStorage
const STORAGE_KEY = 'estacionamentoData';
const listaVeiculos = document.getElementById('lista-veiculos');
const formEntrada = document.getElementById('form-entrada');
const mensagemVazio = document.getElementById('mensagem-vazio');

/**
 * Lê os dados do localStorage (simulando o READ base).
 * @returns {Array} Lista de veículos.
 */
function getVeiculos() {
    const data = localStorage.getItem(STORAGE_KEY);
    // Retorna o objeto JSON parseado ou um array vazio se não houver dados.
    return data ? JSON.parse(data) : [];
}

/**
 * Salva a lista de veículos no localStorage.
 * @param {Array} veiculos - A lista completa de veículos.
 */
function saveVeiculos(veiculos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(veiculos));
}

// --------------------------------------------------------

// 2. CREATE: Adicionar Novo Veículo (Entrada)
formEntrada.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const placa = document.getElementById('placa').value.trim().toUpperCase();
    const proprietario = document.getElementById('proprietario').value.trim();

    if (!placa) {
        alert('A placa é obrigatória!');
        return;
    }

    let veiculos = getVeiculos();
    // Verifica se a placa já está estacionada
    if (veiculos.find(v => v.placa === placa)) {
        alert(`O veículo com a placa ${placa} já está estacionado.`);
        return;
    }

    // Objeto do novo veículo
    const novoVeiculo = {
        placa: placa,
        proprietario: proprietario,
        horaEntrada: new Date().toISOString(), // Grava o timestamp
        // Gera um código único (simulando um ticket)
        ticket: Math.random().toString(36).substring(2, 8).toUpperCase() 
    };

    veiculos.push(novoVeiculo);
    saveVeiculos(veiculos); // Salva a lista atualizada
    
    // Atualiza a interface
    renderizarTabela();
    formEntrada.reset();

    alert(`Veículo ${placa} registrado! Ticket: ${novoVeiculo.ticket}`);
});

// --------------------------------------------------------

// 3. READ: Renderizar a Tabela
/**
 * Renderiza a lista de veículos na tabela HTML.
 */
function renderizarTabela() {
    const veiculos = getVeiculos();
    listaVeiculos.innerHTML = ''; // Limpa as linhas existentes

    if (veiculos.length === 0) {
        mensagemVazio.style.display = 'block';
    } else {
        mensagemVazio.style.display = 'none';
    }

    veiculos.forEach(veiculo => {
        const row = listaVeiculos.insertRow();

        // Células com os dados
        row.insertCell().textContent = veiculo.placa;
        row.insertCell().textContent = veiculo.proprietario || 'N/A';
        row.insertCell().textContent = veiculo.ticket;
        // Formata a hora de entrada para melhor visualização
        row.insertCell().textContent = new Date(veiculo.horaEntrada).toLocaleTimeString('pt-BR');

        // Célula de Ações (com botões de Update e Delete)
        const cellAcoes = row.insertCell();

        // Botão para EDITAR (UPDATE)
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn-editar');
        // Adiciona o evento de clique que chama a função de edição
        btnEditar.onclick = () => editarVeiculo(veiculo.placa); 
        cellAcoes.appendChild(btnEditar);

        // Botão para SAÍDA (DELETE)
        const btnSaida = document.createElement('button');
        btnSaida.textContent = 'Saída';
        btnSaida.classList.add('btn-saida');
        // Adiciona o evento de clique que chama a função de remoção
        btnSaida.onclick = () => removerVeiculo(veiculo.placa); 
        cellAcoes.appendChild(btnSaida);
    });
}

// --------------------------------------------------------

// 4. UPDATE: Editar um Veículo
/**
 * Permite EDITAR (UPDATE) o nome do proprietário.
 * @param {string} placa - A placa do veículo a ser editado.
 */
function editarVeiculo(placa) {
    let veiculos = getVeiculos();
    const veiculoIndex = veiculos.findIndex(v => v.placa === placa);

    if (veiculoIndex === -1) {
        alert('Erro: Veículo não encontrado!');
        return;
    }

    const veiculoAtual = veiculos[veiculoIndex];

    const novoProprietario = prompt(
        `Editando veículo ${placa}.\nProprietário atual: ${veiculoAtual.proprietario || 'N/A'}\n\nDigite o novo nome do proprietário:`,
        veiculoAtual.proprietario || ''
    );

    if (novoProprietario !== null) {
        // Atualiza o proprietário
        veiculos[veiculoIndex].proprietario = novoProprietario.trim(); 

        saveVeiculos(veiculos); // Salva o estado atualizado (UPDATE)
        renderizarTabela(); // Atualiza a visualização
        alert(`Proprietário do veículo ${placa} atualizado!`);
    }
}

// --------------------------------------------------------

// 5. DELETE: Remover um Veículo (Saída)
/**
 * Remove (DELETE) um veículo do sistema.
 * @param {string} placa - A placa do veículo a ser removido.
 */
function removerVeiculo(placa) {
    if (!confirm(`Tem certeza que deseja registrar a saída (DELETE) do veículo ${placa}?`)) return;

    let veiculos = getVeiculos();
    
    // Filtra: cria uma nova lista SEM o veículo com a placa especificada
    veiculos = veiculos.filter(veiculo => veiculo.placa !== placa);

    saveVeiculos(veiculos); // Salva a lista filtrada
    renderizarTabela(); // Atualiza a interface
    
    alert(`Veículo ${placa} saiu do estacionamento.`);
}

// --------------------------------------------------------

// 6. Inicialização
// Garante que a lista seja carregada assim que a página é aberta.
document.addEventListener('DOMContentLoaded', renderizarTabela);
