# 🚀 Velox PMO Dashboard — Release V16

**Data:** Maio 2026
**Versão:** 16.0 · build 2026.05

| Ambiente | Link | Observação |
|---|---|---|
| 🟡 **Netlify** | https://invent-dashboard.netlify.app/login.html | Principal · limite 300 min/mês |
| 🔵 **GitHub Pages** | https://daia85-prog.github.io/dashboard-velox-pmo/login.html | Backup · sem limite |

---

## O que é o Velox PMO?

O **Velox PMO Dashboard** é a central de inteligência de projetos da Invent Corp.
Em uma única tela, o time de PMO acompanha o **status real de cada projeto**, identifica **riscos e bloqueios** antes que virem problema, e mantém todos os squads e gestores alinhados — sem planilhas, sem e-mails perdidos.

---

## 🖥️ Tela de Login

A primeira impressão já conta. A tela de login foi desenhada para transmitir a identidade do sistema:

- **Fundo industrial animado** — correia transportadora com caixas deslizando, engrenagens girando e fluxo de dados entre módulos. Cada elemento é uma metáfora do sistema: projetos (caixas) fluindo pelo pipeline, passando por pontos de decisão (nós), gerando dados que alimentam o dashboard
- **Terminal ao vivo** (canto superior direito) — simula verificações do sistema em tempo real: `velox auth --init`, `velox health --check`, módulos carregados
- **Ticker inferior** — status contínuo do sistema rolando da esquerda para a direita, sincronizado com o movimento da correia
- **Autenticação por usuário corporativo** — formato `nome.sobrenome@departamento` (ex: `ivan.duarte@infra`)

---

## 📋 Módulos Disponíveis

### 1. Dashboard Principal (`index.html`)
> *Visão executiva do portfólio em tempo real*

- **KPIs do portfólio**: total de projetos, ativos, em risco, bloqueados e concluídos
- **Portfolio Health**: índice de saúde calculado automaticamente com base em status, prazos e bloqueios
- **Farol de projetos**: semáforo visual (🟢 🟡 🔴) por projeto com alertas de prazo
- **Feed de atividades recentes**: últimas ações registradas no sistema
- **Modo TV** (`F11`): projeção automática para salas de reunião, com rotação de slides e atualização em tempo real

---

### 2. Projetos (`projetos.html`)
> *Gestão completa do ciclo de vida de cada projeto*

- Cadastro e edição de projetos com: nome, responsável, PMO, squad, datas, status e % de avanço
- **Cálculo automático de status**: Em dia · Em risco · Atrasado · Bloqueado · Concluído
- **Indicador de risco**: calculado por similaridade de projetos anteriores + dias em atraso
- Filtros por status, responsável, squad e texto livre
- Histórico de atividades por projeto

---

### 3. Gerencial (`gerencial.html`)
> *Visão consolidada para gestores e diretoria*

- Tabela executiva com todos os projetos e indicadores-chave
- **Gráfico de Gantt dinâmico**: linha do tempo visual de cada projeto
- Exportação para impressão com data de geração automática
- Agrupamento por squad, responsável ou status

---

### 4. Squads (`squads.html`)
> *Organização e acompanhamento dos times*

- Cadastro de squads com membros, missão e projetos vinculados
- Expansão/colapso individual por squad (estado salvo no navegador)
- Filtro e busca por nome, área e status
- **Gantt por squad**: visualização dos projetos do time no tempo

---

### 5. Central de Alertas (`alertas.html`)
> *Radar de riscos e pendências*

- Alertas automáticos gerados pelo sistema: projetos atrasados, bloqueados, sem atualização
- **Prioridades**: P0 (crítico) · P1 (alto) · P2 (médio) · P3 (baixo)
- Filtros por prioridade, status e tipo
- Visualização em cards ou lista
- Estado de filtro salvo entre sessões

---

### 6. Administração (`admin.html`)
> *Gestão de usuários e configurações* · 🔐 Acesso restrito: Admin

- Criação e edição de usuários com formato `usuario@departamento`
- **Detecção automática de colisão**: se `joao.silva@pmo` já existe, sugere `joao.silva2@pmo`
- Papéis de acesso: **Admin** · **Editor** · **Viewer**
- Ativação e desativação de contas
- Reset de dados de demonstração

---

## 🔐 Perfis de Acesso

| Papel | O que pode fazer |
|---|---|
| **Admin** | Acesso total — configura usuários, reset de dados, todas as páginas |
| **Editor** | Cria e edita projetos, squads e alertas — não acessa admin |
| **Viewer** | Somente leitura — navega, filtra e visualiza, sem editar |

---

## 🏗️ Como o sistema funciona por baixo

- **Tecnologia**: HTML + CSS + JavaScript puro — sem frameworks, sem dependências externas
- **Armazenamento**: `localStorage` do navegador com prefixo `v16_*`
- **Deploy automático**: GitHub → Netlify (a cada push no branch `main`, o site é atualizado em ~1 min)
- **Responsivo**: adaptado para desktop, com modo compacto em telas menores

---

## 👤 Guia rápido para Ivan Duarte

Olá, Ivan! Seja bem-vindo ao **Velox PMO Dashboard**. 🎉

Suas credenciais de acesso:

| Campo | Valor |
|---|---|
| **Usuário** | `ivan.duarte@infra` |
| **Senha inicial** | `ivan123` |
| **Perfil** | Viewer — visualização completa, sem edição |

### O que você pode explorar:

1. **Faça login** em https://invent-dashboard.netlify.app/login.html
2. No **Dashboard**, confira o resumo do portfólio e o farol de projetos
3. Em **Projetos**, navegue pelos projetos cadastrados e use os filtros
4. Em **Gerencial**, veja a visão consolidada e o Gantt
5. Em **Squads**, explore os times e seus projetos
6. Na **Central de Alertas**, veja os alertas ativos por prioridade

### Sobre sua senha
Na primeira vez que fizer login, o sistema vai pedir para você definir uma senha pessoal. Ela precisa ter:
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos uma letra maiúscula
- ✅ Pelo menos um número
- ✅ Pelo menos um caractere especial (`!@#$%` etc.)

Depois disso, sua senha fica salva e você entra normalmente nas próximas vezes.

### O que anotar enquanto navega:
- Algo que ficou confuso ou pouco intuitivo?
- Alguma informação que você esperava ver e não encontrou?
- Algo que ficou muito bom e deve ser mantido?

> Feedback de quem está vendo pela primeira vez é ouro! 💛

---

## 📦 O que vem na V17

| Feature | Descrição |
|---|---|
| 🔐 Hash de senha | Senhas armazenadas com SHA-256 |
| 👤 Papéis expandidos | Super Admin · Dept Admin · Editor · Viewer |
| 📋 Log de auditoria | Quem criou, editou ou deletou — e quando |
| 🔔 Alerta de deleção | P0 automático na Central quando algo é removido |

---

*Velox PMO · Invent Corp © 2026 · Desenvolvido com Claude (Anthropic)*
