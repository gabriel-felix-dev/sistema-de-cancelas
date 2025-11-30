// script_visitante.js

// IMPORTA as funções de Gerenciamento de Veículos e Carteira
import { getVeiculos, saveVeiculos, adicionarTransacao } from '../js/data_manager.js'; // Ajuste o caminho conforme sua estrutura!

const ticketInput = document.getElementById('ticket-input');
const formPagamento = document.getElementById('form-pagamento');
const tempoDisplay = document.getElementById('tempo-permanencia');
const valorDisplay = document.getElementById('valor-a-pagar');
const btnPagar = document.getElementById('btn-pagar');

let veiculoAtual = null;

// Simples: R$5 por hora, R$1 a cada 15 minutos extras
const TARIFA_BASE_POR_HORA = 5.00; 

function calcularValor(horaEntrada) {
    const entrada = new Date(horaEntrada);
    const saida = new Date();
    const diffMs = saida - entrada; 
    
    const diffHoras = diffMs / (1000 * 60 * 60);

    const horas = Math.floor(diffHoras);
    const minutos = Math.floor((diffHoras - horas) * 60);
    const tempoFormatado = `${horas}h ${minutos}m`;

    const totalHorasArredondadas = Math.ceil(diffHoras); 
    const valor = totalHorasArredondadas * TARIFA_BASE_POR_HORA;
    
    return {
        tempo: tempoFormatado,
        valor: valor
    };
}


// READ (Busca do ticket)
ticketInput.addEventListener('input', function() {
    const codigoTicket = this.value.trim().toUpperCase();
    const veiculos = getVeiculos(); // Usa a função importada
    
    veiculoAtual = veiculos.find(v => v.ticket === codigoTicket);

    if (veiculoAtual) {
        const { tempo, valor } = calcularValor(veiculoAtual.horaEntrada);
        
        tempoDisplay.textContent = `⏱️ ${tempo}`;
        valorDisplay.textContent = `💲 R$ ${valor.toFixed(2).replace('.', ',')}`;
        btnPagar.disabled = false;
        btnPagar.textContent = `PAGAR R$ ${valor.toFixed(2).replace('.', ',')}`;
    } else {
        tempoDisplay.textContent = '⏱️ ---';
        valorDisplay.textContent = '💲 R$ 0,00';
        btnPagar.disabled = true;
        btnPagar.textContent = 'PAGAR';
    }
});

// DELETE (Saída e Remoção do registro)
formPagamento.addEventListener('submit', function(event) {
    event.preventDefault();

    if (veiculoAtual) {
        // 1. Obtém o valor a ser pago (e o converte para negativo)
        const valorPago = -parseFloat(valorDisplay.textContent.split(' ')[2].replace(',', '.')); 
        
        // 2. Registra a despesa na carteira do usuário (usando a função importada)
        const descricaoTransacao = `Pagamento Estacionamento (Placa ${veiculoAtual.placa})`;
        adicionarTransacao(descricaoTransacao, valorPago);

        // 3. Remove o veículo do estacionamento (DELETE)
        let veiculos = getVeiculos();
        veiculos = veiculos.filter(v => v.ticket !== veiculoAtual.ticket);
        saveVeiculos(veiculos); // Salva o estado atualizado do estacionamento

        alert(`Pagamento de R$ ${valorPago * -1} realizado com sucesso! Transação registrada.`);
        
        // 4. Limpa a interface após o pagamento
        veiculoAtual = null;
        ticketInput.value = '';
        ticketInput.dispatchEvent(new Event('input')); 
        
        // O usuário precisará recarregar a tela da Carteira para ver o histórico atualizado.
    } else {
        alert('Ticket inválido ou não encontrado.');
    }
});
