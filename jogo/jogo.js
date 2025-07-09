window.addEventListener("DOMContentLoaded", () => {
const dificuldade = localStorage.getItem('dificuldadeSelecionada');
preencherSudoku(dificuldade || 'facil');

  // Exemplo: Muda o título ou inicia lógica de jogo com base na dificuldade
  const titulo = document.getElementById("titulo-jogo");
  titulo.textContent = `Sudoku - ${
    dificuldade.charAt(0).toUpperCase() + dificuldade.slice(1)
  }`;
});

function gerarTabuleiroVazio() {
  return Array.from({ length: 9 }, () => Array(9).fill(""));
}

// Simula um gerador aleatório simples por dificuldade
function preencherSudoku(dificuldade) {
  const baseCompleta = gerarSudokuCompleto(); // você pode usar um gerador real ou uma função mock
  let tabuleiro = JSON.parse(JSON.stringify(baseCompleta));

  let removals;
  if (dificuldade === 'facil') removals = 20;
  else if (dificuldade === 'medio') removals = 40;
  else if (dificuldade === 'dificil') removals = 55;

  for (let i = 0; i < removals; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (tabuleiro[row][col] === "");
    tabuleiro[row][col] = "";
  }

  desenharTabuleiro(tabuleiro);
}

function desenharTabuleiro(matriz) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  matriz.forEach((linha, i) => {
    const tr = document.createElement("tr");
    linha.forEach((valor, j) => {
      const td = document.createElement("td");
      td.dataset.row = i;
      td.dataset.col = j;
      td.textContent = valor;
      td.classList.add("celula");
      if (valor === "") {
        td.addEventListener("click", selecionarCelula);
      } else {
        td.classList.add("fixo");
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

let segundos = 0;
let timerInterval = null;
let pausado = false;

function iniciarTimer() {
  timerInterval = setInterval(() => {
    segundos++;
    atualizarTimer();
  }, 1000);
}

function atualizarTimer() {
  const min = String(Math.floor(segundos / 60)).padStart(2, '0');
  const sec = String(segundos % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
}

function togglePausa() {
  const botao = document.getElementById("btn-pausa");
  if (pausado) {
    iniciarTimer();
    botao.textContent = "Pausar";
    pausado = false;
  } else {
    clearInterval(timerInterval);
    botao.textContent = "Retomar";
    pausado = true;
  }
}

// Iniciar ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  iniciarTimer();
});

let celulaSelecionada = null;

function selecionarCelula(e) {
  celulaSelecionada = e.target;
}

function inserirNumero(valor) {
  if (celulaSelecionada && !celulaSelecionada.classList.contains('fixo')) {
    const estadoAtual = Array.from(document.querySelectorAll("td")).map(td => td.textContent);
    
    if (valor === '') {
      // Só salva no stack de refazer se for apagar
      refazerStack.push(estadoAtual);
    } else {
      salvarEstado(); // salva no histórico para possível desfazer
    }

    celulaSelecionada.textContent = valor;
  }
}

let historico = [], refazerStack = [];

function salvarEstado() {
  const estado = Array.from(document.querySelectorAll("td")).map(td => td.textContent);
  historico.push(estado);
}

function restaurarEstado(estado) {
  const tds = document.querySelectorAll("td");
  estado.forEach((valor, i) => tds[i].textContent = valor);
}

function refazerJogada() {
  if (refazerStack.length > 0) {
    const estado = refazerStack.pop();
    historico.push(Array.from(document.querySelectorAll("td")).map(td => td.textContent));
    restaurarEstado(estado);
  }
}

function novoJogo() {
  const dificuldade = localStorage.getItem('dificuldadeSelecionada') || 'facil';
  preencherSudoku(dificuldade); // regera nova tabela
  segundos = 0; // reseta timer
}

function selecionarDificuldade() {
  const dificuldade = prompt("Escolha: fácil, médio ou difícil").toLowerCase();
  if (["facil", "medio", "dificil"].includes(dificuldade)) {
    localStorage.setItem('dificuldadeSelecionada', dificuldade);
    location.reload();
  }
}