// script_adm.js (Consolidado)

// --- CHAVES DO LOCAL STORAGE ---
const CONFIG_KEY = 'sistemaConfig';
const VEICULOS_KEY = 'estacionamentoData'; // Necessária para o Relatório

// --- FUNÇÕES DE ARMAZENAMENTO BASE ---

function getConfig() {
    const data = localStorage.getItem(CONFIG_KEY);
    // Configurações padrão (inicialização)
    const defaultConfig = {
        tarifaBaseHora: 5.00,
        tarifaAdicional: 2.00,
        descontoPercentual: 0 
    };
    
    return data ? JSON.parse(data) : defaultConfig;
}

function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// Funções para CRUD de Configuração
function getTarifaBase() {
    return getConfig().tarifaBaseHora;
}

function setTarifaBase(novoValor) {
    const config = getConfig();
    config.tarifaBaseHora = parseFloat(novoValor);
    saveConfig(config);
}

function setDescontoPercentual(novoPercentual) {
    const config = getConfig();
    config.descontoPercentual = parseInt(novoPercentual);
    saveConfig(config);
}

// Função de Veículos (para o Relatório) - READ
function getVeiculos() {
    const data = localStorage.getItem(VEICULOS_KEY);
    return data ? JSON.parse(data) : [];
}

// --------------------------------------------------------
// --- LÓGICA DE INTERAÇÃO (CRUD de Configuração) ---
// --------------------------------------------------------

const boxTarifas = document.getElementById('boxTarifas');
const boxDescontos = document.getElementById('boxDescontos');
const boxRelatorio = document.getElementById('boxRelatorio');

// 🔑 CRUD: UPDATE/READ - Gerenciamento de Tarifas
boxTarifas.addEventListener('click', () => {
    const tarifaAtual = getTarifaBase(); 
    
    const novoValorStr = prompt(`Tarifa base atual: R$ ${tarifaAtual.toFixed(2)}. Digite a nova tarifa base por hora:`);
    
    if (novoValorStr !== null) {
        // Substitui vírgula por ponto para garantir que o parse seja correto
        const novoValor = parseFloat(novoValorStr.replace(',', '.'));
        
        if (!isNaN(novoValor) && novoValor >= 0) {
            setTarifaBase(novoValor); 
            alert(`Tarifa base atualizada para R$ ${novoValor.toFixed(2)}.`);
        } else {
            alert("Valor inválido. Por favor, digite um número.");
        }
    }
});

// 🔑 CRUD: UPDATE/READ - Gerenciamento de Descontos
boxDescontos.addEventListener('click', () => {
    const config = getConfig();
    const descontoAtual = config.descontoPercentual;
    
    const novoPercentualStr = prompt(`Desconto percentual atual: ${descontoAtual}%. Digite o novo percentual de desconto (0 a 100):`);
    
    if (novoPercentualStr !== null) {
        const novoPercentual = parseInt(novoPercentualStr);
        
        if (!isNaN(novoPercentual) && novoPercentual >= 0 && novoPercentual <= 100) {
            setDescontoPercentual(novoPercentual); 
            alert(`Desconto percentual atualizado para ${novoPercentual}%.`);
        } else {
            alert("Valor inválido. Por favor, digite um número inteiro entre 0 e 100.");
        }
    }
});

// 🔑 CRUD: READ - Relatório (Lê os dados e mostra um resumo)
boxRelatorio.addEventListener('click', () => {
    const veiculos = getVeiculos(); 
    const config = getConfig();

    const totalVeiculos = veiculos.length;
    
    alert(`--- Relatório Rápido do Sistema ---
    Veículos Estacionados: ${totalVeiculos}
    Tarifa Base Atual: R$ ${config.tarifaBaseHora.toFixed(2)}
    Desconto Ativo: ${config.descontoPercentual}%
    `);
});

// --------------------------------------------------------
// --- LÓGICA DOS GRÁFICOS (READ) ---
// (CÓDIGO ORIGINAL COM PEQUENAS ADAPTAÇÕES)
// --------------------------------------------------------

// ================================
// GRÁFICO 1: USO (barras)
// ================================
const ctxUso = document.getElementById("graficoUso");

new Chart(ctxUso, {
    type: "bar",
    data: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex"],
        datasets: [{
            label: "Veículos",
            data: [15, 22, 35, 28, 40], // Estes dados seriam dinâmicos em um sistema real
            backgroundColor: [
                "rgba(0, 200, 255, 0.7)",
                "rgba(0, 150, 255, 0.7)",
                "rgba(0, 120, 255, 0.7)",
                "rgba(0, 100, 255, 0.7)",
                "rgba(0, 80, 255, 0.7)"
            ],
            borderRadius: 8,
            barPercentage: 0.8,
            categoryPercentage: 0.6
        }]
    },
    options: {
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255,255,255,0.1)" }
            },
            x: { grid: { display: false } }
        }
    }
});

// ================================
// GRÁFICO 2: RECEITAS (linha)
// ================================
const ctxReceitas = document.getElementById("graficoReceitas");

new Chart(ctxReceitas, {
    type: "line",
    data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        datasets: [{
            label: "Receita (R$)",
            data: [300, 450, 480, 520, 600, 750], // Estes dados seriam dinâmicos em um sistema real
            borderWidth: 3,
            fill: false,
            borderColor: "rgba(0, 200, 255, 0.8)",
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: "white"
        }]
    },
    options: {
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: "rgba(255,255,255,0.1)" } },
            x: { grid: { display: false } }
        }
    }
});
