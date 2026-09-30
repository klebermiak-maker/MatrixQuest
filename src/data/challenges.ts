import { Challenge } from '../types/game';

export const CHALLENGES: Challenge[] = [
  // ==========================================
  // MÓDULO 1: O MAPA DAS COORDENADAS (1 a 5)
  // ==========================================
  {
    id: 1,
    module: 1,
    moduleName: 'Fundamentos de Matriz',
    title: 'O Baú na Ilha do Tesouro',
    category: 'foundations',
    interactionType: 'cell-pick',
    theme: 'island',
    description: 'Um pirata escondeu um baú de ouro na ilha! O mapa náutico é uma matriz com linhas e colunas. Clique exatamente na coordenada indicada pelo mapa.',
    bnccGoal: 'Compreender que uma matriz organiza elementos em linhas horizontais e colunas verticais, permitindo localizar qualquer objeto através do par de coordenadas.',
    rows: 4,
    cols: 5,
    targetCoords: [{ r: 1, c: 3 }], // Linha 2, Coluna 4 (0-index: r:1, c:3)
    coordinateTaskHint: 'Encontre o quadrado na Linha 2, Coluna 4.',
    initialBoard: {
      items: [
        { pos: { r: 1, c: 3 }, name: 'Baú do Tesouro', icon: '💎', color: 'amber' },
        { pos: { r: 0, c: 1 }, name: 'Palmeira', icon: '🌴' },
        { pos: { r: 2, c: 0 }, name: 'Palmeira', icon: '🌴' },
        { pos: { r: 3, c: 4 }, name: 'Barco Pirata', icon: '⛵' }
      ]
    },
    hints: [
      'Lembre-se: as Linhas são as faixas horizontais de cima para baixo (Linha 1, Linha 2...).',
      'As Colunas são as faixas verticais da esquerda para a direita (Coluna 1, Coluna 2, 3, 4...).',
      'Desça até a Linha 2 e caminhe para a direita até a Coluna 4!'
    ],
    successMessage: 'Incrível! Você encontrou o baú no ponto exato (Linha 2, Coluna 4)!',
    realWorldConnection: 'Mapas de GPS, Batalha Naval e o jogo de Xadrez utilizam essa mesma organização de linhas e colunas para encontrar qualquer lugar do mundo.'
  },
  {
    id: 2,
    module: 1,
    moduleName: 'Fundamentos de Matriz',
    title: 'Cinema das Estrelas: Reserva de Assentos',
    category: 'foundations',
    interactionType: 'cell-pick',
    theme: 'cinema',
    description: 'Três amigos compraram ingressos no cinema digital. Eles precisam sentar nas seguintes poltronas da matriz: (Linha 2, Coluna 2), (Linha 2, Coluna 3) e (Linha 3, Coluna 4). Clique nas 3 poltronas certas!',
    bnccGoal: 'Identificar múltiplos componentes organizados em matrizes bidimensionais do cotidiano, como assentos de teatro, cinema e estádios.',
    rows: 4,
    cols: 5,
    targetCoords: [
      { r: 1, c: 1 }, // Linha 2, Coluna 2
      { r: 1, c: 2 }, // Linha 2, Coluna 3
      { r: 2, c: 3 }  // Linha 3, Coluna 4
    ],
    coordinateTaskHint: 'Marque as 3 poltronas: [L2, C2], [L2, C3] e [L3, C4].',
    initialBoard: {
      items: [
        { pos: { r: 0, c: 0 }, name: 'Poltrona Ocupada', icon: '👤' },
        { pos: { r: 0, c: 4 }, name: 'Poltrona Ocupada', icon: '👤' },
        { pos: { r: 3, c: 1 }, name: 'Poltrona Ocupada', icon: '👤' }
      ]
    },
    hints: [
      'Veja os números das Linhas no lado esquerdo e das Colunas no topo.',
      'Primeiro localize a Linha 2: marque as colunas 2 e 3.',
      'Depois vá para a Linha 3: marque a coluna 4.'
    ],
    successMessage: 'Poltronas reservadas com sucesso! Todos os amigos sentaram nos lugares certos.',
    realWorldConnection: 'Aplicativos de compra de ingressos usam matrizes de dados para garantir que duas pessoas nunca comprem a mesma poltrona.'
  },
  {
    id: 3,
    module: 1,
    moduleName: 'Fundamentos de Matriz',
    title: 'A Estante da Biblioteca Encantada',
    category: 'foundations',
    interactionType: 'coordinate-quiz',
    theme: 'library',
    description: 'O livro de Robótica Dourado está guardado em um nicho da estante-matriz. Observe o tabuleiro e diga qual é a coordenada exata onde o livro dourado está guardado!',
    bnccGoal: 'Exercitar a leitura e interpretação de coordenadas a partir da observação visual de uma matriz organizada.',
    rows: 5,
    cols: 5,
    targetCoords: [{ r: 3, c: 1 }], // Linha 4, Coluna 2
    initialBoard: {
      items: [
        { pos: { r: 3, c: 1 }, name: 'Livro de Robótica Dourado', icon: '📘', color: 'amber' },
        { pos: { r: 1, c: 3 }, name: 'Livro de Ciências', icon: '📗' },
        { pos: { r: 0, c: 2 }, name: 'Livro de História', icon: '📕' },
        { pos: { r: 4, c: 4 }, name: 'Globo Terrestre', icon: '🌍' }
      ]
    },
    hints: [
      'Procure o livro azul com brilho dourado na estante.',
      'Olhe para o número da Linha na esquerda daquele livro.',
      'Olhe para o número da Coluna no topo daquele livro.'
    ],
    successMessage: 'Excelente dedução! O livro está na Linha 4, Coluna 2!',
    realWorldConnection: 'Bibliotecas e armazéns gigantes usam sistemas de endereçamento por matriz (corredor, prateleira, nível) para localizar milhares de itens em segundos.'
  },
  {
    id: 4,
    module: 1,
    moduleName: 'Fundamentos de Matriz',
    title: 'Primeiro Passo do Robô Byte',
    category: 'foundations',
    interactionType: 'navigation',
    theme: 'lab',
    description: 'O Robô Byte está na coordenada (Linha 1, Coluna 1) e precisa chegar até a bateria de recarga na coordenada (Linha 1, Coluna 5). Programe o caminho do robô usando comandos de direção!',
    bnccGoal: 'Navegar em uma dimensão da matriz (variação de colunas mantendo a linha fixa), introduzindo a linguagem de comandos e pensamento algorítmico.',
    rows: 3,
    cols: 5,
    startPos: { r: 0, c: 0 },
    startDir: 'right',
    targetPos: { r: 0, c: 4 },
    allowedCommands: ['right', 'left', 'up', 'down'],
    maxCommands: 4,
    hints: [
      'O Robô Byte já está virado para a direita.',
      'Conte quantas casas faltam para chegar até a bateria de energia: 1, 2, 3, 4 passos!',
      'Use 4 comandos de "Direita" e clique em "Executar Programa".'
    ],
    successMessage: 'Bateria recarregada! Você criou seu primeiro algoritmo de navegação em matriz!',
    realWorldConnection: 'Robôs industriais e carros autônomos seguem sequências ordenadas de coordenadas para se deslocar com máxima precisão.'
  },
  {
    id: 5,
    module: 1,
    moduleName: 'Fundamentos de Matriz',
    title: 'O Pomar da Fazenda: Desvio de Cercas',
    category: 'foundations',
    interactionType: 'navigation',
    theme: 'farm',
    description: 'Ajude o trator agrícola a colher todas as 2 cestas de frutas nas coordenadas da fazenda, desviando das cercas de madeira!',
    bnccGoal: 'Navegar em duas dimensões (linhas e colunas simultaneamente) contornando restrições espaciais (obstáculos).',
    rows: 4,
    cols: 5,
    startPos: { r: 0, c: 0 },
    startDir: 'right',
    targetCoords: [
      { r: 0, c: 3 }, // Maçã 1
      { r: 3, c: 3 }  // Maçã 2
    ],
    obstacles: [
      { r: 1, c: 1 },
      { r: 1, c: 2 },
      { r: 1, c: 3 }
    ],
    initialBoard: {
      walls: [
        { r: 1, c: 1 },
        { r: 1, c: 2 },
        { r: 1, c: 3 }
      ],
      items: [
        { pos: { r: 0, c: 3 }, name: 'Cesta de Maçãs', icon: '🍎' },
        { pos: { r: 3, c: 3 }, name: 'Cesta de Laranjas', icon: '🍊' }
      ]
    },
    allowedCommands: ['right', 'left', 'up', 'down'],
    hints: [
      'Cuidado com a cerca de madeira na Linha 2!',
      'Você pode ir para a direita pela Linha 1 para pegar a primeira maçã.',
      'Depois contorne pelo lado direito (desça pela Coluna 5 ou 4) para alcançar a cesta na Linha 4!'
    ],
    successMessage: 'Todas as frutas colhidas e nenhuma cerca derrubada! Sensacional!',
    realWorldConnection: 'Tratores modernos usam computação na agricultura de precisão para navegar pelo campo colhendo sem danificar as plantas vizinhas.'
  },

  // ==========================================
  // MÓDULO 2: MANIPULAÇÃO DE IMAGENS & PIXELS (6 a 10)
  // ==========================================
  {
    id: 6,
    module: 2,
    moduleName: 'Imagens Digitais & Pixel Art',
    title: 'Pixel Art: O Coração Digital',
    category: 'pixel-art',
    interactionType: 'pixel-draw',
    theme: 'pixel',
    description: 'Sabia que a tela do computador ou celular é uma matriz gigante de pontinhos chamados PIXELS? Pinte os pixels vermelhos nas coordenadas certas para formar um coração 5x5!',
    bnccGoal: 'Reconhecer que imagens digitais são representadas por matrizes onde cada pixel possui uma coordenada e um valor de cor.',
    rows: 5,
    cols: 5,
    targetCoords: [
      { r: 1, c: 1 }, { r: 1, c: 3 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 },
      { r: 3, c: 1 }, { r: 3, c: 2 }, { r: 3, c: 3 },
      { r: 4, c: 2 }
    ],
    coordinateTaskHint: 'Pinte os 11 pixels do coração de acordo com a silhueta guia.',
    initialBoard: {
      targetPixels: [
        { pos: { r: 1, c: 1 }, color: '#EF4444' },
        { pos: { r: 1, c: 3 }, color: '#EF4444' },
        { pos: { r: 2, c: 0 }, color: '#EF4444' },
        { pos: { r: 2, c: 1 }, color: '#EF4444' },
        { pos: { r: 2, c: 2 }, color: '#EF4444' },
        { pos: { r: 2, c: 3 }, color: '#EF4444' },
        { pos: { r: 2, c: 4 }, color: '#EF4444' },
        { pos: { r: 3, c: 1 }, color: '#EF4444' },
        { pos: { r: 3, c: 2 }, color: '#EF4444' },
        { pos: { r: 3, c: 3 }, color: '#EF4444' },
        { pos: { r: 4, c: 2 }, color: '#EF4444' }
      ]
    },
    hints: [
      'Clique nos quadrados que possuem a marcação do coração para pintá-los de vermelho.',
      'Na Linha 2, pinte as colunas 2 e 4.',
      'Na Linha 3, pinte todas as colunas de 1 a 5!',
      'Na Linha 4, pinte as colunas 2, 3 e 4. Na Linha 5, apenas o centro (coluna 3).'
    ],
    successMessage: 'Coração desenhado com perfeição! Você construiu uma imagem digital usando coordenadas de matriz!',
    realWorldConnection: 'Telas de alta definição (como Full HD e 4K) têm milhões de pixels organizados em matrizes de linhas e colunas acendendo luzes coloridas.'
  },
  {
    id: 7,
    module: 2,
    moduleName: 'Imagens Digitais & Pixel Art',
    title: 'Matriz Binária: A Letra C',
    category: 'pixel-art',
    interactionType: 'pixel-draw',
    theme: 'pixel',
    description: 'Dentro do computador, as imagens são salvas com números: 1 significa "pixel aceso" e 0 significa "pixel apagado". Acenda os pixels com valor 1 para formar a letra C!',
    bnccGoal: 'Compreender a representação de dados binários em matrizes (ligado/desligado, 1/0) para formar caracteres e glifos.',
    rows: 5,
    cols: 5,
    targetCoords: [
      { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 },
      { r: 1, c: 0 },
      { r: 2, c: 0 },
      { r: 3, c: 0 },
      { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }
    ],
    coordinateTaskHint: 'Acenda os pixels onde o valor é 1 para desenhar a letra C.',
    initialBoard: {
      targetPixels: [
        { pos: { r: 0, c: 1 }, color: '#3B82F6' },
        { pos: { r: 0, c: 2 }, color: '#3B82F6' },
        { pos: { r: 0, c: 3 }, color: '#3B82F6' },
        { pos: { r: 1, c: 0 }, color: '#3B82F6' },
        { pos: { r: 2, c: 0 }, color: '#3B82F6' },
        { pos: { r: 3, c: 0 }, color: '#3B82F6' },
        { pos: { r: 4, c: 1 }, color: '#3B82F6' },
        { pos: { r: 4, c: 2 }, color: '#3B82F6' },
        { pos: { r: 4, c: 3 }, color: '#3B82F6' }
      ]
    },
    hints: [
      'A letra C tem uma barra superior na Linha 1 (colunas 2, 3, 4).',
      'Tem uma barra vertical na Coluna 1 (linhas 2, 3 e 4).',
      'E uma barra inferior na Linha 5 (colunas 2, 3, 4).'
    ],
    successMessage: 'Letra C renderizada! É exatamente assim que os computadores mostram letras na tela.',
    realWorldConnection: 'Painéis de ônibus e placares de estádios de futebol funcionam com matrizes de LEDs que ligam e desligam para formar palavras.'
  },
  {
    id: 8,
    module: 2,
    moduleName: 'Imagens Digitais & Pixel Art',
    title: 'Translação: Movendo Objetos na Tela',
    category: 'pixel-art',
    interactionType: 'matrix-transform',
    theme: 'space',
    description: 'Em jogos de videogame, quando você aperta para andar, o jogo faz uma "translação de matriz": soma nas coordenadas! A nave espacial azul precisa se mover 2 colunas para a direita (+2 nas colunas). Selecione as novas coordenadas da nave!',
    bnccGoal: 'Efetuar manipulações simples sobre representações matriciais (translação de coordenadas x + d).',
    rows: 5,
    cols: 6,
    // Original shape: Top at (1, 1), Left at (2, 0), Center at (2, 1), Right at (2, 2)
    // Shifted +2 cols: Top at (1, 3), Left at (2, 2), Center at (2, 3), Right at (2, 4)
    targetCoords: [
      { r: 1, c: 3 },
      { r: 2, c: 2 },
      { r: 2, c: 3 },
      { r: 2, c: 4 }
    ],
    coordinateTaskHint: 'Marque a nave na nova posição (cada ponto somou +2 na coluna).',
    initialBoard: {
      pixels: [
        { pos: { r: 1, c: 1 }, color: '#93C5FD' },
        { pos: { r: 2, c: 0 }, color: '#93C5FD' },
        { pos: { r: 2, c: 1 }, color: '#93C5FD' },
        { pos: { r: 2, c: 2 }, color: '#93C5FD' }
      ]
    },
    hints: [
      'Olhe para o topo da nave original: estava na Linha 2, Coluna 2.',
      'Somando +2 na coluna: Coluna 2 + 2 = Coluna 4!',
      'Mantenha a mesma forma da nave, só desenhando-a duas casas mais à direita!'
    ],
    successMessage: 'Translação realizada com sucesso! A nave voou 2 coordenadas à frente!',
    realWorldConnection: 'Motores de jogos 2D e 3D (como os usados em Minecraft e Roblox) usam matemática de matriz para mover personagens na tela a cada milissegundo.'
  },
  {
    id: 9,
    module: 2,
    moduleName: 'Imagens Digitais & Pixel Art',
    title: 'Simetria e Espelhamento na Matriz',
    category: 'pixel-art',
    interactionType: 'pixel-draw',
    theme: 'farm',
    description: 'A asa esquerda da borboleta já está desenhada na matriz! Complete o desenho espelhando os mesmos pixels na asa direita. A linha central da matriz funciona como um espelho!',
    bnccGoal: 'Reconhecer simetria e relações de espelhamento em matrizes (reflexão em relação ao eixo central).',
    rows: 5,
    cols: 5,
    targetCoords: [
      // Left wing (already there or to complete)
      { r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 0 }, { r: 3, c: 1 },
      // Body center
      { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 4, c: 2 },
      // Right wing (reflection)
      { r: 0, c: 4 }, { r: 1, c: 3 }, { r: 2, c: 4 }, { r: 3, c: 3 }
    ],
    coordinateTaskHint: 'Pinte a asa direita da borboleta espelhando a esquerda.',
    initialBoard: {
      pixels: [
        { pos: { r: 0, c: 0 }, color: '#A855F7' },
        { pos: { r: 1, c: 1 }, color: '#A855F7' },
        { pos: { r: 2, c: 0 }, color: '#A855F7' },
        { pos: { r: 3, c: 1 }, color: '#A855F7' },
        { pos: { r: 0, c: 2 }, color: '#1E293B' },
        { pos: { r: 1, c: 2 }, color: '#1E293B' },
        { pos: { r: 2, c: 2 }, color: '#1E293B' },
        { pos: { r: 3, c: 2 }, color: '#1E293B' },
        { pos: { r: 4, c: 2 }, color: '#1E293B' }
      ]
    },
    hints: [
      'A coluna central do corpo é a Coluna 3.',
      'O pixel na Coluna 1 da esquerda espelha na Coluna 5 da direita.',
      'O pixel na Coluna 2 da esquerda espelha na Coluna 4 da direita.'
    ],
    successMessage: 'Borboleta simétrica perfeita! As duas asas ficaram com coordenadas equilibradas.',
    realWorldConnection: 'Designers de personagens e filtros de câmera (como Instagram e TikTok) utilizam espelhamento de matriz para criar rostos e máscaras simétricas.'
  },
  {
    id: 10,
    module: 2,
    moduleName: 'Imagens Digitais & Pixel Art',
    title: 'Caça ao Bug: Glitch na Imagem Digital',
    category: 'pixel-art',
    interactionType: 'cell-pick',
    theme: 'lab',
    description: 'Um patinho amarelo em pixel art sofreu um "glitch" (bug na transmissão). Há um pixel com a cor errada (roxo em vez de amarelo) estragando o desenho. Encontre a coordenada do bug e clique nele para consertar!',
    bnccGoal: 'Identificar inconsistências e erros em matrizes visuais através do par ordenado de coordenadas.',
    rows: 5,
    cols: 5,
    targetCoords: [{ r: 2, c: 2 }], // Linha 3, Coluna 3
    coordinateTaskHint: 'Clique no pixel roxo intruso no meio do patinho amarelo.',
    initialBoard: {
      pixels: [
        { pos: { r: 0, c: 2 }, color: '#FACC15' }, { pos: { r: 0, c: 3 }, color: '#FACC15' },
        { pos: { r: 1, c: 2 }, color: '#FACC15' }, { pos: { r: 1, c: 3 }, color: '#FACC15' }, { pos: { r: 1, c: 4 }, color: '#EA580C' },
        { pos: { r: 2, c: 1 }, color: '#FACC15' }, { pos: { r: 2, c: 2 }, color: '#A855F7' }, { pos: { r: 2, c: 3 }, color: '#FACC15' },
        { pos: { r: 3, c: 1 }, color: '#FACC15' }, { pos: { r: 3, c: 2 }, color: '#FACC15' }, { pos: { r: 3, c: 3 }, color: '#FACC15' },
        { pos: { r: 4, c: 2 }, color: '#EA580C' }
      ]
    },
    hints: [
      'Procure o pontinho com a cor roxa.',
      'Veja em qual Linha e Coluna ele está: Linha 3, Coluna 3!',
      'Clique no pixel roxo para corrigi-lo para amarelo.'
    ],
    successMessage: 'Bug corrigido com sucesso! A imagem digital do patinho voltou a ficar perfeita.',
    realWorldConnection: 'Câmeras digitais possuem algoritmos automáticos que identificam "dead pixels" (pixels com defeito na matriz do sensor) e corrigem a foto instantaneamente.'
  },

  // ==========================================
  // MÓDULO 3: PENSAMENTO COMPUTACIONAL & ALGORITMOS (11 a 15)
  // ==========================================
  {
    id: 11,
    module: 3,
    moduleName: 'Algoritmos & Navegação',
    title: 'O Robô Aspirador Autônomo',
    category: 'algorithms',
    interactionType: 'navigation',
    theme: 'lab',
    description: 'Programe o robô aspirador para limpar todas as 3 sujeiras na sala sem bater na mesa central!',
    bnccGoal: 'Construir sequências lógicas estruturadas de passos (algoritmos) para visitar múltiplas posições definidas por coordenadas na matriz.',
    rows: 4,
    cols: 4,
    startPos: { r: 0, c: 0 },
    startDir: 'right',
    targetCoords: [
      { r: 0, c: 3 },
      { r: 3, c: 3 },
      { r: 3, c: 0 }
    ],
    obstacles: [
      { r: 1, c: 1 }, { r: 1, c: 2 },
      { r: 2, c: 1 }, { r: 2, c: 2 }
    ],
    initialBoard: {
      walls: [
        { r: 1, c: 1 }, { r: 1, c: 2 },
        { r: 2, c: 1 }, { r: 2, c: 2 }
      ],
      items: [
        { pos: { r: 0, c: 3 }, name: 'Sujeira 1', icon: '🧹' },
        { pos: { r: 3, c: 3 }, name: 'Sujeira 2', icon: '🧹' },
        { pos: { r: 3, c: 0 }, name: 'Sujeira 3', icon: '🧹' }
      ]
    },
    allowedCommands: ['right', 'down', 'left', 'up'],
    hints: [
      'A mesa ocupa o centro da sala nas linhas 2 e 3.',
      'O caminho pelas bordas limpa toda a sala!',
      'Avance para a direita até o canto superior, desça até o canto inferior e vire à esquerda até o último canto.'
    ],
    successMessage: 'Sala brilhando! O robô aspirou todas as coordenadas com perfeição.',
    realWorldConnection: 'Robôs aspiradores reais usam sensores a laser (LIDAR) para criar uma matriz interna do chão da sua casa e planejar a rota mais eficiente.'
  },
  {
    id: 12,
    module: 3,
    moduleName: 'Algoritmos & Navegação',
    title: 'Missão de Resgate: Drone na Cidade',
    category: 'algorithms',
    interactionType: 'navigation',
    theme: 'city',
    description: 'Um gatinho subiu no terraço do prédio na coordenada (Linha 1, Coluna 5). Conduza o drone de resgate saindo de (Linha 4, Coluna 1) desviando dos prédios altos!',
    bnccGoal: 'Planejar rotas com curvas e mudanças de direção em planos quadriculados com obstáculos.',
    rows: 5,
    cols: 5,
    startPos: { r: 3, c: 0 },
    startDir: 'up',
    targetPos: { r: 0, c: 4 },
    obstacles: [
      { r: 1, c: 1 }, { r: 2, c: 1 },
      { r: 2, c: 3 }, { r: 3, c: 3 }
    ],
    initialBoard: {
      walls: [
        { r: 1, c: 1 }, { r: 2, c: 1 },
        { r: 2, c: 3 }, { r: 3, c: 3 }
      ],
      items: [
        { pos: { r: 0, c: 4 }, name: 'Gatinho Miau', icon: '🐱', color: 'amber' }
      ]
    },
    allowedCommands: ['up', 'down', 'left', 'right'],
    hints: [
      'Suba pela Coluna 1 até a Linha 1.',
      'Depois siga em linha reta para a direita até a Coluna 5!',
      'Ou faça o ziguezague pelo meio da avenida.'
    ],
    successMessage: 'Miau são e salvo! O drone pousou com segurança nas coordenadas do resgate.',
    realWorldConnection: 'Drones de entrega de medicamentos em áreas rurais navegam usando coordenadas tridimensionais (latitude, longitude e altitude).'
  },
  {
    id: 13,
    module: 3,
    moduleName: 'Algoritmos & Navegação',
    title: 'Otimização de Rota: O Menor Caminho',
    category: 'algorithms',
    interactionType: 'navigation',
    theme: 'island',
    description: 'O mascote precisa chegar à caverna de cristal na coordenada (Linha 4, Coluna 4). Mas a bateria só aguenta no MÁXIMO 6 comandos! Encontre o caminho mais curto e eficiente!',
    bnccGoal: 'Desenvolver a habilidade de otimização de algoritmos (eficiência de passos na matriz).',
    rows: 4,
    cols: 4,
    startPos: { r: 0, c: 0 },
    startDir: 'right',
    targetPos: { r: 3, c: 3 },
    obstacles: [
      { r: 0, c: 2 },
      { r: 2, c: 1 }
    ],
    initialBoard: {
      walls: [
        { r: 0, c: 2 },
        { r: 2, c: 1 }
      ],
      items: [
        { pos: { r: 3, c: 3 }, name: 'Caverna de Cristal', icon: '🔮' }
      ]
    },
    allowedCommands: ['right', 'down', 'left', 'up'],
    maxCommands: 6,
    hints: [
      'Para ir de (Linha 1, Coluna 1) até (Linha 4, Coluna 4), você precisa de exatamente 3 passos para baixo e 3 passos para a direita (3 + 3 = 6 passos)!',
      'Desça 1 vez, vá 2 vezes para a direita, desça 2 vezes e vá 1 para a direita!',
      'Qualquer volta a mais gastará mais de 6 comandos.'
    ],
    successMessage: 'Algoritmo ultra-otimizado! 6 passos exatos sem nenhum desperdício de energia!',
    realWorldConnection: 'Algoritmos de GPS como Waze e Google Maps calculam constantemente o caminho mais curto na matriz de ruas da cidade para economizar combustível.'
  },
  {
    id: 14,
    module: 3,
    moduleName: 'Algoritmos & Navegação',
    title: 'Radar de Obstáculos: Caminho Seguro',
    category: 'algorithms',
    interactionType: 'coordinate-quiz',
    theme: 'space',
    description: 'Um asteroide gigante está bloqueando uma das rotas espaciais. Observe a imagem do radar e responda: em qual coordenada está o asteroide perigoso?',
    bnccGoal: 'Localizar obstáculos críticos e isolar coordenadas de risco em matrizes de detecção.',
    rows: 5,
    cols: 5,
    targetCoords: [{ r: 2, c: 3 }], // Linha 3, Coluna 4
    initialBoard: {
      items: [
        { pos: { r: 2, c: 3 }, name: 'Asteroide Gigante', icon: '☄️', color: 'red' },
        { pos: { r: 0, c: 1 }, name: 'Estrela Guia', icon: '⭐' },
        { pos: { r: 4, c: 2 }, name: 'Satélite Amigo', icon: '🛰️' }
      ]
    },
    hints: [
      'Procure o meteoro/asteroide em chamas.',
      'Siga com o dedo para a esquerda para achar a Linha (Linha 3).',
      'Siga com o dedo para cima para achar a Coluna (Coluna 4).'
    ],
    successMessage: 'Coordenada identificada com precisão militar! Rota espacial recalculada com segurança.',
    realWorldConnection: 'A NASA e a Estação Espacial Internacional usam matrizes de rastreamento para desviar de lixo espacial e pequenos meteoros.'
  },
  {
    id: 15,
    module: 3,
    moduleName: 'Algoritmos & Navegação',
    title: 'O Poder do Loop: Repetição no Grid',
    category: 'algorithms',
    interactionType: 'navigation',
    theme: 'farm',
    description: 'Na programação, quando fazemos a mesma coisa muitas vezes, usamos um "LOOP" (repetição). Ajude o robô fazendeiro a plantar sementes em toda a Linha 3!',
    bnccGoal: 'Compreender o conceito de repetição (laço/loop) ao percorrer posições sequenciais na mesma linha da matriz.',
    rows: 4,
    cols: 5,
    startPos: { r: 2, c: 0 },
    startDir: 'right',
    targetCoords: [
      { r: 2, c: 1 },
      { r: 2, c: 2 },
      { r: 2, c: 3 },
      { r: 2, c: 4 }
    ],
    initialBoard: {
      items: [
        { pos: { r: 2, c: 1 }, name: 'Canteiro 1', icon: '🌱' },
        { pos: { r: 2, c: 2 }, name: 'Canteiro 2', icon: '🌱' },
        { pos: { r: 2, c: 3 }, name: 'Canteiro 3', icon: '🌱' },
        { pos: { r: 2, c: 4 }, name: 'Canteiro 4', icon: '🌱' }
      ]
    },
    allowedCommands: ['right', 'action', 'loop_repeat'],
    hints: [
      'Você pode usar o comando "Repetir 4x: [Direita]"!',
      'Ou adicionar 4 passos de Direita seguidos.',
      'Veja como um padrão repetido percorre todas as colunas daquela linha!'
    ],
    successMessage: 'Canteiro 100% plantado! Você descobriu como os loops facilitam a programação em matrizes!',
    realWorldConnection: 'Em computação gráfica, quando o computador desenha uma linha horizontal na tela, ele roda um loop "para cada coluna de 1 até N, pinte o pixel".'
  },

  // ==========================================
  // MÓDULO 4: APLICAÇÕES DO MUNDO REAL (16 a 20)
  // ==========================================
  {
    id: 16,
    module: 4,
    moduleName: 'Aplicações no Mundo Real & Espaço',
    title: 'Satélite Ambiental: Coordenadas de Reflorestamento',
    category: 'real-world',
    interactionType: 'cell-pick',
    theme: 'farm',
    description: 'A imagem de satélite 6x6 identificou 3 áreas secas que precisam de sementes urgentes. Clique nas coordenadas das 3 áreas de solo seco marcadas com terra árida!',
    bnccGoal: 'Aplicar representação matricial na interpretação de imagens de satélite e dados geográficos reais.',
    rows: 6,
    cols: 6,
    targetCoords: [
      { r: 1, c: 2 }, // L2, C3
      { r: 3, c: 4 }, // L4, C5
      { r: 4, c: 1 }  // L5, C2
    ],
    coordinateTaskHint: 'Marque as 3 coordenadas de solo seco: [L2, C3], [L4, C5] e [L5, C2].',
    initialBoard: {
      items: [
        { pos: { r: 1, c: 2 }, name: 'Solo Seco', icon: '🍂', color: 'amber' },
        { pos: { r: 3, c: 4 }, name: 'Solo Seco', icon: '🍂', color: 'amber' },
        { pos: { r: 4, c: 1 }, name: 'Solo Seco', icon: '🍂', color: 'amber' },
        { pos: { r: 0, c: 0 }, name: 'Floresta Densa', icon: '🌲' },
        { pos: { r: 2, c: 2 }, name: 'Floresta Densa', icon: '🌳' },
        { pos: { r: 5, c: 5 }, name: 'Rio de Água Doce', icon: '💧' }
      ]
    },
    hints: [
      'Procure as folhinhas secas marrons no mapa de satélite.',
      'A primeira está na Linha 2, Coluna 3.',
      'A segunda na Linha 4, Coluna 5.',
      'A terceira na Linha 5, Coluna 2.'
    ],
    successMessage: 'Drones de sementes despachados com sucesso! O reflorestamento está garantido!',
    realWorldConnection: 'O Instituto Nacional de Pesquisas Espaciais (INPE) analisa matrizes de imagens de satélites diariamente para proteger a Floresta Amazônica.'
  },
  {
    id: 17,
    module: 4,
    moduleName: 'Aplicações no Mundo Real & Espaço',
    title: 'Armazém Inteligente de Logística',
    category: 'real-world',
    interactionType: 'navigation',
    theme: 'city',
    description: 'No centro de entregas, o robô transportador precisa pegar a encomenda na entrada (Linha 5, Coluna 1) e levá-la até o caminhão de despacho na coordenada (Linha 1, Coluna 5), sem colidir com as empilhadeiras!',
    bnccGoal: 'Resolver problemas reais de logística e roteamento em armazéns automatizados usando grids.',
    rows: 5,
    cols: 5,
    startPos: { r: 4, c: 0 },
    startDir: 'up',
    targetPos: { r: 0, c: 4 },
    obstacles: [
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 },
      { r: 1, c: 4 }, { r: 3, c: 4 }
    ],
    initialBoard: {
      walls: [
        { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 },
        { r: 1, c: 4 }, { r: 3, c: 4 }
      ],
      items: [
        { pos: { r: 0, c: 4 }, name: 'Caminhão de Entrega', icon: '🚚' }
      ]
    },
    allowedCommands: ['up', 'down', 'left', 'right'],
    hints: [
      'Há uma esteira bloqueando a Linha 3 à esquerda.',
      'Siga para a direita até a Coluna 4 para poder subir em segurança!',
      'Depois entre na baía de carga do caminhão na Coluna 5.'
    ],
    successMessage: 'Pacote entregue no caminhão! Logística 100% automatizada e sem atrasos.',
    realWorldConnection: 'Centros de distribuição de grandes lojas virtuais contam com milhares de robôs autônomos que navegam em matrizes desenhadas no chão.'
  },
  {
    id: 18,
    module: 4,
    moduleName: 'Aplicações no Mundo Real & Espaço',
    title: 'Estufa Inteligente: Irrigação de Precisão',
    category: 'real-world',
    interactionType: 'cell-pick',
    theme: 'farm',
    description: 'Os sensores de umidade avisaram que apenas as plantas nas seguintes coordenadas estão precisando de água: (Linha 1, Coluna 3), (Linha 3, Coluna 1) e (Linha 4, Coluna 4). Clique nelas para ligar a irrigação!',
    bnccGoal: 'Realizar filtragem e ativação seletiva de elementos em uma matriz baseando-se em condições lógicas.',
    rows: 5,
    cols: 5,
    targetCoords: [
      { r: 0, c: 2 },
      { r: 2, c: 0 },
      { r: 3, c: 3 }
    ],
    coordinateTaskHint: 'Ative a água nas coordenadas: [L1, C3], [L3, C1] e [L4, C4].',
    initialBoard: {
      items: [
        { pos: { r: 0, c: 2 }, name: 'Planta com Sede', icon: '🥀', color: 'red' },
        { pos: { r: 2, c: 0 }, name: 'Planta com Sede', icon: '🥀', color: 'red' },
        { pos: { r: 3, c: 3 }, name: 'Planta com Sede', icon: '🥀', color: 'red' },
        { pos: { r: 1, c: 1 }, name: 'Planta Hidratada', icon: '🪴' },
        { pos: { r: 4, c: 2 }, name: 'Planta Hidratada', icon: '🪴' }
      ]
    },
    hints: [
      'Economize água! Só clique nas florzinhas murchas que pediram irrigação.',
      'Linha 1, Coluna 3.',
      'Linha 3, Coluna 1.',
      'Linha 4, Coluna 4.'
    ],
    successMessage: 'Plantas regadas na medida exata! Nenhuma gota de água foi desperdiçada.',
    realWorldConnection: 'Sistemas modernos de Internet das Coisas (IoT) conectam sensores em matriz a válvulas inteligentes para economizar até 70% de água na agricultura.'
  },
  {
    id: 19,
    module: 4,
    moduleName: 'Aplicações no Mundo Real & Espaço',
    title: 'Rover Marciano: Coleta de Amostras',
    category: 'real-world',
    interactionType: 'navigation',
    theme: 'space',
    description: 'O Rover da NASA pousou em Marte e recebeu do centro de comando 3 coordenadas geológicas ricas em minerais raros. Conduza o robô para recolher as 3 amostras marcianas!',
    bnccGoal: 'Traçar rota otimizada em grid para cumprir múltiplos objetivos em coordenadas sequenciais.',
    rows: 5,
    cols: 5,
    startPos: { r: 0, c: 0 },
    startDir: 'right',
    targetCoords: [
      { r: 0, c: 4 }, // Rocha 1
      { r: 2, c: 2 }, // Rocha 2
      { r: 4, c: 4 }  // Rocha 3
    ],
    obstacles: [
      { r: 1, c: 1 }, { r: 1, c: 3 },
      { r: 3, c: 1 }, { r: 3, c: 3 }
    ],
    initialBoard: {
      walls: [
        { r: 1, c: 1 }, { r: 1, c: 3 },
        { r: 3, c: 1 }, { r: 3, c: 3 }
      ],
      items: [
        { pos: { r: 0, c: 4 }, name: 'Mineral Vermelho', icon: '💎' },
        { pos: { r: 2, c: 2 }, name: 'Cristal Marciano', icon: '💠' },
        { pos: { r: 4, c: 4 }, name: 'Meteorito de Ferro', icon: '⭐' }
      ]
    },
    allowedCommands: ['right', 'down', 'left', 'up'],
    hints: [
      'Colete primeiro o mineral na Linha 1, Coluna 5.',
      'Depois contorne a cratera e vá até o cristal no centro (Linha 3, Coluna 3).',
      'Por fim, desça até a última rocha na Linha 5, Coluna 5!'
    ],
    successMessage: 'Amostras de Marte coletadas com sucesso! Descoberta científica histórica!',
    realWorldConnection: 'Os rovers Perseverance e Curiosity na superfície de Marte recebem programas com trajetórias em grid uma vez por dia, pois o sinal de rádio demora minutos para viajar da Terra até lá.'
  },
  {
    id: 20,
    module: 4,
    moduleName: 'Aplicações no Mundo Real & Espaço',
    title: 'O Grande Mestre da Matriz: Missão Cósmica Final',
    category: 'real-world',
    interactionType: 'navigation',
    theme: 'space',
    description: 'Desafio Final do 4º Ano! Programe o explorador espacial para coletar os 3 cristais de hiperespaço em suas coordenadas secretas, desviar dos campos de asteroides e embarcar no foguete de lançamento!',
    bnccGoal: 'Síntese de todas as habilidades da habilidade EF04CO01: representação de objetos em matriz, leitura e interpretação de coordenadas, restrições espaciais e pensamento computacional completo.',
    rows: 6,
    cols: 6,
    startPos: { r: 5, c: 0 },
    startDir: 'up',
    targetCoords: [
      { r: 4, c: 2 },
      { r: 1, c: 1 },
      { r: 2, c: 4 }
    ],
    targetPos: { r: 0, c: 5 }, // Foguete final
    obstacles: [
      { r: 3, c: 1 }, { r: 3, c: 2 },
      { r: 2, c: 3 }, { r: 1, c: 3 },
      { r: 4, c: 4 }
    ],
    initialBoard: {
      walls: [
        { r: 3, c: 1 }, { r: 3, c: 2 },
        { r: 2, c: 3 }, { r: 1, c: 3 },
        { r: 4, c: 4 }
      ],
      items: [
        { pos: { r: 4, c: 2 }, name: 'Cristal Alfa', icon: '🔮' },
        { pos: { r: 1, c: 1 }, name: 'Cristal Beta', icon: '💎' },
        { pos: { r: 2, c: 4 }, name: 'Cristal Gama', icon: '💠' },
        { pos: { r: 0, c: 5 }, name: 'Foguete Cósmico', icon: '🚀' }
      ]
    },
    allowedCommands: ['up', 'right', 'down', 'left'],
    hints: [
      'Suba e pegue o Cristal Alfa em (Linha 5, Coluna 3).',
      'Vá para a esquerda e suba até o Cristal Beta em (Linha 2, Coluna 2).',
      'Atravesse para a direita acima do asteroide e pegue o Cristal Gama em (Linha 3, Coluna 5).',
      'Suba até o foguete em (Linha 1, Coluna 6) para a decolagem!'
    ],
    successMessage: 'PARABÉNS! VOCÊ É O GRANDE MESTRE DA MATRIZ! Conquistou todos os 20 desafios com maestria em pensamento computacional e coordenadas!',
    realWorldConnection: 'Você agora domina a base de como cientistas da computação, engenheiros de inteligência artificial e desenvolvedores de jogos organizam o mundo em matrizes!'
  }
];

export const BADGES_LIST = [
  {
    id: 'first-step',
    title: 'Primeiro Ponto',
    description: 'Concluiu o primeiro desafio com coordenadas na matriz.',
    icon: '🎯',
    unlocked: false,
    reqText: 'Completar o Desafio 1'
  },
  {
    id: 'cinema-boss',
    title: 'Guia de Cinema',
    description: 'Organizou assentos e identificou coordenadas da vida real.',
    icon: '🎟️',
    unlocked: false,
    reqText: 'Completar o Desafio 2'
  },
  {
    id: 'pixel-artist',
    title: 'Artista Digital',
    description: 'Desenhou e manipulou imagens digitais usando pixels e coordenadas.',
    icon: '🎨',
    unlocked: false,
    reqText: 'Completar os Desafios 6 e 7'
  },
  {
    id: 'transformer',
    title: 'Mestre da Translação',
    description: 'Moveu e transformou objetos modificando coordenadas de matriz.',
    icon: '📐',
    unlocked: false,
    reqText: 'Completar o Desafio 8'
  },
  {
    id: 'bug-hunter',
    title: 'Caçador de Bugs',
    description: 'Encontrou e corrigiu um glitch na imagem através de coordenada.',
    icon: '🔍',
    unlocked: false,
    reqText: 'Completar o Desafio 10'
  },
  {
    id: 'clean-bot',
    title: 'Algoritmo Limpo',
    description: 'Programou uma rota completa para limpar a matriz sem colisões.',
    icon: '🤖',
    unlocked: false,
    reqText: 'Completar o Desafio 11'
  },
  {
    id: 'route-optimizer',
    title: 'Otimizador de Rotas',
    description: 'Encontrou o caminho mais econômico com limite restrito de passos.',
    icon: '⚡',
    unlocked: false,
    reqText: 'Completar o Desafio 13'
  },
  {
    id: 'loop-coder',
    title: 'Poder do Loop',
    description: 'Entendeu a repetição de comandos para percorrer matrizes.',
    icon: '🔁',
    unlocked: false,
    reqText: 'Completar o Desafio 15'
  },
  {
    id: 'earth-defender',
    title: 'Guardião da Terra',
    description: 'Usou matrizes em dados ambientais e agricultura de precisão.',
    icon: '🌱',
    unlocked: false,
    reqText: 'Completar os Desafios 16 e 18'
  },
  {
    id: 'grand-master',
    title: 'Grande Mestre da Matriz',
    description: 'Completou com louvor todos os 20 desafios da habilidade EF04CO01!',
    icon: '🏆',
    unlocked: false,
    reqText: 'Completar todos os 20 desafios'
  }
];
