# Dashboard v16 — Invent Corp · Gestão de Projetos

## O que há de novo na v16 (vs v15)

| Funcionalidade | Descrição |
|---|---|
| ✦ **Migração Automática v15→v16** | Dados do v15 copiados automaticamente para chaves `v16_*` no primeiro acesso |
| ✦ **Briefing de Hoje** | Barra no dashboard com chips de urgência (Go Lives críticos, bloqueios, atrasados) |
| ✦ **KPI Sparklines** | Mini gráficos SVG de tendência em cada card de KPI |
| ✦ **Health Ring Animado** | Anel SVG com transição suave + contador animado |
| ✦ **Feed de Comunicações** | Card no dashboard com histórico recente de movimentações por projeto |
| ✦ **Histórico no Project Hub** | 6ª aba no Hub com timeline de comunicações (enviado/recebido/urgente/resolvido) + filtros |
| ✦ **Insights PMO** | Nova aba "📈 Insights V16" em Gerencial — insights automáticos, distribuição de status, score por PMO |
| ✦ **Snooze de Alertas** | Botões ⏰ 3d / ⏰ 7d para adiar alertas temporariamente |
| ✦ **Timeline de Alertas** | 3ª view na Central de Alertas — lista cronológica com conectores visuais + sidebar PMO |
| ✦ **Kanban Melhorado** | Cards com `border-top` colorido por status e animação hover `translateY(-1px)` |

---

## Arquivos

| Arquivo | Descrição |
|---|---|
| `login.html` | Aurora login com hints de acesso demo |
| `index.html` | Dashboard principal — KPIs + sparklines, health ring animado, briefing bar, feed de comunicações |
| `gerencial.html` | Visão gerencial — Farol · Carga PMO · Calendário Go Live · Portfólio Completo · **Insights V16** |
| `projetos.html` | Projetos — lista/kanban + **Project Hub** (6 abas: Visão Geral · Fases · Atividades · Capa Técnica · Mudanças de Escopo · **Histórico**) |
| `alertas.html` | Central de alertas — Smart Triage kanban · Agrupado por projeto · **Timeline V16** · **Snooze** |
| `admin.html` | Admin — projetos, atividades, usuários, import/export, Data Health |
| `squads.html` | Áreas técnicas — visão por squad/time |
| `utils.js` | Fundação compartilhada — dados, cálculos, auth, UI + 7 novas funções v16 |

---

## Primeiro Acesso

1. Abra `login.html` no navegador
2. Credenciais de demo:

| E-mail | Senha | Papel |
|---|---|---|
| `admin@inventcorp.com` | `admin123` | Admin |
| `editor@inventcorp.com` | `editor123` | Editor |
| `viewer@inventcorp.com` | `viewer123` | Viewer |

3. Dados do v15 são migrados automaticamente — nenhuma ação necessária

---

## Inovações V16 em Detalhe

### Briefing de Hoje (index.html)
Barra discreta abaixo do urgency banner. Aparece automaticamente quando há:
- Projetos com Go Live em até 7 dias
- Bloqueios ativos
- Projetos atrasados

Chips clicáveis levam para a Central de Alertas.

### Insights PMO (gerencial.html → aba "📈 Insights V16")
- **Distribuição de Status**: barra horizontal colorida mostrando % de cada status nos projetos ativos
- **Saúde por PMO**: cards com score 0–100 por gestor (ativos, atrasados, bloqueados)
- **Insights automáticos**: textos gerados em tempo real detectando padrões — PMO em risco, go lives urgentes, taxa de conclusão

### Snooze de Alertas (alertas.html)
Botões `⏰ 3d` e `⏰ 7d` em cada card de alerta permitem silenciá-lo temporariamente. O alerta some da view principal e aparece apenas no filtro "⏰ Adiados (N)". Ao expirar, volta automaticamente.

### Timeline de Alertas (alertas.html → botão ▤)
Terceira view na Central de Alertas. Lista vertical com:
- Conectores visuais coloridos por severidade (pontos vermelhos/amarelos/azuis)
- Sidebar fixa com contagem por PMO
- Suporte a snooze e marcar lido inline

---

## Armazenamento v16

| Chave localStorage | Conteúdo |
|---|---|
| `v16_projetos` | Array de projetos |
| `v16_atividades` | Array de atividades com comentários |
| `v16_users` | Usuários |
| `v16_capas` | Capas técnicas editadas via UI |
| `v16_altescopo` | Histórico de mudanças de escopo |
| `v16_alertasLidos` | Alertas marcados como lidos |
| `v16_alertasSnoozed` | Timestamps de expiração de snooze por alerta |
| `v16_theme` | `dark` ou `light` |
| `v16_historico` | Histórico de comunicações por projeto (override) |
| `inventV16Sidebar` | Estado da sidebar (expandida/colapsada) |

---

## Dados

- **41 projetos reais** do portfólio Invent Corp · Squad Infra · atualizado 24/05/2026
- 19 concluídos · 16 ativos · 3 standby · 3 não iniciados
- PMOs: Anderson · Alex · Giovanni · Fabio
- Capa técnica + histórico para: NAVEPARK, TITANO, OCTOPUS MS, QUELUZ, REVERSE, PTL SP, CRISTAL MG, COUGAR, BR SUPPLY, GUATEMALA, BP, DIAMANTE

---

## Versão

`v16` · Invent Corp · Squad Infra · Criado em maio/2026 · Base: v15 portfólio v8.1 (24/05/2026)
