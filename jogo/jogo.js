 window.addEventListener('DOMContentLoaded', () => {
        const dificuldade = localStorage.getItem('dificuldadeSelecionada');
        console.log('Dificuldade selecionada:', dificuldade);

        // Exemplo: Muda o título ou inicia lógica de jogo com base na dificuldade
        const titulo = document.getElementById('titulo-jogo');
        titulo.textContent = `Sudoku - ${dificuldade.charAt(0).toUpperCase() + dificuldade.slice(1)}`;
      });