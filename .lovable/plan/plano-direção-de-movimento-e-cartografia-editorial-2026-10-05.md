# Plano: direção de movimento e cartografia editorial

## Objetivo

Tornar toda a página mais contínua, imersiva e precisa sem reconstruí-la: preservar identidade Brodard, tipografia, paleta, textos, fotografias, galeria, CTAs e ordem das seções. O trabalho será uma revisão de física, acabamento e conexão visual.

## Diagnóstico confirmado

- Várias entradas usam animações com duração própria após o gatilho do scroll. Em uma rolagem rápida, o elemento continua animando quando já saiu da área visível, deixando a sensação de efeito inacabado.
- Os cálculos são atualizados ao iniciar e ao trocar o idioma, mas não depois que fontes e todas as imagens relevantes estabilizam suas medidas.
- As sequências fixas do apartamento usam alturas longas e intervalos rígidos; a saída de textos e a chegada das imagens não têm uma regra comum de conclusão.
- A área das quatro estações mantém uma grande metade fixa quase vazia: hoje ela mostra apenas número e título, sem a mudança visual prometida pelo estado ativo.
- O mapa usa linhas abstratas muito leves, pontos sem rótulos próximos e uma ligação inicial sem percurso visível. A hierarquia geográfica existe no texto, mas ainda não é comunicada claramente pelo desenho.
- A captura completa mostrou grandes áreas de transição sem informação suficiente no desktop. No celular, a navegação é estável, mas a barra fixa disputa espaço com conteúdos baixos e a seção das estações perde parte da experiência visual.

## 1. Unificar a física do scroll

- Criar uma única configuração de movimento para duração, suavidade, antecipação e conclusão dos efeitos.
- Trocar entradas longas dependentes do relógio por movimentos curtos ligados ao progresso da tela, ou fazê-las concluir imediatamente ao sair da área visível.
- Adicionar regras de `onLeave` e `onLeaveBack` nos efeitos que precisam de estado final garantido.
- Recalcular posições após fontes e imagens críticas carregarem, ao redimensionar, ao mudar a orientação e ao trocar idioma.
- Usar `invalidateOnRefresh` e limpeza completa para evitar posições antigas, efeitos duplicados ou desalinhamentos após navegação.
- Harmonizar Lenis e ScrollTrigger sem aumentar a sensação de atraso entre gesto e página.

## 2. Corrigir cada sequência existente

- **Entrada e abertura:** manter o desenho atual, mas sincronizar a saída da entrada com o primeiro quadro da abertura e impedir salto de scroll.
- **Abertura:** limitar o deslocamento do título e a aproximação da foto para que terminem antes do conteúdo seguinte assumir a tela.
- **Sala, quarto e varanda:** recalibrar as alturas fixas, os pontos de entrada/saída e a ordem de texto, imagem principal e detalhe; cada história terá começo, leitura e encerramento visíveis.
- **Revelações de texto e fotografia:** reduzir repetição, eliminar animações que começam tarde e garantir estado final quando o usuário rolar rapidamente.
- **Parallax:** reduzir amplitudes que podem expor bordas ou parecer atrasadas, principalmente em telas baixas.
- **Números e linha contínua:** disparar uma vez, terminar dentro da tela e permanecer estáveis ao voltar.
- **Galeria:** manter o desenho, mas impedir conflito do cursor com dispositivos de toque e respeitar redução de movimento no zoom e na abertura.
- **Barra móvel:** manter o CTA, acrescentando espaço seguro real no fim de cada trecho para não cobrir textos, créditos ou controles.

## 3. Reconstruir a ilustração geográfica sem mudar a linguagem visual

- Manter o mapa como ilustração editorial, não como mapa de navegação.
- Redesenhar o SVG com três escalas legíveis: Villars e experiências locais; destinos acessíveis desde Villars; região, Lausanne, Genève e lago Léman.
- Usar linhas topográficas finas, silhueta alpina, vale do Rhône e lago com contraste suficiente, sem poluir ou simular precisão cartográfica.
- Posicionar nomes junto aos pontos principais; o estado ativo reforçará ponto, nome e ligação a Villars.
- Animar o traçado principal pelo progresso do scroll, com conclusão garantida. As linhas secundárias aparecerão somente quando o local estiver ativo.
- Desktop: foco e passagem do cursor com resposta discreta. Mobile: toque, alvos confortáveis e informação nunca dependente de hover.
- Preservar a nota “Illustration géographique simplifiée” e a hierarquia factual já aprovada.

## 4. Conectar as novas seções de Villars

- Transformar a timeline de mobilidade em uma progressão contínua: linha, ponto e texto chegam juntos.
- Fazer o percurso Villars → Bretaye terminar exatamente no destino, sem o ponto escapar da linha.
- Refinar a passagem entre fotografia, estatística e texto no Roc d’Orsay, Bretaye, lago, Glacier 3000 e destinos regionais.
- Usar as fotografias reais já licenciadas como âncoras; nenhuma imagem nova ou sintética será adicionada.
- Conservar os créditos visíveis e evitar que sejam cobertos pelo CTA móvel.

## 5. Completar “Quatre saisons”

- Fazer a área fixa realmente responder à estação ativa com número, nome, fotografia real já aprovada e uma transição editorial curta.
- Sincronizar a troca visual com o centro de leitura, sem atraso e sem telas vermelhas vazias.
- No celular, manter fluxo normal e mostrar cada estado completo sem seção fixa pesada.
- Com redução de movimento, apresentar estados totalmente legíveis e estáticos.

## 6. Continuidade visual e alinhamento

- Normalizar o ritmo vertical entre blocos claros, pedra, vermelho e fotografia para retirar vazios acidentais sem reduzir o espaço editorial intencional.
- Conferir linhas de grid, larguras, títulos, créditos e bordas nos três idiomas.
- Corrigir cortes e quebras em 390 px, 430 px, telas baixas de notebook e desktop amplo.
- Garantir dimensões reservadas para todas as imagens usadas pelos efeitos, evitando deslocamentos durante o carregamento.

## 7. Acessibilidade e desempenho

- Respeitar `prefers-reduced-motion` em GSAP, CSS, galeria, entrada e rolagem suave.
- Garantir que mapa, estações e galeria continuem completos por teclado e toque.
- Animar somente `transform`, `opacity`, `clip-path` e traços SVG; evitar efeitos que forcem recálculo contínuo da página.
- Suspender animações contínuas fora da tela e reduzir trabalho em celulares.

## Validação

- Percorrer a página em velocidade lenta, normal e rápida, para baixo e para cima.
- Verificar cada efeito no início, no meio e no estado final — não apenas capturas isoladas.
- Testar desktop 1280 px, notebook de baixa altura, mobile 430 px e 390 px.
- Repetir em FR, EN e DE, com e sem redução de movimento.
- Confirmar ausência de sobreposição, saltos, áreas vazias acidentais, bordas expostas, erros e animações ainda rodando fora da tela.

## Limites

- Não alterar conteúdo comercial, preço, contatos, identidade, tipografia, paleta, fotografias, ordem global, formulário ou arquitetura da página.
- Não adicionar dependências, vídeo, efeitos chamativos, novos dados geográficos ou imagens sem licença.

## Detalhes técnicos

- Centralizar a orquestração em um único contexto GSAP/ScrollTrigger, com funções pequenas por sequência e media queries separadas para desktop/mobile/reduced-motion.
- Usar timelines com progresso controlado, `invalidateOnRefresh`, `matchMedia`, observação de imagens/fontes e estados finais explícitos.
- Evoluir o SVG atual em vez de incorporar Google Maps ou outra biblioteca.
