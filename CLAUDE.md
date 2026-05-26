# CLAUDE.md — Velox PMO Dashboard

Este arquivo é lido automaticamente pelo Claude Code ao iniciar qualquer sessão.
Contém as regras, padrões e decisões do projeto.

---

## 📁 Estrutura do Projeto

| Arquivo | Descrição |
|---|---|
| `utils.js` | Base compartilhada — carregado por TODAS as páginas |
| `login.html` | Tela de autenticação |
| `index.html` | Dashboard principal (KPIs, briefing, TV mode) |
| `gerencial.html` | Visão gerencial executiva |
| `projetos.html` | Kanban de projetos |
| `squads.html` | Áreas técnicas e Gantt |
| `alertas.html` | Central de alertas / Smart Triage |
| `admin.html` | Administração de usuários e dados |

**GitHub:** `https://github.com/daia85-prog/dashboard-velox-pmo`
**Netlify:** `https://invent-dashboard.netlify.app`
**Arquivos locais:** `C:/Users/daiana.costa/OneDrive - INVENT/Documentos/Claude/Projetos/Code/Dashboard Projetos/V16/`

---

## 🎨 REGRA CRÍTICA — Fundo Aurora

> **NUNCA remover ou alterar o fundo aurora. Mantê-lo em TODAS as páginas sem exceção.**

```css
background: radial-gradient(ellipse 120% 60% at 50% -5%, #1a1060 0%, #0a0520 35%, #030610 70%);
```

---

## 🔧 Padrões de Código

### localStorage — prefixo obrigatório
Todas as chaves usam prefixo `v16_*`:
```js
v16_projetos, v16_atividades, v16_users, v16_squads
v16_capas, v16_altescopo, v16_historico, v16_alertasLidos
v16_currentUser (sessionStorage)
```

### Funções utilitárias (definidas em utils.js)
- `esc(s)` — escape JS+HTML, usar em todos os `onclick="fn('${esc(val)}')"` 
- `escHtml(s)` — escape HTML apenas, usar em `innerHTML`
- `calcStatus(p)` — calcula status do projeto
- `calcRisco(p)` — calcula risco
- `calcAlertaBadge()` — conta alertas não lidos
- `_calcSimilarity()` e `_diasEntre()` — utilitários de histórico

### Constantes de threshold (em utils.js)
```js
THRESHOLD_PARADO_CRITICO = 15  // dias sem atualização → crítico
THRESHOLD_PARADO_ATENCAO = 7   // dias sem atualização → atenção
THRESHOLD_PRAZO_ALERTA   = 30  // dias para prazo → alerta
```

### Squad IDs são strings
```js
'INFRA', 'WMS', 'WCS', 'PMO'  // NÃO são números
```

### Segurança — XSS
- Sempre usar `escHtml()` ao inserir dados do usuário em `innerHTML`
- Sempre usar `esc()` em atributos `onclick` com dados dinâmicos
- NUNCA usar `innerHTML +=` (destrói event listeners)

---

## 🚀 Deploy

Fluxo automático após configuração:
```
Mudança no código → commit → git push → Netlify publica automaticamente
```

Comando de push:
```bash
cd "C:/Users/daiana.costa/OneDrive - INVENT/Documentos/Claude/Projetos/Code/Dashboard Projetos/V16"
git add -A
git commit -m "descrição do que foi feito"
git push
```

---

## 📋 Decisões de Arquitetura

- **SPA puro** — HTML/CSS/JS sem frameworks, sem build step
- **Sem backend** — todos os dados em `localStorage`
- **utils.js carregado primeiro** — todas as páginas dependem dele
- **HOJE e HOJE_ISO** — usar sempre em vez de `new Date()` para datas de exibição
- **tvClock()** — EXCEÇÃO: usa `new Date()` pois é relógio em tempo real

---

## 🗂️ Histórico de Versões

Ver pasta `docs/` para changelog detalhado por versão.
