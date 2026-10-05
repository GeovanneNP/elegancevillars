# Fotografias reais e hierarquia geográfica de Villars

## Limite da intervenção

Alterar somente `VillarsLifestyle` e seu conteúdo bilíngue/imagens. Hero, galeria do imóvel, CTAs, tipografia, paleta, animações existentes, detalhes, contato, modal e restante da página permanecem intactos.

## Remover imagens sintéticas da experiência geográfica

- Retirar das seções de localização e lifestyle as oito imagens geradas anteriormente: ski, Roc d’Orsay, lago, golf, wellness, Glacier 3000, primavera e outono.
- Não reaproveitar `seasons.jpg` nessa área sem prova de que seja uma fotografia real do local.
- Remover imports e arquivos que ficarem sem uso, evitando que imagens sintéticas continuem no pacote da página.

## Fotografias aprovadas para uso

Baixar somente os originais com identidade e licença comercial verificadas, preservar o conteúdo fotográfico e converter para WebP/AVIF responsivo sem transformação generativa.

1. **Villars-sur-Ollon**
   - Panorama real de Villars, 6.762 × 2.406 px, Wouter Hagens, CC BY-SA 3.0.
   - Uso na abertura “Tout est à portée de Villars”.

2. **Roc d’Orsay**
   - Télécabine real de Roc d’Orsay em Villars, 1.824 × 1.368 px, Alexey Filatov, CC BY-SA 4.0.
   - Uso em “11 minutes. Et vous êtes là-haut.”

3. **Bretaye / linha Bex–Villars–Bretaye**
   - Fotografia real em alta resolução do trem vermelho BVB em sua linha, 4.212 × 2.808 px, flybyeigenheer, CC BY-SA 2.0.
   - Uso no percurso Villars → Bretaye.
   - Manter **ENV. 20 MIN**, conforme a decisão do usuário e a fonte oficial consultada.

4. **Lac des Chavonnes**
   - Usar duas fotografias reais distintas: panorama 4.000 × 3.000 px e vista próxima/reflexos 2.272 × 1.514 px.
   - Confirmar o nome final do autor e a variante exata da licença na página individual de cada arquivo antes do download; se qualquer dado não estiver claro, usar apenas a foto plenamente confirmada.

5. **Glacier 3000**
   - Panorama real do Glacier Walk, 6.000 × 4.000 px, CC BY-SA 4.0.
   - Peak Walk by Tissot real e identificável, usando o original de maior qualidade entre os candidatos verificados, CC BY-SA 4.0 ou CC BY-SA 2.0.

6. **Château d’Aigle**
   - Fotografia real do castelo com contexto de vinhedos, até 6.555 × 4.370 px, Falk2 ou Panoramasuisse, CC BY-SA.

7. **Château de Chillon / Lac Léman**
   - Fotografia real em alta resolução com o lago, Christian David, CC BY-SA 4.0.

## Locais sem imagem nesta entrega

Não usar fotografia para os itens abaixo, porque não foi encontrada licença comercial pública e inequívoca:

- Golf Club Villars
- Les Bains de Villars
- Villars Palace
- interior das Mines de Sel de Bex

As fotografias oficiais encontradas são protegidas ou destinadas apenas a imprensa. Essas seções manterão a composição tipográfica atual, sem imagem falsa, genérica ou substituta. Poderão receber fotografias depois, caso o proprietário obtenha autorização escrita dos estabelecimentos.

## Créditos e conformidade

- Exibir crédito discreto abaixo de cada fotografia com autor, Wikimedia Commons e licença/link.
- Registrar no projeto, junto aos assets, a origem, autor, URL da página do arquivo, licença e alterações realizadas.
- Como as licenças são CC BY-SA, manter as versões derivadas otimizadas sob licença compatível e informar que houve apenas crop/otimização quando aplicável.
- Não aplicar geração, remoção de elementos, troca de céu/estação, alteração geográfica ou reconstrução. Somente crop, redimensionamento, compressão e ajustes fotográficos leves se necessários.

## Hierarquia geográfica

Sem redesenhar o layout geral, inserir labels editoriais para organizar o conteúdo atual em quatro níveis:

1. **Dans Villars** — Roc d’Orsay, Les Bains de Villars, Villars Palace, acesso ao trem de montanha e domínio Villars–Gryon–Les Diablerets.
2. **Accessibles depuis Villars** — Bretaye, Golf Club Villars e Lac des Chavonnes.
3. **À découvrir dans la région** — Glacier 3000, Château d’Aigle e Mines de Sel de Bex.
4. **Beyond Villars** — Château de Chillon, Montreux e Lac Léman.

A seção das cinco escolas permanece neutra, sem indicação de parceria ou distância precisa.

## Distâncias e linguagem factual

- Manter separadamente: Transports publics — 50 m; Commerces — 300 m.
- Manter como dados comerciais sem atribuir modal: Aigle — 15 min; Sion Airport — 30 min; Lausanne — 55 min; Genève — 90 min.
- Manter Golf Club Villars em aproximadamente 1’660 m.
- Substituir qualquer formulação ampla de proximidade regional por linguagem neutra, como “Accessible depuis Villars”, “À découvrir dans la région” e “Beyond Villars”.
- Para Glacier 3000, usar “Une expérience alpine à découvrir dans la région”, sem dizer “à quelques minutes”.

## Quatre saisons

- Reutilizar somente as fotografias reais verificadas já incorporadas: Villars/Roc d’Orsay no inverno, Villars/Bretaye/Lac des Chavonnes na primavera, Golf sem fotografia até haver licença e Lac des Chavonnes no verão, Villars real no outono quando a estação da foto corresponder de fato.
- Não baixar imagens apenas para completar os quatro estados. Quando não houver fotografia real da estação correspondente, manter o estado tipográfico sem inventar uma imagem sazonal.

## Performance e validação

- Guardar os downloads brutos temporariamente fora do projeto; manter no app apenas os arquivos otimizados e os registros de licença.
- Usar `picture/srcset` com WebP/AVIF quando o ganho for relevante, dimensões estáveis e lazy-load abaixo do primeiro viewport.
- Validar cada foto visualmente antes de integrar, conferir créditos em francês e inglês e testar 1280 px, 430 px e 390 px.
- Confirmar que nenhuma imagem gerada ou não licenciada permaneça na experiência de localização e que nenhum texto sugira vista do apartamento, transporte, distância, parceria ou proximidade não comprovada.
