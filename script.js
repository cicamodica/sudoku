const botoes = document.querySelectorAll(".botao-dificuldade");
const descricao = document.getElementById("descricao-dificuldade");
const btnJogar = document.getElementById("btn-jogar");
let dificuldadeSelecionada = null;

const descricoes = {
  facil: "Modo Fácil: mais números revelados, ideal para iniciantes.",
  medio: "Modo Médio: desafio equilibrado, para quem já conhece as regras.",
  dificil: "Modo Difícil: poucos números revelados, para jogadores experientes.",
};

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    // Remover seleção anterior
    botoes.forEach((b) => b.classList.remove("selected"));

    // Marcar o botão clicado
    botao.classList.add("selected");

    // Atualizar dificuldade
    dificuldadeSelecionada = botao.dataset.dificuldade;

    // Exibir descrição
    descricao.textContent = descricoes[dificuldadeSelecionada];

    // Ativar botão Jogar
    btnJogar.disabled = false;
  });
});

btnJogar.addEventListener("click", () => {
  if (dificuldadeSelecionada) {
    localStorage.setItem("dificuldadeSelecionada", dificuldadeSelecionada);
    window.location.href = "jogo/jogo.html";
  }
});
