const storage = {
  get(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const defaults = {
  templates: [
    {id:'terceiros',name:'TERCEIROS',description:'Empresas terceirizadas, setores, funções, riscos e NRs aplicáveis.',sections:8,questions:24,version:'1.0',active:true},
    {id:'visita',name:'VISITA TÉCNICA SIMPLIFICADA',description:'Registro rápido de visita, evidências e observações gerais.',sections:4,questions:18,version:'1.1',active:true},
    {id:'arquivo',name:'CHECKLIST OPERACIONAL 2025',description:'Versão anterior mantida para consulta.',sections:6,questions:31,version:'2.3',active:false}
  ],
  companies: [
    {id:'alpha',name:'Empresa Alpha Industrial',city:'Novo Hamburgo/RS',cnpj:'00.000.000/0001-00',inspections:3,initials:'EA'},
    {id:'beta',name:'Empresa Beta Serviços',city:'Canoas/RS',cnpj:'00.000.000/0002-00',inspections:2,initials:'EB'},
    {id:'gamma',name:'Empresa Gamma Logística',city:'Caxias do Sul/RS',cnpj:'00.000.000/0003-00',inspections:1,initials:'EG'},
    {id:'delta',name:'Empresa Delta Manufatura',city:'São Leopoldo/RS',cnpj:'00.000.000/0004-00',inspections:4,initials:'ED'}
  ],
  inspections: [
    {id:'LEV-DEMO-018',company:'Empresa Alpha Industrial',city:'Novo Hamburgo',cnpj:'00.000.000/0001-00',template:'TERCEIROS',status:'concluido',progress:100,score:75,updated:'27 ago. 2026',initials:'EA'},
    {id:'LEV-DEMO-021',company:'Empresa Beta Serviços',city:'Canoas',cnpj:'00.000.000/0002-00',template:'TERCEIROS',status:'revisao',progress:100,score:77,updated:'Hoje, 09:42',initials:'EB'},
    {id:'LEV-DEMO-024',company:'Empresa Delta Manufatura',city:'São Leopoldo',cnpj:'00.000.000/0004-00',template:'TERCEIROS',status:'andamento',progress:68,score:82,updated:'Hoje, 10:18',initials:'ED'},
    {id:'LEV-DEMO-025',company:'Empresa Épsilon Saúde',city:'Porto Alegre',cnpj:'00.000.000/0005-00',template:'TERCEIROS',status:'andamento',progress:34,score:null,updated:'Ontem, 16:05',initials:'EE'},
    {id:'LEV-DEMO-017',company:'Empresa Gamma Logística',city:'Caxias do Sul',cnpj:'00.000.000/0003-00',template:'TERCEIROS',status:'concluido',progress:100,score:65,updated:'4 set. 2026',initials:'EG'}
  ]
};

const checklistSections = [
  {title:'Identificação',description:'Dados da empresa e responsáveis pela visita.',questions:[
    {id:'razao',label:'Razão social da empresa',type:'text',required:true,placeholder:'Digite a razão social'},
    {id:'cnpj',label:'CNPJ',type:'text',required:true,placeholder:'00.000.000/0000-00'},
    {id:'acompanhante',label:'Responsável que acompanhou o levantamento',type:'text',required:true,placeholder:'Nome e função'}
  ]},
  {title:'Informações gerais',description:'Características do estabelecimento e da operação.',questions:[
    {id:'atividade',label:'A atividade observada corresponde à atividade declarada?',type:'tri',required:true},
    {id:'documentos',label:'Os documentos ocupacionais estavam disponíveis?',type:'tri',required:true},
    {id:'obs',label:'Observações gerais da visita',type:'textarea',placeholder:'Descreva informações relevantes'}
  ]},
  {title:'Setores',description:'Ambientes, condições e evidências encontradas.',questions:[
    {id:'setor',label:'Nome do setor avaliado',type:'text',required:true,placeholder:'Ex.: Produção'},
    {id:'condicao',label:'As condições gerais do ambiente são adequadas?',type:'tri',required:true},
    {id:'foto',label:'Registre uma evidência fotográfica do setor',type:'photo'}
  ]},
  {title:'Funções e riscos',description:'Atividades executadas e fatores de risco identificados.',questions:[
    {id:'funcao',label:'Função avaliada',type:'text',required:true,placeholder:'Ex.: Operador de produção'},
    {id:'fisicos',label:'Há exposição a riscos físicos?',type:'tri',required:true},
    {id:'quimicos',label:'Há exposição a riscos químicos?',type:'tri',required:true},
    {id:'ergonomicos',label:'Há fatores de risco ergonômico?',type:'tri',required:true}
  ]},
  {title:'Documentos',description:'Registros, treinamentos e controles verificados.',questions:[
    {id:'pgr',label:'O PGR está disponível e atualizado?',type:'tri',required:true},
    {id:'pcmso',label:'O PCMSO está disponível e atualizado?',type:'tri',required:true},
    {id:'treinamentos',label:'Os treinamentos obrigatórios possuem comprovação?',type:'tri',required:true}
  ]},
  {title:'NRs aplicáveis',description:'Blocos condicionais conforme a realidade encontrada.',questions:[
    {id:'nr10',label:'A NR-10 é aplicável à empresa ou setor?',type:'tri',required:true},
    {id:'nr10_doc',label:'O prontuário das instalações elétricas está disponível?',type:'tri',required:true,condition:{id:'nr10',value:'sim'}},
    {id:'nr12',label:'A NR-12 é aplicável à empresa ou setor?',type:'tri',required:true},
    {id:'nr12_doc',label:'As máquinas possuem inventário e análise de riscos?',type:'tri',required:true,condition:{id:'nr12',value:'sim'}},
    {id:'nr35',label:'Há atividades com trabalho em altura?',type:'tri',required:true}
  ]},
  {title:'Pendências',description:'Não conformidades e orientações registradas.',questions:[
    {id:'pendencias',label:'Principais pendências identificadas',type:'textarea',placeholder:'Liste cada pendência de forma objetiva'},
    {id:'acao',label:'Foi necessária alguma orientação ou ação imediata?',type:'tri',required:true}
  ]},
  {title:'Finalização',description:'Revisão do preenchimento com o acompanhante.',questions:[
    {id:'confirmacao',label:'As informações foram revisadas junto ao acompanhante?',type:'tri',required:true},
    {id:'responsavel',label:'Nome do responsável pela confirmação',type:'text',required:true,placeholder:'Nome completo'},
    {id:'final',label:'Observação final',type:'textarea',placeholder:'Informações adicionais'}
  ]}
];

const state = {
  role: localStorage.getItem('innovativa-role') || 'Administrador',
  page: 'inicio',
  currentSection: 0,
  activeInspectionId: null,
  deferredInstall: null,
  templates: storage.get('innovativa-templates', defaults.templates),
  companies: storage.get('innovativa-companies', defaults.companies),
  inspections: storage.get('innovativa-inspections', defaults.inspections),
  users: [
    {name:'Administrador Demo',email:'admin@example.com',role:'Administrador',count:0,status:'Ativo',access:'Agora'},
    {name:'Técnico Demo',email:'tecnico@example.com',role:'Técnico',count:18,status:'Ativo',access:'Hoje, 10:18'},
    {name:'Técnica Demo',email:'tecnica@example.com',role:'Técnico',count:14,status:'Ativo',access:'Hoje, 09:42'},
    {name:'Gestão Demo',email:'gestao@example.com',role:'Gestão',count:4,status:'Ativo',access:'Ontem, 17:30'}
  ]
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const statusLabels = {andamento:'Em andamento',revisao:'Em revisão',concluido:'Concluído'};

function persist() {
  storage.set('innovativa-templates', state.templates);
  storage.set('innovativa-companies', state.companies);
  storage.set('innovativa-inspections', state.inspections);
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
}

function navigate(page) {
  state.page = page;
  $$('.page').forEach(el => el.classList.toggle('active', el.id === `page-${page}`));
  $$('.nav').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  $('#sidebar').classList.remove('open');
  if (page === 'levantamentos') renderInspections();
  if (page === 'modelos') renderTemplates();
  if (page === 'empresas') renderCompanies();
  if (page === 'usuarios') renderUsers();
  window.scrollTo({top:0,behavior:'smooth'});
}

function applyRole() {
  $('#roleLabel').textContent = state.role;
  const admin = state.role === 'Administrador';
  const manager = admin || state.role === 'Gestão';
  $$('.admin-only').forEach(el => el.hidden = !admin);
  $$('.manager-only').forEach(el => el.hidden = !manager);
}

function cycleRole() {
  const roles = ['Administrador','Gestão','Técnico'];
  state.role = roles[(roles.indexOf(state.role) + 1) % roles.length];
  localStorage.setItem('innovativa-role', state.role);
  applyRole();
  toast(`Perfil demonstrativo: ${state.role}`);
}

function renderStats() {
  $('#statOpen').textContent = state.inspections.filter(x => x.status === 'andamento').length;
  $('#statReview').textContent = state.inspections.filter(x => x.status === 'revisao').length;
  $('#statDone').textContent = state.inspections.filter(x => x.status === 'concluido').length;
  $('#statCompanies').textContent = state.companies.length;
}

function row(item, compact=false) {
  const score = item.score == null ? '—' : `${Math.round(item.score)}%`;
  if (compact) {
    return `<button class="recent" data-open="${item.id}">
      <span class="logo">${item.initials}</span>
      <span class="recent-main"><strong>${item.company}</strong><small>${item.id} · ${item.template} · ${item.city}</small></span>
      <span class="status ${item.status}">${statusLabels[item.status]}</span>
      <span class="mini-progress"><i style="width:${item.progress}%"></i><small>${item.progress}%</small></span>
    </button>`;
  }
  return `<tr data-open="${item.id}">
    <td><div class="company-cell"><span class="logo">${item.initials}</span><span><strong>${item.company}</strong><small>${item.id} · ${item.city}</small></span></div></td>
    <td>${item.cnpj}</td>
    <td><span class="status ${item.status}">${statusLabels[item.status]}</span></td>
    <td><div class="bar-cell"><div><i style="width:${item.progress}%"></i></div><b>${item.progress}%</b></div></td>
    <td>${score}</td>
    <td>${item.updated}</td>
  </tr>`;
}

function renderRecent() {
  $('#recentList').innerHTML = state.inspections.slice(0,4).map(x => row(x,true)).join('');
  renderStats();
}

function filteredInspections() {
  const q = ($('#inspectionSearch')?.value || '').toLowerCase();
  const status = $('#statusFilter')?.value || 'all';
  return state.inspections.filter(item => {
    const matchesStatus = status === 'all' || item.status === status;
    const text = `${item.company} ${item.city} ${item.cnpj} ${item.id}`.toLowerCase();
    return matchesStatus && text.includes(q);
  });
}

function renderInspections() {
  const items = filteredInspections();
  $('#resultCount').textContent = items.length;
  $('#inspectionTable').innerHTML = items.map(x => row(x)).join('') ||
    '<tr><td colspan="6" class="empty-cell">Nenhum levantamento encontrado.</td></tr>';
}

function renderTemplates() {
  $('#templateGrid').innerHTML = state.templates.map(t => `<article class="card">
    <div class="card-top"><span class="pill">${t.active ? 'Ativo' : 'Rascunho'}</span><small>v${t.version}</small></div>
    <h3>${t.name}</h3><p>${t.description}</p>
    <div class="card-metrics"><span><b>${t.sections}</b> seções</span><span><b>${t.questions}</b> perguntas</span></div>
    <button class="ghost full" data-duplicate="${t.id}">Duplicar modelo</button>
  </article>`).join('');
}

function renderCompanies() {
  $('#companyGrid').innerHTML = state.companies.map(c => `<article class="card">
    <span class="logo large">${c.initials}</span>
    <h3>${c.name}</h3><p>${c.cnpj}<br>${c.city}</p>
    <div class="card-metrics"><span><b>${c.inspections}</b> levantamentos</span></div>
  </article>`).join('');
}

function renderUsers() {
  $('#userTable').innerHTML = state.users.map(u => `<tr>
    <td><div class="company-cell"><span class="logo">${u.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><span><strong>${u.name}</strong><small>${u.email}</small></span></div></td>
    <td>${u.role}</td><td>${u.count}</td><td><span class="status concluido">${u.status}</span></td><td>${u.access}</td>
  </tr>`).join('');
}

function openNewInspection() {
  $('#companySelect').innerHTML = state.companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  $('#templateSelect').innerHTML = state.templates.filter(t => t.active).map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  $('#scheduledDate').value = new Date().toISOString().slice(0,10);
  $('#newInspectionDialog').showModal();
}

function inspectionAnswersKey(id) {
  return `innovativa-answers-${id}`;
}

function getAnswers() {
  return storage.get(inspectionAnswersKey(state.activeInspectionId), {});
}

function setAnswer(id, value) {
  const answers = getAnswers();
  answers[id] = value;
  storage.set(inspectionAnswersKey(state.activeInspectionId), answers);
  updateProgress();
}

function visibleQuestions(section, answers) {
  return section.questions.filter(q => !q.condition || answers[q.condition.id] === q.condition.value);
}

function totalProgress(answers) {
  const questions = checklistSections.flatMap(s => visibleQuestions(s, answers)).filter(q => q.required);
  if (!questions.length) return 0;
  const done = questions.filter(q => String(answers[q.id] ?? '').trim() !== '').length;
  return Math.round(done / questions.length * 100);
}

function sectionProgress(section, answers) {
  const questions = visibleQuestions(section, answers).filter(q => q.required);
  if (!questions.length) return 100;
  const done = questions.filter(q => String(answers[q.id] ?? '').trim() !== '').length;
  return Math.round(done / questions.length * 100);
}

function conformityScore(answers) {
  const values = Object.values(answers).filter(v => ['sim','nao','na'].includes(v));
  const applicable = values.filter(v => v !== 'na');
  if (!applicable.length) return null;
  return Math.round(applicable.filter(v => v === 'sim').length / applicable.length * 100);
}

function startInspection(item) {
  state.activeInspectionId = item.id;
  state.currentSection = 0;
  $('#checklistCompany').textContent = item.company;
  $('#checklistTemplate').textContent = item.template;
  renderChecklist();
  navigate('checklist');
}

function renderQuestion(q, index, answers) {
  const value = answers[q.id] ?? '';
  let field = '';
  if (q.type === 'tri') {
    field = `<div class="tri">
      ${[['sim','Sim'],['nao','Não'],['na','N.A.']].map(([v,l]) =>
        `<button type="button" data-answer="${q.id}" data-value="${v}" class="${value===v?'selected':''}">${l}</button>`
      ).join('')}
    </div>`;
  } else if (q.type === 'textarea') {
    field = `<textarea data-text="${q.id}" rows="4" placeholder="${q.placeholder || ''}">${escapeHtml(value)}</textarea>
      <button type="button" class="voice" data-voice="${q.id}">🎙 Preencher por voz</button>`;
  } else if (q.type === 'photo') {
    field = `<label class="photo-button">＋ Adicionar foto<input type="file" accept="image/*" capture="environment" data-photo="${q.id}" hidden></label>
      ${value ? `<img class="photo-preview" src="${value}" alt="Evidência fotográfica">` : ''}`;
  } else {
    field = `<input data-text="${q.id}" value="${escapeHtml(value)}" placeholder="${q.placeholder || ''}">
      <button type="button" class="voice" data-voice="${q.id}">🎙 Preencher por voz</button>`;
  }
  return `<article class="question-card">
    <div class="question-number">${index + 1}</div>
    <div class="question-body"><h3>${q.label}${q.required ? ' <em>*</em>' : ''}</h3>${field}</div>
  </article>`;
}

function renderChecklist() {
  const answers = getAnswers();
  const section = checklistSections[state.currentSection];
  const questions = visibleQuestions(section, answers);

  $('#sectionNav').innerHTML = checklistSections.map((s,i) => {
    const progress = sectionProgress(s, answers);
    return `<button data-section="${i}" class="${i===state.currentSection?'active':''}">
      <span>${i+1}</span><b>${s.title}</b><small>${progress}%</small>
    </button>`;
  }).join('');

  $('#sectionKicker').textContent = `SEÇÃO ${state.currentSection + 1} DE ${checklistSections.length}`;
  $('#sectionTitle').textContent = section.title;
  $('#sectionDescription').textContent = section.description;
  $('#sectionProgress').textContent = `${sectionProgress(section, answers)}%`;
  $('#questionList').innerHTML = questions.map((q,i) => renderQuestion(q,i,answers)).join('');
  $('#previousSection').disabled = state.currentSection === 0;
  $('#nextSection').textContent = state.currentSection === checklistSections.length - 1 ? 'Enviar para revisão →' : 'Próxima seção →';

  $$('[data-answer]').forEach(btn => btn.onclick = () => {
    setAnswer(btn.dataset.answer, btn.dataset.value);
    renderChecklist();
  });
  $$('[data-text]').forEach(input => input.oninput = () => setAnswer(input.dataset.text, input.value));
  $$('[data-photo]').forEach(input => input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 1800000) return toast('Para esta demo, use imagem de até 1,8 MB.');
    const reader = new FileReader();
    reader.onload = () => {
      setAnswer(input.dataset.photo, reader.result);
      renderChecklist();
    };
    reader.readAsDataURL(file);
  });
  $$('[data-voice]').forEach(btn => btn.onclick = () => startVoice(btn.dataset.voice));
  updateProgress();
}

function startVoice(id) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const field = document.querySelector(`[data-text="${id}"]`);
  if (!Recognition) {
    field?.focus();
    toast('Use o microfone do teclado para ditar neste navegador.');
    return;
  }
  const recognition = new Recognition();
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
  toast('Ouvindo…');
  recognition.onresult = event => {
    setAnswer(id, event.results[0][0].transcript);
    renderChecklist();
  };
  recognition.onerror = () => toast('Não foi possível reconhecer a fala.');
  recognition.start();
}

function updateProgress() {
  if (!state.activeInspectionId) return;
  const answers = getAnswers();
  const progress = totalProgress(answers);
  $('#checklistProgressBar').style.width = `${progress}%`;
  const item = state.inspections.find(x => x.id === state.activeInspectionId);
  if (item) {
    item.progress = progress;
    item.score = conformityScore(answers);
    item.updated = 'Agora';
    persist();
    renderRecent();
  }
}

function openSimple(type) {
  const configs = {
    company:{
      kicker:'CADASTRO',title:'Nova empresa',
      fields:'<label class="full">Razão social<input name="name" required></label><label>CNPJ<input name="cnpj" required placeholder="00.000.000/0000-00"></label><label>Cidade/UF<input name="city" required></label>'
    },
    model:{
      kicker:'CONSTRUTOR',title:'Novo modelo',
      fields:'<label class="full">Nome<input name="name" required></label><label class="full">Descrição<textarea name="description" rows="3"></textarea></label>'
    },
    user:{
      kicker:'ACESSOS',title:'Novo usuário',
      fields:'<label class="full">Nome<input name="name" required></label><label class="full">E-mail<input name="email" type="email" required></label><label class="full">Perfil<select name="role"><option>Técnico</option><option>Gestão</option><option>Administrador</option></select></label>'
    }
  };
  const config = configs[type];
  $('#simpleKicker').textContent = config.kicker;
  $('#simpleTitle').textContent = config.title;
  $('#simpleFields').innerHTML = config.fields;
  $('#simpleForm').dataset.type = type;
  $('#simpleDialog').showModal();
}

function saveSimple(form) {
  const data = Object.fromEntries(new FormData(form));
  if (form.dataset.type === 'company') {
    state.companies.unshift({
      id:Date.now().toString(),name:data.name,city:data.city,cnpj:data.cnpj,
      inspections:0,initials:data.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()
    });
    persist();
    renderCompanies();
  }
  if (form.dataset.type === 'model') {
    state.templates.unshift({
      id:Date.now().toString(),name:data.name.toUpperCase(),
      description:data.description || 'Modelo personalizado de checklist.',
      sections:1,questions:0,version:'0.1',active:false
    });
    persist();
    renderTemplates();
  }
  if (form.dataset.type === 'user') {
    state.users.unshift({name:data.name,email:data.email,role:data.role,count:0,status:'Convite enviado',access:'Nunca'});
    renderUsers();
  }
  form.reset();
  $('#simpleDialog').close();
  toast('Registro salvo.');
}

function exportData() {
  const payload = JSON.stringify({inspections:state.inspections,companies:state.companies,templates:state.templates}, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], {type:'application/json'}));
  link.download = 'innovativa-inspecoes-demo.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function updateConnection() {
  const online = navigator.onLine;
  $('#connectionBadge').classList.toggle('offline', !online);
  $('#connectionBadge b').textContent = online ? 'Online' : 'Sem conexão';
}

function bind() {
  $$('[data-page]').forEach(btn => btn.onclick = () => navigate(btn.dataset.page));
  $$('[data-go]').forEach(btn => btn.onclick = () => navigate(btn.dataset.go));
  $$('[data-action="new-inspection"]').forEach(btn => btn.onclick = openNewInspection);

  $('#menuButton').onclick = () => $('#sidebar').classList.toggle('open');
  $('#profileButton').onclick = cycleRole;
  $('#inspectionSearch').oninput = renderInspections;
  $('#statusFilter').onchange = renderInspections;
  $('#globalSearch').onfocus = () => navigate('levantamentos');
  $('#globalSearch').oninput = event => {
    $('#inspectionSearch').value = event.target.value;
    renderInspections();
  };
  $('#exportButton').onclick = exportData;

  $('#newModelButton').onclick = () => openSimple('model');
  $('#newCompanyButton').onclick = () => openSimple('company');
  $('#newUserButton').onclick = () => openSimple('user');

  $$('.close-modal').forEach(btn => btn.onclick = () => $('#newInspectionDialog').close());
  $$('.close-simple').forEach(btn => btn.onclick = () => $('#simpleDialog').close());

  $('#simpleForm').onsubmit = event => {
    event.preventDefault();
    saveSimple(event.currentTarget);
  };

  $('#newInspectionForm').onsubmit = event => {
    event.preventDefault();
    const company = state.companies.find(c => c.id === $('#companySelect').value);
    const template = state.templates.find(t => t.id === $('#templateSelect').value);
    if (!company || !template) return;
    const item = {
      id:`LEV-DEMO-${String(Date.now()).slice(-6)}`,
      company:company.name,
      city:company.city.split('/')[0],
      cnpj:company.cnpj,
      template:template.name,
      status:'andamento',
      progress:0,
      score:null,
      updated:'Agora',
      initials:company.initials
    };
    state.inspections.unshift(item);
    company.inspections += 1;
    persist();
    $('#newInspectionDialog').close();
    renderRecent();
    startInspection(item);
    toast('Levantamento criado.');
  };

  document.addEventListener('click', event => {
    const open = event.target.closest('[data-open]');
    if (open) {
      const item = state.inspections.find(x => x.id === open.dataset.open);
      if (item) startInspection(item);
    }
    const duplicate = event.target.closest('[data-duplicate]');
    if (duplicate) {
      const template = state.templates.find(x => x.id === duplicate.dataset.duplicate);
      if (!template) return;
      state.templates.unshift({...template,id:Date.now().toString(),name:`${template.name} — CÓPIA`,version:'0.1',active:false});
      persist();
      renderTemplates();
      toast('Modelo duplicado como rascunho.');
    }
  });

  $('#modelImport').onchange = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        state.templates.unshift({
          id:Date.now().toString(),
          name:String(data.name || file.name.replace(/\.json$/i,'')).toUpperCase(),
          description:data.description || 'Modelo importado para revisão.',
          sections:Array.isArray(data.sections) ? data.sections.length : 1,
          questions:Array.isArray(data.sections) ? data.sections.reduce((n,s)=>n+(s.questions?.length || 0),0) : 0,
          version:'importado',
          active:false
        });
        persist();
        renderTemplates();
        toast('Modelo importado como rascunho.');
      } catch {
        toast('JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  $('#exitChecklist').onclick = () => navigate('levantamentos');
  $('#previousSection').onclick = () => {
    if (state.currentSection > 0) {
      state.currentSection -= 1;
      renderChecklist();
      window.scrollTo(0,0);
    }
  };
  $('#nextSection').onclick = () => {
    if (state.currentSection < checklistSections.length - 1) {
      state.currentSection += 1;
      renderChecklist();
      window.scrollTo(0,0);
      return;
    }
    const item = state.inspections.find(x => x.id === state.activeInspectionId);
    if (item?.progress === 100) {
      item.status = 'revisao';
      persist();
      renderRecent();
      toast('Levantamento enviado para revisão.');
      navigate('levantamentos');
    } else {
      toast('Existem campos obrigatórios pendentes.');
    }
  };
  $('#sectionNav').onclick = event => {
    const button = event.target.closest('[data-section]');
    if (!button) return;
    state.currentSection = Number(button.dataset.section);
    renderChecklist();
  };

  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    state.deferredInstall = event;
    $('#installButton').hidden = false;
  });
  $('#installButton').onclick = async () => {
    if (!state.deferredInstall) return toast('Use “Adicionar à Tela de Início” no navegador.');
    state.deferredInstall.prompt();
    await state.deferredInstall.userChoice;
    state.deferredInstall = null;
    $('#installButton').hidden = true;
  };
}

function init() {
  bind();
  applyRole();
  renderRecent();
  renderInspections();
  renderTemplates();
  renderCompanies();
  renderUsers();
  updateConnection();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
