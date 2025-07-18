window.addEventListener("DOMContentLoaded", () => {
  const dificuldade = localStorage.getItem('dificuldadeSelecionada') || 'facil';
  preencherSudoku(dificuldade);

  // Ajusta o select para refletir a dificuldade salva
  const select = document.getElementById("dificuldade-select");
  if (select) {
    select.value = dificuldade;
    select.addEventListener("change", (e) => {
      const novaDificuldade = e.target.value;
      localStorage.setItem('dificuldadeSelecionada', novaDificuldade);
      preencherSudoku(novaDificuldade);
      segundos = 0; // reseta o timer
    });
  }

  iniciarTimer();
});

function gerarTabuleiroVazio() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

// ✅ GERADOR DE SUDOKU USANDO BACKTRACKING
function gerarSudokuCompleto() {
  const tabuleiro = gerarTabuleiroVazio();
  preencherTabuleiro(tabuleiro);
  return tabuleiro;
}

function preencherTabuleiro(tabuleiro) {
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function resolver(row = 0, col = 0) {
    if (row === 9) return true;
    if (col === 9) return resolver(row + 1, 0);

    if (tabuleiro[row][col] === 0) {
      shuffleArray(numeros);
      for (let num of numeros) {
        if (podeColocar(tabuleiro, row, col, num)) {
          tabuleiro[row][col] = num;
          if (resolver(row, col + 1)) return true;
          tabuleiro[row][col] = 0;
        }
      }
      return false;
    } else {
      return resolver(row, col + 1);
    }
  }

  resolver();
}

function podeColocar(tabuleiro, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[row][i] === num || tabuleiro[i][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (tabuleiro[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ✅ PREENCHER TABULEIRO COM BASE NA DIFICULDADE
function preencherSudoku(dificuldade) {
  const baseCompleta = gerarSudokuCompleto();
  let tabuleiro = JSON.parse(JSON.stringify(baseCompleta));

  let removals;
  if (dificuldade === 'facil') removals = 30;
  else if (dificuldade === 'medio') removals = 45;
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

// ✅ DESENHAR O TABULEIRO NA TELA
function desenharTabuleiro(matriz) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  matriz.forEach((linha, i) => {
    const tr = document.createElement("tr");
    linha.forEach((valor, j) => {
      const td = document.createElement("td");
      td.dataset.row = i;
      td.dataset.col = j;
      td.textContent = valor || "";
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

let celulaSelecionada = null;

function selecionarCelula(e) {
  limparDestaques();
  celulaSelecionada = e.target;
  if (!celulaSelecionada.classList.contains("fixo")) {
    destacarCelula(celulaSelecionada);
  }
}

function limparDestaques() {
  document.querySelectorAll(".destacado, .celula-selecionada").forEach(td => {
    td.classList.remove("destacado", "celula-selecionada");
  });
}

function destacarCelula(celula) {
  const row = parseInt(celula.dataset.row);
  const col = parseInt(celula.dataset.col);

  const tds = document.querySelectorAll("td");
  tds.forEach(td => {
    const r = parseInt(td.dataset.row);
    const c = parseInt(td.dataset.col);

    // Linha e coluna
    if (r === row || c === col) {
      td.classList.add("destacado");
    }

    // Bloco 3x3
    const blocoRow = Math.floor(row / 3);
    const blocoCol = Math.floor(col / 3);
    if (Math.floor(r / 3) === blocoRow && Math.floor(c / 3) === blocoCol) {
      td.classList.add("destacado");
    }
  });

  // Célula propriamente dita
  celula.classList.add("celula-selecionada");
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

function inserirNumero(valor) {
  if (pausado) return;
  if (celulaSelecionada && !celulaSelecionada.classList.contains('fixo')) {
    const estadoAtual = Array.from(document.querySelectorAll("td")).map(td => td.textContent);

    if (valor === "") {
      // Ao apagar, empilhe o estado atual no refazerStack
      refazerStack.push(estadoAtual);
    } else {
      // Ao inserir um número, salva no histórico e limpa o refazerStack
      salvarEstado();
      refazerStack = [];
    }

    celulaSelecionada.textContent = valor;
  }
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
  preencherSudoku(dificuldade);
  segundos = 0;
}

function selecionarDificuldade() {
  const dificuldade = prompt("Escolha: fácil, médio ou difícil").toLowerCase();
  if (["facil", "medio", "dificil"].includes(dificuldade)) {
    localStorage.setItem('dificuldadeSelecionada', dificuldade);
    location.reload();
  }
}