## Objetivo
Painel interno em `/painel-funil` mostrando a jornada completa de cada lead na página: visitas, seções vistas, cliques no CTA, tempo na página, dispositivo, UTM e ponto de abandono. Tudo via Lovable Cloud (banco próprio) — independente do Pixel.

## Etapas do funil (inferidas das seções existentes)
1. **Visitou** — entrou na página (PageView)
2. **Engajou** — rolou além do Hero
3. **Viu o Kit** — chegou na seção "O Que Está Incluso"
4. **Viu Bônus** — chegou na seção Bônus
5. **Viu Depoimentos** — prova social
6. **Viu Oferta** — chegou na seção de preço
7. **Clicou no CTA** — botão "Quero começar"
8. **Saiu** — registrado no unload (qual seção era a última)

## O que será construído

### 1. Backend (Lovable Cloud)
- Tabela `funnel_events` — uma linha por evento (page_view, section_view, cta_click, exit)
- Tabela `funnel_sessions` — uma linha por visitante/sessão (id, user_agent, device, utm_source/medium/campaign, referrer, country, started_at, last_seen_at, exit_step)
- RLS: insert público (anon) sem retorno; leitura só via server function admin
- Índices em `session_id`, `created_at`, `event_name`

### 2. Tracking no frontend (leve, ~2KB)
- `src/lib/tracker.ts` — gera/persiste `session_id` em sessionStorage, faz batching de eventos (envia a cada 3s ou no `pagehide` via `navigator.sendBeacon`)
- IntersectionObserver nas seções marcadas com `data-funnel-step="..."`
- Listener no CTA (`data-cta="primary"`) → grava `cta_click`
- `pagehide` → grava `exit` com a última seção vista e tempo total

### 3. Endpoint público de ingestão
- `POST /api/public/track` — recebe lote de eventos, valida com Zod, insere via service role
- Sem PII; rate-limit simples por IP/sessão

### 4. Dashboard `/painel-funil` (rota oculta, sem login)
- **Cards de topo**: visitantes únicos, sessões, cliques no CTA, taxa de conversão para clique, tempo médio
- **Gráfico de funil** (barras horizontais) com % de retenção entre cada etapa e onde caiu
- **Tabela de últimas 50 sessões** — hora, dispositivo, UTM, etapas atingidas, ponto de abandono
- **Quebra por fonte (UTM source/medium)** — qual tráfego converte melhor
- Filtros: período (hoje / 7d / 30d), fonte
- Atualização: refetch a cada 30s

## Detalhes técnicos
- Server fns em `src/lib/funnel.functions.ts` (leitura agregada com `supabaseAdmin` carregado dentro do handler)
- Schema com migration; GRANTs explícitos (`anon` apenas INSERT em `funnel_events`/`funnel_sessions`)
- Rota oculta = sem link público, mas qualquer um com a URL acessa (você disse OK)
- Performance: tracker assíncrono, não bloqueia render; eventos enviados em batch

## Riscos / Considerações
- **Sem login** = se o link vazar, qualquer um vê os dados. Posso adicionar uma senha simples por query string (`?k=segredo`) se quiser uma camada extra — me avise.
- AdBlockers podem bloquear `/api/public/track` em alguns navegadores (raro, pois é mesmo domínio)
- Dados começam do zero — só registra a partir do deploy

Posso prosseguir?