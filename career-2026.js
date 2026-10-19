(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const data=JSON.parse($('career-data').textContent);
 const root=document.documentElement;
 root.classList.add('js-ready');
 document.querySelectorAll('.enhance').forEach(el=>el.hidden=false);
 const bio={short:'I build financial data pipelines with Python, SQL, Snowflake and Airflow at Payden & Rygel. My background also includes NLP and model deployment at NVIDIA.',long:'I’m a Los Angeles data engineer with 6+ years at Payden & Rygel, working on derivatives data, regulatory reporting, reconciliation and cloud migration. Earlier roles include education-data pipelines at CSU Long Beach, NLP at Sprinklr and TensorFlow Serving deployment during an NVIDIA internship. My next direction is data engineering for AI teams, with applied AI as a secondary path.'};
 document.querySelectorAll('[data-bio]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-bio]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  $('bio-copy').textContent=bio[button.dataset.bio];
 }));
 function theme(value){root.dataset.theme=value;$('theme-toggle').setAttribute('aria-label',`Switch to ${value==='dark'?'light':'dark'} theme`);}
 try{const stored=localStorage.getItem('saumya-career-theme');if(['dark','light'].includes(stored))theme(stored);}catch(_){}
 $('theme-toggle').addEventListener('click',()=>{const value=root.dataset.theme==='dark'?'light':'dark';theme(value);try{localStorage.setItem('saumya-career-theme',value);}catch(_){}});
 const menu=$('mobile-nav'),menuButton=$('menu-toggle');
 const closeMenu=()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');};
 menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 const careerCards=[...document.querySelectorAll('[data-career]')];
 const filterButtons=[...document.querySelectorAll('[data-career-filter]')];
 function filterCareer(filter,skill){
  let count=0;
  careerCards.forEach(card=>{const job=data.jobs.find(j=>j.id===card.dataset.career);const visible=skill?job.skills.toLowerCase().includes(skill.toLowerCase()):filter==='all'||job.category.split(' ').includes(filter);card.hidden=!visible;if(visible)count++;});
  filterButtons.forEach(button=>button.setAttribute('aria-pressed',String(!skill&&button.dataset.careerFilter===filter)));
  $('career-count').textContent=`${count} role${count===1?'':'s'}${skill?' · '+skill:filter==='all'?' · 2016–present':''}`;
  $('career-filter-note').hidden=!skill;
  $('career-filter-note').textContent=skill?`Showing experience connected to ${skill}. Select “All experience” to restore the full chronology.`:'';
 }
 filterButtons.forEach(button=>button.addEventListener('click',()=>filterCareer(button.dataset.careerFilter)));
 document.querySelectorAll('.career-strip a').forEach(a=>a.addEventListener('click',()=>filterCareer('all')));
 const dialog=$('detail-dialog');
 function appendTags(values){$('detail-tags').replaceChildren();values.forEach(value=>{const span=document.createElement('span');span.textContent=value;$('detail-tags').append(span);});}
 function appendLinks(links){$('detail-links').replaceChildren();links.forEach(([label,url])=>{const a=document.createElement('a');a.href=url;a.textContent=label;$('detail-links').append(a);});}
 function populateDetails({kicker,title,meta,summary,listTitle,bullets,tags,links}){
  $('detail-kicker').textContent=kicker;$('detail-title').textContent=title;$('detail-meta').textContent=meta;$('detail-summary').textContent=summary;$('detail-list-title').textContent=listTitle;
  $('detail-list').replaceChildren();bullets.forEach(text=>{const li=document.createElement('li');li.textContent=text;$('detail-list').append(li);});appendTags(tags);appendLinks(links);dialog.showModal();
 }
 function showJob(id){const j=data.jobs.find(x=>x.id===id);populateDetails({kicker:j.area,title:j.company,meta:j.role+' · '+j.dates,summary:j.headline,listTitle:'Work highlights',bullets:j.bullets,tags:j.tags,links:[['Full résumé ↗','resume.html'],['Contact by email ↗','mailto:saumya071294@gmail.com?subject=Connecting%20about%20data%20engineering']]});}
 function showProject(id){const p=data.projects.find(x=>x.id===id);populateDetails({kicker:p.label,title:p.title,meta:p.year+' · Public project',summary:p.context,listTitle:'What to look at',bullets:p.details,tags:p.stack,links:p.url===p.code?[['View repository ↗',p.code]]:[['Open live demo ↗',p.url],['View source code ↗',p.code]]});}
 document.querySelectorAll('[data-job]').forEach(button=>button.addEventListener('click',()=>showJob(button.dataset.job)));
 document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>showProject(button.dataset.project)));
 $('detail-close').addEventListener('click',()=>dialog.close());
 [dialog,$('search-dialog')].forEach(modal=>modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close();}}));
 [dialog,$('search-dialog')].forEach(modal=>modal.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const focusable=[...modal.querySelectorAll('button,a[href],input')].filter(el=>!el.disabled&&el.getClientRects().length);const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}));
 const skillData={
  Snowflake:{description:'Build and maintain ETL/ELT pipelines for portfolio data, and own derivatives data mapping in a Snowflake-on-Azure migration.',employers:'Payden & Rygel · 2020–present'},
  Python:{description:'Use Python for financial data pipelines, earlier education-data collection and classification models, and NLP development.',employers:'Payden & Rygel · CSU Long Beach · Sprinklr · NVIDIA · RVCE'},
  SQL:{description:'Engineer FX/NDF reconciliation and financial reporting in SQL Server, with earlier Oracle SQL/PLSQL and SQLAlchemy work for education analytics.',employers:'Payden & Rygel · CSU Long Beach'},
  Airflow:{description:'Use Airflow to orchestrate financial data pipelines alongside Python, SQL and Snowflake.',employers:'Payden & Rygel · 2020–present'},
  Azure:{description:'Own derivatives data mapping into bronze, silver and gold layers as part of a Snowflake-on-Azure migration.',employers:'Payden & Rygel · 2020–present'},
  TensorFlow:{description:'Built sentiment-analysis models for an autonomous-driving voice assistant and deployed them with TensorFlow Serving. This was earlier internship work, in 2017.',employers:'NVIDIA · Software Developer Intern · Feb–Aug 2017'}
 };
 let selectedSkill='Snowflake';
 document.querySelectorAll('[data-skill]').forEach(button=>button.addEventListener('click',()=>{selectedSkill=button.dataset.skill;const skill=skillData[selectedSkill];document.querySelectorAll('[data-skill]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));$('skill-name').textContent=selectedSkill;$('skill-description').textContent=skill.description;$('skill-employers').textContent=skill.employers;}));
 $('skill-evidence').addEventListener('click',()=>{filterCareer('all',selectedSkill);$('experience').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
 document.querySelectorAll('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{let count=0;document.querySelectorAll('[data-project-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));document.querySelectorAll('[data-project-card]').forEach(card=>{card.hidden=button.dataset.projectFilter!=='all'&&card.dataset.category!==button.dataset.projectFilter;if(!card.hidden)count++;});$('project-count').textContent=`${count} project${count===1?'':'s'}`;}));
 let copyOperation=0;
 async function copy(text,label){const operation=++copyOperation;let timer;$('copy-status').textContent='Copying…';$('copy-value').hidden=true;try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await Promise.race([navigator.clipboard.writeText(text),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Clipboard not confirmed')),1000);})]);if(operation===copyOperation)$('copy-status').textContent=label+' copied.';}catch(_){if(operation===copyOperation){$('copy-status').textContent='Automatic copy was not confirmed. Select this text and copy it:';$('copy-value').value=text;$('copy-value').hidden=false;$('copy-value').focus();$('copy-value').select();}}finally{clearTimeout(timer);}}
 $('copy-email').addEventListener('click',()=>copy('saumya071294@gmail.com','Email'));
 $('copy-link').addEventListener('click',()=>copy('https://saumya-saumya.github.io/','Profile link'));
 const searchDialog=$('search-dialog');
 dialog.addEventListener('close',()=>{if(searchDialog.contains(document.activeElement)||document.activeElement===document.body)$('search-open').focus();});
 const index=[...data.jobs.map(j=>({type:'role',id:j.id,title:j.company,meta:j.dates+' · '+j.area,text:[j.company,j.summary,j.skills,...j.bullets].join(' ')})),...data.projects.map(p=>({type:'project',id:p.id,title:p.title,meta:p.label,text:[p.title,p.description,p.context,...p.stack].join(' ')}))];
 function renderSearch(){const q=$('site-search').value.trim().toLowerCase();const results=q?index.filter(x=>x.text.toLowerCase().includes(q)):index.filter(x=>['payden','nvidia','trade'].includes(x.id));$('search-results').replaceChildren();$('search-status').textContent=q?`${results.length} result${results.length===1?'':'s'}`:'Choose a shortcut or type a topic.';results.forEach(item=>{const button=document.createElement('button');button.className='search-result';const strong=document.createElement('strong');strong.textContent=item.title;const small=document.createElement('small');small.textContent=item.meta;button.append(strong,small);button.addEventListener('click',()=>{searchDialog.close();item.type==='role'?showJob(item.id):showProject(item.id);});$('search-results').append(button);});}
 const openSearch=()=>{if(dialog.open)dialog.close();if(!searchDialog.open){searchDialog.showModal();$('site-search').value='';renderSearch();$('site-search').focus();}};
 $('search-open').addEventListener('click',openSearch);$('search-close').addEventListener('click',()=>searchDialog.close());$('site-search').addEventListener('input',renderSearch);
 document.addEventListener('keydown',event=>{const typing=/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)||event.target.isContentEditable;if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}else if(event.key==='/'&&!typing&&!dialog.open&&!searchDialog.open){event.preventDefault();openSearch();}else if(event.key==='Escape'){if(searchDialog.open){event.preventDefault();searchDialog.close();}else if(dialog.open){event.preventDefault();dialog.close();}else if(!menu.hidden){closeMenu();menuButton.focus();}}});
 const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;$('progress').style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%';};
 addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',()=>{updateProgress();if(innerWidth>820)closeMenu();});updateProgress();
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('.main-nav a').forEach(a=>{if(a.getAttribute('href')==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -55% 0px'});['experience','expertise','projects','contact'].forEach(id=>observer.observe($(id)));}
})();
