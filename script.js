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
    { titre: "Droit des obligations", texte: "Analyse et défense de vos engagements contractuels et extra-contractuels ainsi que de leurs conséquences." },
    { titre: "Droit des contrats", texte: "Rédaction, négociation et contentieux relatifs à vos contrats." },
    { titre: "Responsabilité civile", texte: "Réparation des préjudices, défense et / ou mise en cause des responsabilités." },
    { titre: "Droit de la consommation", texte: "Défense de vos droits dans vos relations avec les professionnels." },
    { titre: "Droit pénal général", texte: "Assistance et défense des plaignants / victimes comme des mis en cause; des parties civiles comme des prévenus." },
    { titre: "Droit du tourisme", texte: "Litiges liés aux contrats de voyage et de séjour touristique, ainsi qu'aux contrats de transport et hébergement." },
    { titre: "Litiges locatifs", texte: "Conflits entre bailleurs et locataires, baux d'habitation et commerciaux (rétention de garantie, caution, arriérés de loyers, expulsion…)." },
    { titre: "Procédure civile", texte: "Stratégie contentieuse et représentation devant les juridictions civiles." },
    { titre: "Conseil &amp; contentieux", texte: "Un accompagnement sur-mesure, de la prévention à la résolution du litige." }
  ];

  var grid = document.getElementById('domaines-grid');
  if (grid){
    var html = domaines.map(function(d){
      return '<div class="domaine-card">' +
          '<h3>' + d.titre + '</h3>' +
          '<p>' + d.texte + '</p>' +
        '</div>';
    }).join('');
    grid.innerHTML = html;
  }

  /* ---------- Onglets Domaines d'intervention ---------- */
  var domaineTabs = document.querySelectorAll('.domaines-tab');
  var domainePanels = {
    animalier: document.getElementById('panel-animalier'),
    particuliers: document.getElementById('panel-particuliers')
  };

  if (domaineTabs.length && domainePanels.animalier && domainePanels.particuliers){
    /* Amélioration progressive : le panneau "particuliers" n'est masqué
       qu'une fois le JS confirmé disponible, pour rester accessible sans JS. */
    domainePanels.particuliers.hidden = true;

    domaineTabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var target = tab.getAttribute('data-tab');

        domaineTabs.forEach(function(t){
          var isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
          t.tabIndex = isActive ? 0 : -1;
        });

        Object.keys(domainePanels).forEach(function(key){
          domainePanels[key].hidden = key !== target;
        });
      });
    });
  }

  /* ---------- Liens "Voir plus / Voir moins" (mobile) ---------- */
  document.querySelectorAll('[data-collapse]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = document.getElementById(btn.getAttribute('data-collapse'));
      if (target) target.classList.toggle('is-expanded');
    });
  });

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
