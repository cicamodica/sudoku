document.getElementById("btn-jogar").addEventListener("click", () => {
  const dificuldade = document.getElementById("dificuldade").value;
  localStorage.setItem("dificuldadeSelecionada", dificuldade);
  window.location.href = "jogo.html";
});


 window.addEventListener('DOMContentLoaded', () => {
        const dificuldade = localStorage.getItem('dificuldadeSelecionada');
        console.log('Dificuldade selecionada:', dificuldade);

        // Exemplo: Muda o título ou inicia lógica de jogo com base na dificuldade
        const titulo = document.getElementById('titulo-jogo');
        titulo.textContent = `Sudoku - ${dificuldade.charAt(0).toUpperCase() + dificuldade.slice(1)}`;
      });