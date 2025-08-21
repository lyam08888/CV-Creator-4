let sortableInstances = [];

export function initDragAndDrop() {
  const previewPanel = document.getElementById('cv-preview');
  if (!previewPanel || !window.Sortable) return;

  // Destroy existing instances
  sortableInstances.forEach(inst => inst.destroy());
  sortableInstances = [];

  const pages = previewPanel.querySelectorAll('.cv-page');
  pages.forEach(page => {
    const sortable = Sortable.create(page, {
      group: 'cv-sections',
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'dragging',
      chosenClass: 'drag-over',
      onEnd: () => {
        saveSectionOrder();
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('regeneratePreview'));
        }, 100);
      }
    });
    sortableInstances.push(sortable);
  });
}

export function destroyDragAndDrop() {
  sortableInstances.forEach(inst => inst.destroy());
  sortableInstances = [];
}

function saveSectionOrder() {
  const sections = document.querySelectorAll('.cv-section[data-section]');
  const order = Array.from(sections).map(sec => sec.dataset.section);
  localStorage.setItem('cv-section-order', JSON.stringify(order));
}
