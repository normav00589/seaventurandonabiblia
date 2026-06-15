## Contexto

Hoje o PageSpeed mobile mostra: Desempenho 92, FCP 2,0s, **LCP 3,0s** (laranja), TBT 80ms, CLS 0. O hero é uma imagem `hero-mockup.webp` de **200 KB, 900×900**, servida pelo CDN da Lovable. Os demais sinais já estão no verde — não vou mexer no que está bom.

Sobre o painel do lead: **já existe** em `/painel-funil` (criado num plano anterior). Ele mostra sessões, etapas atingidas, cliques no CTA, fontes de tráfego (UTM), dispositivos e últimas 50 sessões. Confirmo abaixo o que falta para ele ficar completo do jeito que você descreveu.

---

## Parte 1 — Reduzir LCP do hero (alvo: < 2,5s mobile)

O LCP é a imagem do mockup. Três frentes, todas sem impactar as outras seções:

### 1.1 Servir o hero em tamanhos responsivos (maior ganho)
Hoje carrega 900×900 mesmo em celular de 360px. Vou gerar variantes menores e usar `srcset`/`sizes`:

```text
hero-mockup-480.webp   (~45 KB)   ← mobile
hero-mockup-768.webp   (~95 KB)   ← tablet
hero-mockup-1200.webp  (~180 KB)  ← desktop
```

No `<img>`:
```tsx
<img
  src={hero480}
  srcSet={`${hero480} 480w, ${hero768} 768w, ${hero1200} 1200w`}
  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
  width={900} height={900}
  fetchPriority="high" decoding="async"
/>
```
E ajusto o `<link rel="preload" imagesrcset/imagesizes>` no `head()` para o preload casar com o que a tag escolhe (evita baixar duas vezes).

### 1.2 Adiar o Pixel do Facebook em ~1,5s
Hoje o snippet do Pixel é injetado no primeiro efeito do `index.tsx`. O `fbevents.js` é async, mas a injeção dele ainda compete com o LCP no main thread. Vou:
- Injetar o snippet em `requestIdleCallback` (fallback: `setTimeout(1500)`).
- Manter o `preconnect` para `connect.facebook.net` (já está).
- Disparar `PageView` só depois que o LCP estimado já passou. Eventos de clique (`InitiateCheckout`) continuam imediatos — não afeta atribuição porque o `PageView` cai logo em seguida e o CAPI server-side já dá redundância.

### 1.3 Adiar componentes não-LCP do topo
`UrgencyBar` e `SalesNotifications` montam imediatamente. Vou:
- Manter `UrgencyBar` como está (é leve e está acima da dobra).
- Carregar `SalesNotifications` com `lazy()` + montar após o LCP (`requestIdleCallback`), pois ele só aparece como toast depois de alguns segundos mesmo.

### 1.4 Pequenos ajustes que não custam nada
- `<html lang="pt-BR">` (hoje está `en`) — afeta a11y/SEO, não LCP, mas é trivial.
- Garantir `content-visibility: auto` nas seções abaixo da dobra (bonus, depoimentos, FAQ) para reduzir trabalho de layout inicial.

**Ganho esperado**: LCP de 3,0s → 1,8–2,2s no mobile. FCP deve cair para ~1,6s. TBT, CLS e Performance Score permanecem.

---

## Parte 2 — Painel do Funil (`/painel-funil`)

O painel **já existe** e está coletando: visitou → engajou → viu kit → viu bônus → viu depoimentos → viu oferta → clicou no CTA, mais saída (`exit_step`), tempo, dispositivo, browser, UTM e referrer. Para acessar: `https://seusite.com.br/painel-funil` (rota oculta, sem link público).

Se você quiser, eu também:
- **(a)** Adiciono uma senha simples via query string (`/painel-funil?k=seusegredo`) para impedir acesso se o link vazar.
- **(b)** Adiciono uma seção "Onde mais perdem leads" — destaca visualmente a etapa com maior queda %.
- **(c)** Adiciono exportação CSV das últimas sessões.

Me diz quais desses extras você quer e eu já incluo nesta mesma rodada.

---

## Detalhes técnicos (para referência)

- **Imagens responsivas**: criar 3 variantes via `imagegen--edit_image` (ou `sharp` via script) a partir do `hero-mockup.webp` atual; subir cada uma como asset Lovable e referenciar pelos `.asset.json`.
- **Adiamento do Pixel**: mover a injeção do `FB_PIXEL_SNIPPET` para dentro de `requestIdleCallback` no `useEffect` da `SalesPage` em `src/routes/index.tsx`. `trackFbEvent` (cliques) continua funcionando porque enfileira em `fbq.queue` até o `fbevents.js` carregar.
- **Lazy SalesNotifications**: `const SalesNotifications = lazy(...)` + `<Suspense fallback={null}>` montado em idle.
- **Preload do hero**: trocar `imagesrcset`/`imagesizes` para casar com `<img srcset>`.
- **content-visibility**: classes Tailwind arbitrárias `content-visibility-auto` via `src/styles.css`.

---

## O que NÃO vou tocar
- Bundle, code-split de outras rotas, Pixel CAPI (`fb-capi.functions.ts`), estilo visual, copy, ofertas.
- Painel `/painel-funil` (a menos que você peça os extras a, b, c).

Posso prosseguir?
