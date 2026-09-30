import React from 'react';
import { BookOpen, Compass, Cpu, Layers, CheckCircle2, Monitor, MapPin, Grid } from 'lucide-react';

export const PedagogicalGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Title Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>BNCC Computação na Educação Básica · 4º Ano</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Habilidade EF04CO01 & Pensamento Computacional
        </h2>
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200/80 rounded-2xl text-slate-800 text-sm leading-relaxed font-medium">
          <strong>(EF04CO01):</strong> “Reconhecer objetos do mundo real e/ou digital que podem ser representados através de matrizes que estabelecem uma organização na qual cada componente está em uma posição definida por coordenadas, fazendo manipulações simples sobre estas representações.”
        </div>
      </div>

      {/* The 4 Pedagogical Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Módulo 1: O Mapa das Coordenadas & Linha x Coluna
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Estabelece a base da matriz bidimensional: linhas horizontais e colunas verticais. Os estudantes aprendem a ler e referenciar posições como (Linha L, Coluna C), assentos de cinema, livros em estantes e mapas náuticos.
          </p>
          <span className="text-xs font-semibold text-blue-700">Desafios 1 ao 5</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Módulo 2: Imagens Digitais, Pixels & Pixel Art
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conecta a computação ao dia a dia visual: telas de celular e monitores são matrizes de pixels! Pratica valores binários (1/0, ligado/desligado), translações (+2 nas colunas) e simetria reflexiva.
          </p>
          <span className="text-xs font-semibold text-purple-700">Desafios 6 ao 10</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Módulo 3: Algoritmos & Navegação Autônoma em Grid
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Estimula o pensamento algorítmico ativo: criar programas sequenciais de passos, contornar obstáculos espaciais, otimizar rotas para economizar energia e utilizar repetições estruturadas (loops).
          </p>
          <span className="text-xs font-semibold text-emerald-700">Desafios 11 ao 15</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Módulo 4: Aplicações no Mundo Real & Exploração Espacial
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mostra o impacto social e científico das matrizes: análise de fotos de satélites para reflorestamento, robôs em centros de distribuição, estufas com agricultura de precisão e sondas espaciais em Marte.
          </p>
          <span className="text-xs font-semibold text-amber-800">Desafios 16 ao 20</span>
        </div>
      </div>

      {/* The 4 Pillars of Computational Thinking */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Os Quatro Pilares do Pensamento Computacional no Jogo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
            <span className="text-sm font-bold text-indigo-700">1. Decomposição</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dividir um trajeto longo ou uma imagem complexa em coordenadas pontuais menores e acessíveis passo a passo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
            <span className="text-sm font-bold text-indigo-700">2. Padrões</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Perceber que caminhar por uma linha inteira é repetir o mesmo comando várias vezes (introdução ao conceito de laço/loop).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
            <span className="text-sm font-bold text-indigo-700">3. Abstração</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Representar objetos físicos (árvores, poltronas, planetas) como elementos discretos em uma malha matemática indexada.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
            <span className="text-sm font-bold text-indigo-700">4. Algoritmos</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Construir e testar sequências lógicas finitas e ordenadas de comandos para alcançar uma meta com precisão.
            </p>
          </div>
        </div>
      </div>

      {/* Classroom Tips for Educators */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Dicas Práticas para o Professor em Sala de Aula</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <strong className="text-white block mb-1">Atividade Desplugada:</strong>
            Desenhe uma matriz no chão da quadra ou sala com fita crepe. Peça para um aluno ser o robô e outro ser o programador dando ordens de passos!
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <strong className="text-white block mb-1">Papel Quadriculado:</strong>
            Peça para os alunos criarem um desenho em papel quadriculado, anotarem as coordenadas de cada quadrado colorido e trocarem com um colega reproduzir.
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <strong className="text-white block mb-1">Discussão Reflexiva:</strong>
            Pergunte aos alunos: "Como o Google Maps sabe qual rua estamos?" e "Como a televisão sabe qual cor acender em cada pedacinho da tela?".
          </div>
        </div>
      </div>
    </div>
  );
};
