# Plano: página orientada à venda, WhatsApp permanente e leitura maior

## Objetivo
Fazer o visitante entender e desejar o apartamento antes de conhecer os entretenimentos de Villars, com textos sempre legíveis e uma ação permanente para marcar visita pelo WhatsApp.

## 1. Nova ordem comercial
A página será reorganizada, sem apagar conteúdo, nesta sequência:

```text
Entrada do imóvel
→ Fotos e narrativa do apartamento
→ Números principais
→ Cozinha, sala, quarto e varanda
→ Detalhes completos e comodidades
→ Galeria de fotos grandes
→ Preço, disponibilidade e dossier
→ Localização, mapa e mobilidade
→ Ski, Palace, Bretaye, golf, Glacier, estações, lago e região
→ Contato e informações legais
```

- Mover “Detalhes”, comodidades, galeria e bloco de preço para antes de todo o conteúdo de localização e entretenimento.
- Manter as fotografias grandes já aprovadas e priorizar as imagens do próprio apartamento.
- Atualizar a navegação para que “Apartamento”, “Galeria”, “Detalhes” e “Situação” levem à nova posição correta.
- Preservar integralmente mapa, experiências, textos e créditos; apenas mudar sua posição na jornada.

## 2. “Organizar uma visita” sempre pelo WhatsApp
- Trocar o destino de todos os botões “Organizar uma visita”: hero, bloco de preço e botão permanente.
- Abrir diretamente o WhatsApp de Gregory com mensagem pronta no idioma ativo, citando o apartamento e a referência 044598.
- Manter o botão permanente como pop-up visível desde o início em celular e computador, sem depender da rolagem.
- No celular, manter preço e chamada juntos numa barra fixa confortável; no computador, manter o botão lateral inferior.
- Não enviar o visitante ao rodapé para conseguir marcar a visita.
- Continuar ocultando a ação quando um diálogo estiver aberto; o rodapé permanece apenas como contato complementar.

## 3. Eliminar letras pequenas
- Aumentar o padrão global dos textos auxiliares em caixa alta, que hoje aparece com aproximadamente 9–11 px em vários pontos.
- Aplicar um mínimo legível em navegação, idioma, metadados do hero, números, filtros do mapa, distâncias, detalhes, créditos, legendas, escolas, galeria e rodapé.
- Reduzir o espaçamento exagerado entre letras quando ele prejudicar a leitura.
- Aumentar rótulos e valores da tabela de detalhes, com melhor contraste e largura para não apertar palavras.
- Aumentar textos do botão permanente e dos CTAs, mantendo a estética editorial.
- Manter créditos legais discretos, porém claramente legíveis — não escondê-los nem removê-los.

## 4. Ritmo e conversão
- Recalibrar as animações e medições de rolagem depois da troca de ordem, para nenhuma transição terminar fora da tela.
- Garantir que o bloco de preço e os CTAs apareçam antes da parte turística.
- Manter a experiência sem cards, arredondamentos, gradientes ou reconstrução visual.
- Preservar FR, EN e DE e usar a mensagem correta do WhatsApp em cada idioma.

## 5. Validação
- Conferir toda a jornada em 390 px, 430 px, laptop e desktop.
- Testar cada botão de visita e validar número, mensagem, referência e idioma no link do WhatsApp.
- Confirmar ordem das seções, navegação, mapa, galeria, dossier e contato.
- Verificar textos cortados, tipografia ainda pequena, sobreposições do botão fixo, rolagem horizontal e efeitos incompletos.

## Detalhes técnicos
- Reordenar os blocos existentes em `Villa.tsx`, mantendo `VillarsLifestyle` intacto como conjunto turístico.
- Centralizar a URL de visita por WhatsApp a partir do telefone e da mensagem já existentes no dicionário.
- Atualizar a utility `eyebrow` e substituir exceções locais abaixo do novo mínimo de leitura.
- Reaproveitar os componentes e tokens atuais; nenhuma alteração de dados, preço, backend ou conteúdo factual.
