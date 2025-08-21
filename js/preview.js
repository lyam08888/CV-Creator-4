export function generatePreview(formData) {
  const previewContainer = document.getElementById('cv-preview');
  
  // Générer le contenu des sections
  const sections = generateSections(formData);
  
  // Créer les pages avec pagination automatique
  const pages = createPagesWithPagination(sections);
  
  // Injecter le HTML dans le conteneur
  previewContainer.innerHTML = pages;
  
  // Optimiser les espaces vides
  optimizeSpacing();
  
  // Initialiser le drag & drop après avoir généré le contenu
  initializeDragAndDrop();
  
  // Appliquer la personnalisation
  applyCustomizationToPreview();
}

// Fonction pour optimiser les espaces vides
function optimizeSpacing() {
  const sections = document.querySelectorAll('.cv-section');
  
  sections.forEach(section => {
    // Supprimer les paragraphes vides
    const emptyParagraphs = section.querySelectorAll('p:empty, p:not(:has(*)):not([contenteditable])');
    emptyParagraphs.forEach(p => {
      if (!p.textContent.trim()) {
        p.remove();
      }
    });
    
    // Supprimer les divs vides
    const emptyDivs = section.querySelectorAll('div:empty:not(.drag-handle):not(.resize-handle)');
    emptyDivs.forEach(div => div.remove());
    
    // Optimiser les marges des derniers éléments
    const lastItem = section.querySelector('.cv-item:last-child');
    if (lastItem) {
      lastItem.style.marginBottom = '0';
    }
    
    // Réduire les espaces excessifs entre les éléments
    const items = section.querySelectorAll('.cv-item');
    items.forEach((item, index) => {
      if (index > 0) {
        const prevItem = items[index - 1];
        const gap = item.offsetTop - (prevItem.offsetTop + prevItem.offsetHeight);
        if (gap > 20) { // Si l'espace est trop grand
          item.style.marginTop = '-5px';
        }
      }
    });
  });
  
  // Supprimer les sections complètement vides
  const emptySections = document.querySelectorAll('.cv-section:not(.cv-recruitment-banner)');
  emptySections.forEach(section => {
    const hasContent = section.querySelector('h1, h2, h3, p, li, img, .cv-item');
    const textContent = section.textContent.trim();
    if (!hasContent || textContent.length < 10) {
      section.remove();
    }
  });
}

function generateSections(formData) {
  const sections = [];

  // Bannière de recrutement
  if (formData.showRecruitmentBanner && (formData.recruiterName || formData.companyName || formData.companyLogoUrl || formData.bannerMessage)) {
    const bannerStyle = formData.bannerStyle || 'modern';
    const bannerColor = formData.bannerColor || '#3B82F6';
    const bannerHeight = parseInt(formData.bannerHeight) || 20;
    const bannerImageUrl = formData.bannerImageUrl || '';
    
    // Ne pas ajouter la bannière si la hauteur est 0
    if (bannerHeight > 0) {
      sections.push({
        type: 'recruitment-banner',
        content: generateRecruitmentBanner(formData, bannerStyle, bannerColor, bannerHeight, bannerImageUrl),
        height: bannerHeight + 5 // hauteur + marge réduite
      });
    }
  }

  // En-tête
  sections.push({
    type: 'header',
    content: `
      <div class="cv-section sortable" data-section="header">
        <div class="drag-handle">⋮⋮</div>
        <div class="cv-header">
          <h1 contenteditable="false">${formData.fullName || ''}</h1>
          <p contenteditable="false">${formData.jobTitle || ''}</p>
          <p contenteditable="false">${formData.email || ''} | ${formData.phone || ''} | ${formData.address || ''}</p>
        </div>
      </div>
    `,
    height: 35
  });

  // Résumé
  if (formData.summary) {
    sections.push({
      type: 'summary',
      content: `
        <div class="cv-section sortable" data-section="summary">
          <div class="drag-handle">⋮⋮</div>
          <h2 contenteditable="false">Résumé</h2>
          <p contenteditable="false">${formData.summary}</p>
        </div>
      `,
      height: 25 + Math.min((formData.summary.length / 150) * 8, 20) // estimation plus compacte
    });
  }

  // Expérience
  if (formData.experience && formData.experience.length > 0) {
    let experienceContent = '<div class="cv-section sortable" data-section="experience"><div class="drag-handle">⋮⋮</div><h2 contenteditable="false">Expérience Professionnelle</h2>';
    let experienceHeight = 20; // titre réduit
    
    formData.experience.forEach(exp => {
      const title = exp.title || '';
      const company = exp.company || '';
      const period = exp.period || '';
      const description = exp.description || '';
      
      experienceContent += `
        <div class="cv-item">
          <h3 contenteditable="false">${title}${company ? ` chez ${company}` : ''}</h3>
          ${period ? `<p class="cv-period" contenteditable="false">${period}</p>` : ''}
          ${description ? `<p contenteditable="false">${description}</p>` : ''}
        </div>
      `;
      experienceHeight += 18 + (description ? Math.min(description.length / 200 * 8, 15) : 0); // plus compact
    });
    
    experienceContent += '</div>';
    
    sections.push({
      type: 'experience',
      content: experienceContent,
      height: experienceHeight
    });
  }

  // Formation
  if (formData.education && formData.education.length > 0) {
    let educationContent = '<div class="cv-section sortable" data-section="education"><div class="drag-handle">⋮⋮</div><h2 contenteditable="false">Formation</h2>';
    let educationHeight = 30;
    
    formData.education.forEach(edu => {
      const degree = edu.degree || '';
      const school = edu.school || '';
      const period = edu.period || '';
      
      educationContent += `
        <div class="cv-item">
          <h3 contenteditable="false">${degree}${school ? ` - ${school}` : ''}</h3>
          ${period ? `<p class="cv-period" contenteditable="false">${period}</p>` : ''}
        </div>
      `;
      educationHeight += 20;
    });
    
    educationContent += '</div>';
    
    sections.push({
      type: 'education',
      content: educationContent,
      height: educationHeight
    });
  }

  // Compétences
  if (formData.skills) {
    sections.push({
      type: 'skills',
      content: `
        <div class="cv-section sortable" data-section="skills">
          <div class="drag-handle">⋮⋮</div>
          <h2 contenteditable="false">Compétences</h2>
          <p contenteditable="false">${formData.skills}</p>
        </div>
      `,
      height: 40 + (formData.skills.length / 100) * 5
    });
  }

  return sections;
}

function createPagesWithPagination(sections) {
  const maxPages = parseInt(localStorage.getItem('cv-max-pages') || '2');
  const pageMarginTop = parseFloat(localStorage.getItem('cv-margin-top') || '20');
  const pageMarginBottom = parseFloat(localStorage.getItem('cv-margin-bottom') || '20');
  const availableHeight = 297 - pageMarginTop - pageMarginBottom; // A4 height minus margins
  
  let pages = [];
  let currentPage = [];
  let currentPageHeight = 0;
  let pageNumber = 1;

  sections.forEach((section, index) => {
    // Vérifier si la section tient sur la page actuelle
    if (currentPageHeight + section.height > availableHeight && currentPage.length > 0) {
      // Créer une nouvelle page
      pages.push(createPageHTML(currentPage, pageNumber));
      currentPage = [];
      currentPageHeight = 0;
      pageNumber++;
      
      // Vérifier si on dépasse le nombre maximum de pages
      if (pageNumber > maxPages) {
        // Ajouter un indicateur de débordement
        pages[pages.length - 1] = pages[pages.length - 1].replace(
          '</div>',
          '<div class="page-overflow-indicator">Contenu tronqué - Augmentez le nombre de pages</div></div>'
        );
        break;
      }
    }
    
    currentPage.push(section);
    currentPageHeight += section.height;
  });

  // Ajouter la dernière page si elle contient du contenu
  if (currentPage.length > 0) {
    pages.push(createPageHTML(currentPage, pageNumber));
  }

  return pages.join('');
}

function createPageHTML(sections, pageNumber) {
  const sectionsHTML = sections.map(section => section.content).join('');
  
  return `
    <div class="cv-page" data-page="${pageNumber}">
      ${sectionsHTML}
      <div class="page-number">Page ${pageNumber}</div>
    </div>
  `;
}

function generateRecruitmentBanner(formData, bannerStyle, bannerColor, bannerHeight, bannerImageUrl) {
  const companyName = formData.companyName || '';
  const recruiterName = formData.recruiterName || '';
  const recruiterContact = formData.recruiterContact || '';
  const companyLogoUrl = formData.companyLogoUrl || '';
  const bannerMessage = formData.bannerMessage || '';
  
  // Si la hauteur est 0, retourner une bannière masquée
  if (bannerHeight <= 0) {
    return `
      <div class="cv-section cv-recruitment-banner banner-${bannerStyle} sortable" 
           data-section="recruitment-banner" 
           style="display: none !important; height: 0 !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important;">
      </div>
    `;
  }
  
  // Styles CSS inline pour la bannière
  const bannerStyles = `
    --banner-height: ${bannerHeight}mm;
    --banner-color: ${bannerColor};
    --banner-color-secondary: ${adjustColor(bannerColor, -20)};
    min-height: ${bannerHeight}mm;
    height: ${bannerHeight}mm;
    ${bannerImageUrl ? `background-image: url('${bannerImageUrl}');` : ''}
  `;
  
  return `
    <div class="cv-section cv-recruitment-banner banner-${bannerStyle} sortable" 
         data-section="recruitment-banner" 
         style="${bannerStyles}">
      <div class="drag-handle">⋮⋮</div>
      <div class="banner-content">
        ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${companyName} Logo" class="banner-logo">` : ''}
        <div class="banner-info">
          ${companyName ? `<h3 class="banner-company">${companyName}</h3>` : ''}
          ${recruiterName ? `<p class="banner-recruiter">Contact: ${recruiterName}</p>` : ''}
          ${recruiterContact ? `<p class="banner-contact">${recruiterContact}</p>` : ''}
          ${bannerMessage ? `<p class="banner-message">${bannerMessage}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}

function adjustColor(color, amount) {
  // Fonction utilitaire pour ajuster la luminosité d'une couleur
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

function applyCustomizationToPreview() {
  // Cette fonction sera appelée pour appliquer les styles de personnalisation
  const customization = JSON.parse(localStorage.getItem('cv-customization') || '{}');
  
  if (Object.keys(customization).length > 0) {
    // Importer et appliquer la personnalisation
    import('./customization.js').then(module => {
      if (module.applyCurrentCustomization) {
        module.applyCurrentCustomization();
      }
    });
  }
}

function initializeDragAndDrop() {
  const previewPanel = document.getElementById('cv-preview');
  
  if (window.Sortable && previewPanel) {
    // Détruire les instances existantes
    if (previewPanel.sortableInstances) {
      previewPanel.sortableInstances.forEach(instance => instance.destroy());
    }
    previewPanel.sortableInstances = [];
    
    // Créer une instance Sortable pour chaque page
    const pages = previewPanel.querySelectorAll('.cv-page');
    pages.forEach(page => {
      const sortableInstance = Sortable.create(page, {
        group: 'cv-sections', // Permet le drag & drop entre pages
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'dragging',
        chosenClass: 'drag-over',
        onEnd: function(evt) {
          // Sauvegarder l'ordre des sections après le drag & drop
          saveSectionOrder();
          // Régénérer l'aperçu pour recalculer la pagination
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('regeneratePreview'));
          }, 100);
        }
      });
      previewPanel.sortableInstances.push(sortableInstance);
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
