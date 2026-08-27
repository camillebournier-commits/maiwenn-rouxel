(function(){
  "use strict";

  /* ---------- Année automatique ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');

  function closeMenu(){
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
  }

  if (toggle && menu){
    toggle.addEventListener('click', function(){
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });

    /* Fermeture si on clique en dehors du menu ouvert */
    document.addEventListener('click', function(e){
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) &&
          e.target !== toggle && !toggle.contains(e.target)){
        closeMenu();
      }
    });
  }

  /* ---------- En-tête : ombre au scroll ---------- */
  var header = document.getElementById('site-header');
  var backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function(){
    var scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Navigation active au scroll ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && sections.length){
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function(a){
            var isCurrent = a.getAttribute('href') === '#' + id;
            a.toggleAttribute('aria-current', isCurrent);
            if (isCurrent) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function(s){ navObserver.observe(s); });
  }

  /* ---------- Apparition au scroll (reveal) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    var revealObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function(el){ revealObserver.observe(el); });

    /* Filet de sécurité : si pour une raison quelconque l'observateur
       ne se déclenche pas dans un navigateur donné, le contenu reste
       toujours visible au bout de 2,5 s au lieu de rester masqué. */
    setTimeout(function(){
      revealEls.forEach(function(el){ el.classList.add('is-visible'); });
    }, 2500);
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- Domaines d'intervention (rendu dynamique) ---------- */
  var domaines = [
    { titre: "Droit des obligations", texte: "Analyse et défense de vos engagements contractuels et extra-contractuels ainsi que de leurs conséquences.", icone: "scroll" },
    { titre: "Droit des contrats", texte: "Rédaction, négociation et contentieux relatifs à vos contrats.", icone: "doc" },
    { titre: "Responsabilité civile", texte: "Réparation des préjudices, défense et / ou mise en cause des responsabilités.", icone: "shield" },
    { titre: "Droit de la consommation", texte: "Défense de vos droits dans vos relations avec les professionnels.", icone: "cart" },
    { titre: "Droit pénal général", texte: "Assistance et défense des plaignants / victimes comme des mis en cause; des parties civiles comme des prévenus.", icone: "scale" },
    { titre: "Droit des animaux", texte: "Statut juridique de l'animal, maltraitance et contentieux associés.", icone: "paw" },
    { titre: "Droit du tourisme", texte: "Litiges liés aux contrats de voyage et de séjour touristique, ainsi qu'aux contrats de transport et hébergement.", icone: "compass" },
    { titre: "Litiges locatifs", texte: "Conflits entre bailleurs et locataires, baux d'habitation et commerciaux (rétention de garantie, caution, arriérés de loyers, expulsion…).", icone: "home" },
    { titre: "Procédure civile", texte: "Stratégie contentieuse et représentation devant les juridictions civiles.", icone: "gavel" },
    { titre: "Conseil &amp; contentieux", texte: "Un accompagnement sur-mesure, de la prévention à la résolution du litige.", icone: "chat" }
  ];

  var icons = {
    scroll: '<path d="M8 3h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/><path d="M8 3a3 3 0 0 0-3 3"/><path d="M8 8h9M8 12h9"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L23 6H6"/>',
    scale: '<path d="M12 3v18"/><path d="M7 21h10"/><path d="m4 8 3-5 3 5"/><path d="M2 8h10"/><path d="M2 8c0 2.2 1.8 4 4 4s4-1.8 4-4"/><path d="m17 8 3-5 3 5"/><path d="M14 8h10"/><path d="M14 8c0 2.2 1.8 4 4 4s4-1.8 4-4"/>',
    paw: '<circle cx="6" cy="10" r="2.2"/><circle cx="18" cy="10" r="2.2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><path d="M12 12c-3.5 0-6.5 2.4-6.5 5.5 0 2 1.6 3 3.5 3 1.4 0 2-.6 3-.6s1.6.6 3 .6c1.9 0 3.5-1 3.5-3C18.5 14.4 15.5 12 12 12Z"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m14.5 9.5-2 5-5 2 2-5 5-2Z"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    gavel: '<path d="m14 13-7.5 7.5a1.5 1.5 0 0 1-2-2L12 11"/><path d="m17 5 3 3"/><path d="m14 2 7 7-3.5 3.5-7-7Z"/><path d="M6 21h9"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/>'
  };

  var grid = document.getElementById('domaines-grid');
  if (grid){
    var html = domaines.map(function(d){
      return '<details class="domaine-card">' +
        '<summary>' +
          '<span class="domaine-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (icons[d.icone] || '') + '</svg></span>' +
          '<h3>' + d.titre + '</h3>' +
          '<svg class="domaine-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
        '</summary>' +
        '<p>' + d.texte + '</p>' +
        '</details>';
    }).join('');
    grid.innerHTML = html;
  }

  /* ---------- Formulaire de contact (envoi direct via FormSubmit) ---------- */
  var form = document.getElementById('contact-form');
  if (form){
    var submitBtn = document.getElementById('contact-submit');
    var submitLabel = document.getElementById('contact-submit-label');
    var feedback = document.getElementById('contact-feedback');

    form.addEventListener('submit', function(e){
      e.preventDefault();

      feedback.textContent = '';
      feedback.classList.remove('is-error', 'is-success');
      submitBtn.disabled = true;
      submitLabel.textContent = 'Envoi en cours…';

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function(response){ return response.json(); })
        .then(function(data){
          if (!data.success) throw new Error('web3forms');
          feedback.textContent = 'Votre message a bien été envoyé. Merci, une réponse vous sera apportée rapidement.';
          feedback.classList.add('is-success');
          form.reset();
        })
        .catch(function(){
          feedback.textContent = "Une erreur est survenue lors de l'envoi. Vous pouvez réessayer ou écrire directement à mrouxel.avocat@gmail.com.";
          feedback.classList.add('is-error');
        })
        .finally(function(){
          submitBtn.disabled = false;
          submitLabel.textContent = 'Envoyer le message';
        });
    });
  }

})();
