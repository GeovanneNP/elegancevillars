# Expansão editorial — Viver em Villars

## Escopo preservado

A intervenção ficará restrita ao bloco já existente de localização e quatro estações, entre **“Respirez Villars”** e **“Dans le détail”**.

Não serão alterados: hero, navbar, apresentação do apartamento, quarto, varanda, detalhes técnicos, galeria, CTAs, barra fixa, modal, formulário, preço, contato, rodapé, SEO, cursor, tipografia, paleta ou animações atuais.

## Estrutura da experiência

1. **Evoluir “Situation”**
   - Substituir a abertura atual de localização por “Tout est à portée de Villars.” e o apoio curto solicitado.
   - Manter o mesmo grid editorial, os espaços amplos, as linhas finas e os estilos tipográficos já aprovados.

2. **Distâncias clés + timeline**
   - Reapresentar os seis dados oficiais existentes sem alterar valores ou atribuir meio de transporte.
   - Usar uma composição tipográfica com números grandes, labels pequenos e divisórias, sem cards.
   - Complementar com timeline vertical em SVG, desenhada pelo scroll; os pontos ativam discretamente.
   - No mobile e com movimento reduzido, mostrar a timeline completa e estática.

3. **La montagne à votre porte**
   - Criar uma sequência editorial contínua, não um catálogo, reunindo:
     - Villars–Gryon–Les Diablerets: 100+ km de domínio skiable.
     - Roc d’Orsay: composição com foto ampla e tempo aproximado.
     - Bretaye: percurso Villars → Bretaye com linha e ponto animado.
     - Lac des Chavonnes: bloco contemplativo com 1’690 m e caminhada aproximada desde Bretaye.
     - Golf Club Villars: tipografia de impacto e dados essenciais.
   - Cada imagem turística ou conceitual será identificada discretamente como **“Image d’ambiance — Villars-sur-Ollon”**, nunca como vista do imóvel.

4. **Wellness + Glacier 3000**
   - Integrar Les Bains de Villars e Villars Palace como infraestrutura local, sem logos, parceria implícita ou linguagem promocional excessiva.
   - Dar ao Glacier 3000 um momento visual forte com “Beyond Villars”, Peak Walk by Tissot e 107 m.

5. **International village**
   - Apresentar o número 5 e listar somente Aiglon College, Collège Alpin Beau Soleil, La Garenne, Préfleuri e Villars Palace Academy.
   - Sem logos, rankings, endossos ou afirmações adicionais.

6. **Evoluir “Un lieu. Quatre saisons.”**
   - Transformar a seção atual em quatro estados: Hiver, Printemps, Été e Automne.
   - Desktop: transição sticky leve, com imagem, nome e texto curto mudando conforme o scroll, sem extensão excessiva.
   - Mobile: fluxo vertical ou controle por toque, sem pin pesado, parallax ou interação dependente de hover.
   - Movimento reduzido: estados estáticos e navegáveis, com toda a informação disponível.

7. **Au-delà de Villars**
   - Criar um bloco secundário e visualmente mais discreto para Aigle, Bex e região do Lac Léman, usando somente os pontos indicados.

8. **Mapa editorial**
   - Evoluir o pequeno mapa atual para um SVG line-art interativo com Villars, Roc d’Orsay, Bretaye, Lac des Chavonnes, Golf Club Villars, Les Bains, Aigle, Glacier 3000, Lausanne e Genève.
   - Adicionar “Illustration géographique simplifiée.”
   - Desktop: hover sutil em ponto, nome e conexão; mobile: tap com o mesmo conteúdo; nenhum tooltip grande.

## Imagens

- Combinar fotografias fornecidas pelo proprietário quando existirem com novas imagens editoriais de atmosfera para os locais ainda sem material autorizado.
- Manter as fotos do imóvel intactas e separadas das imagens de ambiente.
- Gerar um conjunto visual coerente, sem simular a vista do apartamento, e entregar em WebP responsivo, lazy-loaded e sem preload secundário.
- Deixar a estrutura preparada para trocar imagens de ambiente por fotografias licenciadas futuras sem alterar o layout.

## Conteúdo e idiomas

- Centralizar todo o novo texto no dicionário atual, com versões completas em francês e inglês.
- Preservar francês como idioma padrão e o seletor FR/EN existente.
- Verificar paridade de labels, textos, nomes próprios, descrições de imagens e estados interativos nos dois idiomas.

## Veracidade confirmada

A pesquisa em fontes oficiais confirmou: domínio skiable acima de 100 km, Roc d’Orsay em aproximadamente 11 minutos, Lac des Chavonnes a 1’690 m e cerca de 30 minutos a pé desde Bretaye, fundação do Golf Club em 1922, infraestrutura de wellness, Peak Walk com 107 m e as cinco escolas listadas.

Duas especificações serão ajustadas para não publicar precisão conflitante:
- **Bretaye:** usar “environ 20 minutes” em vez de 18 minutos; a fonte oficial consultada informa aproximadamente 20 minutos.
- **Golf Club Villars:** usar **1’660 m** em vez de 1’600 m; as páginas oficiais de turismo e a ficha do clube repetem 1’660 m, enquanto 1’600 m aparece apenas como arredondamento promocional.

Os seis valores da propriedade em “Distances clés” permanecerão exatamente como fornecidos.

## Animação, desempenho e acessibilidade

- Reutilizar GSAP, ScrollTrigger e os padrões já presentes; nenhuma dependência nova.
- Adicionar animação apenas aos novos elementos: timeline SVG, percurso a Bretaye, Four Seasons, mapa e revelação de imagens.
- Manter animações desktop dentro da regra atual de telas a partir de 768 px; em 390/430 px, usar fluxo leve e estável.
- Toda informação continuará visível e utilizável com `prefers-reduced-motion`.
- Evitar cards, ícones genéricos, badges, caixas arredondadas, gradientes, glassmorphism e sombras fortes.

## Organização técnica

- Extrair a expansão para componentes focados dentro da área editorial existente, mantendo a página principal legível.
- Reutilizar os tokens, o grid de 12 colunas, os utilitários de título/label e o contexto único de animação atuais.
- Preservar o `id="location"` para a navegação existente; não adicionar item novo à navbar.

## Validação

- Conferir todo o percurso em francês e inglês.
- Testar desktop e larguras de 430 px e 390 px, inclusive interações por toque e movimento reduzido.
- Confirmar ausência de sobreposição, rolagem horizontal, quebra de texto, imagens pesadas ou regressão nas seções existentes.
- Verificar que nenhuma imagem de ambiente seja apresentada como vista real do apartamento.
