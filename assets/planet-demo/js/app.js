(function(){
  'use strict';

  /* ============================================================
     COUCHE DONNÉES — localStorage pour ce prototype.
     À remplacer plus tard par des appels vers une API PHP.
     readTable/writeTable/uid sont le seul endroit à modifier
     pour brancher une vraie base de données.
     ============================================================ */

  var DB_KEYS = {
    users: 'ms_users', teachers: 'ms_teachers', students: 'ms_students',
    rooms: 'ms_rooms', courses: 'ms_courses', session: 'ms_session'
  };
  function readTable(key){ try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; } }
  function writeTable(key, rows){ localStorage.setItem(key, JSON.stringify(rows)); }
  function uid(prefix){ return prefix + '_' + Math.random().toString(36).slice(2,9); }

  function defaultCourses(){
    // Ancre chaque cours d'exemple sur le lundi de la semaine courante,
    // avec répétition hebdomadaire activée (voir courseMatchesDate plus bas).
    var monday = mondayOf(new Date());
    function iso(offsetDays){ return isoDate(addDays(monday, offsetDays)); }
    function c(subject, teacherId, roomId, group, dayOffset, start, end){
      return { id: uid('c'), subject:subject, teacherId:teacherId, roomId:roomId, group:group, date: iso(dayOffset), recurring:true, start:start, end:end };
    }
    return [
      c('Développement Web','t2','r3','BTS SIO2',0,'09:00','11:00'),
      c('Anglais','t6','r3','BTS SIO2',0,'11:00','12:30'),
      c('Montage Vidéo','t5','r2','MMI1',0,'14:00','17:00'),
      c('Motion Design & Animation','t1','r1','MMI2',1,'09:00','12:00'),
      c('Réseaux & Systèmes','t3','r4','BTS SIO2',1,'13:30','15:30'),
      c('Anglais','t6','r4','BTS SIO1',1,'15:30','17:00'),
      c('Photographie','t4','r1','MMI1',2,'08:30','10:30'),
      c('Développement Web','t2','r3','BTS SIO1',2,'10:30','12:30'),
      c('Communication de Projet','t7','r5','MMI2',2,'14:00','16:00'),
      c('Réseaux & Systèmes','t3','r4','BTS SIO1',3,'09:00','11:00'),
      c('Motion Design & Animation','t1','r1','MMI1',3,'11:00','13:00'),
      c('Montage Vidéo','t5','r2','MMI2',3,'14:30','17:30'),
      c('Anglais','t6','r3','BTS SIO2',4,'09:00','10:30'),
      c('Développement Web','t2','r4','BTS SIO2',4,'10:30','12:30'),
      c('Communication de Projet','t7','r5','BTS SIO1',4,'14:00','16:00')
    ];
  }
  function seedIfEmpty(){
    if (!localStorage.getItem(DB_KEYS.users)) {
      writeTable(DB_KEYS.users, [
        { id:'u_admin', name:'Admin Mediaschool', email:'admin@mediaschool.fr', password:'admin123', role:'admin', createdAt: Date.now() },
        { id:'u_user', name:'Léo Élève', email:'eleve@mediaschool.fr', password:'eleve123', role:'user', createdAt: Date.now() }
      ]);
    }
    if (!localStorage.getItem(DB_KEYS.teachers)) {
      writeTable(DB_KEYS.teachers, [
        { id:'t1', name:'Claire Dubreuil', email:'claire.dubreuil@mediaschool.fr', subject:'Motion Design & Animation' },
        { id:'t2', name:'Karim Ferhat', email:'karim.ferhat@mediaschool.fr', subject:'Développement Web' },
        { id:'t3', name:'Marc Aubert', email:'marc.aubert@mediaschool.fr', subject:'Réseaux & Systèmes' },
        { id:'t4', name:'Sophie Laurent', email:'sophie.laurent@mediaschool.fr', subject:'Photographie' },
        { id:'t5', name:'Julien Roques', email:'julien.roques@mediaschool.fr', subject:'Montage Vidéo' },
        { id:'t6', name:'Emma Wright', email:'emma.wright@mediaschool.fr', subject:'Anglais' },
        { id:'t7', name:'Nadia Chikh', email:'nadia.chikh@mediaschool.fr', subject:'Communication de Projet' }
      ]);
    }
    if (!localStorage.getItem(DB_KEYS.rooms)) {
      writeTable(DB_KEYS.rooms, [
        { id:'r1', name:'Studio A', capacity:20 }, { id:'r2', name:'Studio B', capacity:15 },
        { id:'r3', name:'Salle Info 1', capacity:24 }, { id:'r4', name:'Salle Info 2', capacity:24 },
        { id:'r5', name:'Amphi', capacity:60 }
      ]);
    }
    if (!localStorage.getItem(DB_KEYS.students)) {
      writeTable(DB_KEYS.students, [
        { id:'e1', name:'Lina Moreau', email:'lina.moreau@eleve.mediaschool.fr', group:'BTS SIO2' },
        { id:'e2', name:'Hugo Petit', email:'hugo.petit@eleve.mediaschool.fr', group:'BTS SIO1' },
        { id:'e3', name:'Camille Faye', email:'camille.faye@eleve.mediaschool.fr', group:'MMI2' },
        { id:'e4', name:'Théo Girard', email:'theo.girard@eleve.mediaschool.fr', group:'MMI1' },
        { id:'e5', name:'Manon Roy', email:'manon.roy@eleve.mediaschool.fr', group:'BTS SIO1' },
        { id:'e6', name:'Yanis Belkacem', email:'yanis.belkacem@eleve.mediaschool.fr', group:'MMI2' }
      ]);
    }
    if (!localStorage.getItem(DB_KEYS.courses)) writeTable(DB_KEYS.courses, defaultCourses());
  }
  seedIfEmpty();

  /* ============================================================
     ÉTAT
     ============================================================ */
  var state = { currentUser:null, view:'planning', planningMode:'semaine', currentDate:new Date(), entity:'cours', search:'', planningSearch:'' };

  function $(sel, ctx){ return (ctx||document).querySelector(sel); }
  function $$(sel, ctx){ return Array.prototype.slice.call((ctx||document).querySelectorAll(sel)); }
  function escapeHtml(s){
    return String(s==null?'':s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
  }
  var toastTimer=null;
  function toast(msg, isError){
    var c = $('#toast-container');
    c.textContent = msg;
    c.classList.toggle('is-error', !!isError);
    c.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ c.classList.remove('show'); }, 3200);
  }
  function isAdmin(){ return !!(state.currentUser && state.currentUser.role==='admin'); }

  /* ============================================================
     THÈME
     ============================================================ */
  var MOON_PATH = '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"></path>';
  var SUN_PATH = '<circle cx="12" cy="12" r="4.5"></circle><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>';
  function applyThemeIcon(){
    var t = document.documentElement.getAttribute('data-theme');
    var html = t==='dark' ? MOON_PATH : SUN_PATH;
    var i1 = $('#themeIcon'); if (i1) i1.innerHTML = html;
    var i2 = $('#themeIconAuth'); if (i2) i2.innerHTML = html;
  }
  function setTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    applyThemeIcon();
    try { localStorage.setItem('mediaschool_theme', t); } catch(e){}
  }
  function toggleTheme(){
    setTheme(document.documentElement.getAttribute('data-theme')==='light' ? 'dark' : 'light');
  }
  applyThemeIcon();

  /* ============================================================
     AUTH
     ============================================================ */
  function login(email, password){
    var user = readTable(DB_KEYS.users).filter(function(u){ return u.email.toLowerCase()===email.toLowerCase() && u.password===password; })[0];
    if (!user) return null;
    state.currentUser = user;
    localStorage.setItem(DB_KEYS.session, user.id);
    return user;
  }
  function register(data){
    var users = readTable(DB_KEYS.users);
    if (users.some(function(u){ return u.email.toLowerCase()===data.email.toLowerCase(); })) throw new Error('Un compte existe déjà avec cet email.');
    var user = { id: uid('u'), name:data.name, email:data.email, password:data.password, role:data.role, createdAt: Date.now() };
    users.push(user);
    writeTable(DB_KEYS.users, users);
    state.currentUser = user;
    localStorage.setItem(DB_KEYS.session, user.id);
    return user;
  }
  function logout(){
    localStorage.removeItem(DB_KEYS.session);
    state.currentUser = null;
    showAuth();
  }
  function tryRestoreSession(){
    var sid = localStorage.getItem(DB_KEYS.session);
    if (!sid) return;
    var user = readTable(DB_KEYS.users).filter(function(u){ return u.id===sid; })[0];
    if (user) { state.currentUser = user; showApp(); }
  }
  function showApp(){
    $('#screen-auth').classList.remove('active');
    $('#screen-app').classList.add('active');
    state.view='planning'; state.planningMode='semaine'; state.currentDate=new Date();
    render();
  }
  function showAuth(){
    $('#screen-app').classList.remove('active');
    $('#screen-auth').classList.add('active');
    $('#form-login').reset();
    $('#form-register').reset();
  }

  /* ============================================================
     DATES / TEMPS
     ============================================================ */
  var DAY_NAMES = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi'];
  var DAY_SHORT = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  var START_HOUR = 8, END_HOUR = 19, HOUR_PX = 52;

  function mondayOf(date){ var d=new Date(date); var day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); d.setHours(0,0,0,0); return d; }
  function addDays(date,n){ var d=new Date(date); d.setDate(d.getDate()+n); return d; }
  function sameDate(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function toMinutes(hhmm){ var p=hhmm.split(':'); return Number(p[0])*60+Number(p[1]); }
  function fmtDate(d){ return d.toLocaleDateString('fr-FR',{weekday:'long', day:'numeric', month:'long'}); }
  function fmtShort(d){ return d.toLocaleDateString('fr-FR',{day:'numeric', month:'short'}); }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  // Cours ancrés sur une vraie date (input type="date"), au lieu d'un simple jour de semaine.
  function isoDate(d){ var y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0'); return y+'-'+m+'-'+day; }
  function dateFromIso(iso){ var p=iso.split('-'); return new Date(Number(p[0]), Number(p[1])-1, Number(p[2])); }
  function todayIso(){ return isoDate(new Date()); }
  function frDate(iso){ var p=iso.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }
  function frDateShort(iso){ var p=iso.split('-'); return p[2]+'/'+p[1]; }
  function frDateWeekday(iso){ var d=dateFromIso(iso); return DAY_SHORT[(d.getDay()+6)%7]+' '+frDate(iso); }
  function frDateWeekdayShort(iso){ var d=dateFromIso(iso); return DAY_SHORT[(d.getDay()+6)%7]+' '+frDateShort(iso); }
  // true si `course` a lieu à la date `d` : soit une date unique identique,
  // soit (par défaut) une répétition hebdomadaire du même jour depuis sa date d'ancrage.
  function courseMatchesDate(course, d){
    if (course.recurring===false) return course.date === isoDate(d);
    var anchor = dateFromIso(course.date); anchor.setHours(0,0,0,0);
    var dd = new Date(d); dd.setHours(0,0,0,0);
    if (dd < anchor) return false;
    return dd.getDay() === anchor.getDay();
  }
  function coursesOnDate(d){ return readTable(DB_KEYS.courses).filter(function(c){ return courseMatchesDate(c, d); }); }
  function matchesPlanningSearch(course){
    var q = normalize(state.planningSearch);
    if (!q) return true;
    var teacher = readTable(DB_KEYS.teachers).filter(function(t){ return t.id===course.teacherId; })[0];
    return normalize([course.group, teacher?teacher.name:''].join(' ')).indexOf(q) !== -1;
  }

  /* ============================================================
     COMPOSANTS — configuration générique par type d'entité
     ============================================================ */
  var ENTITY_CONFIG = {
    cours: {
      label:'cours', key: DB_KEYS.courses,
      columns: [{key:'subject',label:'Cours'},{key:'teacher',label:'Professeur'},{key:'room',label:'Salle'},{key:'group',label:'Groupe'},{key:'time',label:'Créneau'}],
      row: function(item){
        var teacher = readTable(DB_KEYS.teachers).filter(function(t){ return t.id===item.teacherId; })[0];
        var room = readTable(DB_KEYS.rooms).filter(function(r){ return r.id===item.roomId; })[0];
        var when = frDateWeekdayShort(item.date)+' '+item.start+'–'+item.end + (item.recurring===false ? ' (unique)' : '');
        return { subject:item.subject, teacher: teacher?teacher.name:'—', room: room?room.name:'—', group:item.group, time: when };
      },
      searchText: function(item){
        var teacher = readTable(DB_KEYS.teachers).filter(function(t){ return t.id===item.teacherId; })[0];
        var room = readTable(DB_KEYS.rooms).filter(function(r){ return r.id===item.roomId; })[0];
        return [item.subject, item.group, teacher?teacher.name:'', room?room.name:''].join(' ');
      }
    },
    professeurs: {
      label:'professeur', key: DB_KEYS.teachers,
      columns:[{key:'name',label:'Nom'},{key:'subject',label:'Matière'},{key:'email',label:'Email'}],
      row: function(item){ return item; },
      searchText: function(item){ return [item.name,item.subject,item.email].join(' '); }
    },
    eleves: {
      label:'élève', key: DB_KEYS.students,
      columns:[{key:'name',label:'Nom'},{key:'group',label:'Groupe'},{key:'email',label:'Email'}],
      row: function(item){ return item; },
      searchText: function(item){ return [item.name,item.group,item.email].join(' '); }
    },
    salles: {
      label:'salle', key: DB_KEYS.rooms,
      columns:[{key:'name',label:'Nom'},{key:'capacity',label:'Capacité'}],
      row: function(item){ return {name:item.name, capacity:item.capacity+' places'}; },
      searchText: function(item){ return item.name; }
    }
  };
  function normalize(str){ return (str||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }

  /* ============================================================
     RENDU — PLANNING (mêmes classes que le mockup : grid/ghead/tcol/dcol/block, month-grid/mcell/mpill)
     ============================================================ */
  function buildDayOrWeekGrid(days){
    var teachers = readTable(DB_KEYS.teachers);
    var rooms = readTable(DB_KEYS.rooms);
    var wrap = document.createElement('div'); wrap.className='grid-wrap';
    var grid = document.createElement('div'); grid.className = 'grid' + (days.length===1?' single-day':'');
    grid.style.position='relative';

    grid.appendChild(document.createElement('div')).className='ghead';
    var today = new Date(); today.setHours(0,0,0,0);
    days.forEach(function(d){
      var h = document.createElement('div');
      h.className = 'ghead day' + (sameDate(d,today) ? ' is-today' : '');
      h.textContent = DAY_NAMES[(d.getDay()+6)%7] + (days.length===1 ? ' · ' + fmtShort(d) : '');
      grid.appendChild(h);
    });

    var tcol = document.createElement('div'); tcol.className='tcol';
    for (var h=START_HOUR; h<END_HOUR; h++){
      var tcell = document.createElement('div'); tcell.className='tcell'; tcell.textContent = h+':00';
      tcol.appendChild(tcell);
    }
    grid.appendChild(tcol);

    var anyBlockRendered = false;
    days.forEach(function(d){
      var dow = (d.getDay()+6)%7;
      var col = document.createElement('div'); col.className='dcol'; col.setAttribute('data-day', DAY_NAMES[dow] || '');
      for (var h2=START_HOUR; h2<END_HOUR; h2++){ col.appendChild(document.createElement('div')).className='hline'; }
      coursesOnDate(d).filter(matchesPlanningSearch).forEach(function(course){
        var top = (toMinutes(course.start) - START_HOUR*60)/60*HOUR_PX;
        var height = Math.max(28, (toMinutes(course.end)-toMinutes(course.start))/60*HOUR_PX - 4);
        if (top+height <= 0 || top >= (END_HOUR-START_HOUR)*HOUR_PX) return;
        anyBlockRendered = true;
        var teacher = teachers.filter(function(t){ return t.id===course.teacherId; })[0];
        var room = rooms.filter(function(r){ return r.id===course.roomId; })[0];
        var block = document.createElement('button');
        block.type='button'; block.className='block';
        block.style.top = top+'px'; block.style.height = height+'px';
        block.style.textAlign='left'; block.style.width='auto'; block.style.font='inherit'; block.style.cursor='pointer';
        block.innerHTML = '<b>'+escapeHtml(course.subject)+'</b><span>'+course.start+'–'+course.end+' · '+escapeHtml(room?room.name:'—')+'</span><span>'+escapeHtml(teacher?teacher.name:'—')+' · '+escapeHtml(course.group)+'</span>';
        block.addEventListener('click', function(){ openCourseDetail(course.id); });
        col.appendChild(block);
      });
      grid.appendChild(col);
    });

    wrap.appendChild(grid);

    if (!anyBlockRendered){
      var empty = document.createElement('div');
      empty.className='grid-empty-note';
      var totalCourses = readTable(DB_KEYS.courses).length;
      if (state.planningSearch && state.planningSearch.trim()){
        empty.textContent = 'Aucun cours ne correspond à « '+state.planningSearch.trim()+' » sur cette période.';
      } else if (totalCourses===0){
        empty.textContent = isAdmin()
          ? "Aucun cours programmé. Ajoutez-en un depuis Composants → Cours, ou générez le planning d'exemple ci-dessus."
          : 'Aucun cours programmé pour le moment.';
      } else {
        empty.textContent = 'Aucun cours programmé sur cette période.';
      }
      wrap.appendChild(empty);
    }
    return wrap;
  }

  function buildMonthGrid(refDate){
    var year = refDate.getFullYear(), month = refDate.getMonth();
    var wrap = document.createElement('div'); wrap.className='month-wrap-scroll';
    var grid = document.createElement('div'); grid.className='month-grid';
    var head = document.createElement('div'); head.className='month-head';
    DAY_SHORT.forEach(function(n){ var d=document.createElement('div'); d.textContent=n; head.appendChild(d); });
    grid.appendChild(head);

    var body = document.createElement('div'); body.className='month-body';
    var firstOfMonth = new Date(year, month, 1);
    var startOffset = (firstOfMonth.getDay()+6)%7;
    var start = addDays(firstOfMonth, -startOffset);
    var today = new Date(); today.setHours(0,0,0,0);

    for (var i=0;i<42;i++){
      (function(i){
        var d = addDays(start,i);
        var cell = document.createElement('button');
        cell.type='button';
        cell.className='mcell' + (d.getMonth()!==month ? ' out' : '');
        var numSpan = document.createElement('div');
        numSpan.className = 'mnum' + (sameDate(d,today) ? ' today' : '');
        numSpan.textContent = d.getDate();
        cell.appendChild(numSpan);
        if (d.getMonth()===month){
          var dayCourses = coursesOnDate(d).filter(matchesPlanningSearch);
          dayCourses.slice(0,2).forEach(function(course){
            var pill = document.createElement('div'); pill.className='mpill'; pill.textContent = course.subject;
            cell.appendChild(pill);
          });
          if (dayCourses.length>2){
            var more = document.createElement('div'); more.className='mmore'; more.textContent = '+'+(dayCourses.length-2)+' autre'+(dayCourses.length-2>1?'s':'');
            cell.appendChild(more);
          }
          cell.addEventListener('click', function(){ state.currentDate=d; state.planningMode='jour'; render(); });
        }
        body.appendChild(cell);
      })(i);
    }
    grid.appendChild(body);
    wrap.appendChild(grid);
    return wrap;
  }

  function planningPeriodLabel(){
    if (state.planningMode==='jour') return capitalize(fmtDate(state.currentDate));
    if (state.planningMode==='semaine'){ var mon=mondayOf(state.currentDate), fri=addDays(mon,4); return 'Semaine du '+fmtShort(mon)+' au '+fmtShort(fri); }
    return capitalize(state.currentDate.toLocaleDateString('fr-FR',{month:'long', year:'numeric'}));
  }
  function step(dir){
    if (state.planningMode==='jour') state.currentDate = addDays(state.currentDate, dir);
    else if (state.planningMode==='semaine') state.currentDate = addDays(state.currentDate, dir*7);
    else { var d=new Date(state.currentDate); d.setMonth(d.getMonth()+dir); state.currentDate=d; }
    render();
  }

  function renderPlanning(){
    var wrap = $('#planning-grid-wrap');
    wrap.innerHTML = '';
    if (state.planningMode==='jour') wrap.appendChild(buildDayOrWeekGrid([state.currentDate]));
    else if (state.planningMode==='semaine'){
      var monday = mondayOf(state.currentDate);
      wrap.appendChild(buildDayOrWeekGrid([0,1,2,3,4].map(function(i){ return addDays(monday,i); })));
    } else wrap.appendChild(buildMonthGrid(state.currentDate));
  }

  /* ============================================================
     RENDU — COMPOSANTS / COMPTES
     ============================================================ */
  function renderComposantsTable(){
    var cfg = ENTITY_CONFIG[state.entity];
    var wrap = $('#composants-table-wrap');
    var items = readTable(cfg.key);
    if (state.search.trim()){
      var q = normalize(state.search);
      items = items.filter(function(it){ return normalize(cfg.searchText(it)).indexOf(q)!==-1; });
    }
    if (items.length===0){
      wrap.innerHTML = '<div class="empty-state">Aucun '+cfg.label+' ne correspond'+(state.search?' à votre recherche':'')+'.</div>';
      return;
    }
    var table = document.createElement('table'); table.className='data-table';
    var thead=document.createElement('thead'); var headRow=document.createElement('tr');
    cfg.columns.forEach(function(col){ var th=document.createElement('th'); th.textContent=col.label; headRow.appendChild(th); });
    if (isAdmin()){ var thA=document.createElement('th'); thA.className='col-actions'; headRow.appendChild(thA); }
    thead.appendChild(headRow); table.appendChild(thead);
    var tbody=document.createElement('tbody');
    items.forEach(function(item){
      var rowData = cfg.row(item);
      var tr=document.createElement('tr');
      cfg.columns.forEach(function(col){ var td=document.createElement('td'); td.textContent=rowData[col.key]; tr.appendChild(td); });
      if (isAdmin()){
        var td=document.createElement('td'); td.className='col-actions';
        var editBtn=document.createElement('button'); editBtn.type='button'; editBtn.className='icon-btn'; editBtn.title='Modifier'; editBtn.textContent='✎';
        editBtn.addEventListener('click', function(){ openEntityModal(state.entity, item.id); });
        var delBtn=document.createElement('button'); delBtn.type='button'; delBtn.className='icon-btn icon-btn-danger'; delBtn.title='Supprimer'; delBtn.textContent='🗑';
        delBtn.addEventListener('click', function(){ deleteEntity(state.entity, item.id); });
        td.appendChild(editBtn); td.appendChild(delBtn);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.innerHTML=''; wrap.appendChild(table);
  }

  function renderComptes(){
    var wrap = $('#comptes-table-wrap');
    var users = readTable(DB_KEYS.users);
    var table=document.createElement('table'); table.className='data-table';
    var thead=document.createElement('thead');
    thead.innerHTML = '<tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Créé le</th><th class="col-actions"></th></tr>';
    table.appendChild(thead);
    var tbody=document.createElement('tbody');
    users.forEach(function(u){
      var tr=document.createElement('tr');
      var tdName=document.createElement('td'); tdName.textContent=u.name;
      var tdEmail=document.createElement('td'); tdEmail.textContent=u.email;
      var tdRole=document.createElement('td');
      var tdCreated=document.createElement('td'); tdCreated.textContent = u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—';
      var tdActions=document.createElement('td'); tdActions.className='col-actions';
      var select=document.createElement('select'); select.className='role-select';
      ['user','admin'].forEach(function(r){
        var o=document.createElement('option'); o.value=r; o.textContent = r==='admin'?'Administrateur':'Utilisateur';
        if (r===u.role) o.selected=true;
        select.appendChild(o);
      });
      select.disabled = (u.id === state.currentUser.id);
      select.addEventListener('change', function(){
        var rows = readTable(DB_KEYS.users);
        var idx = rows.findIndex(function(r){ return r.id===u.id; });
        rows[idx].role = select.value;
        writeTable(DB_KEYS.users, rows);
        toast('Rôle mis à jour.');
        renderSidebarUser(); renderComptes();
      });
      tdRole.appendChild(select);
      if (u.id !== state.currentUser.id){
        var delBtn=document.createElement('button'); delBtn.type='button'; delBtn.className='icon-btn icon-btn-danger'; delBtn.title='Supprimer'; delBtn.textContent='🗑';
        delBtn.addEventListener('click', function(){
          if (!confirm('Supprimer ce compte ?')) return;
          writeTable(DB_KEYS.users, readTable(DB_KEYS.users).filter(function(r){ return r.id!==u.id; }));
          renderComptes(); toast('Compte supprimé.');
        });
        tdActions.appendChild(delBtn);
      }
      tr.appendChild(tdName); tr.appendChild(tdEmail); tr.appendChild(tdRole); tr.appendChild(tdCreated); tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.innerHTML=''; wrap.appendChild(table);
  }

  /* ============================================================
     CONTRÔLES DE LA BARRE SUPÉRIEURE
     ============================================================ */
  function renderViewControls(){
    var el = $('#view-controls');
    el.innerHTML='';
    if (state.view==='planning'){
      $('#view-title').textContent = 'Planning';
      $('#view-subtitle').textContent = planningPeriodLabel();

      var planningSearch=document.createElement('input');
      planningSearch.type='search'; planningSearch.className='input search-input';
      planningSearch.placeholder='Rechercher une classe ou un professeur…';
      planningSearch.value=state.planningSearch;
      planningSearch.addEventListener('input', function(e){ state.planningSearch=e.target.value; renderPlanning(); });
      el.appendChild(planningSearch);

      var nav = document.createElement('div'); nav.className='range';
      var prev=document.createElement('button'); prev.type='button'; prev.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"></path></svg>'; prev.setAttribute('aria-label','Période précédente');
      prev.addEventListener('click', function(){ step(-1); });
      var next=document.createElement('button'); next.type='button'; next.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"></path></svg>'; next.setAttribute('aria-label','Période suivante');
      next.addEventListener('click', function(){ step(1); });
      nav.appendChild(prev); nav.appendChild(next);
      el.appendChild(nav);

      var todayBtn=document.createElement('button'); todayBtn.type='button'; todayBtn.className='btn btn-ghost btn-sm'; todayBtn.textContent="Aujourd'hui";
      todayBtn.addEventListener('click', function(){ state.currentDate=new Date(); render(); });
      el.appendChild(todayBtn);

      var modeGroup = document.createElement('div'); modeGroup.className='segmented';
      ['jour','semaine','mois'].forEach(function(m){
        var b=document.createElement('button');
        b.type='button'; b.className='seg'+(state.planningMode===m?' active':'');
        b.textContent = capitalize(m);
        b.addEventListener('click', function(){ state.planningMode=m; render(); });
        modeGroup.appendChild(b);
      });
      el.appendChild(modeGroup);

      if (isAdmin()){
        var admin = document.createElement('div'); admin.className='admin-tools';
        var seedBtn=document.createElement('button'); seedBtn.type='button'; seedBtn.className='btn btn-ghost btn-sm'; seedBtn.textContent='Planning exemple';
        seedBtn.addEventListener('click', function(){
          if (confirm("Remplacer le planning actuel par le planning d'exemple ?")){ writeTable(DB_KEYS.courses, defaultCourses()); toast('Planning exemple généré.'); render(); }
        });
        var clearBtn=document.createElement('button'); clearBtn.type='button'; clearBtn.className='btn btn-ghost btn-sm'; clearBtn.textContent='Vider le planning';
        clearBtn.addEventListener('click', function(){
          if (confirm('Supprimer tous les cours du planning ?')){ writeTable(DB_KEYS.courses, []); toast('Planning vidé.'); render(); }
        });
        admin.appendChild(seedBtn); admin.appendChild(clearBtn);
        el.appendChild(admin);
      }
    } else if (state.view==='composants'){
      $('#view-title').textContent = 'Composants';
      $('#view-subtitle').textContent = 'Cours, professeurs, élèves et salles de Mediaschool.';
      var search=document.createElement('input');
      search.type='search'; search.className='input search-input'; search.placeholder='Rechercher…'; search.value=state.search;
      search.addEventListener('input', function(e){ state.search=e.target.value; renderComposantsTable(); });
      el.appendChild(search);
      if (isAdmin()){
        var addBtn=document.createElement('button'); addBtn.type='button'; addBtn.className='btn btn-primary btn-sm'; addBtn.textContent='+ Ajouter';
        addBtn.addEventListener('click', function(){ openEntityModal(state.entity, null); });
        el.appendChild(addBtn);
      }
    } else if (state.view==='comptes'){
      $('#view-title').textContent = 'Comptes';
      $('#view-subtitle').textContent = 'Comptes ayant accès au planning.';
    }
  }

  /* ============================================================
     MODALE
     ============================================================ */
  function openModal(){ $('#modal-overlay').classList.add('active'); }
  function closeModal(){ $('#modal-overlay').classList.remove('active'); }

  function field(label,name,type,value,placeholder){
    return '<label class="field"><span>'+label+'</span><input class="input" name="'+name+'" type="'+type+'" value="'+(value!=null?escapeHtml(String(value)):'')+'" placeholder="'+(placeholder||'')+'" required></label>';
  }
  function selectField(label,name,options,selected){
    var opts = options.map(function(o){ return '<option value="'+o.value+'" '+(String(o.value)===String(selected)?'selected':'')+'>'+escapeHtml(o.label)+'</option>'; }).join('');
    return '<label class="field"><span>'+label+'</span><select class="input" name="'+name+'" required>'+opts+'</select></label>';
  }
  function checkboxField(label,name,checked){
    return '<label class="field field-checkbox"><input type="checkbox" name="'+name+'" '+(checked?'checked':'')+'><span>'+label+'</span></label>';
  }
  function formActions(){
    return '<p class="field-error" id="modal-error" role="alert"></p><div class="modal-actions"><button type="button" class="btn btn-ghost" id="modal-cancel">Annuler</button><button type="submit" class="btn btn-primary">Enregistrer</button></div>';
  }
  function buildEntityFormHtml(entity, item){
    item = item || {};
    if (entity==='professeurs') return field('Nom','name','text',item.name)+field('Email','email','email',item.email)+field('Matière','subject','text',item.subject)+formActions();
    if (entity==='eleves') return field('Nom','name','text',item.name)+field('Email','email','email',item.email)+field('Groupe','group','text',item.group,'BTS SIO1, MMI2…')+formActions();
    if (entity==='salles') return field('Nom','name','text',item.name)+field('Capacité','capacity','number',item.capacity)+formActions();
    var teachers = readTable(DB_KEYS.teachers), rooms = readTable(DB_KEYS.rooms);
    return field('Nom du cours','subject','text',item.subject,'Développement Web…')
      + selectField('Professeur','teacherId', teachers.map(function(t){ return {value:t.id,label:t.name}; }), item.teacherId)
      + selectField('Salle','roomId', rooms.map(function(r){ return {value:r.id,label:r.name}; }), item.roomId)
      + field('Groupe','group','text',item.group,'BTS SIO2…')
      + field('Date','date','date', item.date || todayIso())
      + checkboxField('Se répète chaque semaine', 'recurring', item.recurring !== false)
      + field('Début','start','time',item.start||'09:00')
      + field('Fin','end','time',item.end||'10:00')
      + formActions();
  }
  var ENTITY_TITLES = { cours:'un cours', professeurs:'un professeur', eleves:'un élève', salles:'une salle' };

  function openEntityModal(entity, id){
    var cfg = ENTITY_CONFIG[entity];
    var isEdit = !!id;
    var item = isEdit ? readTable(cfg.key).filter(function(x){ return x.id===id; })[0] : null;
    $('#modal-title').textContent = (isEdit?'Modifier ':'Ajouter ') + ENTITY_TITLES[entity];
    var form = $('#modal-form');
    form.innerHTML = buildEntityFormHtml(entity, item);
    form.onsubmit = function(e){ e.preventDefault(); saveEntity(entity, id, form); };
    openModal();
  }
  function openCourseDetail(id){
    if (isAdmin()) { openEntityModal('cours', id); return; }
    var course = readTable(DB_KEYS.courses).filter(function(c){ return c.id===id; })[0];
    if (!course) return;
    var teacher = readTable(DB_KEYS.teachers).filter(function(t){ return t.id===course.teacherId; })[0];
    var room = readTable(DB_KEYS.rooms).filter(function(r){ return r.id===course.roomId; })[0];
    $('#modal-title').textContent = course.subject;
    $('#modal-form').innerHTML =
      '<div class="detail-list">'+
      '<p><strong>Horaire</strong>'+frDateWeekday(course.date)+' '+course.start+'–'+course.end+(course.recurring===false ? ' · unique' : ' · chaque semaine')+'</p>'+
      '<p><strong>Professeur</strong>'+escapeHtml(teacher?teacher.name:'—')+'</p>'+
      '<p><strong>Salle</strong>'+escapeHtml(room?room.name:'—')+'</p>'+
      '<p><strong>Groupe</strong>'+escapeHtml(course.group)+'</p>'+
      '</div><div class="modal-actions"><button type="button" class="btn btn-primary" id="modal-cancel">Fermer</button></div>';
    $('#modal-form').onsubmit = function(e){ e.preventDefault(); };
    openModal();
  }
  function openAccountPanel(){
    $('#modal-title').textContent = 'Mon compte';
    $('#modal-form').innerHTML =
      '<div class="account-panel"><span class="who">'+escapeHtml(state.currentUser.name)+'</span><span class="role">'+(isAdmin()?'Administrateur':'Utilisateur')+' · '+escapeHtml(state.currentUser.email)+'</span></div>'+
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" id="modal-cancel">Fermer</button><button type="button" class="btn btn-primary" id="modal-logout">Se déconnecter</button></div>';
    $('#modal-form').onsubmit = function(e){ e.preventDefault(); };
    openModal();
    $('#modal-logout').addEventListener('click', function(){ closeModal(); logout(); });
  }

  function saveEntity(entity, id, form){
    var cfg = ENTITY_CONFIG[entity];
    var data = Object.fromEntries(new FormData(form).entries());
    if (entity==='cours'){
      data.recurring = (data.recurring === 'on');
      if (toMinutes(data.end) <= toMinutes(data.start)){ $('#modal-error').textContent = "L'heure de fin doit être après l'heure de début."; return; }
    }
    if (entity==='salles'){ data.capacity = Number(data.capacity); }
    var rows = readTable(cfg.key);
    if (id){ var idx = rows.findIndex(function(r){ return r.id===id; }); rows[idx] = Object.assign({}, rows[idx], data); }
    else { data.id = uid(entity.charAt(0)); rows.push(data); }
    writeTable(cfg.key, rows);
    closeModal();
    toast((id?'Modifié':'Ajouté')+' avec succès.');
    if (state.view==='composants') renderComposantsTable();
    if (entity==='cours' && state.view==='planning') renderPlanning();
  }
  function deleteEntity(entity, id){
    var cfg = ENTITY_CONFIG[entity];
    if (!confirm('Supprimer cet élément ?')) return;
    writeTable(cfg.key, readTable(cfg.key).filter(function(x){ return x.id!==id; }));
    renderComposantsTable();
    toast('Supprimé.');
  }

  /* ============================================================
     RENDU PRINCIPAL
     ============================================================ */
  function renderSidebarUser(){
    if (!state.currentUser) return;
    var avatar = $('#user-avatar');
    avatar.textContent = state.currentUser.name.trim().charAt(0).toUpperCase();
    avatar.title = state.currentUser.name + ' — ' + (isAdmin()?'Administrateur':'Utilisateur');
    $('#nav-comptes').style.display = isAdmin() ? '' : 'none';
  }
  function render(){
    renderSidebarUser();
    $$('.rail-btn[data-view]').forEach(function(b){ b.classList.toggle('active', b.dataset.view===state.view); });
    $$('.view').forEach(function(v){ v.classList.remove('active'); });
    $('#view-'+state.view).classList.add('active');
    renderViewControls();
    if (state.view==='planning') renderPlanning();
    else if (state.view==='composants') renderComposantsTable();
    else if (state.view==='comptes') renderComptes();
  }

  /* ============================================================
     ÉVÉNEMENTS
     ============================================================ */
  $$('.auth-tabs .seg').forEach(function(tab){
    tab.addEventListener('click', function(){
      $$('.auth-tabs .seg').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      var target = tab.dataset.authTab;
      $('#form-login').classList.toggle('active', target==='login');
      $('#form-register').classList.toggle('active', target==='register');
    });
  });
  $$('.hint-chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      if (chip.dataset.fill==='admin'){ $('#login-email').value='admin@mediaschool.fr'; $('#login-password').value='admin123'; }
      else { $('#login-email').value='eleve@mediaschool.fr'; $('#login-password').value='eleve123'; }
    });
  });
  $('#form-login').addEventListener('submit', function(e){
    e.preventDefault();
    var user = login($('#login-email').value.trim(), $('#login-password').value);
    if (!user){ $('#login-error').textContent = 'Email ou mot de passe incorrect.'; return; }
    $('#login-error').textContent=''; showApp();
  });
  $('#form-register').addEventListener('submit', function(e){
    e.preventDefault();
    var password = $('#register-password').value;
    if (password.length<4){ $('#register-error').textContent='Le mot de passe doit contenir au moins 4 caractères.'; return; }
    try {
      register({ name: $('#register-name').value.trim(), email: $('#register-email').value.trim(), password:password, role: $('input[name="register-role"]:checked').value });
      $('#register-error').textContent=''; showApp();
    } catch(err){ $('#register-error').textContent = err.message; }
  });

  $$('.rail-btn[data-view]').forEach(function(btn){
    btn.addEventListener('click', function(){ state.view = btn.dataset.view; state.search=''; render(); });
  });
  $$('#composants-tabs .seg').forEach(function(btn){
    btn.addEventListener('click', function(){
      $$('#composants-tabs .seg').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      state.entity = btn.dataset.entity; state.search='';
      render();
    });
  });

  $('#themeToggle').addEventListener('click', toggleTheme);
  $('#themeToggleAuth').addEventListener('click', toggleTheme);
  $('#user-avatar').addEventListener('click', openAccountPanel);

  $('#modal-overlay').addEventListener('click', function(e){
    if (e.target.id==='modal-overlay' || e.target.id==='modal-close' || e.target.id==='modal-cancel') closeModal();
  });

  tryRestoreSession();
})();
