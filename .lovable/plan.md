# Desempenho mobile — diagnóstico e plano (sem mudança visual)

## Passo 1 — Diagnóstico (medido no site publicado, 412 px, perfil Moto G)

**a) LCP = poster do filme de abertura** (`<video>` com `poster` JPG de 336 KB, ~1080p). Ele só aparece depois que o JavaScript monta o hero. O `src` do vídeo é definido no JS com `preload="auto"`, então o MP4 de 720p (14,8 MB) começa a baixar já aos ~1,9 s e disputa banda com o poster. Nenhuma pré-carga (preload) do poster.

**b) CLS 0,15:** na minha medição sem limitação de rede não houve deslocamento. Por isso o CLS do Lighthouse vem de causas que só aparecem em rede lenta. As causas prováveis, confirmadas no código: logo (688 px exibido a 112 px) e as fotos do apartamento **sem width/height** (só algumas da região têm), e a troca das fontes Google (Cormorant/Manrope com `display=swap`, sem fallback métrico ajustado). O banner de cookies e o botão do WhatsApp são fixos/sobrepostos e não deslocam conteúdo. Vou confirmar com um Lighthouse limitado antes e depois.

**c) Bloqueio de renderização:** `styles.css` (18 KB) + o CSS do Google Fonts (que puxa os arquivos de fonte). Sem scripts bloqueantes. **JS não usado:** MapLibre (284 KB + worker de 145 KB) é baixado aos ~2,2 s, mesmo com o mapa muito abaixo da dobra. O resto vem do chunk da página (GSAP/Lenis, 105 KB) e do index (166 KB).

**d) Payload:** o filme de 720p soma ~14,8 MB, ou **~83% dos 17,7 MB**. Imagens: ~1,5 MB de WebP + poster de 336 KB + logo de 93 KB, ou seja ~1,9 MB. As fotos do apartamento são servidas em 2528 px de largura para exibição em ~412 px, de 380 a 680 KB cada. JS ~0,73 MB, CSS ~30 KB.

## Passo 2 — Correções propostas (por impacto)
1. **Filme:** `preload="none"`, `src` atribuído só após o primeiro render/idle (e só se o hero estiver visível). Poster com `<link rel=preload fetchpriority=high>` em versão mobile WebP de mesma aparência (~80–120 KB). Autoplay, loop, muted e botão de som continuam iguais. MP4 não é recomprimido.
2. **Imagens:** width/height reais em todas as `<img>`. Variantes 828/1280/1920 px via `srcset/sizes` (mesmo corte, mesma qualidade visual). `loading="lazy"` abaixo da dobra. Logo em versão 2x (~240 px).
3. **Fontes:** preconnect já existe. Adicionar fallback métrico (`size-adjust`) para Cormorant/Manrope para eliminar o salto na troca. Manter só os pesos usados.
4. **CLS:** aspect-ratio reservado no vídeo, no mapa e no tour. O banner e o WhatsApp continuam sobrepostos.
5. **JS:** MapLibre só importado quando o mapa se aproxima da tela (IntersectionObserver, margem de 1 tela). Tour 360° continua no clique. GTM continua só após consentimento.
6. **CSS:** o CSS é pequeno; inline crítico só se o build permitir sem risco.

## Expectativa honesta
LCP < 3 s e CLS < 0,1 são prováveis. Já o score ≥ 80 num Moto G em 4G lento depende também do JS do React/GSAP. Se não chegar lá sem mudar o visual, eu digo.

## Verificação
7 arquivos de testes, build, Lighthouse mobile antes/depois (LCP, CLS, peso), Playwright em 320/360/390/430 px × FR/EN/DE. A conferência no site publicado só é possível depois que você publicar; antes disso valido no preview e no build de produção local.
