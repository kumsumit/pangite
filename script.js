'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){ menu.setAttribute('aria-expanded','false'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
navigation.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && navigation.classList.contains('is-open')){closeMenu(); menu.focus();} });
window.matchMedia('(min-width: 681px)').addEventListener('change', e => {if(e.matches) closeMenu();});
const info = {
 access: ['Your local market. A new possibility.', 'Pangeabuy is being introduced as a local product and merchant discovery platform. Live search, shopping and registration are not connected on this website.\n\nLaunch timing and local coverage have not been announced. The product and merchant illustrations explain the concept; they are not live listings. No personal information or early-access sign-ups are collected here.'],
 merchant: ['A new way to be discovered.', 'Pangeabuy aims to create an additional discovery opportunity for participating local merchants. Onboarding is not available through this website yet.\n\nParticipation requirements and launch coverage will need to be published when confirmed. Where an authorised Stromule integration is implemented, eligible product information may support discovery. No customer growth or sales are guaranteed.'],
 contact: ['Contact & support information', 'An official Pangeabuy contact or support destination has not been supplied for publication. This website does not submit enquiries or collect contact details.\n\nFor now, explore the FAQ for product information. An official support channel will need to be added before a live customer or merchant service is offered.'],
 privacy: ['Privacy on this introductory website', 'This website has no sign-up form, account system, analytics script or connected merchant database. Category selections only change the page displayed in your browser and are not saved.\n\nThe page requests the Manrope font from Google Fonts; your browser may share standard connection information with that provider. Hosting providers may also process standard request logs.\n\nA platform-specific privacy policy has not been supplied. This information is a description of this website, not a substitute for that policy.'],
 terms: ['An introduction, with clear limits.', 'This website explains the Pangeabuy concept. Products, merchant names and artwork are illustrative. No transactions, reservations, product availability checks or account registrations take place here.\n\nLive coverage, onboarding requirements, ordering, payments and fulfilment depend on confirmed platform capabilities. Formal platform terms have not been supplied for publication.']
};
const categoryInfo = {
 electronics:['Electronics & accessories','Charging cables, adapters, headphones and everyday technology accessories.'],
 home:['Home & everyday essentials','Household products, kitchen accessories and useful items for daily life.'],
 fashion:['Fashion & lifestyle','Clothing, footwear and accessories from local retailers.'],
 books:['Books & stationery','Notebooks, school supplies, writing materials and everyday creative essentials.'],
 tools:['Tools & specialist products','Hardware, tools and specialist products for particular jobs and needs.']
};
const dialog = document.querySelector('#info-dialog'); let previousFocus;
function showInfo(title, copy){previousFocus = document.activeElement; document.querySelector('#dialog-title').textContent=title; document.querySelector('#dialog-copy').textContent=copy; dialog.showModal();}
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => showInfo(...info[button.dataset.info])));
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {const [title,copy]=categoryInfo[button.dataset.category]; showInfo(title, copy+'\n\nThis is an illustrative category, not a live product result. Listings, coverage and category availability depend on participating merchants and the eventual platform experience.');}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', e => {if(e.target === dialog){const r=dialog.getBoundingClientRect(); if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>previousFocus?.focus());
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',()=>{
 const group=button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let count=0;
 document.querySelectorAll('[data-group]').forEach(card=>{card.hidden=group!=='all' && card.dataset.group!==group;if(!card.hidden)count++;});
 document.querySelector('.more-card').hidden=group!=='all';
 document.querySelector('#category-status').textContent=`${count} illustrative categories shown. Examples only, not live inventory or confirmed launch categories.`;
}));
document.querySelector('#year').textContent = new Date().getFullYear();
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.section-heading,.steps,.ecosystem,.local-layout').forEach(el=>observer.observe(el));}
