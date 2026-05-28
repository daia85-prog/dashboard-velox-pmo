// ============================================================
// UTILS.JS — V16 · Velox by Invent · Gestão de Projetos PMO
// Fundação compartilhada por todas as páginas
// ============================================================

// ── Data de Referência ─────────────────────────────────────
// let em vez de const para permitir refreshHoje() atualizar após meia-noite
let HOJE = new Date(); HOJE.setHours(0,0,0,0);
let HOJE_ISO = HOJE.toISOString().split('T')[0];
function refreshHoje(){
  HOJE = new Date(); HOJE.setHours(0,0,0,0);
  HOJE_ISO = HOJE.toISOString().split('T')[0];
}

// ── Thresholds centralizados (usados em utils.js e alertas.html) ──
const THRESHOLD_PARADO_CRITICO = 15;  // dias sem update → alerta P1
const THRESHOLD_PARADO_ATENCAO  = 7;  // dias sem update → alerta P2
const THRESHOLD_PRAZO_ALERTA   = 30;  // dias até GoLive → alerta P2

// ── Fases ─────────────────────────────────────────────────
const FASES = [
  '1. Kickoff',
  '2. Levantamento Técnico',
  '3. Provisionamento',
  '4. Implantação',
  '5. Homologação',
  '6. Go Live',
  '7. Encerramento'
];

// ── Atividades Padrão — Infraestrutura ───────────────────
// Base atual: atividades do time de Infra (demais departamentos a adicionar)
const ATIVIDADES_PADRAO = [
  // 1. Kickoff
  {fase:'1. Kickoff',              nome:'Reunião de Kickoff'},
  {fase:'1. Kickoff',              nome:'Definição de Escopo'},
  // 2. Levantamento Técnico
  {fase:'2. Levantamento Técnico', nome:'Levantamento Técnico do Ambiente'},
  {fase:'2. Levantamento Técnico', nome:'Documentação de Arquitetura'},
  // 3. Provisionamento
  {fase:'3. Provisionamento',      nome:'Solicitação de Acessos e Range de IPs'},
  {fase:'3. Provisionamento',      nome:'Solicitação de Equipamentos'},
  {fase:'3. Provisionamento',      nome:'Validação do Ambiente Disponibilizado pelo Cliente'},
  {fase:'3. Provisionamento',      nome:'Elaboração do Procedimento Técnico e Compartilhamento com o Time'},
  {fase:'3. Provisionamento',      nome:'Compartilhamento de Acessos com Demais Times'},
  // 4. Implantação
  {fase:'4. Implantação',          nome:'Acompanhamento na Instalação Física dos Equipamentos'},
  // 5. Homologação — a preencher por outros departamentos
  // 6. Go Live — a preencher por outros departamentos
  // 7. Encerramento
  {fase:'7. Encerramento',         nome:'Aceite Formal do Cliente (Formulário Infraestrutura)'},
];

// ── Mapas Visuais ─────────────────────────────────────────
const STATUS_MAP = {
  'Concluído':    {icon:'✅', cls:'status-done',     color:'#22c55e', bg:'rgba(34,197,94,.15)',  label:'Concluído'},
  'Em andamento': {icon:'🔄', cls:'status-progress', color:'#3b82f6', bg:'rgba(59,130,246,.15)', label:'Em andamento'},
  'Aguardando':   {icon:'⏳', cls:'status-wait',     color:'#f59e0b', bg:'rgba(245,158,11,.15)', label:'Aguardando'},
  'Atrasado':     {icon:'🚨', cls:'status-late',     color:'#ef4444', bg:'rgba(239,68,68,.15)',  label:'Atrasado'},
  'Não Iniciado': {icon:'📋', cls:'status-new',      color:'#94a3b8', bg:'rgba(148,163,184,.15)',label:'Não Iniciado'},
  'Bloqueado':    {icon:'🚫', cls:'status-blocked',  color:'#f97316', bg:'rgba(249,115,22,.15)', label:'Bloqueado'},
  'Standby':      {icon:'⏸', cls:'status-standby',  color:'#64748b', bg:'rgba(100,116,139,.15)',label:'Standby'},
  'Crítico':      {icon:'🔥', cls:'status-critico',  color:'#ef4444', bg:'rgba(239,68,68,.18)',  label:'Crítico'},
};
const RISCO_MAP = {
  'alto':  {label:'Alto',  cls:'risco-alto',  color:'#ef4444', bg:'rgba(239,68,68,.12)',  dot:'🔴'},
  'medio': {label:'Médio', cls:'risco-medio', color:'#f5c300', bg:'rgba(245,195,0,.12)',  dot:'🟡'},
  'baixo': {label:'Baixo', cls:'risco-baixo', color:'#22c55e', bg:'rgba(34,197,94,.12)',  dot:'🟢'},
};
const PRIORIDADE_MAP = {
  'Alta':  {cls:'prio-alta',  color:'#ef4444'},
  'Média': {cls:'prio-media', color:'#f5c300'},
  'Baixa': {cls:'prio-baixa', color:'#22c55e'},
};
const ATIV_STATUS_OPTS = ['Não Iniciado','Em andamento','Aguardando','Concluído'];

// ── Projetos Concluídos / Não Iniciados ───────────────────
// (controlados via p.status nos projetos — arrays mantidos para compatibilidade)
const CONCLUIDOS    = [];
const NAO_INICIADOS = [];

// ── Portfólio Real — Squad Infra · v8 · 24/05/2026 ────────
const PROJETOS_PADRAO = [
  // ── GoLive Urgente ────────────────────────────────────────
  {
    nome: 'TITANO', local: 'Betim - MG', pmo: 'GIOVANNI', resp: 'DAIANA COSTA',
    colaboradores: ['SANCHES', 'FLORÊNCIO', 'THOMAS'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2025-09-01', fim: '2026-05-27', fimAjustado: '',
    bloqueador: 'Contrato SaaS Victor pendente; protocolo técnico Stellantis (rede + painel PLC) não recebido; VPN S2S ATA emitida 22/04 — validação end-to-end pendente; Victor cobrando SOC 2 Type II / ISO 27001',
    diasParado: 0, status: 'Bloqueado',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'OCTOPUS MS', local: 'Campo Grande - MS', pmo: 'ALEX', resp: 'DAIANA COSTA',
    colaboradores: ['GEFERSON MEDINA', 'ROBERTO OROSCO'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2023-12-01', fim: '2026-05-26', fimAjustado: '',
    bloqueador: 'VLAN IA pendente definição; switch credentials/IP pendente; acesso Deivison (implantação) em tratativa com Fábio; senha Grupo Pereira expira em 15 dias',
    diasParado: 0, status: 'Em andamento',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  // ── Próximos GoLives ──────────────────────────────────────
  {
    nome: 'QUELUZ', local: 'Itajaí - SC', pmo: 'FABIO', resp: 'DAIANA COSTA',
    colaboradores: ['MARCOS', 'IVAN', 'THOMAS'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2025-04-01', fim: '2026-06-24', fimAjustado: '2027-01-20',
    bloqueador: 'Ivan — aprovação 4 e-mails pendente antes do envio ao Marcos (TI); cliente aguardando: VM + BD + VPN + whitelist + chamado TOTVS-CON5',
    diasParado: 0, status: 'Em andamento',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'BP', local: 'São Paulo - SP', pmo: 'GIOVANNI', resp: 'DAIANA COSTA',
    colaboradores: ['TIAGO LOUCATELLI', 'ARTUR PESSETTI', 'ERIK ZANETTE'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2024-01-15', fim: '2026-06-23', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Em andamento',
  },
  {
    nome: 'BETA ESTEIO', local: 'Esteio - RS', pmo: 'ANDERSON', resp: 'DAIANA COSTA',
    colaboradores: ['ANA CAROLINA SILVA PRIMO'],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2025-01-20', fim: '2026-08-17', fimAjustado: '',
    bloqueador: 'Ownership de infraestrutura não formalizado — risco de precedente (Beta SP); Anderson engajar cliente: Opção 1 (cliente assume) ou Opção 2 (Invent formaliza)',
    diasParado: 0, status: 'Não Iniciado',
  },
  {
    nome: 'NAVEPARK', local: 'Navegantes - SC', pmo: 'ANDERSON', resp: 'DAIANA COSTA',
    colaboradores: ['GIOVANNI', 'IVAN', 'CAIQUE', 'SANCHES', 'LUAN'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2026-01-16', fim: '2026-08-24', fimAjustado: '2026-10-31',
    bloqueador: 'VMs + credenciais HML e PRD pendentes (Vedamotors); rede dedicada para implantação não configurada; desenho de arquitetura de rede aguardando (solicitado 08/05)',
    diasParado: 0, status: 'Bloqueado',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'MARKET PERU', local: 'Lima - Peru', pmo: 'ALEX', resp: 'DAIANA COSTA',
    colaboradores: ['GUSTAVO ALVES PEREIRA', 'RAFAEL GALLO', 'SANCHES'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2025-01-15', fim: '2026-10-21', fimAjustado: '',
    bloqueador: 'Emulador WCS (acordado em contrato) — Alex sem resposta desde março; VPN site-to-site — retorno Jonathan (FTC) sobre licença pendente; range IP /24 exclusivo para automação pendente',
    diasParado: 0, status: 'Bloqueado',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  // ── Em Andamento ──────────────────────────────────────────
  {
    nome: 'REVERSE', local: 'São Paulo - SP', pmo: 'ALEX', resp: 'DAIANA COSTA',
    colaboradores: ['JOSÉ ROBERTO'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2022-12-01', fim: '2026-09-30', fimAjustado: '',
    bloqueador: 'Aguardando retorno TPC sobre erro no banco Oracle Cloud; SQL Developer/DBeaver não instalados; tablespaces VELOX_DAT/VELOX_IDX e usuário velox não criados; porta 1521 não liberada; Carlos Galvão urgenciou DBA em 21/05 — Fábio Rocha redirecionado',
    diasParado: 0, status: 'Bloqueado',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'PTL SP', local: 'Araçariguama - SP', pmo: 'ANDERSON', resp: 'DAIANA COSTA',
    colaboradores: ['WELTON CYRIACO', 'CAMILA FARIA'],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2026-01-01', fim: '2026-12-31', fimAjustado: '',
    bloqueador: 'Formalização validação NAT por e-mail pendente (combinado com Douglas); IP duplicado 10.142.216.151 a resolver com Nestlé',
    diasParado: 0, status: 'Em andamento',
  },
  {
    nome: 'CRISTAL MG', local: 'Pouso Alegre - MG', pmo: 'GIOVANNI', resp: 'DAIANA COSTA',
    colaboradores: ['CAIQUE', 'SANCHES', 'MARLON', 'IGOR'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2025-09-01', fim: '2026-09-30', fimAjustado: '',
    bloqueador: '3 slots de reunião expirados (30/04, 04/05, 06/05) — Giovanni cobrar Gabriel diretamente; spec servidor + IP + credenciais pendentes; switch gerenciável (decisão Regiane/comercial)',
    diasParado: 0, status: 'Bloqueado',
  },
  {
    nome: 'COUGAR', local: 'Cajamar - SP', pmo: '', resp: 'DAIANA COSTA',
    colaboradores: ['CAIQUE', 'MARLON', 'EDIELSON', 'VINICIUS'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2022-12-01', fim: '2026-12-31', fimAjustado: '',
    bloqueador: 'Link instável no CD Cajamar (vandalismos fibra + rádio); decisão sobre migração on-premise aguardando retorno Regiane — proposta Dell com desconto aguardando aprovação comercial',
    diasParado: 0, status: 'Aguardando',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'ELETRO', local: 'São Paulo - SP', pmo: 'GIOVANNI', resp: 'DAIANA COSTA',
    colaboradores: ['DIOGO CARRIÇO', 'ROGÉRIO FERNANDES'],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2023-09-01', fim: '2023-12-31', fimAjustado: '',
    bloqueador: 'Infra concluída. VPN SoftEther manutenção pós-entrega: renovada até 18/06/2026 — programar antes do vencimento (19 usuários ativos, sem auto-renovação)',
    diasParado: 0, status: 'Concluído',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'BR SUPPLY', local: 'São Paulo - SP', pmo: 'ANDERSON', resp: 'DAIANA COSTA',
    colaboradores: ['EVANDRO GAZOLA'],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2026-05-20', fim: '2026-12-31', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Em andamento',
  },
  {
    nome: 'PETER', local: 'São Paulo - SP', pmo: 'ANDERSON', resp: 'DAIANA COSTA',
    colaboradores: ['CAROLINA MAIA'],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2026-03-01', fim: '2026-12-31', fimAjustado: '',
    bloqueador: 'Credenciais admin (compartilhadas vs individuais) e domínio de autenticação a definir com Carolina Maia (Dyscamp); porta 102 TIA Portal — regra de firewall PLC Siemens pendente',
    diasParado: 0, status: 'Aguardando',
  },
  {
    nome: 'BETA FULL SP', local: 'São Paulo - SP', pmo: 'ANDERSON', resp: 'DAIANA COSTA',
    colaboradores: [],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2025-01-11', fim: '2026-12-31', fimAjustado: '',
    bloqueador: 'Ownership de infraestrutura assumido sem formalização — Anderson engajar cliente: Opção 1 cliente assume / Opção 2 Invent formaliza contrato',
    diasParado: 0, status: 'Não Iniciado',
  },
  {
    nome: 'DIAMANTE', local: 'São Paulo - SP', pmo: 'ANDERSON', resp: 'DAIANA COSTA',
    colaboradores: [],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2026-04-01', fim: '2027-03-31', fimAjustado: '',
    bloqueador: 'Eliane Higino (HND Labs) não retornou reunião técnica solicitada em 09/05 — servidores HML+PRD separados necessários; RAM atual 4GB (abaixo do mínimo); Ivan aguardando avaliação técnica specs degradadas (WhatsApp 12/05)',
    diasParado: 0, status: 'Aguardando',
  },
  {
    nome: 'C&A', local: 'São Paulo - SP', pmo: 'PMO', resp: 'DAIANA COSTA',
    colaboradores: ['CAIQUE'],
    prioridade: 'Baixa', squad: 'INFRA',
    inicio: '2026-05-01', fim: '2026-12-31', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Em andamento',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'GUATEMALA', local: 'Guatemala', pmo: 'GIOVANNI', resp: 'DAIANA COSTA',
    colaboradores: ['MANUEL PEREA'],
    prioridade: 'Alta', squad: 'INFRA',
    inicio: '2026-05-11', fim: '2026-12-31', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Em andamento',
    skipAtivs: ['Acompanhamento na Instalação Física dos Equipamentos'],
  },
  {
    nome: 'MARKET CHILE', local: 'Chile', pmo: 'ALEX', resp: 'DAIANA COSTA',
    colaboradores: [],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2026-05-21', fim: '2027-06-30', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Não Iniciado',
  },
  {
    nome: 'TOLEDO IP', local: 'Interno - Transversal', pmo: '', resp: 'DAIANA COSTA',
    colaboradores: ['GUSTAVO'],
    prioridade: 'Média', squad: 'INFRA',
    inicio: '2026-05-22', fim: '2026-06-30', fimAjustado: '',
    bloqueador: 'Gustavo (Toledo) — retorno sobre padrão de IP câmeras (192.168.1.X vs 192.168.10.X) pendente; cobrar presencialmente na semana de 25/05; resultado serve de base para formalizar padrão único em todos os projetos',
    diasParado: 0, status: 'Aguardando',
  },
  // ── Standby ───────────────────────────────────────────────
  {
    nome: 'FLOWER', local: '—', pmo: '', resp: 'DAIANA COSTA',
    colaboradores: [], prioridade: 'Baixa', squad: 'INFRA',
    inicio: '2026-01-01', fim: '2026-12-31', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Standby',
  },
  {
    nome: 'MASTER', local: '—', pmo: '', resp: 'DAIANA COSTA',
    colaboradores: [], prioridade: 'Baixa', squad: 'INFRA',
    inicio: '2026-01-01', fim: '2026-12-31', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Standby',
  },
  {
    nome: 'WILD FORK', local: '—', pmo: '', resp: 'DAIANA COSTA',
    colaboradores: [], prioridade: 'Baixa', squad: 'INFRA',
    inicio: '2026-01-01', fim: '2026-12-31', fimAjustado: '',
    bloqueador: '', diasParado: 0, status: 'Standby',
  },
  // ── Concluídos ────────────────────────────────────────────
  { nome:'CDSK',            local:'São Paulo - SP',      pmo:'VINICIUS', resp:'DAIANA COSTA',
    colaboradores:['DANIEL VIANA','LUAN','GIOVANNI'], prioridade:'Alta', squad:'INFRA',
    inicio:'2025-11-01', fim:'2026-04-02', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'DIA',             local:'São Paulo - SP',      pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2025-08-01', fim:'2026-04-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  // ── Concluídos históricos ─────────────────────────────────
  { nome:'HEART',           local:'São Paulo - SP',      pmo:'GIOVANNI', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Alta', squad:'INFRA',
    inicio:'2024-06-01', fim:'2025-12-31', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'MARA IV',         local:'São Paulo - SP',      pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2024-01-01', fim:'2025-06-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'SUPER DIV',       local:'São Paulo - SP',      pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2024-03-01', fim:'2025-09-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'OPTIMUS',         local:'São Paulo - SP',      pmo:'GIOVANNI', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2023-06-01', fim:'2024-12-31', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'BELEZA',          local:'São Paulo - SP',      pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Baixa', squad:'INFRA',
    inicio:'2023-01-01', fim:'2024-06-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'BARBECUE',        local:'São Paulo - SP',      pmo:'ALEX',     resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Baixa', squad:'INFRA',
    inicio:'2023-03-01', fim:'2024-03-31', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'CANDELÁRIA',      local:'São Paulo - SP',      pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Baixa', squad:'INFRA',
    inicio:'2023-06-01', fim:'2024-09-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'ESPERANÇA',       local:'São Paulo - SP',      pmo:'GIOVANNI', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Baixa', squad:'INFRA',
    inicio:'2022-06-01', fim:'2023-12-31', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'EUROFARMA',       local:'São Paulo - SP',      pmo:'ALEX',     resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Alta', squad:'INFRA',
    inicio:'2023-01-01', fim:'2024-12-31', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'FDBR',            local:'São Paulo - SP',      pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2022-01-01', fim:'2023-06-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'GAVIÃO',          local:'São Paulo - SP',      pmo:'GIOVANNI', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2022-06-01', fim:'2023-09-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'OCTOPUS SC',      local:'Santa Catarina - SC', pmo:'ALEX',     resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2023-01-01', fim:'2024-06-30', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'PROMOFARMA',      local:'São Paulo - SP',      pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Média', squad:'INFRA',
    inicio:'2023-06-01', fim:'2025-03-31', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'REISADO',         local:'São Paulo - SP',      pmo:'GIOVANNI', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Baixa', squad:'INFRA',
    inicio:'2022-01-01', fim:'2023-03-31', fimAjustado:'', bloqueador:'', diasParado:0, status:'Concluído' },
  // ── Concluídos adicionados v8 ─────────────────────────────
  { nome:'COUGAR FASE 1',   local:'Cajamar - SP',        pmo:'PMO',      resp:'DAIANA COSTA',
    colaboradores:['CAIQUE','MARLON'],  prioridade:'Alta', squad:'INFRA',
    inicio:'2022-12-01', fim:'2024-12-31', fimAjustado:'',
    bloqueador:'', diasParado:0, status:'Concluído' },
  { nome:'TRABALHOS INTERNOS', local:'São Paulo - SP',   pmo:'ANDERSON', resp:'DAIANA COSTA',
    colaboradores:[], prioridade:'Baixa', squad:'INFRA',
    inicio:'2023-01-01', fim:'2025-12-31', fimAjustado:'',
    bloqueador:'', diasParado:0, status:'Concluído' },
];

// ── Squads ────────────────────────────────────────────────
const SQUADS_PADRAO = [
  { id:'INFRA', nome:'Infra', cor:'#22c55e', desc:'Infraestrutura & Conectividade',  icone:'🖧'  },
  { id:'WMS',   nome:'WMS',   cor:'#3b82f6', desc:'Documentação & Processos',        icone:'📄' },
  { id:'WCS',   nome:'Dev',   cor:'#a855f7', desc:'Desenvolvimento & Warehouse Control', icone:'🤖' },
  { id:'PMO',   nome:'PMO',   cor:'#f59e0b', desc:'Gerenciamento de Projetos',       icone:'📋' },
];
let SQUADS = [...SQUADS_PADRAO];

// ── Gantt: distribuição de fases por projeto ──────────────
// Pesos relativos de duração por fase (total = 9)
const FASE_PESOS = [0.5, 1, 1.5, 2, 1.5, 1, 1.5];
function calcGanttFases(p){
  const ini   = new Date(p.inicio).getTime();
  const fim   = new Date(getFimEfetivo(p)||p.fim).getTime();
  const total = fim - ini || 1;
  const totalPeso = FASE_PESOS.reduce((s,v)=>s+v,0);
  let acum = 0;
  return FASES.map((fase, i) => {
    const peso    = FASE_PESOS[i] || 1;
    const start   = new Date(ini + (acum/totalPeso)*total);
    acum += peso;
    const end     = new Date(ini + (acum/totalPeso)*total);
    const ativs   = ATIVIDADES.filter(a=>a.projeto===p.nome&&a.fase===fase);
    const prog    = ativs.length ? Math.round(ativs.filter(a=>a.status==='Concluído').length/ativs.length*100) : 0;
    return { fase, start, end, prog, peso };
  });
}

// ── Capa Técnica — NAVEPARK ───────────────────────────────
const CAPAS_PADRAO = {
  'NAVEPARK': {
    codigo:     'I25.4066',
    cliente:    'Vedamotors',
    produtos:   'CD Navegantes - SC · armazenagem e distribuição Vedamotors',
    semelhanca: '',
    performance: {
      linha:  'N/A — projeto de infraestrutura',
      sorter: 'N/A',
    },
    sistemas: {
      wms:        'WMS Velox (Invent)',
      wcs:        'WCS (Invent)',
      servidor:   'Linux Ubuntu 22.04 LTS + PostgreSQL · servidor físico local no CD Navegantes + OCI (Oracle Cloud) como contingência',
      infra:      'VPN IPSec Fortinet (securegw05.vedamotors.com.br) · VLAN 121 (192.168.121.0/25, GW 192.168.121.1) · AES128/256 + SHA256 + DH14',
      servidorIA: '',
      tv:         '',
    },
    escopo: {
      'Infraestrutura': [
        'Servidor físico local no CD Navegantes (Linux Ubuntu 22.04 LTS + PostgreSQL)',
        'OCI (Oracle Cloud Infrastructure) como contingência — latência aceita ≤10ms local / ≤20ms OCI',
        'VPN IPSec Fortinet — securegw05.vedamotors.com.br · AES128/256 + SHA256 + DH14',
        'VLAN 121 — 192.168.121.0/25 · GW 192.168.121.1 · máscara 255.255.255.128',
      ],
      'Rede': [
        'Rede dedicada para implantação (Wi-Fi projetos/parceiros ou cabeada) com acesso a servidores Velox, VLAN automação e internet restrita',
        'Desenho de arquitetura de rede — VLANs, ranges, Fortigate (aguardando cliente)',
        'Configuração de rede validada com Leonardo Rengel (TI Vedamotors)',
      ],
      'Periféricos': [
        '39 tablets HIGOLE F7R (PO IMP-26007) — problema de fornecimento (sem baterias)',
        'Recomendação de migração para HIGOLE F7G (Win 11 Pro, 8GB RAM) — total 76 unidades nos projetos impactados',
      ],
    },
    recebidos: [
      'VLAN 121 recebida de Leonardo Rengel em 07/05/2026',
      'Config VPN IPSec Fortinet recebida em 07/05/2026',
      'Planilha de Periféricos de Rede disponibilizada por Luan (Engenharia)',
      'Spec de servidores aprovada por Heberton (Vedamotors) em 03/03/2026',
    ],
    observacoes: [
      'Servidor físico local preferível pela latência ≤10ms exigida',
      'OCI configurado como contingência — VMs equivalentes ao hardware local',
      'Leonardo Rengel é o contato de rede/TI na Vedamotors',
      'Heberton é o responsável técnico de aprovação na Vedamotors',
      'Reunião de integração realizada em 28/04/2026 — arquitetura de rede levantada',
    ],
    alteracoesEscopo: [
      {
        data:        '2026-05-08',
        descricao:   'Substituição de tablets HIGOLE F7R por F7G (Win 11 Pro, 8GB RAM)',
        solicitante: 'Daiana Costa + Marcelo Sanches — Invent',
        impacto:     'Aguardando aprovação de fornecimento · 76 unidades total nos projetos impactados',
        status:      'Pendente',
      },
    ],
    pendencias: [
      'Credenciais dos servidores HML e PRD — aguardando Vedamotors (solicitado 08/05/2026)',
      'Rede dedicada para implantação não configurada — aguardando cliente (solicitado 08/05/2026)',
      'Desenho de arquitetura de rede (VLANs, ranges, Fortigate) — aguardando cliente (solicitado 08/05/2026)',
      'Validação do ambiente completo dos servidores HML e PRD',
      'Compartilhamento de acessos com demais times (WCS, WMS)',
    ],
  },
};

// ── Histórico de Comunicações por Projeto ─────────────────
// tipo: 'enviado' | 'recebido' | 'interno' | 'urgente' | 'resolvido'
const HISTORICO_PADRAO = {
  'NAVEPARK': [
    {
      dataISO:'2026-01-16', dataLabel:'16/01/2026',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Leonardo Rengel, Edgar Velter (Vedamotors) + Ivan Duarte',
      titulo:'Especificação Técnica de Servidores — WCS Velox Rev.1',
      corpo:'Primeiro contato formal com o cliente para envio da Especificação Técnica de Servidores. SO: Linux Ubuntu · BD: PostgreSQL · Arquitetura: servidor físico em Navegantes + backup/contingência na Sede · Latência: dentro dos parâmetros recomendados (10–15ms). Documento base com 3 opções: Físico Local, Virtualizado e Cloud. Ivan Duarte copiado para apoio técnico.',
    },
    {
      dataISO:'2026-02-11', dataLabel:'11/02/2026',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Leonardo Rengel, Edgar Velter + Suporte IT Plus',
      titulo:'Follow-up — Confirmação de análise da spec e agendamento de reunião',
      corpo:'Sem retorno desde 16/01. Daia solicita confirmação de que o time analisou a especificação e propõe agendamento de reunião técnica para a próxima semana. Solicita 3 sugestões de datas/horários.',
    },
    {
      dataISO:'2026-02-27', dataLabel:'27/02/2026',
      tipo:'urgente',
      de:'Daiana Costa (Invent)',
      para:'Leonardo Rengel, Edgar Velter + Suporte IT Plus',
      titulo:'Cobrança — Sem retorno desde 16/01',
      corpo:'Retomada com flag de alta prioridade. Infra é item crítico para o cronograma. Solicita confirmação urgente das sugestões de datas para reunião técnica.',
    },
    {
      dataISO:'2026-03-03', dataLabel:'03/03/2026',
      tipo:'recebido',
      de:'Heberton Luiz Hoffmann (Vedamotors)',
      para:'Douglas Alves (Invent)',
      titulo:'Resposta do cliente — "Nada pendente do nosso lado"',
      corpo:'Heberton respondeu diretamente ao Douglas (não à Daia): "do nosso lado não estamos considerando nada pendente — o entendimento é que existem requisitos (já repassados por vocês) que devemos seguir." ⚠ Cliente não reconheceu as pendências de infra (Range IP, VPN, acesso remoto) como responsabilidade dele. Spec de servidores considerada aprovada.',
    },
    {
      dataISO:'2026-03-04', dataLabel:'04/03/2026 09:45',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Gustavo Teixeira, Heberton Luiz Hoffmann + 4 outros',
      titulo:'Agradecimento da aprovação + Formalização de pendências de infra',
      corpo:'Agradecimento pela aprovação da spec de servidores. Formalização das 3 pendências de infra ainda abertas: (1) Range de IP exclusivo para a automação · (2) Criação de acesso VPN para o time Invent · (3) Acesso remoto aos servidores para configuração e suporte. Comunicado via WhatsApp ao Heberton antes do e-mail.',
    },
    {
      dataISO:'2026-03-04T11:32', dataLabel:'04/03/2026 11:32',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Heberton, Gustavo, Leonardo, Edgar, José Jochem, Antônio Weiss',
      titulo:'Solicitação: Range de IPs para Automação (/25)',
      corpo:'E-mail separado formalizando a solicitação de range de 128 endereços IP exclusivo para automação (PLCs, concentradores, sensores). Tabela de informações necessárias enviada: Range de IPs · IP DNS Primário e Secundário · IP Gateway · Máscara de sub-rede · VLAN atribuída (se aplicável).',
    },
    {
      dataISO:'2026-03-04T11:57', dataLabel:'04/03/2026 11:57',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Heberton, Gustavo, Leonardo, Edgar, José Jochem, Antônio Weiss',
      titulo:'Solicitação: Acesso VPN e Acesso Remoto',
      corpo:'E-mail separado com relação completa de colaboradores que precisam de VPN e acesso remoto. Destinos: servidores, PLC. Portas por tipo de acesso. Anexo: Projeto_Navepark_Endereços... (778 KB).',
    },
    {
      dataISO:'2026-03-04T21:53', dataLabel:'04/03/2026 21:53',
      tipo:'interno',
      de:'Daiana Costa (Invent)',
      para:'Heberton Luiz Hoffmann, Anderson Araújo (PMO)',
      titulo:'Reunião de Alinhamento: Cronograma e Prazos',
      corpo:'E-mail para Anderson (PMO) e Heberton solicitando overview do projeto: cronograma geral (todas as áreas), dia do status report e prazos para entregas de infra. Heberton solicitou 3 sugestões de data/horário.',
    },
    {
      dataISO:'2026-03-25', dataLabel:'25/03/2026',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Leonardo Rengel, Heberton Luiz Hoffmann',
      titulo:'Avaliação técnica: WCS Cloud vs. Local',
      corpo:'Resposta à solicitação do cliente de avaliação de servidor cloud. Case de referência compartilhado: 1.200 ciclos/hora, 6,5ms, Grande SP, VPN Site-to-Site. Recomendação padrão mantida: servidor local (≤10ms). Para cloud, link do site e redundância são críticos. Perguntas enviadas ao cliente: infraestrutura de rede disponível no site e provider cloud em uso (AWS/Azure/GCP/OCI).',
    },
    {
      dataISO:'2026-04-22', dataLabel:'22/04/2026 (aprox.)',
      tipo:'interno',
      de:'Anderson Araújo (PMO)',
      para:'Douglas Alves, Marcelo Sanches, Giovanni Crestan + outros',
      titulo:'Reunião de Integração convocada — 28/04 às 9h',
      corpo:'Cliente enviou datas de entrega de infra e software (datas ultrapassam necessidade do projeto). Próprio cliente solicitou reunião para esclarecer cronograma. Daia enviou status de infra para representação da equipe (conflito de agenda).',
    },
    {
      dataISO:'2026-04-28', dataLabel:'28/04/2026',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Heberton, Gustavo, Leonardo, Edgar + CCs',
      titulo:'Formalização pós-reunião 28/04 + Retomada das solicitações',
      corpo:'E-mail de formalização dos alinhamentos da reunião. Definição cloud vs. local finalizada: servidor físico local PRD + OCI como contingência. Sinalizado que seriam enviados e-mails de retomada para Range de IP e VPN.',
    },
    {
      dataISO:'2026-04-28T22:12', dataLabel:'28/04/2026 22:12',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Heberton, Gustavo, Leonardo, Edgar, José Jochem, Antônio Weiss',
      titulo:'Retomada: Range de IP exclusivo para automação',
      corpo:'Retomada da solicitação de 04/03. Pedido de /25 (128 IPs) com: range, gateway, máscara, DNS primário, DNS secundário, VLAN.',
    },
    {
      dataISO:'2026-04-29', dataLabel:'29/04/2026 08:30',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Heberton, Gustavo, Leonardo, Edgar, José Jochem, Antônio Weiss',
      titulo:'Retomada: VPN e Acesso Remoto',
      corpo:'Retomada da solicitação de 04/03. Tabela de usuários por grupo de acesso, origens, destinos, portas e regras de firewall. Anexo: Projeto_Navepark_Endereços... (778KB).',
    },
    {
      dataISO:'2026-04-30', dataLabel:'30/04/2026 20:57',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Heberton, Gustavo, Leonardo + 3 outros',
      titulo:'Sugestão de Agenda — Reunião de Infraestrutura',
      corpo:'3 sugestões de data/horário para reunião de infra: 07/05 09h–10h · 07/05 14h–15h · 08/05 09h–10h.',
    },
    {
      dataISO:'2026-05-07T13:30', dataLabel:'07/05/2026 13:30',
      tipo:'recebido',
      de:'Leonardo Rengel (Vedamotors)',
      para:'Daiana Costa',
      titulo:'✅ Informações de rede recebidas — VLAN 121',
      corpo:'Gateway: 192.168.121.1 · Máscara: 255.255.255.128 (/25) · DNS Primário: 192.168.121.1 · DNS Secundário: N/A · VLAN: 121. Pergunta: Existe a necessidade de DHCP para a rede das automações?',
    },
    {
      dataISO:'2026-05-07T13:50', dataLabel:'07/05/2026 13:50',
      tipo:'recebido',
      de:'Leonardo Rengel (Vedamotors)',
      para:'Daiana Costa',
      titulo:'✅ Configurações VPN IPSec recebidas',
      corpo:'FortiClient VPN IPSec. Gateway: securegw05.vedamotors.com.br. Chave pré-compartilhada fornecida. Fase 1 IKE: AES128/256 + SHA256 + DH14. Credenciais individuais em arquivo ZIP — distribuição via Invent.',
    },
    {
      dataISO:'2026-05-07T15:55', dataLabel:'07/05/2026 15:55–17:50',
      tipo:'recebido',
      de:'Leonardo Rengel ↔ Daiana Costa',
      para:'—',
      titulo:'Confirmação da reunião — 08/05/2026 09h–10h',
      corpo:'Leonardo solicitou usar horário 08/05 (e-mail havia ficado perdido). Daia confirmou e enviou convite para 08/05 09h–10h.',
    },
    {
      dataISO:'2026-05-08T15:46', dataLabel:'08/05/2026 15:46',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Leonardo, Heberton, Edgar | Cc: Anderson, Suporte IT Plus, Douglas',
      titulo:'Pós-reunião 08/05 — Formalização de 2 solicitações',
      corpo:'Reunião produtiva — pontos técnicos finalizados. Formalizadas: (1) Rede para time de implantação: rede dedicada (Wi-Fi projetos/parceiros ou cabeada) com acesso a servidores Velox, VLAN automação e internet restrita. Bloquear: redes sociais, streaming, entretenimento. (2) Credenciais servidores: aguardando credenciais HML e PRD após criação para validação completa.',
    },
    {
      dataISO:'2026-05-08T16:14', dataLabel:'08/05/2026 16:14',
      tipo:'enviado',
      de:'Daiana Costa (Invent)',
      para:'Leonardo Rengel | Cc: Suporte IT Plus',
      titulo:'Resposta sobre DHCP + Solicitação de desenho de rede',
      corpo:'DHCP: Velox trabalha exclusivamente com IP fixo (servidores e dispositivos de automação) — não há necessidade de DHCP na VLAN de automação. Nas demais redes, cliente segue padrão interno. Solicitação: desenho da arquitetura de rede (VLANs, ranges de IP, firewall/Fortigate, posição dos servidores Velox) para organizar documentação e planilha de IPs pela Invent.',
    },
  ],
  'TITANO': [
    { dataISO:'2026-03-30', dataLabel:'30/03/2026', tipo:'interno',
      de:'Giovanni Crestan (Invent)', para:'Equipe + Ivan Duarte',
      titulo:'Call de alinhamento técnico — SaaS OAuth2/PingFederate confirmado',
      corpo:'Confirmação técnica: SaaS OAuth2/PingFederate viável. Resumo encaminhado ao Ivan. Fluxo técnico documentado.' },
    { dataISO:'2026-04-22', dataLabel:'22/04/2026', tipo:'interno',
      de:'Daiana Costa (Invent)', para:'Equipe',
      titulo:'ATA emitida — GoLive confirmado 27/05',
      corpo:'ATA de reunião emitida. GoLive definido para 27/05/2026. Giovanni e equipe alinhados.' },
    { dataISO:'2026-04-27', dataLabel:'27/04/2026', tipo:'interno',
      de:'Ivan Duarte (Invent)', para:'Daiana Costa, Giovanni',
      titulo:'Reunião Ivan 11h — pauta Titano + Navepark',
      corpo:'Revisão executiva dos dois projetos críticos da semana. GoLive Titano reconfirmado para 27/05.' },
    { dataISO:'2026-04-30', dataLabel:'30/04/2026', tipo:'urgente',
      de:'Victor (Stellantis)', para:'Equipe Invent',
      titulo:'Recebido: "Stellantis não permite roteador/modem"',
      corpo:'Victor informou que Stellantis proíbe roteador/modem externo na rede. VPN site-to-site S2S confirmada como única arquitetura aceita.' },
    { dataISO:'2026-04-30', dataLabel:'30/04/2026', tipo:'urgente',
      de:'Equipe Invent', para:'Matheus Azevedo (Stellantis)',
      titulo:'Reunião emergencial Titano — 16:30h',
      corpo:'Reunião emergencial convocada com Matheus Azevedo para resolver bloqueio de rede Stellantis.' },
    { dataISO:'2026-05-07', dataLabel:'07/05/2026', tipo:'interno',
      de:'Giovanni Crestan (Invent)', para:'Edimilson Reis, Victor',
      titulo:'Giovanni retomou acompanhamento técnico',
      corpo:'Giovanni retomou contato com Edimilson/Victor para destravar pendências de protocolo técnico.' },
    { dataISO:'2026-05-08', dataLabel:'08/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Victor (Stellantis)',
      titulo:'Resposta alinhamento técnico VPN/acesso',
      corpo:'Resposta formal com detalhes técnicos de VPN S2S e requisitos de acesso.' },
    { dataISO:'2026-05-11', dataLabel:'11/05/2026', tipo:'recebido',
      de:'Victor (Stellantis)', para:'Daiana Costa',
      titulo:'OAuth2 exigido como autenticação mínima Stellantis',
      corpo:'Victor confirmou que OAuth2 é requisito mínimo da Stellantis para integração.' },
    { dataISO:'2026-05-13', dataLabel:'13/05/2026', tipo:'interno',
      de:'Giovanni Crestan (Invent)', para:'Equipe técnica',
      titulo:'Endpoints Velox compartilhados',
      corpo:'Giovanni compartilhou endpoints: POST teste.velox-by-invent.com/integracao/api/titano/onda' },
    { dataISO:'2026-05-13', dataLabel:'13/05/2026', tipo:'recebido',
      de:'Victor (Stellantis)', para:'Equipe Invent',
      titulo:'Endpoint Click nonprod + reconhecimento de impedimentos infra',
      corpo:'Victor informou endpoint Click nonprod e reconheceu impedimentos de infra do lado Stellantis.' },
    { dataISO:'2026-05-14', dataLabel:'14/05/2026', tipo:'recebido',
      de:'Victor (Stellantis)', para:'Daiana Costa',
      titulo:'Cobrança: credenciais QA para Reply + SOC 2 Type II formalizado',
      corpo:'Victor cobrou credenciais do ambiente QA para Reply + formalizou exigência SOC 2 Type II (1ª vez).' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'interno',
      de:'Thomas (Invent)', para:'Equipe técnica',
      titulo:'Thomas confirmou OAuth2 viável — modelo client_credentials',
      corpo:'Migração Basic Auth + JWT → OAuth2 confirmada tecnicamente. Modelo: client_credentials.' },
    { dataISO:'2026-05-19', dataLabel:'19/05/2026', tipo:'recebido',
      de:'Victor (Stellantis)', para:'Daiana Costa',
      titulo:'Victor retomou cobrança SOC 2 Type II / ISO 27001 (2ª vez)',
      corpo:'Segunda cobrança formal de SOC 2 Type II e ISO 27001 como requisito para contratação SaaS.' },
    { dataISO:'2026-05-25', dataLabel:'25/05/2026', tipo:'urgente',
      de:'Victor (Stellantis)', para:'Daiana Costa',
      titulo:'3ª cobrança SOC 2 Type II — necessário o mais rápido possível',
      corpo:'Victor cobrou pela 3ª vez certificação SOC 2 Type II ou ISO 27001. GoLive previsto para hoje (25/05). Pedido de compra SaaS ainda não assinado. API Click sem alcance — impedimento Stellantis em resolução. Solicita certificação o mais rápido possível.' },
  ],
  'OCTOPUS MS': [
    { dataISO:'2026-05-08', dataLabel:'08/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Geferson Medina (cc Douglas, Alex)',
      titulo:'E-mail IA completo — requisitos infra para Sorter IA',
      corpo:'Requisitos de infra para IA: VLAN dedicada, switch credentials/IP, acesso Deivison (implantação). VMs APP/BD já configuradas.' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'recebido',
      de:'Fábio (Oracle/RDP)', para:'Equipe Invent',
      titulo:'Explicação tabela VOLUMESCANCELADOS — integração Consinco',
      corpo:'Fábio explicou funcionamento da tabela VOLUMESCANCELADOS utilizada na integração com o sistema Consinco do Grupo Pereira.' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'interno',
      de:'Florêncio (Invent)', para:'Equipe VPN',
      titulo:'Guilherme Fantin adicionado na thread VPN',
      corpo:'Florêncio incluiu Guilherme Fantin na thread de VPN FortiClient SSL para acesso ao ambiente.' },
    { dataISO:'2026-05-19', dataLabel:'19/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Geferson Medina',
      titulo:'VLAN IA será criada pelo Grupo Pereira — acesso Deivison em tratativa',
      corpo:'Confirmação de que a VLAN IA será criada pelo Grupo Pereira. Acesso Deivison em tratativa com Fábio.' },
    { dataISO:'2026-05-20', dataLabel:'20/05/2026', tipo:'urgente',
      de:'Sistema (Alerta)', para:'Daiana Costa, Alex',
      titulo:'⚠ Senha Grupo Pereira expirando em 15 dias',
      corpo:'Senha de acesso ao ambiente Grupo Pereira expira em 15 dias. Necessário renovar antes do vencimento.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'recebido',
      de:'Geferson Medina (Grupo Pereira)', para:'Daiana Costa',
      titulo:'Redes Sorter IA definidas: Depósito 10.249.32.0/24 · IA 10.249.43.0/24',
      corpo:'Geferson definiu os ranges de rede: Depósito 10.249.32.0/24, IA 10.249.43.0/24.' },
    { dataISO:'2026-05-22', dataLabel:'22/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Geferson Medina, Fábio',
      titulo:'Macro topologia IA enviada + cobrança acesso Deivison',
      corpo:'Topologia macro de rede IA enviada. Cobrança formal sobre acesso Deivison (implantação) direcionada ao Fábio.' },
    { dataISO:'2026-05-22', dataLabel:'22/05/2026', tipo:'interno',
      de:'Alex (Invent)', para:'Mauricio (NF), Flavio (transporte)',
      titulo:'Alex pediu ajuda: retorno servidor IA da fábrica',
      corpo:'Alex solicitou apoio de Mauricio (NF) e Flavio (transporte) para tratar o retorno do servidor IA da fábrica.' },
  ],
  'QUELUZ': [
    { dataISO:'2026-04-22', dataLabel:'22/04/2026', tipo:'interno',
      de:'Equipe Invent', para:'Ivan Duarte',
      titulo:'Stack técnica fechada (22–24/04)',
      corpo:'Oracle appliance + Ubuntu 24 LTS + API CON5 (base Zaffari/CDSK, 3 fases, 9 integrações) + VPN OpenVPN + whitelist + WTS. 4 e-mails formais prontos aguardando aprovação Ivan para envio ao Marcos.' },
    { dataISO:'2026-05-15', dataLabel:'15/05/2026', tipo:'interno',
      de:'Raphael (Invent)', para:'D\'Muller',
      titulo:'Entrega: Descritivo Funcional REV 2 (Fase 1)',
      corpo:'Raphael entregou o Descritivo Funcional REV 2 da Fase 1 ao cliente D\'Muller.' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'enviado',
      de:'Fábio Ornelas (Invent)', para:'Mario Neis, Tiago Toledo',
      titulo:'Layout executivo elétrico Fase 1 enviado',
      corpo:'Fábio Ornelas enviou layout executivo elétrico da Fase 1 ao Mario/Tiago.' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'urgente',
      de:'Raphael (Invent)', para:'D\'Muller',
      titulo:'Cobrança retorno REV 2 — deadline 26/05',
      corpo:'Raphael cobrou retorno do D\'Muller sobre REV 2. Deadline: 26/05. Ivan aprovação 4 e-mails técnicos ainda pendente.' },
    { dataISO:'2026-05-23', dataLabel:'23/05/2026', tipo:'resolvido',
      de:'Marcos Machado (D\'Muller TI)', para:'Daiana Costa',
      titulo:'✅ Servidor Ubuntu 26.04 LTS ATIVO — 128 GB RAM',
      corpo:'Marcos confirmou: máquina Ubuntu 26.04 LTS ativa com 128 GB RAM. Print fastfetch + df compartilhado. Verificando faixa IP, VLAN e Owners para liberar acessos. Previsão: compartilhar até 26/05.' },
    { dataISO:'2026-05-23', dataLabel:'23/05/2026', tipo:'recebido',
      de:'Ivan Duarte (Invent)', para:'Equipe Queluz',
      titulo:'Rede confirmada: 192.168.11.0/24 — GW .1, servidores .2–.19',
      corpo:'Ivan confirmou rede 192.168.11.0/24. GW .1, servidores .2–.19 reservados para servidores (incl. Velox). A partir de .20: automação Invent. Marcos seguindo configurações.' },
  ],
  'REVERSE': [
    { dataISO:'2026-03-01', dataLabel:'Mar/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'TPC / José Roberto (Zero)',
      titulo:'Definições Oracle enviadas — VELOX_DAT/IDX, user velox',
      corpo:'Enviados requisitos Oracle: tablespaces VELOX_DAT (dados) e VELOX_IDX (índices), usuário velox com CONNECT + RESOURCE, porta 1521 a liberar.' },
    { dataISO:'2026-05-05', dataLabel:'05/05/2026', tipo:'interno',
      de:'José Roberto (Zero)', para:'Daiana Costa',
      titulo:'Acesso aos servidores .79 e .219 — sem DBeaver/SQL Developer',
      corpo:'Zero acessou os servidores 10.201.1.79 e 10.201.1.219. Constatou que não há SQL Developer nem DBeaver instalados. Tablespaces e usuário velox ainda não criados.' },
    { dataISO:'2026-05-12', dataLabel:'12/05/2026', tipo:'urgente',
      de:'Daiana Costa (Invent)', para:'TPC — CC: Douglas, Alex, PSC',
      titulo:'Cobrança formal TPC — sem retorno sobre Oracle',
      corpo:'Cobrança formal enviada com cópia para Douglas, Alex e PSC. TPC sem retorno sobre erro no banco Oracle Cloud até a data.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'recebido',
      de:'Carlos Galvão (TPC)', para:'Daiana Costa',
      titulo:'Carlos urgenciou DBA: "crucial para avançar" — redirecionou Fábio Rocha',
      corpo:'Carlos Galvão classificou a questão do DBA como "crucial para avançar" e redirecionou o Fábio Rocha como focal.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Carlos Galvão, Fábio Rocha',
      titulo:'DBA disponível desde 07/05 — pedido de agendamento',
      corpo:'Resposta ao Carlos: DBA (Zero) disponível desde 07/05. Solicita ajuda para agendar sessão de configuração Oracle.' },
  ],
  'PTL SP': [
    { dataISO:'2026-05-19', dataLabel:'19/05/2026', tipo:'interno',
      de:'Igor Silva (Invent)', para:'Equipe',
      titulo:'MFC instalado no servidor Pré-Prod — Plano Cutover compartilhado',
      corpo:'Igor instalou MFC no servidor Pré-Prod e compartilhou o Plano de Cutover com a equipe.' },
    { dataISO:'2026-05-20', dataLabel:'20/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Jorge Torres, Igor Silva, Douglas',
      titulo:'Convocação "PTL SP - Próximos passos"',
      corpo:'Reunião de alinhamento convocada para definir próximos passos do projeto.' },
    { dataISO:'2026-05-20', dataLabel:'20/05/2026', tipo:'enviado',
      de:'Jorge Torres (Invent)', para:'Rogério Brito (Nestlé)',
      titulo:'IPs dispositivos Invent enviados ao Rogério (Nestlé)',
      corpo:'Lista de IPs dos dispositivos Invent enviada para o Rogério (Rede / Nestlé) para liberação de regras de firewall.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'interno',
      de:'Jorge Torres (Invent)', para:'Dev',
      titulo:'Padpicking usa HTTP 8100, não HTTPS 443',
      corpo:'Avaliação técnica: Padpicking funciona em HTTP porta 8100, não HTTPS 443 como esperado inicialmente. Dev informado.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'resolvido',
      de:'Equipe Invent', para:'Nestlé',
      titulo:'✅ Workshop técnico concluído — ata + notas + resumo interno produzidos',
      corpo:'Workshop técnico realizado com sucesso. Documentação completa: ata, notas técnicas e resumo interno produzidos.' },
    { dataISO:'2026-05-22', dataLabel:'22/05/2026', tipo:'resolvido',
      de:'Ivan Duarte (Invent)', para:'Camila Faria (Nestlé)',
      titulo:'✅ NAT PLC Siemens validado — TIA Portal viável',
      corpo:'NAT validado com Ivan: funciona para PLC Siemens via TIA Portal. Atende concentradores, conversores, RPIs e PLC. Camila informada via WhatsApp (Douglas solicitou).' },
  ],
  'CRISTAL MG': [
    { dataISO:'2026-04-29', dataLabel:'29/04/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Gabriel + Wander Moraes + Clayton',
      titulo:'Pendências formais: Senha Segura, switch, VLAN, acesso remoto',
      corpo:'Formalização de pendências: (1) Senha Segura vs VPN, (2) switch gerenciável, (3) decisão VLAN, (4) acesso remoto servidores. Wander havia enviado spec servidor em 25/04.' },
    { dataISO:'2026-05-04', dataLabel:'04/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Gabriel + Wander Moraes + Clayton + 8 outros',
      titulo:'Retomada e-mail 29/04 — "reforço importância alinhamento pendentes"',
      corpo:'Segundo contato formal reforçando urgência dos alinhamentos pendentes.' },
    { dataISO:'2026-05-04', dataLabel:'04/05/2026', tipo:'recebido',
      de:'Wander Moraes (Cristália)', para:'Daiana Costa',
      titulo:'Tamiris Giovana indicada como focal (~11 usuários Invent)',
      corpo:'Wander indicou Tamiris Giovana como focal para gerenciar lista de acesso de ~11 colaboradores Invent.' },
    { dataISO:'2026-05-11', dataLabel:'11/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Beatryz (Cristália)',
      titulo:'Spec switch Aruba JL680A enviada',
      corpo:'Especificação técnica do switch Aruba Instant On 1930 JL680A enviada para aprovação comercial.' },
    { dataISO:'2026-05-12', dataLabel:'12/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Wander Moraes',
      titulo:'"Sou responsável pela parte técnica, não comercial"',
      corpo:'Resposta ao Wander deixando claro que a responsabilidade de Daia é técnica, não comercial.' },
    { dataISO:'2026-05-14', dataLabel:'14/05/2026', tipo:'recebido',
      de:'Wander Moraes (Cristália)', para:'Daiana Costa',
      titulo:'Topologia PA + Itapira recebida (desenhos em anexo)',
      corpo:'Wander enviou os desenhos de topologia de rede das unidades de Pouso Alegre e Itapira.' },
    { dataISO:'2026-05-14', dataLabel:'14/05/2026', tipo:'recebido',
      de:'Gabriel (Cristália)', para:'Daiana Costa',
      titulo:'Gabriel: "será revisto o orçamento do equipamento?"',
      corpo:'Gabriel questionou se o orçamento do switch será revisto.' },
    { dataISO:'2026-05-14', dataLabel:'14/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Wander, Gabriel, Ivan Duarte',
      titulo:'Reunião convocada 15h — Wander + Gabriel + Ivan',
      corpo:'Reunião técnica convocada para destravar pendências de switch, VLAN e acesso remoto.' },
  ],
  'COUGAR': [
    { dataISO:'2026-04-30', dataLabel:'30/04/2026', tipo:'enviado',
      de:'Equipe Invent', para:'Regiane (Comercial)',
      titulo:'Proposta formal on-premise — Dell com desconto ~R$ 60k',
      corpo:'Proposta formal enviada ao cliente. Dell proposta revisada com desconto nos servidores. Cenário A (on-premise): 3 servidores locais. RTO 2–4 dias. Aguardando retorno Regiane.' },
    { dataISO:'2026-05-10', dataLabel:'10/05/2026', tipo:'resolvido',
      de:'Ivan Duarte (Invent)', para:'Igor Silva, Equipe',
      titulo:'✅ Manutenção PostgreSQL concluída (18h–19h)',
      corpo:'Ivan executou, Igor validou remotamente. Sistema estabilizado. Aguardando decisão comercial sobre on-premise.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'interno',
      de:'Campo (Invent)', para:'Equipe',
      titulo:'Implementação Velox sistêmica concluída — apenas aditivos pendentes',
      corpo:'Velox implementado e funcionando. Itens pendentes são apenas aditivos contratuais.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Douglas',
      titulo:'"Regiane disse que enviou ao cliente, mas não recebi e-mail/retorno"',
      corpo:'Daia informou Douglas que Regiane disse ter enviado proposta ao cliente, mas Daia não recebeu confirmação nem retorno.' },
  ],
  'ELETRO': [
    { dataISO:'2026-06-18', dataLabel:'18/06/2026', tipo:'urgente',
      de:'Sistema (Alerta)', para:'Daiana Costa, Giovanni',
      titulo:'⚠ VPN SoftEther vence em 18/06 — renovação manual necessária',
      corpo:'VPN SoftEther Hub TERCEIROS-BRITANIA vence em 18/06/2026. Sem auto-renovação. Ação manual obrigatória antes do vencimento. 19 usuários ativos (Dev + PLC + DBA + Pós-vendas + Implantação + Infra). Porta 443.' },
  ],
  'BR SUPPLY': [
    { dataISO:'2026-05-14', dataLabel:'14/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Ivan Duarte (IT Plus)',
      titulo:'Convocação reunião preparatória BR Supply',
      corpo:'Reunião preparatória convocada com Ivan/IT Plus para alinhamento antes da reunião com o cliente.' },
    { dataISO:'2026-05-19', dataLabel:'19/05/2026', tipo:'recebido',
      de:'BR Supply', para:'Daiana Costa',
      titulo:'✅ Convite reunião BR Supply × Invent aceito',
      corpo:'Convite para reunião de apresentação/alinhamento aceito.' },
    { dataISO:'2026-05-20', dataLabel:'20/05/2026', tipo:'interno',
      de:'Daiana Costa (Invent)', para:'BR Supply — Evandro Gazola',
      titulo:'✅ Reunião realizada — WMS Spark, escopo Daia definido',
      corpo:'Reunião de alinhamento concluída. WMS: Spark. Escopo Daia: servidores, rede, VPN, ambientes, PTL. Evandro Gazola definido como focal TI.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'recebido',
      de:'Andre Mota (Invent)', para:'Equipe',
      titulo:'BR Supply incluída na lista TV Sorter',
      corpo:'Andre Mota confirmou inclusão do projeto BR Supply na lista de TV Sorter.' },
  ],
  'GUATEMALA': [
    { dataISO:'2026-05-11', dataLabel:'11/05/2026', tipo:'interno',
      de:'Fábio Ornelas (Invent)', para:'Manuel Perea, Andrea Mazariegos, Karla Lamboglia, Giovanni',
      titulo:'Ata PBL Guatemala — Reunião 1',
      corpo:'Fábio Ornelas enviou ata da primeira reunião PBL Guatemala.' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'interno',
      de:'Giovanni Crestan (Invent)', para:'Andrea, Augusto Reyes, Karla, Vanessa Villarreal',
      titulo:'Ata Reunião 2 enviada',
      corpo:'Giovanni enviou ata da segunda reunião de alinhamento Guatemala/Nestlé GT.' },
    { dataISO:'2026-05-19', dataLabel:'19/05/2026', tipo:'interno',
      de:'Giovanni + Daiana + Ivan', para:'Gustavo Torres + equipe GT/PA',
      titulo:'Reunião 3 — Giovanni + Daia + Ivan presentes',
      corpo:'Terceira reunião realizada com a equipe Guatemala/Panamá da Nestlé.' },
    { dataISO:'2026-05-19', dataLabel:'19/05/2026', tipo:'recebido',
      de:'Manuel Perea (Nestlé GT)', para:'Daiana Costa',
      titulo:'ARM tropicalizado recebido + mapping de campos',
      corpo:'Manuel Perea enviou o ARM tropicalizado para o projeto Guatemala + tabela de mapping de campos.' },
  ],
  'BP': [
    { dataISO:'2026-04-30', dataLabel:'30/04/2026', tipo:'recebido',
      de:'Tiago Loucatelli (Baspan)', para:'Daiana Costa',
      titulo:'SQL Express confirmado OK para Velox',
      corpo:'"Licença SQL elevada. Roda na gratuita?" → Daia confirmou: "Velox pode usar versão gratuita (Express)."' },
    { dataISO:'2026-05-04', dataLabel:'04/05/2026', tipo:'recebido',
      de:'Tiago Loucatelli (Baspan)', para:'Daiana Costa',
      titulo:'"Iremos dar sequência em servidor HML"',
      corpo:'Tiago confirmou que irão configurar o servidor HML.' },
    { dataISO:'2026-05-06', dataLabel:'06/05/2026', tipo:'recebido',
      de:'Tiago Loucatelli (Baspan)', para:'Daiana Costa',
      titulo:'Prazo: 2 semanas para HML',
      corpo:'Tiago informou que o prazo para disponibilização do servidor HML é de 2 semanas.' },
    { dataISO:'2026-05-15', dataLabel:'15/05/2026', tipo:'resolvido',
      de:'Daiana Costa (Invent)', para:'Equipe BP',
      titulo:'✅ VM HML 192.168.20.12 ativa — SQL Server Express 2022 rodando',
      corpo:'VM HML IP 192.168.20.12 disponível desde 15/05. Daia testou via TS — SQL Server Express 2022 rodando. VPN configs distribuídas para Sanches, Florêncio e Matheus.' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'recebido',
      de:'Artur Pessetti (Baspan)', para:'Daiana Costa',
      titulo:'"A partir de agora para mim e Erik" — Luiz Mauri saiu',
      corpo:'Artur Pessetti informou que ele e Erik Zanette são os novos contatos de TI. Luiz Mauri saiu da empresa. Novos e-mails: artur.pessetti@baspan.com.br e erik.zanette@baspan.com.br.' },
  ],
  'MARKET PERU': [
    { dataISO:'2025-02-01', dataLabel:'Fev/2025', tipo:'interno',
      de:'Alex (Invent)', para:'Equipe técnica',
      titulo:'Kickoff Peru — CD Nestlé Lima',
      corpo:'Kickoff do projeto de Pick 2 Light para o CD Nestlé em Lima/Peru. Equipe: Gustavo Alves Pereira, Rafael Gallo, Sanches. Emulador WCS acordado em contrato como requisito de integração.' },
    { dataISO:'2026-03-01', dataLabel:'Mar/2026', tipo:'urgente',
      de:'Daiana Costa (Invent)', para:'Alex',
      titulo:'Alex sem resposta sobre emulador WCS desde março',
      corpo:'Alex sem retorno sobre o emulador WCS acordado em contrato. Item crítico para avançar com a integração. Solicitação de retorno urgente.' },
    { dataISO:'2026-03-15', dataLabel:'Mar/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Jonathan (FTC)',
      titulo:'Solicitação VPN site-to-site + range IP /24',
      corpo:'Solicitação de VPN site-to-site para acesso ao CD Lima. Pedido de range IP /24 exclusivo para automação (PLCs, concentradores, sensores). Aguardando retorno Jonathan (FTC) sobre licença VPN.' },
    { dataISO:'2026-05-08', dataLabel:'08/05/2026', tipo:'interno',
      de:'Daiana Costa (Invent)', para:'Alex, Equipe técnica',
      titulo:'Avaliar migração tablets HIGOLE F7R → F7G',
      corpo:'Tablets HIGOLE F7R do Peru impactados pelo problema de fornecimento (sem baterias). Recomendação: migrar para F7G (Win 11 Pro, 8GB RAM) — parte das 76 unidades dos projetos impactados.' },
    { dataISO:'2026-05-11', dataLabel:'11/05/2026', tipo:'interno',
      de:'Giovanni Crestan (Invent)', para:'Daiana Costa',
      titulo:'Diagrama de redes atribuído a Daia — responsabilidade do cliente',
      corpo:'Giovanni atribuiu diagrama de redes a Daia. Daia informou ao time que o diagrama de rede é responsabilidade do cliente, não da Invent.' },
    { dataISO:'2026-05-11', dataLabel:'11/05/2026', tipo:'interno',
      de:'Luan (Invent)', para:'Equipe técnica',
      titulo:'Projeto elétrico painel principal enviado',
      corpo:'Luan enviou o projeto elétrico do painel principal para a equipe técnica.' },
    { dataISO:'2026-05-13', dataLabel:'13/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Time Falabella (10 destinatários) — CC: Douglas, Ivan, Giovanni',
      titulo:'Reunião VPN S2S solicitada ao time Falabella (em espanhol)',
      corpo:'Daia solicitou reunião para VPN site-to-site em espanhol. 2 opções de data: 15/05 às 14:30 e 18/05 às 11:00 BRT.' },
    { dataISO:'2026-05-13', dataLabel:'13/05/2026', tipo:'recebido',
      de:'David Larenas (Falabella)', para:'Nicolas Vildoso, Lidia Navarro, Francisco',
      titulo:'Encaminhou pedido de reunião: "favor pueden revisar y enviar la cita"',
      corpo:'David Larenas encaminhou o pedido de reunião para Nicolas Vildoso, Lidia Navarro e Francisco para revisão e confirmação de data.' },
    { dataISO:'2026-05-14', dataLabel:'14/05/2026', tipo:'interno',
      de:'Giovanni Crestan (Invent)', para:'Equipe',
      titulo:'DWG executivo Sorter enviado à equipe',
      corpo:'Giovanni enviou o DWG executivo do Sorter para a equipe técnica do projeto.' },
    { dataISO:'2026-05-18', dataLabel:'18/05/2026', tipo:'recebido',
      de:'IPC (j.villena)', para:'Equipe Invent',
      titulo:'Ata reunião 13/05 do Sorter recebida da IPC',
      corpo:'IPC (j.villena) enviou a ata da reunião de 13/05 sobre o Sorter.' },
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'interno',
      de:'Giovanni Crestan (Invent)', para:'Time Tottus/Falabella',
      titulo:'Gantt ajustado + entregáveis enviados ao time Tottus',
      corpo:'Giovanni enviou o Gantt atualizado e a lista de entregáveis do projeto ao time Tottus/Falabella.' },
  ],
  'C&A': [
    { dataISO:'2026-05-01', dataLabel:'Mai/2026', tipo:'interno',
      de:'PMO (Invent)', para:'Daiana Costa, Caique',
      titulo:'Kickoff C&A — projeto iniciado',
      corpo:'Projeto C&A iniciado em maio/2026. Equipe técnica: Caique. Escopo técnico em definição.' },
    { dataISO:'2026-05-22', dataLabel:'22/05/2026', tipo:'resolvido',
      de:'Flavio Rossi (C&A)', para:'Daiana Costa, Caique',
      titulo:'✅ Extensão Edielson aprovada — deploy transferido para Caique',
      corpo:'Extensão aprovada por Flavio Rossi (A2029084) em 22/05. Deploy transferido de Florêncio para Caique (Pós-vendas). Chamado Jira BKYKVBYRWE em andamento. CC: 11931407 · Loc EC.' },
  ],
  'MARKET CHILE': [
    { dataISO:'2026-05-21', dataLabel:'21/05/2026', tipo:'interno',
      de:'Andre Mota (Invent)', para:'Equipe',
      titulo:'Market Chile listado no TV Sorter — infra a mapear',
      corpo:'Andre Mota incluiu Market Chile na lista de TV Sorter para indicadores de operação (21/05). Infra a mapear — levantamento técnico a iniciar.' },
  ],
  'TOLEDO IP': [
    { dataISO:'2026-05-22', dataLabel:'22/05/2026', tipo:'interno',
      de:'Daiana Costa (Invent)', para:'Gustavo (Toledo)',
      titulo:'Padrão de IP câmeras — 192.168.1.X vs 192.168.10.X',
      corpo:'Projeto interno transversal iniciado para definir padrão único de endereçamento IP de câmeras em todos os projetos Invent. Aguardando retorno de Gustavo (Toledo) sobre qual padrão adotar. Cobrar presencialmente na semana de 25/05. Resultado define documentação técnica padrão.' },
  ],
  'DIAMANTE': [
    { dataISO:'2026-05-09', dataLabel:'09/05/2026', tipo:'enviado',
      de:'Daiana Costa (Invent)', para:'Eliane Higino (HND Labs) — CC: Ivan, Douglas',
      titulo:'Solicitação reunião técnica — servidores + plano de contingência',
      corpo:'Reunião técnica solicitada com HND Labs (Eliane Higino) para discutir specs de servidores HML+PRD separados e plano de contingência. Datas propostas: 11 ou 12/05. Eliane não retornou.' },
    { dataISO:'2026-05-12', dataLabel:'12/05/2026', tipo:'interno',
      de:'Ivan Duarte (Invent)', para:'Daiana Costa',
      titulo:'Ivan aguardando avaliação técnica specs degradadas',
      corpo:'Ivan solicitou via WhatsApp avaliação técnica sobre as specs degradadas (RAM 4GB — abaixo do mínimo). Aguarda retorno.' },
  ],
};

function getHistoricoForProject(projNome){
  const overrides = JSON.parse(localStorage.getItem('v16_historico')||'{}');
  if(overrides[projNome]) return overrides[projNome];
  return HISTORICO_PADRAO[projNome] || [];
}
function saveHistoricoEvent(projNome, evento){
  const overrides = JSON.parse(localStorage.getItem('v16_historico')||'{}');
  if(!overrides[projNome]) overrides[projNome] = JSON.parse(JSON.stringify(HISTORICO_PADRAO[projNome]||[]));
  overrides[projNome].unshift(evento); // mais recente no topo
  overrides[projNome].sort((a,b)=>(b.dataISO||'').localeCompare(a.dataISO||''));
  localStorage.setItem('v16_historico', JSON.stringify(overrides));
}

// ── Usuários Padrão ───────────────────────────────────────
const DEPARTAMENTOS = [
  {val:'infra',       lbl:'Infraestrutura'},
  {val:'eletrica',    lbl:'Elétrica'},
  {val:'mecanica',    lbl:'Mecânica'},
  {val:'dev',         lbl:'Dev'},
  {val:'pmo',         lbl:'PMO'},
  {val:'doc',         lbl:'Documentação'},
  {val:'posvendas',   lbl:'Pós-vendas'},
  {val:'implantacao', lbl:'Implantação'},
];

const USUARIOS_PADRAO = [
  {id:'u1', nome:'Administrador', email:'admin@pmo', senha:'Xm7!qK3@rPnL9#vJ',
   papel:'admin', paginas:['all'], ativo:true, primeiroAcesso:false},
  {id:'u2', nome:'Editor Padrão', email:'editor@pmo', senha:'Bw4#tGhR2$nYcP8!',
   papel:'editor', paginas:['index','gerencial','projetos','squads','alertas'], ativo:true, primeiroAcesso:false},
  {id:'u3', nome:'Visualizador', email:'viewer@pmo', senha:'Dp6@wKmT5#jFxN3$',
   papel:'viewer', paginas:['index','gerencial','squads'], ativo:true, primeiroAcesso:false},
  {id:'u4', nome:'Ivan Duarte', email:'ivan.duarte@infra', senha:'ivan123',
   papel:'viewer', paginas:['index','gerencial','projetos','squads','alertas'], ativo:true, primeiroAcesso:true},
];

// ── Estado Global ─────────────────────────────────────────
let PROJETOS   = [];
let ATIVIDADES = [];
let USUARIOS   = [];

// ── Funções de Cálculo ────────────────────────────────────
function getFimEfetivo(p){
  return (p.fimAjustado && p.fimAjustado.trim()) ? p.fimAjustado : p.fim;
}

function calcStatus(p){
  if(CONCLUIDOS.includes(p.nome))   return 'Concluído';
  if(NAO_INICIADOS.includes(p.nome))return 'Não Iniciado';
  if(p.status && p.status.trim())   return p.status;
  const ini = new Date(p.inicio);
  if(HOJE < ini) return 'Não Iniciado';
  const fe = getFimEfetivo(p);
  if(!fe) return 'Em andamento';
  if(HOJE > new Date(fe)) return 'Atrasado';
  return 'Em andamento';
}

function calcProgresso(p){
  const ativs = ATIVIDADES.filter(a => a.projeto === p.nome);
  if(!ativs.length){
    const st = calcStatus(p);
    if(st === 'Concluído')    return 100;
    if(st === 'Não Iniciado') return 0;
    const ini = new Date(p.inicio).getTime();
    const fe  = new Date(getFimEfetivo(p)||p.fim).getTime();
    const now = HOJE.getTime();
    if(!fe||fe===ini) return 30;
    return Math.min(95, Math.max(5, Math.round((now-ini)/(fe-ini)*100)));
  }
  const total = ativs.length;
  const done  = ativs.filter(a => a.status === 'Concluído').length;
  return Math.round(done/total*100);
}

function calcFaseIdx(p){
  const ativs = ATIVIDADES.filter(a => a.projeto === p.nome);
  if(!ativs.length) return 0;
  let lastDone = -1;
  FASES.forEach((f,i) => {
    const fa = ativs.filter(a => a.fase === f);
    if(fa.length && fa.every(a => a.status === 'Concluído')) lastDone = i;
  });
  return Math.min(lastDone + 1, FASES.length - 1);
}

function calcRisco(p){
  const st = calcStatus(p);
  if(st === 'Concluído' || st === 'Não Iniciado' || st === 'Standby') return 'baixo';
  const fe  = getFimEfetivo(p);
  const d   = fe ? Math.round((new Date(fe) - HOJE) / 86400000) : Infinity;
  const alta = p.prioridade === 'Alta';
  const bloq = !!(p.bloqueador && p.bloqueador.trim());
  const parado = calcDiasParadoAuto(p);
  if(d < 0)                                 return 'alto';
  if(parado >= THRESHOLD_PARADO_CRITICO)    return 'alto';
  if(d <= THRESHOLD_PRAZO_ALERTA && alta)   return 'alto';
  if(bloq && alta)   return 'alto';
  if(d <= 60 || alta || bloq) return 'medio';
  return 'baixo';
}

function isCritico(p){ return calcRisco(p) === 'alto'; }

// Conta alertas P0+P1 não lidos — badge do sidebar (todas as páginas)
function calcAlertaBadge(){
  const lidos = JSON.parse(localStorage.getItem('v16_alertasLidos')||'{}');
  let count = 0;
  PROJETOS.forEach(p => {
    const st    = calcStatus(p);
    if(st==='Concluído'||st==='Standby'||st==='Não Iniciado') return;
    const isAtras = st === 'Atrasado';
    const isBloq  = !!(p.bloqueador && p.bloqueador.trim());
    const parado  = calcDiasParadoAuto(p);
    if(isAtras && isBloq){ if(!lidos[`p0_${p.nome}`])    count++; return; }
    if(isAtras            && !lidos[`atras_${p.nome}`])  count++;
    if(isBloq             && !lidos[`bloq_${p.nome}`])   count++;
    if(parado >= THRESHOLD_PARADO_CRITICO && !lidos[`parado_${p.nome}`]) count++;
  });
  return count;
}
function updateAlertBadge(){
  const n = calcAlertaBadge();
  const el = document.getElementById('nav-alertas-label');
  if(!el) return;
  el.innerHTML = n > 0
    ? `Alertas <span style="background:#ef4444;color:#fff;font-size:9px;padding:1px 5px;border-radius:10px;margin-left:4px">${n}</span>`
    : 'Alertas';
}

function calcWorkload(){
  const ativos = PROJETOS.filter(p => {
    const st = calcStatus(p);
    return st !== 'Concluído' && st !== 'Não Iniciado' && st !== 'Standby';
  });
  const pmos = {};
  ativos.forEach(p => {
    const raw = (p.pmo || '').trim();
    const pmo = (raw === '' || raw === 'PMO') ? 'Sem PMO' : raw;
    if(!pmos[pmo]) pmos[pmo] = {total:0, criticos:0, bloqueados:0, atrasados:0, projetos:[]};
    pmos[pmo].total++;
    pmos[pmo].projetos.push(p);
    if(isCritico(p))                         pmos[pmo].criticos++;
    if(p.bloqueador && p.bloqueador.trim())  pmos[pmo].bloqueados++;
    if(calcStatus(p) === 'Atrasado')         pmos[pmo].atrasados++;
  });
  return pmos;
}

// ── Auto-cálculo de Dias Parado ───────────────────────────
// (inovação V15: calcula automaticamente a partir da última atividade)
function calcDiasParadoAuto(p){
  const ativs = ATIVIDADES.filter(a => a.projeto === p.nome && a.status !== 'Concluído');
  if(!ativs.length) return p.diasParado || 0;
  let maisRecente = null;
  ativs.forEach(a => {
    (a.comentarios || []).forEach(c => {
      const d = new Date(c.dataISO);
      if(!maisRecente || d > maisRecente) maisRecente = d;
    });
  });
  if(!maisRecente) return p.diasParado || 0;
  maisRecente.setHours(0,0,0,0);
  const dias = Math.round((HOJE - maisRecente) / 86400000);
  return Math.max(0, dias);
}

// ── Portfolio Health Score (V15 exclusivo) ────────────────
// Normalizado por projeto — não penaliza portfólios maiores
function calcPortfolioHealth(){
  const ativos = PROJETOS.filter(p => {
    const st = calcStatus(p); return st !== 'Concluído' && st !== 'Não Iniciado' && st !== 'Standby';
  });
  if(!ativos.length) return 100;
  let totalPenalty = 0;
  ativos.forEach(p => {
    let penalty = 0;
    const r = calcRisco(p);
    if(r === 'alto')  penalty += 40;
    if(r === 'medio') penalty += 20;
    if(p.bloqueador && p.bloqueador.trim()) penalty += 20;
    const pst = calcStatus(p);
    if(pst === 'Atrasado')  penalty += 20;
    if(pst === 'Bloqueado') penalty += 15;
    totalPenalty += Math.min(100, penalty);
  });
  const avgPenalty = totalPenalty / ativos.length;
  return Math.max(0, Math.min(100, Math.round(100 - avgPenalty)));
}

// ── Capa ──────────────────────────────────────────────────
function getCapaForProject(projNome){
  const overrides = JSON.parse(localStorage.getItem('v16_capas') || '{}');
  if(overrides[projNome]) return overrides[projNome];
  return CAPAS_PADRAO[projNome] || null;
}
function saveCapaForProject(projNome, capaData){
  const overrides = JSON.parse(localStorage.getItem('v16_capas') || '{}');
  overrides[projNome] = capaData;
  localStorage.setItem('v16_capas', JSON.stringify(overrides));
}
function getMergedAlteracoes(p){
  const capa = getCapaForProject(p.nome);
  const base = (capa && capa.alteracoesEscopo) || [];
  const override = JSON.parse(localStorage.getItem('v16_altescopo') || '{}')[p.nome];
  if(override) return override;
  return base.map(a => ({...a}));
}
function saveAltEscopoOverrides(projNome, arr){
  const all = JSON.parse(localStorage.getItem('v16_altescopo') || '{}');
  all[projNome] = arr;
  localStorage.setItem('v16_altescopo', JSON.stringify(all));
}

// ── Projetos demo a remover do portfólio (lista histórica) ──
const _PROJETOS_DEMO_REMOVER = ['EXPRESSO 24','LOGBR NORDESTE','SMARTLOG SP','MADERO CD CURITIBA','BRLOGISTIC RJ'];

// ── Data I/O ──────────────────────────────────────────────
function loadData(){
  refreshHoje(); // garante que HOJE é sempre a data atual (fix: sessões abertas passando da meia-noite)
  // ── V16 Migration from V15 ──
  if (!localStorage.getItem('v16_projetos') && localStorage.getItem('v15_projetos')) {
    try { localStorage.setItem('v16_projetos', localStorage.getItem('v15_projetos')); } catch(e){}
  }
  if (!localStorage.getItem('v16_atividades') && localStorage.getItem('v15_atividades')) {
    try { localStorage.setItem('v16_atividades', localStorage.getItem('v15_atividades')); } catch(e){}
  }
  if (!localStorage.getItem('v16_users') && localStorage.getItem('v15_users')) {
    try { localStorage.setItem('v16_users', localStorage.getItem('v15_users')); } catch(e){}
  }
  if (!localStorage.getItem('v16_capas') && localStorage.getItem('v15_capas')) {
    try { localStorage.setItem('v16_capas', localStorage.getItem('v15_capas')); } catch(e){}
  }
  if (!localStorage.getItem('v16_altescopo') && localStorage.getItem('v15_altescopo')) {
    try { localStorage.setItem('v16_altescopo', localStorage.getItem('v15_altescopo')); } catch(e){}
  }
  if (!localStorage.getItem('v16_historico') && localStorage.getItem('v15_historico')) {
    try { localStorage.setItem('v16_historico', localStorage.getItem('v15_historico')); } catch(e){}
  }
  try {
    const raw = localStorage.getItem('v16_projetos');
    PROJETOS = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(PROJETOS_PADRAO));
  } catch(e){ PROJETOS = JSON.parse(JSON.stringify(PROJETOS_PADRAO)); }
  // Migração: renomear 'OCTOPUSMS' → 'OCTOPUS MS' se existir no localStorage
  let migChanged = false;
  PROJETOS.forEach(p => { if(p.nome === 'OCTOPUSMS'){ p.nome = 'OCTOPUS MS'; migChanged = true; } });
  if(migChanged){
    try {
      const rawA = localStorage.getItem('v16_atividades');
      if(rawA){ const ativs = JSON.parse(rawA).map(a=>{if(a.projeto==='OCTOPUSMS')a.projeto='OCTOPUS MS';return a;}); localStorage.setItem('v16_atividades',JSON.stringify(ativs)); }
    } catch(e){}
    localStorage.setItem('v16_projetos', JSON.stringify(PROJETOS));
  }
  // Migrações pontuais — executam apenas uma vez via flag persistente
  if(!localStorage.getItem('v16_mig_v8_done')){
    let migSave = false;
    // ELETRO → Concluído
    PROJETOS.forEach(p => {
      if(p.nome === 'ELETRO' && p.status === 'Em andamento'){
        p.status = 'Concluído'; p.fim = '2023-12-31';
        p.bloqueador = 'Infra concluída. VPN SoftEther manutenção pós-entrega: renovada até 18/06/2026 — programar antes do vencimento (19 usuários ativos, sem auto-renovação)';
        migSave = true;
      }
    });
    // QUELUZ pmo GALLO → FABIO
    PROJETOS.forEach(p => { if(p.nome==='QUELUZ' && p.pmo==='GALLO'){ p.pmo='FABIO'; migSave=true; } });
    // COUGAR pmo LEANDRO → ''
    PROJETOS.forEach(p => { if(p.nome==='COUGAR' && p.pmo==='LEANDRO'){ p.pmo=''; migSave=true; } });
    if(migSave) localStorage.setItem('v16_projetos', JSON.stringify(PROJETOS));
    localStorage.setItem('v16_mig_v8_done', '1');
  }
  // Limpar projetos demo antigos automaticamente
  const antes = PROJETOS.length;
  PROJETOS = PROJETOS.filter(p => !_PROJETOS_DEMO_REMOVER.includes(p.nome));
  if(PROJETOS.length !== antes){
    // Remove atividades dos projetos demo também
    try {
      const rawA = localStorage.getItem('v16_atividades');
      if(rawA){
        const ativs = JSON.parse(rawA).filter(a => !_PROJETOS_DEMO_REMOVER.includes(a.projeto));
        localStorage.setItem('v16_atividades', JSON.stringify(ativs));
      }
    } catch(e){}
    localStorage.setItem('v16_projetos', JSON.stringify(PROJETOS));
  }
  // Merge automático: adiciona projetos novos do portfólio padrão que ainda não existem
  let mergeChanged = false;
  PROJETOS_PADRAO.forEach(p => {
    if(!PROJETOS.find(x => x.nome === p.nome)){
      PROJETOS.push(JSON.parse(JSON.stringify(p)));
      mergeChanged = true;
    }
  });
  if(mergeChanged) localStorage.setItem('v16_projetos', JSON.stringify(PROJETOS));
  try {
    const raw = localStorage.getItem('v16_atividades');
    ATIVIDADES = raw ? JSON.parse(raw) : _buildDefaultActivities();
  } catch(e){ ATIVIDADES = _buildDefaultActivities(); }
  // Gera atividades para projetos novos que ainda não têm nenhuma
  {
    let ativsChanged = false;
    PROJETOS_PADRAO.forEach(p => {
      if(p.status === 'Não Iniciado' || p.status === 'Standby') return;
      const projAtivs = ATIVIDADES.filter(a => a.projeto === p.nome);
      const jaTemAtivs = projAtivs.length > 0;
      // Smart migration: se todas as atividades estão em branco (Não Iniciado, sem comentários)
      // E existe um _DEMO_STATUS novo para este projeto → regenera com dados reais
      const map = _DEMO_STATUS[p.nome] || {};
      const hasDemoData = Object.values(map).some(v => v.status !== 'Não Iniciado' || (v.comentarios && v.comentarios.length > 0));
      const allBlank = jaTemAtivs && projAtivs.every(a => a.status === 'Não Iniciado' && (!a.comentarios || a.comentarios.length === 0));
      if(!jaTemAtivs || (allBlank && hasDemoData)){
        // Remove entradas em branco e regenera com _DEMO_STATUS
        ATIVIDADES = ATIVIDADES.filter(a => a.projeto !== p.nome);
        const skip = p.skipAtivs || [];
        ATIVIDADES_PADRAO.forEach(a => {
          if(skip.includes(a.nome)) return;
          const demo = map[a.nome] || {status:'Não Iniciado', resp:'', comentarios:[]};
          ATIVIDADES.push({
            projeto: p.nome, fase: a.fase, nome: a.nome,
            status: demo.status, resp: demo.resp || '',
            comentarios: JSON.parse(JSON.stringify(demo.comentarios || [])),
          });
        });
        ativsChanged = true;
      }
    });
    if(ativsChanged) localStorage.setItem('v16_atividades', JSON.stringify(ATIVIDADES));
  }
  try {
    const raw = localStorage.getItem('v16_squads');
    SQUADS = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SQUADS_PADRAO));
  } catch(e){ SQUADS = JSON.parse(JSON.stringify(SQUADS_PADRAO)); }
}
function saveSquads(){
  localStorage.setItem('v16_squads', JSON.stringify(SQUADS));
}
function saveData(){
  localStorage.setItem('v16_projetos',   JSON.stringify(PROJETOS));
  localStorage.setItem('v16_atividades', JSON.stringify(ATIVIDADES));
}
function loadUsers(){
  try {
    const raw = localStorage.getItem('v16_users');
    USUARIOS = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(USUARIOS_PADRAO));
  } catch(e){ USUARIOS = JSON.parse(JSON.stringify(USUARIOS_PADRAO)); }
  // Migração: garante que usuários novos do USUARIOS_PADRAO sejam adicionados
  // automaticamente, sem apagar usuários existentes
  let changed = false;
  USUARIOS_PADRAO.forEach(padrao => {
    const existe = USUARIOS.find(u => u.email === padrao.email || u.id === padrao.id);
    if(!existe){ USUARIOS.push(JSON.parse(JSON.stringify(padrao))); changed = true; }
  });
  // Migração: garante flag primeiroAcesso em usuários antigos
  const IDS_DEMO = ['u1','u2','u3'];
  USUARIOS.forEach(u => {
    if(u.primeiroAcesso === undefined){
      u.primeiroAcesso = !IDS_DEMO.includes(u.id);
      changed = true;
    }
  });
  if(changed) saveUsers();
}
function saveUsers(){
  localStorage.setItem('v16_users', JSON.stringify(USUARIOS));
}
// ── Status inicial das atividades por projeto ─────────────
const _DEMO_STATUS = {

  // ── NAVEPARK ────────────────────────────────────────────
  'NAVEPARK': {
    'Reunião de Kickoff':                  {status:'Concluído',    resp:'DAIANA COSTA', comentarios:[{texto:'Kickoff realizado. Spec técnica de servidores enviada para Vedamotors (Linux Ubuntu + PostgreSQL + servidor físico local em Navegantes + OCI contingência). Stack definida com 3 opções: físico local, virtualizado e cloud.',autor:'DAIANA COSTA',dataISO:'2026-01-16',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído',    resp:'DAIANA COSTA', comentarios:[{texto:'Spec aprovada por Heberton (Vedamotors). Arquitetura final: servidor físico local no CD Navegantes + OCI como contingência. Latência aceita ≤10ms local, até 20ms no OCI.',autor:'DAIANA COSTA',dataISO:'2026-03-03',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído',    resp:'DAIANA COSTA', comentarios:[{texto:'Reunião de integração realizada em 28/04. Arquitetura de rede levantada. Decisão cloud vs. local finalizada. Planilha de Periféricos de Rede disponibilizada por Luan (Engenharia).',autor:'DAIANA COSTA',dataISO:'2026-04-28',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Aguardando desenho de arquitetura de rede do cliente (VLANs, ranges, Fortigate). Solicitado em 08/05/2026.',autor:'DAIANA COSTA',dataISO:'2026-05-08',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído',   resp:'DAIANA COSTA', comentarios:[{texto:'VLAN 121 recebida de Leonardo Rengel em 07/05: 192.168.121.0/25, gateway 192.168.121.1, máscara 255.255.255.128. Config VPN IPSec Fortinet recebida: securegw05.vedamotors.com.br, AES128/256+SHA256+DH14.',autor:'DAIANA COSTA',dataISO:'2026-05-07',status:'Concluído'}]},
    'Solicitação de Equipamentos':         {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'39 tablets HIGOLE F7R (PO IMP-26007) com problema de fornecimento (sem baterias). Recomendação: migrar para F7G (Win 11 Pro, 8GB RAM) — 76 unidades nos projetos impactados.',autor:'DAIANA COSTA',dataISO:'2026-05-08',status:'Em andamento'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Aguardando', resp:'DAIANA COSTA', comentarios:[{texto:'Aguardando credenciais dos servidores HML e PRD da Vedamotors para validação completa. Solicitado via e-mail em 08/05/2026.',autor:'DAIANA COSTA',dataISO:'2026-05-08',status:'Aguardando'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Aguardando', resp:'DAIANA COSTA', comentarios:[{texto:'Aguardando rede dedicada para implantação (Wi-Fi projetos/parceiros ou cabeada) com acesso a servidores Velox, VLAN automação e internet restrita. Solicitado em 08/05/2026.',autor:'DAIANA COSTA',dataISO:'2026-05-08',status:'Aguardando'}]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Não Iniciado', resp:'IVAN', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'ANDERSON', comentarios:[]},
  },

  // ── TITANO (Bloqueado — GoLive 27/05 · SaaS AWS · sem instalação física) ─
  'TITANO': {
    'Reunião de Kickoff':                  {status:'Concluído',    resp:'GIOVANNI', comentarios:[{texto:'Call de alinhamento técnico com Stellantis (30/03). SaaS OAuth2/PingFederate confirmado. Resumo encaminhado ao Ivan. ATA emitida em 22/04 — GoLive confirmado 27/05.',autor:'GIOVANNI',dataISO:'2026-04-22',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído',    resp:'GIOVANNI', comentarios:[{texto:'Escopo aprovado: SaaS AWS + OAuth2 client_credentials (Thomas confirmou viabilidade técnica 18/05). Migração Basic Auth + JWT → OAuth2 confirmada. Contrato SaaS Victor → Invent ainda pendente de assinatura.',autor:'GIOVANNI',dataISO:'2026-05-18',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído',    resp:'GIOVANNI', comentarios:[{texto:'Levantamento técnico do CD Betim realizado. Giovanni compartilhou endpoints Velox (POST teste.velox-by-invent.com/integracao/api/titano/onda). Victor informou endpoint Click nonprod.',autor:'GIOVANNI',dataISO:'2026-05-13',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'GIOVANNI', comentarios:[{texto:'Protocolo técnico Stellantis (rede + ponto de rede painel PLC) não recebido — necessário para finalizar documentação.',autor:'GIOVANNI',dataISO:'2026-05-08',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Em andamento', resp:'GIOVANNI', comentarios:[{texto:'VPN S2S ATA emitida 22/04. Validação end-to-end pendente. Victor cobrou credenciais QA para Reply + SOC 2 Type II (2ª vez em 19/05). Thomas disponível para suporte OAuth2.',autor:'GIOVANNI',dataISO:'2026-05-19',status:'Em andamento'}]},
    'Solicitação de Equipamentos':         {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'SANCHES', comentarios:[{texto:'Sanches + Florêncio devem validar ambiente de testes. Escalar via Giovanni se sem sinal até meio-dia de 26/05.',autor:'GIOVANNI',dataISO:'2026-05-24',status:'Não Iniciado'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
  },

  // ── OCTOPUS MS (Em andamento — infra completa · GoLive 26/05 · sem instalação física) ─
  'OCTOPUS MS': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Kickoff realizado com G.Pereira (Campo Grande/MS). Escopo confirmado.',autor:'ALEX',dataISO:'2024-01-10',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Escopo técnico definido e aprovado.',autor:'ALEX',dataISO:'2024-02-05',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'GEFERSON MEDINA', comentarios:[{texto:'Levantamento técnico concluído. Redes Sorter IA definidas: Depósito 10.249.32.0/24 · IA 10.249.43.0/24 (Geferson 21/05).',autor:'GEFERSON MEDINA',dataISO:'2026-05-21',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Macro topologia IA enviada 22/05. Documentação finalizada.',autor:'DAIANA COSTA',dataISO:'2026-05-22',status:'Concluído'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído', resp:'GEFERSON MEDINA', comentarios:[{texto:'VPN FortiClient SSL validada (.pfx). VMs APP/BD configuradas. E-mail IA enviado 08/05 (Geferson cc Douglas/Alex).',autor:'DAIANA COSTA',dataISO:'2026-05-08',status:'Concluído'}]},
    'Solicitação de Equipamentos':         {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Equipamentos provisionados.',autor:'ALEX',dataISO:'2025-06-01',status:'Concluído'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Concluído', resp:'ROBERTO OROSCO', comentarios:[{texto:'Ambiente validado. Servidores e conectividade OK.',autor:'ROBERTO OROSCO',dataISO:'2025-12-01',status:'Concluído'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Procedimento técnico elaborado e compartilhado com o time.',autor:'ALEX',dataISO:'2026-03-01',status:'Concluído'}]},
    'Compartilhamento de Acessos com Demais Times': {status:'Aguardando', resp:'ALEX', comentarios:[{texto:'Acesso Deivison (implantação) em tratativa com Fábio. VLAN IA será criada pelo Grupo Pereira — tratativa com Fábio (19/05). Switch credentials/IP pendente.',autor:'DAIANA COSTA',dataISO:'2026-05-22',status:'Aguardando'}]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Em andamento', resp:'ALEX', comentarios:[{texto:'Formulário de aceite pendente. Atenção: senha Grupo Pereira expira em ~15 dias a partir de 20/05.',autor:'ALEX',dataISO:'2026-05-20',status:'Em andamento'}]},
  },

  // ── BR SUPPLY (Em onboarding · Novo · reunião 20/05) ──────
  'BR SUPPLY': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Reunião BR Supply × Invent realizada 20/05. Daia se apresentou. WMS Spark identificado. Evandro Gazola = focal TI. Escopo Daia definido: servidores, rede, VPN, ambientes, PTL.',autor:'DAIANA COSTA',dataISO:'2026-05-20',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Escopo técnico em definição. Spec de servidores sendo compartilhada. Andre Mota incluiu BR na lista TV Sorter (21/05).',autor:'DAIANA COSTA',dataISO:'2026-05-21',status:'Em andamento'}]},
    'Levantamento Técnico do Ambiente':    {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Documentação de Arquitetura':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Acessos e Range de IPs':{status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Equipamentos':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'EVANDRO GAZOLA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
  },

  // ── PETER / Dyscamp (Aguardando · VPN OK · 3 pendências) ──
  'PETER': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Kickoff realizado com Dyscamp. VPN configurada — lista de colaboradores enviada.',autor:'DAIANA COSTA',dataISO:'2026-03-15',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Escopo definido. VPN OK.',autor:'DAIANA COSTA',dataISO:'2026-03-20',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Ambiente Dyscamp mapeado. PLC Siemens identificado.',autor:'DAIANA COSTA',dataISO:'2026-04-10',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Aguardando definição: (1) credenciais admin — compartilhadas vs individuais; (2) domínio de autenticação. A definir com Carolina Maia.',autor:'DAIANA COSTA',dataISO:'2026-05-15',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Porta 102 TIA Portal — regra de firewall para PLC Siemens pendente. Modelo de credenciais admin a definir com Carolina Maia.',autor:'DAIANA COSTA',dataISO:'2026-05-15',status:'Em andamento'}]},
    'Solicitação de Equipamentos':         {status:'Concluído', resp:'DAIANA COSTA', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
  },

  // ── GUATEMALA / Nestlé (Em andamento · Pick 2 Light · 3 reuniões) ─
  'GUATEMALA': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Reunião 1 realizada 11/05. Fábio Ornelas enviou ata PBL Guatemala. Participantes: Manuel Perea, Andrea Mazariegos, Karla Lamboglia, Giovanni.',autor:'GIOVANNI',dataISO:'2026-05-11',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Em andamento', resp:'GIOVANNI', comentarios:[{texto:'3 reuniões realizadas (11, 18, 19/05). ARM tropicalizado recebido de Manuel Perea 19/05 + mapping de campos. Daia + Ivan participaram reunião 19/05.',autor:'DAIANA COSTA',dataISO:'2026-05-19',status:'Em andamento'}]},
    'Levantamento Técnico do Ambiente':    {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Levantamento em andamento. Pick 2 Light · sistema MFC/FL. Projeto muito ativo.',autor:'DAIANA COSTA',dataISO:'2026-05-19',status:'Em andamento'}]},
    'Documentação de Arquitetura':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Acessos e Range de IPs':{status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Equipamentos':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
  },

  // ── CDSK (Concluído — infra entregue 02/04) ───────────────
  'CDSK': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'VINICIUS', comentarios:[{texto:'Kickoff realizado com Zaffari (São Paulo/SP).',autor:'VINICIUS',dataISO:'2025-11-15',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'VINICIUS', comentarios:[{texto:'Escopo definido e aprovado.',autor:'VINICIUS',dataISO:'2025-12-01',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'VINICIUS', comentarios:[{texto:'Stack técnica: Servidor IA local (IP 10.14.105.100), VLAN Câmeras 4021.',autor:'VINICIUS',dataISO:'2026-01-10',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Concluído', resp:'VINICIUS', comentarios:[{texto:'Documentação finalizada.',autor:'VINICIUS',dataISO:'2026-02-01',status:'Concluído'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído', resp:'VINICIUS', comentarios:[{texto:'Acessos recebidos e configurados.',autor:'VINICIUS',dataISO:'2026-02-20',status:'Concluído'}]},
    'Solicitação de Equipamentos':         {status:'Concluído', resp:'LUAN', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Concluído', resp:'VINICIUS', comentarios:[{texto:'Ambiente validado.',autor:'VINICIUS',dataISO:'2026-03-15',status:'Concluído'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Concluído', resp:'VINICIUS', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Concluído', resp:'VINICIUS', comentarios:[]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Concluído', resp:'LUAN', comentarios:[{texto:'Servidor IA entregue ao CD Zaffari em 02/04. Processo rodando. Verificando 2º cabo de rede — sem impacto na operação.',autor:'LUAN',dataISO:'2026-04-02',status:'Concluído'}]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Concluído', resp:'VINICIUS', comentarios:[{texto:'Infra entregue e aceite registrado.',autor:'VINICIUS',dataISO:'2026-04-15',status:'Concluído'}]},
  },

  // ── REVERSE (Bloqueado — Oracle sem ferramentas/tablespaces · SaaS) ─
  'REVERSE': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Kickoff realizado com GTPC (São Paulo/SP). Projeto de automação reversa definido.',autor:'ALEX',dataISO:'2023-01-15',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Escopo técnico definido: banco Oracle, servidores on-premise GTPC. Middleware Velox em SaaS.',autor:'ALEX',dataISO:'2023-02-20',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Levantamento realizado. Oracle DB mapeado. Portas, tablespaces e usuário velox documentados como requisitos.',autor:'ALEX',dataISO:'2023-05-10',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Arquitetura documentada: Oracle DB GTPC + middleware Velox SaaS + integração via porta 1521.',autor:'ALEX',dataISO:'2023-08-30',status:'Concluído'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Aguardando', resp:'ALEX', comentarios:[{texto:'Solicitação formal enviada em 12/05/2026 sem retorno. Pendências: SQL Developer/DBeaver nos servidores Oracle; tablespaces VELOX_DAT e VELOX_IDX; usuário velox; porta 1521 liberada.',autor:'ALEX',dataISO:'2026-05-12',status:'Aguardando'}]},
    'Solicitação de Equipamentos':         {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Sem equipamentos físicos a solicitar — ambiente on-premise do cliente.',autor:'ALEX',dataISO:'2023-03-01',status:'Concluído'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'JOSÉ ROBERTO', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'ALEX', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'ALEX', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'ALEX', comentarios:[]},
  },

  // ── DIA (Concluído — Atacadão · todas as atividades encerradas) ─
  'DIA': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Kickoff realizado com Atacadão (São Paulo/SP).',autor:'ANDERSON',dataISO:'2025-08-15',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Escopo definido e aprovado.',autor:'ANDERSON',dataISO:'2025-08-30',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Levantamento técnico concluído.',autor:'ANDERSON',dataISO:'2025-10-01',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Documentação finalizada.',autor:'ANDERSON',dataISO:'2025-11-15',status:'Concluído'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Acessos e IPs recebidos e configurados.',autor:'ANDERSON',dataISO:'2025-12-10',status:'Concluído'}]},
    'Solicitação de Equipamentos':         {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Equipamentos entregues e instalados.',autor:'ANDERSON',dataISO:'2026-01-20',status:'Concluído'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Ambiente validado.',autor:'ANDERSON',dataISO:'2026-02-10',status:'Concluído'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Procedimento compartilhado com o time.',autor:'ANDERSON',dataISO:'2026-03-01',status:'Concluído'}]},
    'Compartilhamento de Acessos com Demais Times': {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Acessos compartilhados.',autor:'ANDERSON',dataISO:'2026-03-20',status:'Concluído'}]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Instalação física acompanhada e concluída no CD Atacadão.',autor:'ANDERSON',dataISO:'2026-04-01',status:'Concluído'}]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Aceite formal assinado pelo cliente. Projeto encerrado.',autor:'ANDERSON',dataISO:'2026-04-28',status:'Concluído'}]},
  },

  // ── QUELUZ (Em andamento · Oracle appliance + API CON5 · 9 integrações) ─
  'QUELUZ': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'FABIO', comentarios:[{texto:'Kickoff realizado com cliente Itajaí/SC. Stack técnica fechada (22-24/04): Oracle appliance + Ubuntu 24 LTS + API CON5 (base Zaffari/CDSK, 3 fases, 9 integrações) + VPN OpenVPN + whitelist + WTS.',autor:'FABIO',dataISO:'2026-04-24',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'FABIO', comentarios:[{texto:'Escopo técnico aprovado. Descritivo Funcional REV 2 entregue por Raphael ao D\'Muller em 15/05/2026. 4 e-mails técnicos prontos aguardando aprovação de Ivan para envio ao Marcos (TI).',autor:'RAPHAEL',dataISO:'2026-05-15',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Layout executivo elétrico Fase 1 enviado por Fábio Ornelas ao Mario Neis/Tiago Toledo em 18/05. Servidor Ubuntu 26.04 LTS ATIVO desde 23/05 — 128 GB RAM (confirmado por Marcos). Rede: 192.168.11.0/24, GW .1, servidores .2–.19, automação a partir de .20 (Ivan 23/05).',autor:'DAIANA COSTA',dataISO:'2026-05-23',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'RAPHAEL', comentarios:[{texto:'REV 2 entregue — aguardando retorno do D\'Muller. Deadline 26/05/2026. Ivan: aprovação dos 4 e-mails técnicos ainda pendente. IP, VLAN e Owners a confirmar até 26/05.',autor:'RAPHAEL',dataISO:'2026-05-23',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Servidor Ubuntu 26.04 LTS ativo (23/05). Rede 192.168.11.0/24 confirmada por Ivan. Pendentes para liberar acessos: faixa IP exata, VLAN e Owners (Marcos a compartilhar até 26/05). Aprovação Ivan para 4 e-mails ao Marcos (TI) ainda necessária.',autor:'DAIANA COSTA',dataISO:'2026-05-23',status:'Em andamento'}]},
    'Solicitação de Equipamentos':         {status:'Em andamento', resp:'FABIO', comentarios:[{texto:'Oracle appliance em processo de aquisição/provisionamento.',autor:'FABIO',dataISO:'2026-04-24',status:'Em andamento'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'FABIO', comentarios:[]},
  },

  // ── BP (Em andamento · SQL Server Express · GoLive 23/06) ─
  'BP': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Kickoff realizado com cliente São Paulo/SP. Equipe: Tiago Loucatelli, Artur Pessetti, Erik Zanette.',autor:'GIOVANNI',dataISO:'2024-02-01',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Escopo definido: Stack SQL Server Express 2022, Aruba JL680A. GoLive previsto para 23/06/2026.',autor:'GIOVANNI',dataISO:'2024-03-15',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Levantamento técnico concluído. VM HML configurada: IP 192.168.20.12, SQL Server Express 2022, Aruba JL680A.',autor:'GIOVANNI',dataISO:'2026-04-01',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'GIOVANNI', comentarios:[{texto:'VM HML 192.168.20.12 ativa. Documentação de arquitetura em elaboração.',autor:'GIOVANNI',dataISO:'2026-04-01',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'VM HML provisionada com IP 192.168.20.12. Acessos configurados.',autor:'GIOVANNI',dataISO:'2026-04-01',status:'Concluído'}]},
    'Solicitação de Equipamentos':         {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Switch Aruba JL680A provisionado.',autor:'GIOVANNI',dataISO:'2026-04-01',status:'Concluído'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Em andamento', resp:'GIOVANNI', comentarios:[{texto:'HML ativa e em validação. GoLive PRD previsto para 23/06/2026.',autor:'GIOVANNI',dataISO:'2026-04-01',status:'Em andamento'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Em andamento', resp:'GIOVANNI', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Em andamento', resp:'GIOVANNI', comentarios:[{texto:'Aruba JL680A a ser instalado no site São Paulo/SP.',autor:'GIOVANNI',dataISO:'2026-04-01',status:'Em andamento'}]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
  },

  // ── MARKET PERU (Bloqueado · VPN S2S + range IP /24 · emulador WCS) ─
  'MARKET PERU': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Kickoff realizado com cliente Lima/Peru. Projeto Pick 2 Light para CD Nestlé.',autor:'ALEX',dataISO:'2025-02-01',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'ALEX', comentarios:[{texto:'Escopo definido: WCS + integração com sistema local Peru. Emulador WCS acordado em contrato.',autor:'ALEX',dataISO:'2025-03-01',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Em andamento', resp:'ALEX', comentarios:[{texto:'Levantamento técnico em andamento. Aguardando resposta de Alex sobre emulador WCS (sem retorno desde março/2026). VPN site-to-site: retorno Jonathan (FTC) sobre licença pendente.',autor:'ALEX',dataISO:'2026-03-01',status:'Em andamento'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'ALEX', comentarios:[{texto:'Arquitetura parcialmente documentada. Pendências bloqueiam conclusão: emulador WCS, VPN S2S, range IP /24.',autor:'ALEX',dataISO:'2026-03-01',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Aguardando', resp:'ALEX', comentarios:[{texto:'Range IP /24 exclusivo para automação (PLCs, concentradores, sensores) pendente. VPN site-to-site: licença FTC aguardando retorno Jonathan.',autor:'ALEX',dataISO:'2026-03-15',status:'Aguardando'}]},
    'Solicitação de Equipamentos':         {status:'Em andamento', resp:'ALEX', comentarios:[{texto:'Tablets HIGOLE F7R — avaliar migração para F7G (Win 11 Pro, 8GB RAM) conforme recomendação.',autor:'ALEX',dataISO:'2026-05-08',status:'Em andamento'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'ALEX', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'ALEX', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'ALEX', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'ALEX', comentarios:[]},
  },

  // ── PTL SP (Em andamento · Nestlé Araçariguama · workshop concluído) ─
  'PTL SP': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Kickoff realizado com Nestlé Araçariguama/SP. Equipe: Welton Cyriaco, Camila Faria.',autor:'ANDERSON',dataISO:'2026-01-15',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Escopo definido: PTL (Pick-to-Light), PLC Siemens, NAT, Padpicking HTTP 8100.',autor:'ANDERSON',dataISO:'2026-02-01',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Workshop técnico concluído em 21/05/2026 — ata + notas técnicas + resumo interno produzidos. NAT PLC Siemens validado com Ivan: funciona via TIA Portal. Padpicking funciona em HTTP porta 8100, não HTTPS 443.',autor:'DAIANA COSTA',dataISO:'2026-05-21',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Formalização validação NAT por e-mail pendente (combinado com Douglas). NAT validado com Ivan em 22/05 — atende concentradores, conversores, RPIs e PLC Siemens.',autor:'DAIANA COSTA',dataISO:'2026-05-22',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído', resp:'JORGE TORRES', comentarios:[{texto:'IPs dispositivos Invent enviados ao Rogério (Nestlé) em 20/05 para liberação de regras de firewall. MFC instalado no servidor Pré-Prod por Igor em 19/05.',autor:'JORGE TORRES',dataISO:'2026-05-20',status:'Concluído'}]},
    'Solicitação de Equipamentos':         {status:'Concluído', resp:'ANDERSON', comentarios:[{texto:'Equipamentos provisionados.',autor:'ANDERSON',dataISO:'2026-03-01',status:'Concluído'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'IP duplicado 10.142.216.151 a resolver com Nestlé. Formalização pós-workshop em andamento.',autor:'DAIANA COSTA',dataISO:'2026-05-21',status:'Em andamento'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Procedimento sendo elaborado com base no workshop técnico de 21/05 e validação NAT de 22/05.',autor:'DAIANA COSTA',dataISO:'2026-05-22',status:'Em andamento'}]},
    'Compartilhamento de Acessos com Demais Times': {status:'Em andamento', resp:'JORGE TORRES', comentarios:[{texto:'Igor, Jorge Torres e Welton envolvidos. Acesso VPN e regras firewall em tratativa com Nestlé.',autor:'JORGE TORRES',dataISO:'2026-05-20',status:'Em andamento'}]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Em andamento', resp:'IGOR SILVA', comentarios:[{texto:'MFC instalado no servidor Pré-Prod em 19/05/2026. Plano de Cutover compartilhado com a equipe.',autor:'IGOR SILVA',dataISO:'2026-05-19',status:'Em andamento'}]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'ANDERSON', comentarios:[]},
  },

  // ── CRISTAL MG (Bloqueado · Cristália · switch + IP + credenciais pendentes) ─
  'CRISTAL MG': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Kickoff realizado com Cristália Pouso Alegre/MG + Itapira. Equipe: Caique, Sanches, Marlon, Igor.',autor:'GIOVANNI',dataISO:'2025-10-01',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Escopo definido. Wander Moraes enviou spec de servidor em 25/04/2026. Tamiris Giovana indicada como focal para gerenciar lista de acesso (~11 colaboradores Invent).',autor:'GIOVANNI',dataISO:'2026-05-04',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Topologia de rede das unidades Pouso Alegre e Itapira recebida de Wander Moraes em 14/05/2026.',autor:'DAIANA COSTA',dataISO:'2026-05-14',status:'Em andamento'}]},
    'Documentação de Arquitetura':         {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Aguardando decisão sobre VLAN + switch gerenciável para finalizar documentação. Reunião convocada (Wander + Gabriel + Ivan).',autor:'DAIANA COSTA',dataISO:'2026-05-14',status:'Em andamento'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Aguardando', resp:'DAIANA COSTA', comentarios:[{texto:'Spec switch Aruba Instant On 1930 JL680A enviada para aprovação comercial em 11/05. Gabriel questionou revisão de orçamento em 14/05. Pendências: IP/credenciais servidores, decisão switch Regiane/comercial.',autor:'DAIANA COSTA',dataISO:'2026-05-14',status:'Aguardando'}]},
    'Solicitação de Equipamentos':         {status:'Aguardando', resp:'DAIANA COSTA', comentarios:[{texto:'Switch gerenciável (Aruba JL680A) — decisão comercial pendente (Regiane). 3 slots de reunião expirados sem retorno do Gabriel.',autor:'DAIANA COSTA',dataISO:'2026-05-14',status:'Aguardando'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'GIOVANNI', comentarios:[]},
  },

  // ── COUGAR (Aguardando · implantação concluída · aditivos + link instável) ─
  'COUGAR': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'PMO', comentarios:[{texto:'Kickoff realizado com cliente Cajamar/SP.',autor:'PMO',dataISO:'2023-01-15',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'PMO', comentarios:[{texto:'Escopo definido e aprovado.',autor:'PMO',dataISO:'2023-02-01',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Levantamento técnico do CD Cajamar concluído.',autor:'DAIANA COSTA',dataISO:'2023-06-01',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Arquitetura documentada. Link instável no CD Cajamar (vandalismos em fibra + rádio) — pendência de decisão sobre migração on-premise.',autor:'DAIANA COSTA',dataISO:'2024-01-01',status:'Concluído'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Acessos e IPs configurados.',autor:'DAIANA COSTA',dataISO:'2023-10-01',status:'Concluído'}]},
    'Solicitação de Equipamentos':         {status:'Aguardando', resp:'DAIANA COSTA', comentarios:[{texto:'Proposta Dell on-premise (3 servidores locais, ~R$60k com desconto) enviada à Regiane (Comercial) em 30/04/2026. Decisão sobre migração on-premise aguardando aprovação comercial.',autor:'DAIANA COSTA',dataISO:'2026-04-30',status:'Aguardando'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Ambiente validado. Manutenção PostgreSQL concluída por Ivan em 10/05/2026 (18h–19h), Igor validou remotamente. Sistema estabilizado.',autor:'DAIANA COSTA',dataISO:'2026-05-10',status:'Concluído'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Concluído', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Velox sistêmico implementado e funcionando. Apenas aditivos contratuais pendentes (21/05/2026).',autor:'PMO',dataISO:'2026-05-21',status:'Concluído'}]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Aguardando', resp:'PMO', comentarios:[{texto:'Aceite pendente — aguardando resolução dos aditivos contratuais e decisão final sobre on-premise.',autor:'PMO',dataISO:'2026-05-21',status:'Aguardando'}]},
  },

  // ── ELETRO (Concluído · VPN SoftEther pós-entrega · vencimento 18/06) ──
  'ELETRO': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Kickoff realizado com Britânia São Paulo/SP.',autor:'GIOVANNI',dataISO:'2023-09-15',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Escopo definido e aprovado.',autor:'GIOVANNI',dataISO:'2023-10-01',status:'Concluído'}]},
    'Levantamento Técnico do Ambiente':    {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Levantamento técnico concluído.',autor:'DAIANA COSTA',dataISO:'2023-10-15',status:'Concluído'}]},
    'Documentação de Arquitetura':         {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Documentação de arquitetura finalizada.',autor:'DAIANA COSTA',dataISO:'2023-11-01',status:'Concluído'}]},
    'Solicitação de Acessos e Range de IPs':{status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'VPN SoftEther Hub TERCEIROS-BRITANIA configurada. 19 usuários ativos (Dev + PLC + DBA + Pós-vendas + Implantação + Infra). Porta 443.',autor:'DAIANA COSTA',dataISO:'2023-11-15',status:'Concluído'}]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Ambiente validado e aprovado.',autor:'GIOVANNI',dataISO:'2023-12-01',status:'Concluído'}]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Concluído', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'⚠ Atenção pós-entrega: VPN SoftEther vence em 18/06/2026 — sem auto-renovação. Renovação manual obrigatória. 19 usuários ativos.',autor:'DAIANA COSTA',dataISO:'2026-06-18',status:'Concluído'}]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Concluído', resp:'GIOVANNI', comentarios:[{texto:'Infra entregue. Projeto encerrado em 12/2023.',autor:'GIOVANNI',dataISO:'2023-12-31',status:'Concluído'}]},
  },

  // ── DIAMANTE (Aguardando · HND Labs · specs degradadas RAM 4GB) ────────
  'DIAMANTE': {
    'Reunião de Kickoff':                  {status:'Em andamento', resp:'ANDERSON', comentarios:[{texto:'Reunião técnica solicitada a Eliane Higino (HND Labs) em 09/05/2026 para discutir specs HML+PRD separados e plano de contingência. Datas propostas: 11 ou 12/05. Eliane não retornou.',autor:'DAIANA COSTA',dataISO:'2026-05-09',status:'Em andamento'}]},
    'Definição de Escopo':                 {status:'Em andamento', resp:'ANDERSON', comentarios:[{texto:'Escopo técnico em definição. RAM atual 4GB — abaixo do mínimo. Ivan aguardando avaliação técnica das specs degradadas (WhatsApp 12/05/2026).',autor:'DAIANA COSTA',dataISO:'2026-05-12',status:'Em andamento'}]},
    'Levantamento Técnico do Ambiente':    {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Avaliação técnica das specs degradadas em andamento. Servidores HML+PRD separados necessários — aguardando alinhamento com cliente.',autor:'DAIANA COSTA',dataISO:'2026-05-12',status:'Em andamento'}]},
    'Documentação de Arquitetura':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Acessos e Range de IPs':{status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Equipamentos':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Não Iniciado', resp:'ANDERSON', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'ANDERSON', comentarios:[]},
  },

  // ── C&A (Em andamento · novo · iniciado mai/2026) ─────────────────────
  'C&A': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'PMO', comentarios:[{texto:'Kickoff realizado. Projeto iniciado em maio/2026.',autor:'PMO',dataISO:'2026-05-01',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Escopo técnico em definição. Equipe: Caique.',autor:'DAIANA COSTA',dataISO:'2026-05-01',status:'Em andamento'}]},
    'Levantamento Técnico do Ambiente':    {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Documentação de Arquitetura':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Acessos e Range de IPs':{status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Equipamentos':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'PMO', comentarios:[]},
  },

  // ── TOLEDO IP (Aguardando · interno transversal · padrão IP câmeras) ──
  'TOLEDO IP': {
    'Reunião de Kickoff':                  {status:'Concluído', resp:'DAIANA COSTA', comentarios:[{texto:'Projeto interno transversal. Iniciado 22/05/2026 com Gustavo (Toledo). Objetivo: definir padrão único de IP de câmeras para todos os projetos (192.168.1.X vs 192.168.10.X).',autor:'DAIANA COSTA',dataISO:'2026-05-22',status:'Concluído'}]},
    'Definição de Escopo':                 {status:'Em andamento', resp:'DAIANA COSTA', comentarios:[{texto:'Aguardando retorno de Gustavo (Toledo) sobre padrão de IP de câmeras. Cobrar presencialmente na semana de 25/05. Resultado define padrão único para todos os projetos Invent.',autor:'DAIANA COSTA',dataISO:'2026-05-22',status:'Em andamento'}]},
    'Levantamento Técnico do Ambiente':    {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Documentação de Arquitetura':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Acessos e Range de IPs':{status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Solicitação de Equipamentos':         {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Validação do Ambiente Disponibilizado pelo Cliente': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Elaboração do Procedimento Técnico e Compartilhamento com o Time': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Compartilhamento de Acessos com Demais Times': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Acompanhamento na Instalação Física dos Equipamentos': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
    'Aceite Formal do Cliente (Formulário Infraestrutura)': {status:'Não Iniciado', resp:'DAIANA COSTA', comentarios:[]},
  },
};

function _buildDefaultActivities(){
  const ativs = [];
  PROJETOS_PADRAO.forEach(p => {
    // Não gera atividades para projetos sem progresso
    if(p.status === 'Não Iniciado' || p.status === 'Standby') return;
    const map  = _DEMO_STATUS[p.nome] || {};
    const skip = p.skipAtivs || [];
    ATIVIDADES_PADRAO.forEach(a => {
      if(skip.includes(a.nome)) return; // atividade não se aplica a este projeto
      const demo = map[a.nome] || {status:'Não Iniciado', resp:'', comentarios:[]};
      ativs.push({
        projeto:     p.nome,
        fase:        a.fase,
        nome:        a.nome,
        status:      demo.status,
        resp:        demo.resp || '',
        comentarios: JSON.parse(JSON.stringify(demo.comentarios||[])),
      });
    });
  });
  return ativs;
}

// ── Carregar dados demo (merge — não sobrescreve dados existentes) ─
function loadDemoData(){
  loadData(); // garante que PROJETOS/ATIVIDADES estão carregados
  let changed = false;
  PROJETOS_PADRAO.forEach(p => {
    if(!PROJETOS.find(x=>x.nome===p.nome)){
      PROJETOS.push(JSON.parse(JSON.stringify(p)));
      changed = true;
    }
  });
  if(changed){
    // Adiciona atividades para novos projetos
    PROJETOS_PADRAO.forEach(p => {
      if(p.status==='Não Iniciado' || p.status==='Standby') return;
      const jaTemAtivs = ATIVIDADES.some(a=>a.projeto===p.nome);
      if(!jaTemAtivs){
        const map  = _DEMO_STATUS[p.nome] || {};
        const skip = p.skipAtivs || [];
        ATIVIDADES_PADRAO.forEach(a=>{
          if(skip.includes(a.nome)) return;
          const demo = map[a.nome] || {status:'Não Iniciado', resp:'', comentarios:[]};
          ATIVIDADES.push({projeto:p.nome, fase:a.fase, nome:a.nome, status:demo.status, resp:demo.resp||'', comentarios:JSON.parse(JSON.stringify(demo.comentarios||[]))});
        });
      }
    });
    saveData();
  }
  return changed;
}

// ── Forçar atualização do NAVEPARK com dados reais ────────
function updateNaveparkData(){
  loadData();
  const real = PROJETOS_PADRAO.find(p=>p.nome==='NAVEPARK');
  if(!real) return false;
  const idx = PROJETOS.findIndex(p=>p.nome==='NAVEPARK');
  if(idx>=0){
    // Preserva campos de controle que o usuário possa ter alterado
    const old = PROJETOS[idx];
    PROJETOS[idx] = {...real, status: old.status||real.status, diasParado: old.diasParado||0};
  } else {
    PROJETOS.push(JSON.parse(JSON.stringify(real)));
  }
  // Atualiza atividades do NAVEPARK com dados reais (respeitando skipAtivs)
  ATIVIDADES = ATIVIDADES.filter(a=>a.projeto!=='NAVEPARK');
  const map  = _DEMO_STATUS['NAVEPARK'] || {};
  const skip = (real.skipAtivs || []);
  ATIVIDADES_PADRAO.forEach(a=>{
    if(skip.includes(a.nome)) return;
    const demo = map[a.nome] || {status:'Não Iniciado', resp:'', comentarios:[]};
    ATIVIDADES.push({projeto:'NAVEPARK', fase:a.fase, nome:a.nome, status:demo.status, resp:demo.resp||'', comentarios:JSON.parse(JSON.stringify(demo.comentarios||[]))});
  });
  saveData();
  // Remove overrides localStorage de capa e histórico do NAVEPARK
  // para que os dados padrão atualizados sejam utilizados
  const capasOverride = JSON.parse(localStorage.getItem('v16_capas') || '{}');
  if(capasOverride['NAVEPARK']){
    delete capasOverride['NAVEPARK'];
    localStorage.setItem('v16_capas', JSON.stringify(capasOverride));
  }
  const histOverride = JSON.parse(localStorage.getItem('v16_historico') || '{}');
  if(histOverride['NAVEPARK']){
    delete histOverride['NAVEPARK'];
    localStorage.setItem('v16_historico', JSON.stringify(histOverride));
  }
  return true;
}

// ── Duplicar Projeto ───────────────────────────────────────
function duplicarProjeto(projNome){
  const original = PROJETOS.find(p=>p.nome===projNome);
  if(!original) return null;
  let novaNome = original.nome + ' — Cópia';
  let counter = 2;
  while(PROJETOS.find(p=>p.nome===novaNome)){
    novaNome = original.nome + ' — Cópia ' + counter++;
  }
  const copia = {...JSON.parse(JSON.stringify(original)), nome:novaNome, status:'Não Iniciado', bloqueador:'', diasParado:0, fimAjustado:''};
  PROJETOS.push(copia);
  // Duplica atividades zeradas
  ATIVIDADES.filter(a=>a.projeto===projNome).forEach(a=>{
    ATIVIDADES.push({...JSON.parse(JSON.stringify(a)), projeto:novaNome, status:'Não Iniciado', comentarios:[], resp:a.resp||''});
  });
  saveData();
  return copia;
}

// ── Auth ──────────────────────────────────────────────────
const PAGE_NAMES = {
  index:'Dashboard', gerencial:'Gerencial', projetos:'Projetos',
  squads:'Áreas', alertas:'Alertas', admin:'Admin'
};
function checkAuth(page){
  const u = getCurrentUser();
  if(!u){ location.href = 'login.html'; return null; }
  if(!u.ativo){ logout(); return null; }
  if(u.papel === 'admin'){ applyViewerMode(); return u; }
  const allowed = u.paginas || [];
  if(!allowed.includes(page) && !allowed.includes('all')){
    location.href = 'login.html'; return null;
  }
  applyViewerMode();
  return u;
}
function getCurrentUser(){
  try { return JSON.parse(sessionStorage.getItem('v16_currentUser')); }
  catch(e){ return null; }
}
function setCurrentUser(u){
  const safe = {...u}; delete safe.senha;
  sessionStorage.setItem('v16_currentUser', JSON.stringify(safe));
}
function logout(){
  sessionStorage.removeItem('v16_currentUser');
  location.href = 'login.html';
}
function isViewer(){ const u = getCurrentUser(); return u && u.papel === 'viewer'; }
function isAdmin(){  const u = getCurrentUser(); return u && u.papel === 'admin'; }
function isEditor(){ const u = getCurrentUser(); return u && u.papel === 'editor'; }
function applyViewerMode(){
  if(isViewer()) document.body.classList.add('viewer-mode');
}

// ── Sidebar User Widget ───────────────────────────────────
function renderSidebarUser(){
  const el = document.getElementById('sidebar-user');
  if(!el) return;
  const u = getCurrentUser();
  if(!u){ el.innerHTML=''; return; }
  const colors = {admin:'#a855f7', editor:'#3b82f6', viewer:'#64748b'};
  const initials = escHtml(u.nome.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase());
  el.innerHTML = `
    <div class="su-avatar" style="background:${colors[u.papel]||'#64748b'}">${initials}</div>
    <div class="su-info">
      <div class="su-nome">${escHtml(u.nome)}</div>
      <div class="su-papel">${escHtml(u.papel)}</div>
    </div>
    <button onclick="logout()" title="Sair do sistema"
      style="flex-shrink:0;display:flex;align-items:center;gap:5px;padding:5px 9px;
        border-radius:7px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);
        color:#ef4444;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;
        font-family:inherit;white-space:nowrap"
      onmouseover="this.style.background='rgba(239,68,68,.2)'"
      onmouseout="this.style.background='rgba(239,68,68,.1)'">
      <span style="font-size:13px;line-height:1">→</span>
      <span class="su-logout-text" style="letter-spacing:.3px">Sair</span>
    </button>`;
}

// ── Sidebar colapso ───────────────────────────────────────
function initSidebar(){
  const sb  = document.getElementById('sidebar');
  const tog = document.getElementById('sidebar-toggle');
  if(!sb) return;

  // Inject V16 visual identity CSS (once, all pages)
  if(!document.getElementById('sb-util-css')){
    const css = document.createElement('style');
    css.id = 'sb-util-css';
    css.textContent = `
      /* ══════════════════════════════════════════════════════
         V16 VISUAL IDENTITY — overwrites page defaults
         --bg  = #030610 (near-black body)
         --bg2 = #100c2a (indigo sidebar/topbar)
         ══════════════════════════════════════════════════════ */

      /* Aurora blobs visible behind content */
      #main {
        background:
          radial-gradient(ellipse 70% 45% at 20% 15%, rgba(109,40,217,.18) 0%, transparent 55%),
          radial-gradient(ellipse 60% 40% at 80% 75%, rgba(245,195,0,.10) 0%, transparent 50%),
          radial-gradient(ellipse 50% 35% at 60% 10%, rgba(29,78,216,.14) 0%, transparent 50%);
      }

      /* ── SIDEBAR ─────────────────────────────────────────── */
      #sidebar {
        background: linear-gradient(175deg, #1a1242 0%, #120d30 50%, #0d0922 100%) !important;
        border-right: 1px solid rgba(139,92,246,.25) !important;
        box-shadow: 4px 0 40px rgba(0,0,0,.5) !important;
      }
      .sb-header {
        border-bottom: 1px solid rgba(139,92,246,.2) !important;
        padding: 20px 14px 16px !important;
      }
      .sb-logo {
        width: 40px !important; height: 40px !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 24px rgba(245,195,0,.55), 0 0 0 1px rgba(245,195,0,.3) !important;
      }
      .sb-brand-name { font-size: 16px !important; letter-spacing: -1px !important; font-weight: 900 !important; }
      .sb-brand-by  { font-size: 10px !important; letter-spacing: 2px !important; color: rgba(139,92,246,.7) !important; }
      .sb-logo { width: 38px !important; height: 38px !important; font-size: 14px !important; box-shadow: 0 4px 16px rgba(245,195,0,.45) !important; }

      /* Nav items — bigger, bolder */
      .nav-item {
        margin: 1px 0 !important;
        padding: 11px 12px !important;
        border-radius: 10px !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        transition: all .15s ease !important;
      }
      .nav-item:hover {
        background: rgba(139,92,246,.18) !important;
        color: #e2d9f3 !important;
      }
      /* ACTIVE: full solid pill — unmissable */
      .nav-item.active {
        background: linear-gradient(135deg, #F5C300 0%, #d97706 100%) !important;
        color: #0a0600 !important;
        font-weight: 800 !important;
        box-shadow: 0 4px 20px rgba(245,195,0,.4), 0 0 0 1px rgba(245,195,0,.2) !important;
      }
      .nav-item.active .nav-icon { filter: none !important; }
      .nav-icon { font-size: 17px !important; }

      .sb-footer { border-top: 1px solid rgba(139,92,246,.2) !important; }

      /* ── TOPBAR ──────────────────────────────────────────── */
      .topbar {
        background: rgba(16,12,42,.92) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border-bottom: 1px solid rgba(139,92,246,.2) !important;
        box-shadow: 0 1px 0 rgba(245,195,0,.06) !important;
      }
      .topbar-title {
        font-size: 18px !important; font-weight: 800 !important;
        letter-spacing: -.6px !important;
      }

      /* ── CARDS ───────────────────────────────────────────── */
      .card {
        background: rgba(255,255,255,.05) !important;
        border: 1px solid rgba(139,92,246,.18) !important;
        border-top: 1px solid rgba(139,92,246,.35) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        box-shadow: 0 8px 32px rgba(0,0,0,.25), 0 0 0 0 transparent !important;
      }
      .card::before {
        background: linear-gradient(135deg, rgba(139,92,246,.06), transparent 55%) !important;
      }
      .card-title {
        font-size: 10px !important; letter-spacing: 1.2px !important;
        padding-bottom: 12px !important;
        border-bottom: 1px solid rgba(139,92,246,.15) !important;
        margin-bottom: 16px !important;
        color: rgba(167,139,250,.8) !important;
      }

      /* KPI cards */
      .kpi-card {
        background: rgba(255,255,255,.05) !important;
        border: 1px solid rgba(139,92,246,.18) !important;
        border-top: 1px solid rgba(139,92,246,.32) !important;
        box-shadow: 0 4px 20px rgba(0,0,0,.2) !important;
      }

      /* Tab bars */
      .tab-bar {
        background: rgba(16,12,42,.88) !important;
        backdrop-filter: blur(16px) !important;
        border-bottom: 1px solid rgba(139,92,246,.2) !important;
      }
      .tab-btn { font-size: 13px !important; }
      .tab-btn:hover { color: #c4b5fd !important; }
      .tab-btn.active {
        color: #F5C300 !important;
        border-bottom-color: #F5C300 !important;
        font-weight: 700 !important;
      }

      /* Buttons */
      .btn-icon {
        background: rgba(139,92,246,.1) !important;
        border: 1px solid rgba(139,92,246,.22) !important;
      }
      .btn-icon:hover {
        background: rgba(139,92,246,.22) !important;
        border-color: rgba(245,195,0,.4) !important;
        color: #F5C300 !important;
      }

      /* ── COLLAPSED SIDEBAR ───────────────────────────────── */
      #sidebar.collapsed .su-logout-text { display: none }
      .sb-expand-btn {
        display: none; width: calc(100% - 16px); margin: 4px 8px 0; padding: 9px 0;
        background: rgba(139,92,246,.12); border: 1px solid rgba(139,92,246,.25);
        border-radius: 8px; color: #a78bfa; font-size: 14px; cursor: pointer;
        transition: all .2s; align-items: center; justify-content: center; font-family: inherit;
      }
      .sb-expand-btn:hover { background: rgba(139,92,246,.22); color: #e2d9f3; }
      #sidebar.collapsed .sb-expand-btn { display: flex }
      #sidebar.collapsed #sidebar-toggle { display: none }
      #sidebar.collapsed .sb-logo { cursor: pointer }
      #sidebar.collapsed .nav-item.active {
        background: linear-gradient(135deg,#F5C300,#d97706) !important;
        border-radius: 10px !important;
      }

      /* ── SCROLLBAR ───────────────────────────────────────── */
      ::-webkit-scrollbar-thumb { background: rgba(139,92,246,.3) !important; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(245,195,0,.4) !important; }
    `;
    document.head.appendChild(css);
  }

  function toggleSidebar(){
    sb.classList.toggle('collapsed');
    localStorage.setItem('inventV16Sidebar', sb.classList.contains('collapsed') ? 'collapsed' : 'open');
  }

  // Restore saved state
  const stored = localStorage.getItem('inventV16Sidebar');
  if(stored === 'collapsed') sb.classList.add('collapsed');

  // Original toggle button (hamburger in expanded mode)
  if(tog) tog.addEventListener('click', toggleSidebar);

  // "Expand" chevron button added to nav — visible only when collapsed
  const nav = sb.querySelector('.sb-nav');
  if(nav && !nav.querySelector('.sb-expand-btn')){
    const btn = document.createElement('button');
    btn.className = 'sb-expand-btn';
    btn.title = 'Expandir menu';
    btn.innerHTML = '»';
    nav.appendChild(btn);
    btn.addEventListener('click', toggleSidebar);
  }

  // Clicking the VX logo when collapsed also expands
  const logo = sb.querySelector('.sb-logo');
  if(logo) logo.addEventListener('click', () => {
    if(sb.classList.contains('collapsed')) toggleSidebar();
  });

  renderSidebarUser();
}

// ── Tema ──────────────────────────────────────────────────
function initTheme(){
  const t = localStorage.getItem('v16_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', cur);
  localStorage.setItem('v16_theme', cur);
}

// ── Toast ─────────────────────────────────────────────────
function toast(msg, type='info', dur=3500){
  const wrap = document.getElementById('toast-container') || (() => {
    const d = document.createElement('div');
    d.id = 'toast-container';
    d.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(d);
    return d;
  })();
  const colors = {info:'#3b82f6', success:'#22c55e', warn:'#f5c300', error:'#ef4444'};
  const t = document.createElement('div');
  t.style.cssText = `background:var(--bg2,#1e293b);border-left:4px solid ${colors[type]||colors.info};
    color:var(--text,#f1f5f9);padding:12px 20px;border-radius:8px;font-size:13px;
    box-shadow:0 8px 24px rgba(0,0,0,.4);animation:slideInRight .25s ease;max-width:320px;`;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), dur);
}

// ── Portrait Mode Hint ────────────────────────────────────
(function initPortraitHint(){
  let dismissed = false;

  function injectHint(){
    if(document.getElementById('portrait-toast')) return;

    // Keyframe styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes phRotate{0%,30%{transform:rotate(0deg)}55%,85%{transform:rotate(90deg)}100%{transform:rotate(90deg)}}
      @keyframes phSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes phSlideDown{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(20px)}}
      #portrait-toast{animation:phSlideUp .35s cubic-bezier(.22,1,.36,1)}
      #portrait-toast.hiding{animation:phSlideDown .3s ease forwards}
    `;
    document.head.appendChild(style);

    const el = document.createElement('div');
    el.id = 'portrait-toast';
    el.style.cssText = [
      'position:fixed','bottom:72px','left:50%','transform:translateX(-50%)',
      'z-index:7999','display:flex','align-items:center','gap:12px',
      'padding:13px 18px 13px 14px','border-radius:16px',
      'background:rgba(10,6,28,.96)','border:1px solid rgba(139,92,246,.35)',
      'box-shadow:0 8px 32px rgba(0,0,0,.55),0 0 0 1px rgba(139,92,246,.1)',
      'backdrop-filter:blur(16px)','-webkit-backdrop-filter:blur(16px)',
      'white-space:nowrap','pointer-events:auto'
    ].join(';');

    el.innerHTML = `
      <span id="ph-phone" style="font-size:26px;display:inline-block;animation:phRotate 2.2s ease-in-out infinite">📱</span>
      <div style="line-height:1.35">
        <div style="font-size:13px;font-weight:700;color:#f1f5f9">Gire o celular!</div>
        <div style="font-size:11px;color:#64748b">Melhor visualização em paisagem</div>
      </div>
      <button id="ph-close" style="margin-left:6px;width:26px;height:26px;border-radius:8px;
        background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
        color:#64748b;font-size:14px;cursor:pointer;display:flex;align-items:center;
        justify-content:center;flex-shrink:0;font-family:inherit;line-height:1">✕</button>
    `;
    document.body.appendChild(el);

    document.getElementById('ph-close').addEventListener('click', () => {
      dismissed = true;
      hideHint();
    });
  }

  function hideHint(){
    const el = document.getElementById('portrait-toast');
    if(!el) return;
    el.classList.add('hiding');
    setTimeout(() => { if(el.parentNode) el.remove(); }, 320);
  }

  function checkHint(){
    const isMobile = window.innerWidth < 900;
    const isPortrait = window.innerHeight > window.innerWidth;
    const tvOpen = !!(document.getElementById('tv-overlay') && document.getElementById('tv-overlay').classList.contains('open'));
    if(isMobile && isPortrait && !dismissed && !tvOpen){
      injectHint();
    } else {
      hideHint();
    }
  }
  // Expose so openTV() can dismiss the toast
  window._hidePortraitToast = hideHint;

  document.addEventListener('DOMContentLoaded', checkHint);
  window.addEventListener('resize', checkHint);
})();

// ── Sparkline SVG ─────────────────────────────────────────
function makeSparkline(data, {w=80, h=28, color='#3b82f6', fill=true}={}){
  if(!data || data.length < 2) return '';
  const mn = Math.min(...data), mx = Math.max(...data);
  const rng = mx - mn || 1;
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1))*w;
    const y = h - ((v-mn)/rng)*(h-4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const last = pts.split(' ').pop();
  const [lx] = last.split(',');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
    ${fill ? `<polygon points="${pts} ${lx},${h} 0,${h}" fill="${color}" opacity=".15"/>` : ''}
    <polyline points="${pts}" stroke="${color}" stroke-width="2" fill="none" stroke-linejoin="round"/>
    <circle cx="${last.split(',')[0]}" cy="${last.split(',')[1]}" r="2.5" fill="${color}"/>
  </svg>`;
}

// ── Escape HTML (XSS-safe) ────────────────────────────────
function escHtml(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
// esc() — JS-string + HTML safe; use inside onclick="fn('${esc(val)}')"
function esc(s){
  return String(s==null?'':s)
    .replace(/\\/g,'\\\\').replace(/'/g,"\\'")
    .replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Formatadores ──────────────────────────────────────────
function formatDate(iso){
  if(!iso) return '—';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function formatDateShort(iso){
  if(!iso) return '—';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}
function formatCurrency(val){
  if(!val && val !== 0) return '—';
  return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(val);
}
function diasLabel(d){
  if(d < 0)  return `${Math.abs(d)}d atraso`;
  if(d === 0)return 'hoje';
  return `${d}d`;
}
function normalizeFase(f){
  if(!f) return '';
  const legacy = {
    'Aprovisionamento':'3. Provisionamento','Provisionamento':'3. Provisionamento',
    'Kickoff':'1. Kickoff','Levantamento Técnico':'2. Levantamento Técnico',
    'Implantação':'4. Implantação','Homologação':'5. Homologação',
    'Go Live':'6. Go Live','Encerramento':'7. Encerramento',
  };
  if(FASES.includes(f)) return f;
  if(legacy[f]) return legacy[f];
  return FASES.find(x => x.toLowerCase().includes(f.toLowerCase())) || f;
}

// ── Command Palette ───────────────────────────────────────
function initCommandPalette(extraCmds=[]){
  const defaultCmds = [
    {label:'Dashboard',  icon:'📊', action:()=>location.href='index.html'},
    {label:'Gerencial',  icon:'⊞',  action:()=>location.href='gerencial.html'},
    {label:'Projetos',   icon:'📋', action:()=>location.href='projetos.html'},
    {label:'Áreas',      icon:'🏢', action:()=>location.href='squads.html'},
    {label:'Alertas',    icon:'🔔', action:()=>location.href='alertas.html'},
    {label:'Admin',      icon:'⚙',  action:()=>location.href='admin.html'},
    {label:'Alternar tema', icon:'◑', action:toggleTheme},
    {label:'Sair',       icon:'→',  action:logout},
  ];
  const cmds = [...defaultCmds, ...extraCmds];
  // Reutiliza overlay já presente no HTML (gerencial, squads); cria se ausente
  let overlay = document.getElementById('cmd-overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.id = 'cmd-overlay';
    overlay.innerHTML = `
      <div id="cmd-palette">
        <div id="cmd-header"><span id="cmd-icon">⌘</span><input id="cmd-input" placeholder="Buscar comando..." autocomplete="off"/></div>
        <div id="cmd-list"></div>
      </div>`;
    overlay.addEventListener('click', e => { if(e.target===overlay) closePalette(); });
    document.body.appendChild(overlay);
  }

  let active = -1;
  const input = document.getElementById('cmd-input');
  const list  = document.getElementById('cmd-list');

  function render(q=''){
    const filtered = cmds.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
    active = -1;
    list.innerHTML = filtered.map((c,i) =>
      `<div class="cmd-item" data-idx="${i}" onclick="__cmdExec(${i})">${c.icon||'›'} ${c.label}</div>`
    ).join('') || '<div class="cmd-empty">Nenhum resultado</div>';
    window.__cmdFiltered = filtered;
  }
  window.__cmdExec = (i) => {
    const c = window.__cmdFiltered[i];
    if(c) c.action();
    closePalette();
  };
  function openPalette(){ overlay.classList.add('open'); input.value=''; render(); input.focus(); }
  function closePalette(){ overlay.classList.remove('open'); }

  input.addEventListener('input', e => render(e.target.value));
  input.addEventListener('keydown', e => {
    const items = list.querySelectorAll('.cmd-item');
    if(e.key==='ArrowDown'){ e.preventDefault(); active=Math.min(active+1,items.length-1); items.forEach((x,i)=>x.classList.toggle('active',i===active)); }
    if(e.key==='ArrowUp'){   e.preventDefault(); active=Math.max(active-1,0); items.forEach((x,i)=>x.classList.toggle('active',i===active)); }
    if(e.key==='Enter' && active>=0){ window.__cmdExec(active); }
    if(e.key==='Escape'){ closePalette(); }
  });
  overlay.addEventListener('click', e => { if(e.target===overlay) closePalette(); });
  document.addEventListener('keydown', e => {
    if((e.ctrlKey||e.metaKey) && e.key==='k'){ e.preventDefault(); openPalette(); }
  });
}

// ── SVG Health Ring ───────────────────────────────────────
function renderHealthRing(elId, value, color='#3b82f6'){
  const el = document.getElementById(elId);
  if(!el) return;
  const r = 40, c = 2*Math.PI*r;
  const dash = c * value / 100;
  el.innerHTML = `
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="10"/>
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="10"
        stroke-dasharray="${dash.toFixed(1)} ${c.toFixed(1)}"
        stroke-dashoffset="${(c/4).toFixed(1)}" stroke-linecap="round"
        style="transition:stroke-dasharray .8s cubic-bezier(.4,0,.2,1)"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
        fill="${color}" font-size="20" font-weight="700" font-family="Inter">${value}</text>
    </svg>`;
}

// ── Delta Badge ───────────────────────────────────────────
function deltaBadge(val){
  if(val === 0) return `<span class="delta neu">—</span>`;
  const cls = val > 0 ? 'up' : 'dn';
  const icon = val > 0 ? '↑' : '↓';
  return `<span class="delta ${cls}">${icon}${Math.abs(val)}</span>`;
}

// ── Export CSV (com BOM) ──────────────────────────────────
const IE_HEADERS = [
  {key:'nome',         label:'Nome',              wch:32, required:true},
  {key:'status',       label:'Status',            wch:16, required:false},
  {key:'local',        label:'Local',             wch:22, required:true},
  {key:'pmo',          label:'PMO',               wch:16, required:true},
  {key:'resp',         label:'Responsável',       wch:22, required:false},
  {key:'colaboradores',label:'Colaboradores',     wch:28, required:false, serialize: v => Array.isArray(v)?v.join('|'):String(v||''), parse: v => v?v.split('|').map(s=>s.trim()).filter(Boolean):[]},
  {key:'squad',        label:'Squad',             wch:10, required:false},
  {key:'prioridade',   label:'Prioridade',        wch:12, required:true},
  {key:'inicio',       label:'Início',            wch:13, required:true},
  {key:'fim',          label:'Go Live',           wch:13, required:true},
  {key:'fimAjustado',  label:'Go Live Ajustado',  wch:16, required:false},
  {key:'bloqueador',   label:'Bloqueador',        wch:38, required:false},
  {key:'diasParado',   label:'Dias Parado',       wch:13, required:false},
];
function exportCSV(){
  const bom = '﻿';
  const header = IE_HEADERS.map(h => `"${h.label}"`).join(';');
  const rows = PROJETOS.map(p =>
    IE_HEADERS.map(h => {
      const raw = h.serialize ? h.serialize(p[h.key]) : String(p[h.key]??'');
      return `"${raw.replace(/"/g,'""')}"`;
    }).join(';')
  );
  const blob = new Blob([bom + header + '\n' + rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download = `projetos_v16_${HOJE_ISO}.csv`; a.click();
}

// ── Print Modal ──────────────────────────────────────────────
// Orientação: cada página já define sua @page ideal no CSS — não sobrescrever
let _pmTheme='dark';

function initPrintModal(){
  if(document.getElementById('pm-overlay')) return;
  const css=document.createElement('style');
  css.id='pm-css';
  css.textContent=`
    #pm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(12px);z-index:9500;display:none;align-items:center;justify-content:center}
    #pm-overlay.open{display:flex}
    .pm-card{background:linear-gradient(145deg,rgba(16,9,48,.97),rgba(8,4,24,.99));border:1px solid rgba(139,92,246,.4);border-top:1px solid rgba(167,139,250,.6);border-radius:24px;padding:36px;width:440px;max-width:92vw;box-shadow:0 40px 100px rgba(0,0,0,.75),0 0 0 1px rgba(139,92,246,.08)}
    .pm-title{font-size:22px;font-weight:900;color:#f1f5f9;margin-bottom:6px;letter-spacing:-.5px}
    .pm-sub{font-size:12px;color:#6d6e85;margin-bottom:28px;line-height:1.5}
    .pm-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6d6e85;margin-bottom:12px}
    .pm-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px}
    .pm-opt{padding:16px 10px;border-radius:14px;border:1px solid rgba(139,92,246,.2);background:rgba(255,255,255,.025);color:#94a3b8;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;text-align:center;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:5px;line-height:1}
    .pm-opt-icon{font-size:26px;margin-bottom:2px}
    .pm-opt-hint{font-size:10px;opacity:.6}
    .pm-opt:hover{border-color:rgba(139,92,246,.5);background:rgba(139,92,246,.08);color:#c4b5fd}
    .pm-opt.pm-active{border-color:#a78bfa;background:rgba(139,92,246,.2);color:#a78bfa;box-shadow:0 0 0 1px rgba(139,92,246,.3),0 4px 20px rgba(139,92,246,.2)}
    .pm-info-bar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.18);margin-bottom:24px;font-size:11px;color:#818cf8}
    .pm-info-bar svg{flex-shrink:0;opacity:.8}
    .pm-hr{height:1px;background:rgba(139,92,246,.12);margin:0 0 24px}
    .pm-actions{display:flex;gap:12px}
    .pm-btn-cancel{flex:1;padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#64748b;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
    .pm-btn-cancel:hover{color:#94a3b8;background:rgba(255,255,255,.06)}
    .pm-btn-print{flex:2;padding:14px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#6d28d9);border:none;color:#fff;font-family:inherit;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 20px rgba(124,58,237,.45);transition:all .2s;letter-spacing:.2px}
    .pm-btn-print:hover{box-shadow:0 6px 30px rgba(124,58,237,.65);transform:translateY(-1px)}
    @media print{
      [data-ptheme="light"] body{background:#f8fafc!important;color:#0f172a!important}
      [data-ptheme="light"] .card{background:rgba(255,255,255,.97)!important;border-color:rgba(0,0,0,.09)!important;box-shadow:0 1px 4px rgba(0,0,0,.08)!important}
      [data-ptheme="light"] .card-title{color:#475569!important}
      [data-ptheme="light"] #sidebar{background:#e8eaf0!important;border-color:#cbd5e1!important}
      [data-ptheme="light"] .topbar{background:#e8eaf0!important;border-color:#cbd5e1!important}
      [data-ptheme="light"] .kpi-big-lbl,[data-ptheme="light"] .kpi-big-sub{color:#64748b!important}
      [data-ptheme="light"] .proj-table th,[data-ptheme="light"] .proj-table td{border-color:#e2e8f0!important;color:#0f172a!important}
      [data-ptheme="light"] .gantt-label{color:#0f172a!important}
      [data-ptheme="light"] .alert-item{background:rgba(0,0,0,.04)!important}
    }
  `;
  document.head.appendChild(css);
  // Não criamos um estilo @page aqui — cada página define o seu próprio no CSS
  // (gerencial.html e squads.html = landscape; demais = portrait)

  const el=document.createElement('div');
  el.id='pm-overlay';
  el.innerHTML=`
    <div class="pm-card">
      <div class="pm-title">📄 Imprimir / Exportar PDF</div>
      <div class="pm-sub">Configure antes de enviar para impressão</div>
      <div class="pm-info-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Orientação automática — esta página já sabe o melhor layout para impressão</span>
      </div>
      <div class="pm-label">Tema de impressão</div>
      <div class="pm-opts">
        <button class="pm-opt pm-active" id="pm-dark" onclick="pmSel('dark')">
          <span class="pm-opt-icon">🌙</span><span>Escuro</span><span class="pm-opt-hint">fundo atual</span>
        </button>
        <button class="pm-opt" id="pm-light" onclick="pmSel('light')">
          <span class="pm-opt-icon">☀️</span><span>Claro</span><span class="pm-opt-hint">ideal para papel</span>
        </button>
      </div>
      <div class="pm-hr"></div>
      <div class="pm-actions">
        <button class="pm-btn-cancel" onclick="closePM()">Cancelar</button>
        <button class="pm-btn-print" onclick="execPrint()">🖨&nbsp; Imprimir / Salvar PDF</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click',e=>{ if(e.target===el) closePM(); });
}

function pmSel(val){
  _pmTheme=val;
  document.getElementById('pm-dark').classList.toggle('pm-active',val==='dark');
  document.getElementById('pm-light').classList.toggle('pm-active',val==='light');
}

function openPM(){ const el=document.getElementById('pm-overlay'); if(el) el.classList.add('open'); }
function closePM(){ const el=document.getElementById('pm-overlay'); if(el) el.classList.remove('open'); }

function execPrint(){
  closePM();
  const html=document.documentElement;
  if(_pmTheme==='light') html.setAttribute('data-ptheme','light');
  setTimeout(()=>{
    window.print();
    setTimeout(()=>html.removeAttribute('data-ptheme'),600);
  },150);
}

// ── Relative Date (legível por humanos) ───────────────────
// "hoje", "ontem", "há 3 dias", "em 5 dias", "amanhã"
function formatRelativeDate(iso){
  if(!iso) return '—';
  const d = new Date(iso); d.setHours(0,0,0,0);
  const diff = Math.round((HOJE - d) / 86400000);
  if(diff < 0){
    const abs = Math.abs(diff);
    if(abs === 1) return 'amanhã';
    if(abs <= 6)  return `em ${abs} dias`;
    if(abs <= 13) return 'em 1 sem';
    return formatDateShort(iso);
  }
  if(diff === 0) return 'hoje';
  if(diff === 1) return 'ontem';
  if(diff <= 6)  return `há ${diff} dias`;
  if(diff <= 13) return 'há 1 semana';
  if(diff <= 30) return `há ${Math.floor(diff/7)} semanas`;
  return formatDateShort(iso);
}

// ── Projetos com prazo iminente ────────────────────────────
function getUrgentProjects(days=7){
  return PROJETOS.filter(p => {
    const _st = calcStatus(p);
    if(_st === 'Concluído' || _st === 'Não Iniciado' || _st === 'Standby') return false;
    const fe = getFimEfetivo(p) || p.fim;
    if(!fe) return false;
    const d = Math.round((new Date(fe) - HOJE) / 86400000);
    return d >= -3 && d <= days; // inclui até 3 dias atrasados
  }).sort((a,b) => new Date(getFimEfetivo(a)||a.fim) - new Date(getFimEfetivo(b)||b.fim));
}

// ── Count-Up Animation ────────────────────────────────────
// Anima número de 0 até target com easing suave
function countUp(el, target, dur=900){
  if(!el || isNaN(target) || target === 0){ if(el) el.textContent = target; return; }
  const startTime = performance.now();
  const ease = p => p < 0.5 ? 2*p*p : -1 + (4 - 2*p)*p; // ease-in-out
  const tick = now => {
    const p = Math.min((now - startTime) / dur, 1);
    el.textContent = Math.round(ease(p) * target);
    if(p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}

// Executa count-up em todos os elementos com [data-kpi]
function runKpiCounters(){
  document.querySelectorAll('[data-kpi]').forEach(el => {
    countUp(el, +el.dataset.kpi);
  });
}

// ── Staggered Entry Animation ─────────────────────────────
function animateEntrance(sel='.card', step=0.045){
  document.querySelectorAll(sel).forEach((el, i) => {
    const delay = (i * step).toFixed(2);
    el.style.cssText += `;opacity:0;transform:translateY(14px);
      transition:opacity .4s ease ${delay}s,transform .4s ease ${delay}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
}

// ── Última atualização do portfólio ───────────────────────
function getLastUpdateISO(){
  let latest = null;
  ATIVIDADES.forEach(a => {
    (a.comentarios||[]).forEach(c => {
      if(!latest || c.dataISO > latest) latest = c.dataISO;
    });
  });
  return latest;
}

// ── Totais rápidos por status ─────────────────────────────
function calcAtivSummary(){
  const ativos = PROJETOS.filter(p => {
    const s = calcStatus(p); return s !== 'Concluído' && s !== 'Não Iniciado' && s !== 'Standby';
  });
  const ativs = ATIVIDADES.filter(a => ativos.find(p => p.nome === a.projeto));
  const out = {total:0, done:0, inprog:0, waiting:0, notStarted:0, blocked:0};
  ativs.forEach(a => {
    out.total++;
    if(a.status === 'Concluído')    out.done++;
    else if(a.status === 'Em andamento') out.inprog++;
    else if(a.status === 'Aguardando')   out.waiting++;
    else if(a.status === 'Bloqueado')    out.blocked++;
    else out.notStarted++;
  });
  return out;
}

// ═══ V16 UTILITIES ═══════════════════════════════════════════

// Returns color for health score
function calcHealthColor(score) {
  if (score >= 70) return '#22c55e'; // alinhado com calcPortfolioHealth
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}

// Alias unificado — usa formatRelativeDate como canonical (thresholds mais ricos)
function formatDateRelative(isoStr){ return formatRelativeDate(isoStr); }

// ── Detecção de Similaridade (Jaccard) ───────────────────
// Usadas em projetos.html para detectar entradas de histórico duplicadas
function _calcSimilarity(a, b){
  const words = s => new Set(
    (s||'').toLowerCase().replace(/[^\w\s]/g,'').split(/\s+/).filter(w => w.length > 3)
  );
  const wa = words(a), wb = words(b);
  if(!wa.size && !wb.size) return 1;
  if(!wa.size || !wb.size) return 0;
  let inter = 0;
  wa.forEach(w => { if(wb.has(w)) inter++; });
  return inter / (wa.size + wb.size - inter);
}
function _diasEntre(isoA, isoB){
  const a = new Date(isoA||''), b = new Date(isoB||'');
  if(isNaN(a)||isNaN(b)) return null;
  return Math.round(Math.abs(b-a)/86400000);
}

// Returns projects with GoLive in the next N days (sorted by urgency)
function getGoLivesProximos(days) {
  days = days || 30;
  return PROJETOS
    .filter(p => {
      const st = calcStatus(p);
      if (st === 'Concluído' || st === 'Não Iniciado' || st === 'Standby') return false;
      const fe = getFimEfetivo(p);
      if (!fe) return false;
      const diff = Math.round((new Date(fe) - HOJE) / 86400000);
      return diff >= 0 && diff <= days;
    })
    .map(p => {
      const fe = getFimEfetivo(p);
      const diff = Math.round((new Date(fe) - HOJE) / 86400000);
      return { ...p, _daysLeft: diff, _fe: fe };
    })
    .sort((a, b) => a._daysLeft - b._daysLeft);
}

// Returns the most recent communication event across all projects
// Usa getHistoricoForProject() para respeitar overrides do usuário no localStorage
function getRecentComunicacoes(limit) {
  limit = limit || 5;
  const events = [];
  const seen = new Set();
  const projs = (typeof PROJETOS !== 'undefined' && PROJETOS.length) ? PROJETOS : PROJETOS_PADRAO;
  projs.forEach(p => {
    const st = (typeof calcStatus === 'function') ? calcStatus(p) : (p.status||'');
    if(st === 'Standby' || st === 'Não Iniciado') return;
    getHistoricoForProject(p.nome).forEach(ev => {
      const key = p.nome + '||' + (ev.dataISO||'') + '||' + (ev.titulo||'');
      if(!seen.has(key)){
        seen.add(key);
        events.push({ ...ev, _projeto: p.nome });
      }
    });
  });
  return events
    .sort((a, b) => (b.dataISO || '').localeCompare(a.dataISO || ''))
    .slice(0, limit);
}

// Priority score for sorting alerts (higher = more urgent)
function getAlertPriorityScore(p) {
  let score = 0;
  const st = calcStatus(p);
  const fe = getFimEfetivo(p);
  const daysLeft = fe ? Math.round((new Date(fe) - HOJE) / 86400000) : Infinity;
  if (st === 'Atrasado')  score += 100;
  if (st === 'Bloqueado') score += 80;
  if (isCritico(p))       score += 60;
  if (p.bloqueador && p.bloqueador.trim()) score += 40;
  if (daysLeft >= 0 && daysLeft <= 7)  score += 50;
  if (daysLeft >= 0 && daysLeft <= 14) score += 25;
  if (p.prioridade === 'Alta')  score += 20;
  return score;
}

// Sparkline SVG (inline, no canvas needed)
function makeSparklineSVG(values, color, width, height) {
  color  = color  || '#F5C300';
  width  = width  || 80;
  height = height || 32;
  if (!values || values.length < 2) return '';
  const mn = Math.min(...values), mx = Math.max(...values);
  const rng = mx - mn || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 2) + 1;
    const y = height - 4 - ((v - mn) / rng) * (height - 8);
    return [x.toFixed(1), y.toFixed(1)];
  });
  const polyline = pts.map(p => p.join(',')).join(' ');
  const areaPath = `M${pts[0][0]},${height} ` + pts.map(p => `L${p[0]},${p[1]}`).join(' ') + ` L${pts[pts.length-1][0]},${height} Z`;
  const gid = 'spk' + Math.random().toString(36).slice(2,8);
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" style="display:block">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#${gid})"/>
    <polyline points="${polyline}" stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// Generate simulated 7-point sparkline data centered around a value
function simulateSparkData(currentValue, volatility) {
  volatility = volatility || 0.3;
  const data = [];
  let v = Math.max(0, currentValue * (0.7 + Math.random() * 0.3));
  for (let i = 0; i < 6; i++) {
    v = Math.max(0, v + (Math.random() - 0.45) * currentValue * volatility);
    data.push(Math.round(v));
  }
  data.push(currentValue);
  return data;
}

// ── Mobile Sidebar Drawer ─────────────────────────────────────
// Auto-inicializa em todas as páginas: injeta backdrop + hamburger,
// gerencia drawer em telas ≤ 900px.
(function initMobileNav(){
  document.addEventListener('DOMContentLoaded', function(){
    const sidebar = document.getElementById('sidebar');
    if(!sidebar) return;

    // ── Backdrop ──
    const bd = document.createElement('div');
    bd.id = 'sidebar-backdrop';
    document.body.appendChild(bd);
    bd.addEventListener('click', closeMobileNav);

    // ── Hamburger injetado no topbar ──
    const topbar = document.querySelector('.topbar');
    if(topbar && !topbar.querySelector('.topbar-hamburger')){
      const btn = document.createElement('button');
      btn.className = 'topbar-hamburger';
      btn.setAttribute('aria-label', 'Abrir menu');
      btn.setAttribute('title', 'Menu');
      btn.innerHTML = '&#9776;';
      topbar.insertBefore(btn, topbar.firstChild);
      btn.addEventListener('click', toggleMobileNav);
    }

    // ── Fechar ao clicar em link do nav (UX mobile) ──
    sidebar.querySelectorAll('.nav-item').forEach(function(a){
      a.addEventListener('click', function(){
        if(window.innerWidth <= 900) closeMobileNav();
      });
    });

    // ── Fechar com Escape ──
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMobileNav();
    });
  });

  function toggleMobileNav(){
    const sidebar = document.getElementById('sidebar');
    if(!sidebar) return;
    sidebar.classList.contains('mobile-open') ? closeMobileNav() : openMobileNav();
  }

  function openMobileNav(){
    const sidebar  = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if(sidebar)  sidebar.classList.add('mobile-open');
    if(backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav(){
    const sidebar  = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if(sidebar)  sidebar.classList.remove('mobile-open');
    if(backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
})();
