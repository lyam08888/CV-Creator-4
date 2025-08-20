export function generatePreview(formData) {
  const previewPanel = document.getElementById('cv-preview');
  
  let html = '';

  if (formData.recruiterName || formData.companyName || formData.companyLogoUrl) {
    html += `
      <div class="cv-recruitment-banner">
        ${formData.companyLogoUrl ? `<img src="${formData.companyLogoUrl}" alt="${formData.companyName || 'Company'} Logo" class="company-logo">` : ''}
        <div class="recruiter-info">
          <h3>${formData.companyName || 'Entreprise de Recrutement'}</h3>
          <p>Contact: ${formData.recruiterName || 'Recruteur'} (${formData.recruiterContact || 'Non spécifié'})</p>
        </div>
      </div>
    `;
  }

  html += `
    <div class="cv-section sortable" data-section="header">
      <div class="drag-handle">⋮⋮</div>
      <div class="cv-header">
        <h1 contenteditable="false">${formData.fullName || ''}</h1>
        <p contenteditable="false">${formData.jobTitle || ''}</p>
        <p contenteditable="false">${formData.email || ''} | ${formData.phone || ''} | ${formData.address || ''}</p>
      </div>
    </div>
    <div class="cv-section sortable" data-section="summary">
      <div class="drag-handle">⋮⋮</div>
      <h2 contenteditable="false">Résumé</h2>
      <p contenteditable="false">${formData.summary || ''}</p>
    </div>
  `;

  if (formData.experience) {
    html += '<div class="cv-section sortable" data-section="experience"><div class="drag-handle">⋮⋮</div><h2 contenteditable="false">Expérience Professionnelle</h2>';
    formData.experience.forEach(exp => {
      html += `
        <div class="cv-item">
          <h3 contenteditable="false">${exp.title} chez ${exp.company}</h3>
          <p class="cv-period" contenteditable="false">${exp.period}</p>
          <p contenteditable="false">${exp.description}</p>
        </div>
      `;
    });
    html += '</div>';
  }

  if (formData.education) {
    html += '<div class="cv-section sortable" data-section="education"><div class="drag-handle">⋮⋮</div><h2 contenteditable="false">Formation</h2>';
    formData.education.forEach(edu => {
      html += `
        <div class="cv-item">
          <h3 contenteditable="false">${edu.degree} - ${edu.school}</h3>
          <p class="cv-period" contenteditable="false">${edu.period}</p>
        </div>
      `;
    });
    html += '</div>';
  }

  if (formData.skills) {
    html += `
      <div class="cv-section sortable" data-section="skills">
        <div class="drag-handle">⋮⋮</div>
        <h2 contenteditable="false">Compétences</h2>
        <p contenteditable="false">${formData.skills}</p>
      </div>
    `;
  }

  previewPanel.innerHTML = html;
  
  // Initialiser le drag & drop après avoir généré le contenu
  initializeDragAndDrop();
}

function initializeDragAndDrop() {
  const previewPanel = document.getElementById('cv-preview');
  
  if (window.Sortable && previewPanel) {
    // Détruire l'instance existante si elle existe
    if (previewPanel.sortableInstance) {
      previewPanel.sortableInstance.destroy();
    }
    
    // Créer une nouvelle instance Sortable
    previewPanel.sortableInstance = Sortable.create(previewPanel, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'dragging',
      chosenClass: 'drag-over',
      onEnd: function(evt) {
        // Sauvegarder l'ordre des sections après le drag & drop
        saveSectionOrder();
      }
    });
  }
}

function saveSectionOrder() {
  const sections = document.querySelectorAll('.cv-section[data-section]');
  const order = Array.from(sections).map(section => section.dataset.section);
  localStorage.setItem('cv-section-order', JSON.stringify(order));
}

// Fonction pour ajouter une nouvelle page
window.addNewPage = function() {
  const previewPanel = document.getElementById('cv-preview');
  const newPage = document.createElement('div');
  newPage.className = 'cv-page';
  newPage.innerHTML = `
    <div class="cv-section sortable" data-section="new-section-${Date.now()}">
      <div class="drag-handle">⋮⋮</div>
      <h2 contenteditable="true">Nouvelle Section</h2>
      <p contenteditable="true">Contenu de la nouvelle section...</p>
    </div>
  `;
  previewPanel.appendChild(newPage);
  initializeDragAndDrop();
};
