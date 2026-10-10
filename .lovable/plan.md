# Auditoria e correção completa da experiência mobile

## Objetivo
Reorganizar a landing page para que, entre 320 e 430 px, textos, fotos, mapa, galeria e ações comerciais permaneçam claros, elegantes e estáveis, sem alterar a identidade aprovada nem remover conteúdo.

## Problemas confirmados
- Em 320 px, o CTA “Découvrir/Explore the apartment” ultrapassa a largura disponível.
- O hero força uma altura mínima maior que a tela de celulares baixos, escondendo parte da composição inicial e comprimindo título, dados e CTAs.
- Algumas fotos usam cortes e movimentos pensados para telas grandes; no mobile, isso deixa áreas vazias ou o assunto principal pouco evidente.
- Textos sobre fotos usam camadas vermelhas e opacidades inconsistentes, deixando alguns trechos apagados.
- A barra fixa do WhatsApp pode crescer em idiomas longos, mas o espaço reservado no fim da página é fixo; isso pode cobrir o rodapé.
- Parallax e vários efeitos ligados ao scroll continuam ativos no mobile, aumentando o risco de cortes, atraso e animações que não chegam claramente ao estado final.
- O mapa impõe uma altura mínima grande em celulares baixos e concentra filtros, rótulos e instruções no mesmo espaço.
- A lista horizontal de escolas funciona por gesto, mas não comunica claramente que há mais conteúdo lateral.

## Implementação
1. **Base mobile e tipografia**
   - Ajustar títulos e blocos comerciais com tamanhos responsivos por faixa de tela, quebras naturais e limites de largura.
   - Remover quebras rígidas problemáticas no mobile e proteger palavras, números, e-mails e CTAs nos três idiomas.
   - Preservar o tamanho mínimo de leitura já aprovado e aumentar contraste onde o texto aparece apagado.

2. **Hero e ação de venda**
   - Reequilibrar altura, enquadramento da fachada, título, características e botões para 320, 360, 390 e 430 px.
   - Transformar os CTAs em uma composição mobile estável, sem linhas decorativas empurrando texto para fora.
   - Fazer a barra de WhatsApp reservar exatamente sua altura real, incluindo safe area e textos maiores em FR/EN/DE.

3. **Fotos e textos sobre imagens**
   - Definir enquadramentos mobile específicos para fachada, sala, cozinha, quarto, varanda e imagens de lifestyle.
   - Reduzir áreas vazias causadas por cortes verticais e manter o assunto principal visível.
   - Padronizar overlays e posicionar textos em zonas visualmente limpas, com contraste suficiente sem escurecer excessivamente as fotos.

4. **Scroll e animações**
   - Manter a coreografia completa no desktop e criar uma versão mobile mais leve, sem parallax agressivo ou sequências que dependam de grande altura de tela.
   - Garantir estado inicial e final explícito para cada revelação; nenhum texto ou imagem ficará preso, invisível ou pela metade.
   - Recalcular animações após imagens, fontes, troca de idioma e rotação do aparelho, preservando o modo de movimento reduzido.

5. **Mapa, galeria e blocos longos**
   - Reorganizar mapa e filtros para telas baixas, evitando disputa entre rótulos, instrução e controles.
   - Ajustar rótulos ativos e movimentos da câmera para continuarem legíveis em 320–430 px.
   - Dar indicação visual ao carrossel de escolas e revisar galeria, dossier e páginas finais com a barra do WhatsApp presente.

6. **Validação final**
   - Testar 320, 360, 390 e 430 px em FR, EN e DE, além de tablet e desktop.
   - Percorrer a página inteira por scroll real, validar rotação, movimento reduzido, mapa, galeria, dossier e todos os links do WhatsApp.
   - Confirmar ausência de overflow horizontal, sobreposição, texto cortado, conteúdo coberto e erros no navegador.
   - Comparar capturas das principais seções antes/depois para verificar enquadramento, alinhamento e contraste.

## Direção visual preservada
- Identidade Brodard Property, vermelho suíço, marfim, tipografia editorial e fotos reais permanecem.
- A ordem comercial “apartamento primeiro, lifestyle depois” e os conteúdos FR/EN/DE permanecem.
- Nenhuma nova imagem genérica ou gerada por IA será introduzida.

## Detalhes técnicos
- A correção ficará concentrada nos componentes da landing page e nos tokens globais existentes.
- Efeitos pesados serão condicionados por largura, capacidade do dispositivo e preferência de movimento.
- A altura da ação fixa será medida, em vez de depender de espaçamento fixo.
- Testes existentes do WhatsApp serão mantidos e ampliados apenas onde houver regra funcional.