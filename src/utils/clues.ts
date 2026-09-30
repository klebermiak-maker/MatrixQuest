import { Challenge, CoordinateDisplayMode, GradualClue, Coordinate } from '../types/game';
import { formatCoordinate, ROW_LETTERS } from './coordinates';

/**
 * Returns 3 progressive stages of coordinate hints for any of the 20 challenges,
 * formatted according to the active coordinate notation.
 */
export function getGradualCluesForChallenge(
  challenge: Challenge,
  coordMode: CoordinateDisplayMode = 'row-col'
): GradualClue[] {
  // If explicitly predefined on challenge, use those
  if (challenge.gradualClues && challenge.gradualClues.length > 0) {
    return challenge.gradualClues;
  }

  const { rows, cols, interactionType, targetCoords, targetPos, startPos } = challenge;
  const primaryTarget: Coordinate | undefined = targetCoords?.[0] || targetPos;

  // STAGE 1: Leitura dos Eixos e Estrutura da Matriz
  let stage1Text = '';
  if (coordMode === 'alpha-num') {
    stage1Text = `Esta matriz tem ${rows} linhas de letras (de A até ${ROW_LETTERS[rows - 1]}) e ${cols} colunas numéricas (de 1 até ${cols}). Para localizar qualquer ponto, primeiro olhe a letra da Linha na esquerda e depois o número da Coluna no topo.`;
  } else if (coordMode === 'cartesian') {
    stage1Text = `No plano cartesiano (X, Y), o eixo horizontal X representa as Colunas (1 a ${cols}) e o eixo vertical Y representa as Linhas contadas de baixo para cima (1 a ${rows}).`;
  } else {
    stage1Text = `Lembre-se da regra de ouro da matriz: as Linhas são as faixas horizontais (de cima para baixo: Linha 1 até ${rows}) e as Colunas são as faixas verticais (da esquerda para a direita: Coluna 1 até ${cols}).`;
  }

  if (primaryTarget) {
    const rowNum = primaryTarget.r + 1;
    const colNum = primaryTarget.c + 1;
    const verticalPos = rowNum <= Math.ceil(rows / 2) ? 'na metade superior' : 'na metade inferior';
    stage1Text += ` O objetivo principal deste desafio está localizado ${verticalPos} do grid.`;
  }

  // STAGE 2: Lógica de Posicionamento e Relação Espacial
  let stage2Text = '';
  let focusRow: number | undefined = primaryTarget?.r;
  let focusCol: number | undefined = primaryTarget?.c;

  switch (interactionType) {
    case 'navigation': {
      if (startPos && primaryTarget) {
        const dRow = primaryTarget.r - startPos.r;
        const dCol = primaryTarget.c - startPos.c;
        const rowAction = dRow > 0 ? `descer ${dRow} casa(s) [Sul]` : dRow < 0 ? `subir ${Math.abs(dRow)} casa(s) [Norte]` : 'manter a mesma linha';
        const colAction = dCol > 0 ? `avançar ${dCol} casa(s) para a Direita [Leste]` : dCol < 0 ? `recuar ${Math.abs(dCol)} casa(s) para a Esquerda [Oeste]` : 'manter a mesma coluna';

        stage2Text = `Análise do Algoritmo: saindo de ${formatCoordinate(startPos, coordMode, rows)} até ${formatCoordinate(primaryTarget, coordMode, rows)}, você precisa ${rowAction} e ${colAction}. Cuidado com os obstáculos no caminho!`;
      } else {
        stage2Text = `Observe onde estão as metas marcadas no grid. Trace mentalmente o caminho quadrado por quadrado antes de apertar os botões de comando.`;
      }
      break;
    }
    case 'pixel-draw': {
      stage2Text = `Na computação gráfica, imagens são formadas acendendo pixels em coordenadas exatas. Conte quantos quadrados a partir do canto superior esquerdo cada pixel colorido ocupa.`;
      if (challenge.id === 6) {
        stage2Text += ' Dica: o coração é simétrico! O que você pintar na coluna 2 terá um par correspondente na coluna 4.';
      } else if (challenge.id === 7) {
        stage2Text += ' Dica: a letra C é formada por uma linha no topo, uma linha na base e uma coluna vertical na esquerda.';
      } else if (challenge.id === 9) {
        stage2Text += ' Dica de Espelhamento: a Coluna 3 é o espelho central. O pixel da Coluna 1 reflete na Coluna 5, e a Coluna 2 reflete na Coluna 4!';
      }
      break;
    }
    case 'matrix-transform': {
      stage2Text = `Operação de Translação: cada pixel da figura original deve ter o mesmo valor somado em sua coordenada de coluna. Se o ponto estava na Coluna C, ele irá para a Coluna C + 2, mantendo a mesma Linha!`;
      break;
    }
    case 'cell-pick': {
      if (targetCoords && targetCoords.length > 1) {
        const formattedList = targetCoords.map(tc => formatCoordinate(tc, coordMode, rows)).join(', ');
        stage2Text = `Você precisa encontrar múltiplos pontos. As coordenadas procuradas são: ${formattedList}. Localize primeiro a Linha de cada uma e depois cruze com a Coluna correspondente.`;
      } else if (primaryTarget) {
        stage2Text = `Procure a intersecção: deslize o dedo na horizontal pela Linha ${primaryTarget.r + 1} e na vertical pela Coluna ${primaryTarget.c + 1}. Onde as duas se cruzam é o ponto procurado!`;
      }
      break;
    }
    case 'coordinate-quiz': {
      if (primaryTarget) {
        stage2Text = `Olhe para o objeto no tabuleiro. Siga em linha reta para a margem esquerda para ler o número da Linha (L${primaryTarget.r + 1}). Depois siga em linha reta para o topo para ler a Coluna (C${primaryTarget.c + 1}).`;
      }
      break;
    }
  }

  // STAGE 3: Radar Ativo de Coordenadas (Iluminação Visual)
  const allTargets = targetCoords && targetCoords.length > 0 ? targetCoords : targetPos ? [targetPos] : [];
  const stage3Text = `Radar de Coordenadas Ativado! As coordenadas-chave deste desafio foram destacadas com brilho guia no tabuleiro: ${allTargets.map(t => formatCoordinate(t, coordMode, rows)).join(' · ')}. Veja o pulso azul e amarelo na matriz!`;

  return [
    {
      stage: 1,
      stageName: 'Pista 1: Leitura dos Eixos & Orientação',
      explanation: stage1Text,
      focusRow: primaryTarget ? primaryTarget.r : undefined
    },
    {
      stage: 2,
      stageName: 'Pista 2: Lógica de Posicionamento & Algoritmo',
      explanation: stage2Text,
      focusRow,
      focusCol
    },
    {
      stage: 3,
      stageName: 'Pista 3: Radar Visual de Coordenadas',
      explanation: stage3Text,
      focusRow,
      focusCol,
      highlightCoords: allTargets
    }
  ];
}
