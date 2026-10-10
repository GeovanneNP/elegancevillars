# Correções finais e migração para Brodard Property

## Objetivo
Atualizar preço, contato, conteúdo, imagens, conformidade e domínio sem reconstruir a landing page aprovada. Preservar a direção visual, mapa, animações e estrutura, removendo somente repetições e inconsistências identificadas pelo cliente.

## 1. Domínio e publicação
- Conectar `brodardproperty.ch` e `www.brodardproperty.ch` com HTTPS e definir a versão com `www` como principal.
- Manter `elegancevillars.ch` e `www.elegancevillars.ch` conectados ao projeto para redirecionamento permanente ao novo domínio principal.
- Atualizar canonical, `og:url`, imagem social, Twitter, sitemap, robots e dados estruturados para `https://www.brodardproperty.ch`.
- Após a publicação, conferir HTTPS, redirecionamentos, página inicial, mapa e prévia do link. A atualização do cache de WhatsApp e redes depende de uma nova leitura feita por cada plataforma.

## 2. Preço, contato e informações comerciais
- Substituir o preço por **CHF 610'000.-** em FR, EN e DE: abertura, barra móvel, seção de preço, metadados, imagem social e dados estruturados.
- Publicar o contato confirmado: `gregory.brodard@pfgbrodard.ch`, `+41 79 727 31 88` e o mesmo número no WhatsApp.
- Padronizar a superfície como **48 m²** em toda a página.
- Alterar Sion para **45–50 min** e manter Genève em aproximadamente **1h30**, sem sugerir um meio de transporte não confirmado.
- Acrescentar a ressalva LFAIE/Lex Koller em FR e equivalentes claros em EN/DE, identificando-a como condição sujeita à validação notarial.

## 3. Revisão editorial trilingue
- Corrigir espaços, pontuação e quebras de linha, incluindo “Le calme, à proximité des pistes”.
- Remover as ocorrências duplicadas de “Un lieu. Quatre saisons.”, “La montagne dans toute son intensité” e “Roc d’Orsay 11 min”, mantendo uma ocorrência no local editorial mais coerente.
- Trocar “Luxury lifestyle” e “Lifestyle” por “Art de vivre” apenas em francês.
- Revisar integralmente FR, EN e alemão suíço para garantir traduções completas, preço, contato e unidades consistentes.

## 4. Imagens, créditos e veracidade
- Tornar os créditos de Glacier 3000, Lac des Chavonnes e demais imagens Wikimedia completos e clicáveis, com autor, fonte e licença.
- Pesquisar uma fotografia real de Bex/Mines de Sel com licença comercial verificável; só adicioná-la se a proveniência permitir o uso.
- Adicionar textos alternativos específicos às quatro imagens das estações.
- Evitar a repetição visual da fotografia de Roc d’Orsay.
- Manter a fotografia do Villars Palace somente com indicação de que a autorização do titular ainda precisa ser confirmada; não declarar autorização sem documento.
- Preservar fontes internas para IB 2026, Golf Club Villars e encargos, exibindo no site apenas alegações verificadas.

## 5. Interface, páginas legais e informações pendentes
- Corrigir a duplicação visual do logo no cabeçalho sem redesenhar a navegação.
- Criar páginas trilingues de Mentions légales / Impressum e Política de privacidade conforme a nLPD, ligadas no rodapé.
- Preparar essas páginas com a identidade confirmada da Brodard Property, mas não inventar endereço ou IDE; esses dois campos permanecem bloqueados até o fornecimento oficial.
- Manter o mapa existente na seção Situation.
- Não criar uma planta do apartamento nem afirmar localização/custo do estacionamento sem os materiais ou dados oficiais.

## 6. Validação completa
- Testar “Organiser une visite”, dossier privado, telefone, e-mail, WhatsApp e todos os itens do menu.
- Confirmar o envio do dossier e seus estados de sucesso/erro nos três idiomas.
- Verificar desktop, 430 px e 390 px: alinhamento, overflow, mapa, animações, redução de movimento, carregamento das imagens e cabeçalho.
- Validar título, descrição, canonical, dados estruturados, sitemap e imagem social no build publicado.
- Adicionar testes pequenos para os valores obrigatórios: CHF 610'000.-, 48 m², novo contato e ressalva LFAIE.

## Dependências antes da conclusão
- **Endereço legal completo** da Brodard Property Sàrl.
- **Número IDE oficial**.
- Confirmação documental do direito de uso da foto do Villars Palace.
- Planta do apartamento, localização e custo do estacionamento, caso devam ser publicados.

## Detalhes técnicos
- Novas páginas serão rotas próprias com metadados exclusivos e links no rodapé.
- O domínio novo será aplicado a todos os sinais SEO e ao JSON-LD; o antigo permanecerá apenas como origem de redirecionamento.
- O conteúdo trilingue continuará centralizado no dicionário tipado existente.
- Nenhuma imagem será adicionada sem licença comercial/proveniência visível, e nenhuma alteração será feita em fotos para mudar geografia ou arquitetura.
