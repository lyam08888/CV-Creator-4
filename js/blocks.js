// Gestion de l'onglet de disposition des blocs

export function initBlocksTab() {
  const list = document.getElementById('block-order-list');
  if (!list) return;

  const availableSections = [
    { type: 'recruitment-banner', label: 'Bannière de recrutement' },
    { type: 'header', label: 'En-tête' },
    { type: 'summary', label: 'Résumé' },
    { type: 'experience', label: 'Expérience' },
    { type: 'education', label: 'Formation' },
    { type: 'skills', label: 'Compétences' }
  ];

  const hidden = JSON.parse(localStorage.getItem('cv-hidden-sections') || '[]');
  const savedOrder = JSON.parse(localStorage.getItem('cv-section-order') || '[]');

  const ordered = availableSections.slice();
  if (savedOrder.length > 0) {
    ordered.sort((a, b) => {
      const ia = savedOrder.indexOf(a.type);
      const ib = savedOrder.indexOf(b.type);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }

  ordered.forEach(sec => {
    const li = document.createElement('li');
    li.className = 'block-item';
    li.dataset.section = sec.type;
    li.innerHTML = `
      <label class="checkbox-label">
        <input type="checkbox" class="block-visibility" ${hidden.includes(sec.type) ? '' : 'checked'}>
        <span class="checkmark"></span>
        ${sec.label}
      </label>
      <span class="drag-handle">⋮⋮</span>
    `;
    list.appendChild(li);
  });

  if (window.Sortable) {
    Sortable.create(list, {
      animation: 150,
      handle: '.drag-handle',
      // Allow checkboxes to remain interactive while using drag handles
      // "filter" prevents Sortable from hijacking clicks on the inputs
      filter: '.block-visibility',
      preventOnFilter: false,
      onEnd: saveOrder
    });
  }

  list.addEventListener('change', saveVisibility);

  function saveOrder() {
    const order = Array.from(list.querySelectorAll('.block-item')).map(i => i.dataset.section);
    localStorage.setItem('cv-section-order', JSON.stringify(order));
    window.dispatchEvent(new CustomEvent('regeneratePreview'));
  }

  function saveVisibility() {
    const hiddenSections = Array.from(list.querySelectorAll('.block-item'))
      .filter(item => !item.querySelector('.block-visibility').checked)
      .map(item => item.dataset.section);
    localStorage.setItem('cv-hidden-sections', JSON.stringify(hiddenSections));
    window.dispatchEvent(new CustomEvent('regeneratePreview'));
  }
}

