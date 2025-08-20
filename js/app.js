// CV Creator App - Version complète avec drag & drop
console.log('CV Creator App loaded');

// Données d'exemple pour pré-remplir le CV
const exampleData = {
  fullName: "Jean Dupont",
  jobTitle: "Développeur Full Stack Senior",
  email: "jean.dupont@email.com",
  phone: "+33 6 12 34 56 78",
  address: "123 Rue de la Paix, 75001 Paris",
  linkedin: "https://linkedin.com/in/jean-dupont",
  website: "https://jean-dupont.dev",
  github: "https://github.com/jean-dupont",
  summary: "Développeur Full Stack passionné avec 7 ans d'expérience dans le développement d'applications web modernes. Expert en React, Node.js et Python, avec une forte orientation résultats et une capacité prouvée à diriger des équipes techniques.",
  experiences: [
    {
      title: "Lead Developer Full Stack",
      company: "TechCorp Solutions",
      location: "Paris, France",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: "• Direction d'une équipe de 5 développeurs sur des projets web complexes\n• Développement d'une plateforme SaaS utilisée par 10,000+ utilisateurs\n• Amélioration des performances de 40% grâce à l'optimisation du code\n• Mise en place de pratiques DevOps et CI/CD",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"]
    },
    {
      title: "Développeur Full Stack",
      company: "StartupInnovante",
      location: "Lyon, France", 
      startDate: "2019-01",
      endDate: "2021-02",
      current: false,
      description: "• Développement from scratch d'une application e-commerce\n• Intégration de systèmes de paiement (Stripe, PayPal)\n• Optimisation SEO ayant augmenté le trafic de 200%\n• Formation des nouveaux développeurs",
      technologies: ["Vue.js", "Express.js", "MongoDB", "Redis"]
    },
    {
      title: "Développeur Frontend",
      company: "WebAgency Pro",
      location: "Remote",
      startDate: "2017-06",
      endDate: "2018-12",
      current: false,
      description: "• Création de sites web responsives pour des clients variés\n• Développement de composants réutilisables\n• Collaboration étroite avec les designers UX/UI\n• Maintenance et évolution de sites existants",
      technologies: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap"]
    }
  ],
  education: [
    {
      degree: "Master en Informatique",
      school: "École Supérieure d'Informatique de Paris",
      location: "Paris, France",
      startDate: "2015-09",
      endDate: "2017-06",
      description: "Spécialisation en développement web et bases de données. Projet de fin d'études : développement d'une plateforme collaborative.",
      grade: "Mention Très Bien"
    },
    {
      degree: "Licence Informatique",
      school: "Université Pierre et Marie Curie",
      location: "Paris, France",
      startDate: "2012-09", 
      endDate: "2015-06",
      description: "Formation généraliste en informatique avec focus sur la programmation et les algorithmes.",
      grade: "Mention Bien"
    }
  ],
  technicalSkills: [
    { name: "JavaScript", level: 95 },
    { name: "React", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "PostgreSQL", level: 85 },
    { name: "MongoDB", level: 75 },
    { name: "AWS", level: 70 },
    { name: "Docker", level: 75 }
  ],
  softSkills: [
    { name: "Leadership", level: 90 },
    { name: "Communication", level: 85 },
    { name: "Résolution de problèmes", level: 95 },
    { name: "Travail en équipe", level: 90 },
    { name: "Gestion de projet", level: 80 }
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant (C1)" },
    { name: "Espagnol", level: "Intermédiaire (B2)" }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-05",
      url: "https://aws.amazon.com/certification/"
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022-11",
      url: "https://developers.facebook.com/docs/react/"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Plateforme e-commerce complète avec gestion des stocks, paiements et analytics",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      url: "https://github.com/jean-dupont/ecommerce-platform",
      startDate: "2023-01",
      endDate: "2023-06"
    },
    {
      name: "Task Management App",
      description: "Application de gestion de tâches collaborative avec temps réel",
      technologies: ["Vue.js", "Socket.io", "MongoDB"],
      url: "https://taskmanager-demo.com",
      startDate: "2022-08",
      endDate: "2022-12"
    }
  ]
};

// Variables globales
let editMode = false;
let sortableInstances = [];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing CV Creator...');
  
  initNavigation();
  initFormHandlers();
  initPreview();
  populateExampleData();
  generatePreview();
  
  console.log('CV Creator initialized successfully');
});

// NAVIGATION
function initNavigation() {
  console.log('Initializing navigation...');
  
  const navButtons = document.querySelectorAll('.nav-btn');
  const formSections = document.querySelectorAll('.form-section');
  
  navButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('data-form');
      
      // Remove active from all buttons
      navButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      
      // Add active to clicked button
      this.classList.add('active');
      
      // Hide all sections
      formSections.forEach(function(section) {
        section.classList.remove('active');
        section.style.display = 'none';
      });
      
      // Show target section
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
      }
    });
  });
  
  // Initialize first section
  const firstSection = document.getElementById('personal-info');
  if (firstSection) {
    firstSection.style.display = 'block';
    firstSection.classList.add('active');
  }
}

// GESTIONNAIRES DE FORMULAIRES
function initFormHandlers() {
  console.log('Initializing form handlers...');
  
  // Boutons d'ajout
  document.getElementById('btnAddExperience').addEventListener('click', addExperience);
  document.getElementById('btnAddEducation').addEventListener('click', addEducation);
  document.getElementById('btnAddTechnicalSkill').addEventListener('click', addTechnicalSkill);
  document.getElementById('btnAddSoftSkill').addEventListener('click', addSoftSkill);
  document.getElementById('btnAddLanguage').addEventListener('click', addLanguage);
  document.getElementById('btnAddCertification').addEventListener('click', addCertification);
  document.getElementById('btnAddProject').addEventListener('click', addProject);
  
  // Boutons d'action
  document.getElementById('btnAutoFillAI').addEventListener('click', autoFillWithAI);
  document.getElementById('btnGenerateSummaryAI').addEventListener('click', generateSummaryAI);
  document.getElementById('btnSuggestSkillsAI').addEventListener('click', suggestSkillsAI);
  document.getElementById('btnGenerateIA').addEventListener('click', generateFullCVWithAI);
  document.getElementById('btnExport').addEventListener('click', exportToPDF);
  document.getElementById('btnAnalyzeCVAI').addEventListener('click', analyzeCVWithAI);
  document.getElementById('btnToggleEdit').addEventListener('click', toggleEditMode);
  
  // Écouter les changements dans le formulaire pour mettre à jour l'aperçu
  document.getElementById('cv-form').addEventListener('input', debounce(generatePreview, 500));
}

// FONCTIONS D'AJOUT D'ÉLÉMENTS
function addExperience(data = null) {
  const container = document.getElementById('experience-list');
  const index = container.children.length;
  
  const experienceData = data || {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: []
  };
  
  const div = document.createElement('div');
  div.className = 'form-item';
  div.innerHTML = `
    <div class="form-item-header">
      <h4>Expérience ${index + 1}</h4>
      <button type="button" class="btn-remove" onclick="removeFormItem(this)">×</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Titre du poste *</label>
        <input type="text" name="experience[${index}][title]" class="input" value="${experienceData.title}" required>
      </div>
      <div class="form-group">
        <label>Entreprise *</label>
        <input type="text" name="experience[${index}][company]" class="input" value="${experienceData.company}" required>
      </div>
      <div class="form-group">
        <label>Lieu</label>
        <input type="text" name="experience[${index}][location]" class="input" value="${experienceData.location}">
      </div>
      <div class="form-group">
        <label>Date de début *</label>
        <input type="month" name="experience[${index}][startDate]" class="input" value="${experienceData.startDate}" required>
      </div>
      <div class="form-group">
        <label>Date de fin</label>
        <input type="month" name="experience[${index}][endDate]" class="input" value="${experienceData.current ? '' : experienceData.endDate}" ${experienceData.current ? 'disabled' : ''}>
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" name="experience[${index}][current]" ${experienceData.current ? 'checked' : ''} onchange="toggleCurrentJob(this)">
          Poste actuel
        </label>
      </div>
    </div>
    <div class="form-group">
      <label>Description des missions *</label>
      <textarea name="experience[${index}][description]" class="textarea" rows="4" required>${experienceData.description}</textarea>
      <button type="button" class="btn-ai" onclick="improveWithAI(this)">✨ Améliorer avec IA</button>
    </div>
    <div class="form-group">
      <label>Technologies utilisées (séparées par des virgules)</label>
      <input type="text" name="experience[${index}][technologies]" class="input" value="${experienceData.technologies.join(', ')}" placeholder="React, Node.js, PostgreSQL...">
    </div>
  `;
  
  container.appendChild(div);
  return div;
}

function addEducation(data = null) {
  const container = document.getElementById('education-list');
  const index = container.children.length;
  
  const educationData = data || {
    degree: '',
    school: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    grade: ''
  };
  
  const div = document.createElement('div');
  div.className = 'form-item';
  div.innerHTML = `
    <div class="form-item-header">
      <h4>Formation ${index + 1}</h4>
      <button type="button" class="btn-remove" onclick="removeFormItem(this)">×</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Diplôme *</label>
        <input type="text" name="education[${index}][degree]" class="input" value="${educationData.degree}" required>
      </div>
      <div class="form-group">
        <label>École/Université *</label>
        <input type="text" name="education[${index}][school]" class="input" value="${educationData.school}" required>
      </div>
      <div class="form-group">
        <label>Lieu</label>
        <input type="text" name="education[${index}][location]" class="input" value="${educationData.location}">
      </div>
      <div class="form-group">
        <label>Date de début</label>
        <input type="month" name="education[${index}][startDate]" class="input" value="${educationData.startDate}">
      </div>
      <div class="form-group">
        <label>Date de fin</label>
        <input type="month" name="education[${index}][endDate]" class="input" value="${educationData.endDate}">
      </div>
      <div class="form-group">
        <label>Mention</label>
        <input type="text" name="education[${index}][grade]" class="input" value="${educationData.grade}" placeholder="Mention Très Bien">
      </div>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea name="education[${index}][description]" class="textarea" rows="3">${educationData.description}</textarea>
    </div>
  `;
  
  container.appendChild(div);
  return div;
}

function addTechnicalSkill(data = null) {
  const container = document.getElementById('technical-skills');
  const index = container.children.length;
  
  const skillData = data || { name: '', level: 50 };
  
  const div = document.createElement('div');
  div.className = 'skill-item';
  div.innerHTML = `
    <input type="text" name="technicalSkills[${index}][name]" class="input" value="${skillData.name}" placeholder="Nom de la compétence">
    <input type="range" name="technicalSkills[${index}][level]" class="range" min="0" max="100" value="${skillData.level}" oninput="updateSkillLevel(this)">
    <span class="skill-level">${skillData.level}%</span>
    <button type="button" class="btn-remove-small" onclick="removeSkill(this)">×</button>
  `;
  
  container.appendChild(div);
  return div;
}

function addSoftSkill(data = null) {
  const container = document.getElementById('soft-skills');
  const index = container.children.length;
  
  const skillData = data || { name: '', level: 50 };
  
  const div = document.createElement('div');
  div.className = 'skill-item';
  div.innerHTML = `
    <input type="text" name="softSkills[${index}][name]" class="input" value="${skillData.name}" placeholder="Nom de la compétence">
    <input type="range" name="softSkills[${index}][level]" class="range" min="0" max="100" value="${skillData.level}" oninput="updateSkillLevel(this)">
    <span class="skill-level">${skillData.level}%</span>
    <button type="button" class="btn-remove-small" onclick="removeSkill(this)">×</button>
  `;
  
  container.appendChild(div);
  return div;
}

function addLanguage(data = null) {
  const container = document.getElementById('languages-list');
  const index = container.children.length;
  
  const languageData = data || { name: '', level: '' };
  
  const div = document.createElement('div');
  div.className = 'form-item';
  div.innerHTML = `
    <div class="form-item-header">
      <h4>Langue ${index + 1}</h4>
      <button type="button" class="btn-remove" onclick="removeFormItem(this)">×</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Langue</label>
        <input type="text" name="languages[${index}][name]" class="input" value="${languageData.name}" placeholder="Français, Anglais...">
      </div>
      <div class="form-group">
        <label>Niveau</label>
        <select name="languages[${index}][level]" class="input">
          <option value="">Sélectionner un niveau</option>
          <option value="Débutant (A1)" ${languageData.level === 'Débutant (A1)' ? 'selected' : ''}>Débutant (A1)</option>
          <option value="Élémentaire (A2)" ${languageData.level === 'Élémentaire (A2)' ? 'selected' : ''}>Élémentaire (A2)</option>
          <option value="Intermédiaire (B1)" ${languageData.level === 'Intermédiaire (B1)' ? 'selected' : ''}>Intermédiaire (B1)</option>
          <option value="Intermédiaire (B2)" ${languageData.level === 'Intermédiaire (B2)' ? 'selected' : ''}>Intermédiaire (B2)</option>
          <option value="Avancé (C1)" ${languageData.level === 'Avancé (C1)' ? 'selected' : ''}>Avancé (C1)</option>
          <option value="Courant (C1)" ${languageData.level === 'Courant (C1)' ? 'selected' : ''}>Courant (C1)</option>
          <option value="Bilingue (C2)" ${languageData.level === 'Bilingue (C2)' ? 'selected' : ''}>Bilingue (C2)</option>
          <option value="Natif" ${languageData.level === 'Natif' ? 'selected' : ''}>Natif</option>
        </select>
      </div>
    </div>
  `;
  
  container.appendChild(div);
  return div;
}

function addCertification(data = null) {
  const container = document.getElementById('certifications-list');
  const index = container.children.length;
  
  const certData = data || { name: '', issuer: '', date: '', url: '' };
  
  const div = document.createElement('div');
  div.className = 'form-item';
  div.innerHTML = `
    <div class="form-item-header">
      <h4>Certification ${index + 1}</h4>
      <button type="button" class="btn-remove" onclick="removeFormItem(this)">×</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Nom de la certification</label>
        <input type="text" name="certifications[${index}][name]" class="input" value="${certData.name}">
      </div>
      <div class="form-group">
        <label>Organisme</label>
        <input type="text" name="certifications[${index}][issuer]" class="input" value="${certData.issuer}">
      </div>
      <div class="form-group">
        <label>Date d'obtention</label>
        <input type="month" name="certifications[${index}][date]" class="input" value="${certData.date}">
      </div>
      <div class="form-group">
        <label>URL de vérification</label>
        <input type="url" name="certifications[${index}][url]" class="input" value="${certData.url}">
      </div>
    </div>
  `;
  
  container.appendChild(div);
  return div;
}

function addProject(data = null) {
  const container = document.getElementById('projects-list');
  const index = container.children.length;
  
  const projectData = data || {
    name: '',
    description: '',
    technologies: [],
    url: '',
    startDate: '',
    endDate: ''
  };
  
  const div = document.createElement('div');
  div.className = 'form-item';
  div.innerHTML = `
    <div class="form-item-header">
      <h4>Projet ${index + 1}</h4>
      <button type="button" class="btn-remove" onclick="removeFormItem(this)">×</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Nom du projet</label>
        <input type="text" name="projects[${index}][name]" class="input" value="${projectData.name}">
      </div>
      <div class="form-group">
        <label>URL du projet</label>
        <input type="url" name="projects[${index}][url]" class="input" value="${projectData.url}">
      </div>
      <div class="form-group">
        <label>Date de début</label>
        <input type="month" name="projects[${index}][startDate]" class="input" value="${projectData.startDate}">
      </div>
      <div class="form-group">
        <label>Date de fin</label>
        <input type="month" name="projects[${index}][endDate]" class="input" value="${projectData.endDate}">
      </div>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea name="projects[${index}][description]" class="textarea" rows="3">${projectData.description}</textarea>
    </div>
    <div class="form-group">
      <label>Technologies utilisées</label>
      <input type="text" name="projects[${index}][technologies]" class="input" value="${projectData.technologies.join(', ')}" placeholder="React, Node.js, MongoDB...">
    </div>
  `;
  
  container.appendChild(div);
  return div;
}

// FONCTIONS UTILITAIRES
function removeFormItem(button) {
  button.closest('.form-item').remove();
  generatePreview();
}

function removeSkill(button) {
  button.closest('.skill-item').remove();
  generatePreview();
}

function updateSkillLevel(range) {
  const levelSpan = range.nextElementSibling;
  levelSpan.textContent = range.value + '%';
  generatePreview();
}

function toggleCurrentJob(checkbox) {
  const endDateInput = checkbox.closest('.form-item').querySelector('input[name*="[endDate]"]');
  if (checkbox.checked) {
    endDateInput.disabled = true;
    endDateInput.value = '';
  } else {
    endDateInput.disabled = false;
  }
  generatePreview();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = function() {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// REMPLISSAGE AVEC DONNÉES D'EXEMPLE
function populateExampleData() {
  console.log('Populating example data...');
  
  // Informations personnelles
  document.getElementById('fullName').value = exampleData.fullName;
  document.getElementById('jobTitle').value = exampleData.jobTitle;
  document.getElementById('email').value = exampleData.email;
  document.getElementById('phone').value = exampleData.phone;
  document.getElementById('address').value = exampleData.address;
  document.getElementById('linkedin').value = exampleData.linkedin;
  document.getElementById('website').value = exampleData.website;
  document.getElementById('github').value = exampleData.github;
  
  // Résumé
  document.getElementById('summary-text').value = exampleData.summary;
  
  // Expériences
  exampleData.experiences.forEach(exp => addExperience(exp));
  
  // Formation
  exampleData.education.forEach(edu => addEducation(edu));
  
  // Compétences techniques
  exampleData.technicalSkills.forEach(skill => addTechnicalSkill(skill));
  
  // Compétences transversales
  exampleData.softSkills.forEach(skill => addSoftSkill(skill));
  
  // Langues
  exampleData.languages.forEach(lang => addLanguage(lang));
  
  // Certifications
  exampleData.certifications.forEach(cert => addCertification(cert));
  
  // Projets
  exampleData.projects.forEach(project => addProject(project));
}

// GÉNÉRATION DE L'APERÇU
function initPreview() {
  console.log('Initializing preview...');
  // Initialiser le drag & drop pour l'aperçu
  initDragAndDrop();
}

function generatePreview() {
  console.log('Generating preview...');
  
  const formData = getFormData();
  const previewContainer = document.getElementById('cv-preview');
  
  previewContainer.innerHTML = `
    <div class="cv-container" id="cv-container">
      ${generateHeader(formData)}
      ${generateSummary(formData)}
      ${generateExperience(formData)}
      ${generateEducation(formData)}
      ${generateSkills(formData)}
      ${generateLanguages(formData)}
      ${generateCertifications(formData)}
      ${generateProjects(formData)}
    </div>
  `;
  
  // Réinitialiser le drag & drop après la génération
  if (editMode) {
    initDragAndDrop();
  }
}

function generateHeader(data) {
  return `
    <div class="cv-section cv-header" data-section="header">
      <div class="cv-header-content">
        <h1 class="cv-name">${data.fullName || 'Votre Nom'}</h1>
        <h2 class="cv-title">${data.jobTitle || 'Votre Titre'}</h2>
        <div class="cv-contact">
          ${data.email ? `<span class="cv-contact-item">📧 ${data.email}</span>` : ''}
          ${data.phone ? `<span class="cv-contact-item">📱 ${data.phone}</span>` : ''}
          ${data.address ? `<span class="cv-contact-item">📍 ${data.address}</span>` : ''}
          ${data.linkedin ? `<span class="cv-contact-item">💼 <a href="${data.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
          ${data.website ? `<span class="cv-contact-item">🌐 <a href="${data.website}" target="_blank">Portfolio</a></span>` : ''}
          ${data.github ? `<span class="cv-contact-item">💻 <a href="${data.github}" target="_blank">GitHub</a></span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function generateSummary(data) {
  if (!data.summary) return '';
  
  return `
    <div class="cv-section cv-summary" data-section="summary">
      <h3 class="cv-section-title">Résumé Professionnel</h3>
      <p class="cv-summary-text">${data.summary}</p>
    </div>
  `;
}

function generateExperience(data) {
  if (!data.experiences || data.experiences.length === 0) return '';
  
  const experiencesHtml = data.experiences.map(exp => `
    <div class="cv-experience-item">
      <div class="cv-experience-header">
        <h4 class="cv-experience-title">${exp.title}</h4>
        <span class="cv-experience-period">${formatDate(exp.startDate)} - ${exp.current ? 'Présent' : formatDate(exp.endDate)}</span>
      </div>
      <div class="cv-experience-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
      <div class="cv-experience-description">${formatDescription(exp.description)}</div>
      ${exp.technologies && exp.technologies.length > 0 ? `
        <div class="cv-technologies">
          ${exp.technologies.map(tech => `<span class="cv-tech-tag">${tech}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
  
  return `
    <div class="cv-section cv-experience" data-section="experience">
      <h3 class="cv-section-title">Expérience Professionnelle</h3>
      ${experiencesHtml}
    </div>
  `;
}

function generateEducation(data) {
  if (!data.education || data.education.length === 0) return '';
  
  const educationHtml = data.education.map(edu => `
    <div class="cv-education-item">
      <div class="cv-education-header">
        <h4 class="cv-education-degree">${edu.degree}</h4>
        <span class="cv-education-period">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
      </div>
      <div class="cv-education-school">${edu.school}${edu.location ? ` • ${edu.location}` : ''}</div>
      ${edu.grade ? `<div class="cv-education-grade">${edu.grade}</div>` : ''}
      ${edu.description ? `<div class="cv-education-description">${edu.description}</div>` : ''}
    </div>
  `).join('');
  
  return `
    <div class="cv-section cv-education" data-section="education">
      <h3 class="cv-section-title">Formation</h3>
      ${educationHtml}
    </div>
  `;
}

function generateSkills(data) {
  const technicalSkills = data.technicalSkills || [];
  const softSkills = data.softSkills || [];
  
  if (technicalSkills.length === 0 && softSkills.length === 0) return '';
  
  let skillsHtml = '';
  
  if (technicalSkills.length > 0) {
    skillsHtml += `
      <div class="cv-skills-category">
        <h4>Compétences Techniques</h4>
        <div class="cv-skills-list">
          ${technicalSkills.map(skill => `
            <div class="cv-skill-item">
              <span class="cv-skill-name">${skill.name}</span>
              <div class="cv-skill-bar">
                <div class="cv-skill-progress" style="width: ${skill.level}%"></div>
              </div>
              <span class="cv-skill-level">${skill.level}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  if (softSkills.length > 0) {
    skillsHtml += `
      <div class="cv-skills-category">
        <h4>Compétences Transversales</h4>
        <div class="cv-skills-list">
          ${softSkills.map(skill => `
            <div class="cv-skill-item">
              <span class="cv-skill-name">${skill.name}</span>
              <div class="cv-skill-bar">
                <div class="cv-skill-progress" style="width: ${skill.level}%"></div>
              </div>
              <span class="cv-skill-level">${skill.level}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  return `
    <div class="cv-section cv-skills" data-section="skills">
      <h3 class="cv-section-title">Compétences</h3>
      ${skillsHtml}
    </div>
  `;
}

function generateLanguages(data) {
  if (!data.languages || data.languages.length === 0) return '';
  
  const languagesHtml = data.languages.map(lang => `
    <div class="cv-language-item">
      <span class="cv-language-name">${lang.name}</span>
      <span class="cv-language-level">${lang.level}</span>
    </div>
  `).join('');
  
  return `
    <div class="cv-section cv-languages" data-section="languages">
      <h3 class="cv-section-title">Langues</h3>
      <div class="cv-languages-list">
        ${languagesHtml}
      </div>
    </div>
  `;
}

function generateCertifications(data) {
  if (!data.certifications || data.certifications.length === 0) return '';
  
  const certificationsHtml = data.certifications.map(cert => `
    <div class="cv-certification-item">
      <div class="cv-certification-name">${cert.name}</div>
      <div class="cv-certification-details">
        ${cert.issuer} • ${formatDate(cert.date)}
        ${cert.url ? ` • <a href="${cert.url}" target="_blank">Vérifier</a>` : ''}
      </div>
    </div>
  `).join('');
  
  return `
    <div class="cv-section cv-certifications" data-section="certifications">
      <h3 class="cv-section-title">Certifications</h3>
      ${certificationsHtml}
    </div>
  `;
}

function generateProjects(data) {
  if (!data.projects || data.projects.length === 0) return '';
  
  const projectsHtml = data.projects.map(project => `
    <div class="cv-project-item">
      <div class="cv-project-header">
        <h4 class="cv-project-name">${project.name}</h4>
        <span class="cv-project-period">${formatDate(project.startDate)} - ${formatDate(project.endDate)}</span>
      </div>
      <div class="cv-project-description">${project.description}</div>
      ${project.technologies && project.technologies.length > 0 ? `
        <div class="cv-technologies">
          ${project.technologies.map(tech => `<span class="cv-tech-tag">${tech}</span>`).join('')}
        </div>
      ` : ''}
      ${project.url ? `<div class="cv-project-url"><a href="${project.url}" target="_blank">Voir le projet</a></div>` : ''}
    </div>
  `).join('');
  
  return `
    <div class="cv-section cv-projects" data-section="projects">
      <h3 class="cv-section-title">Projets</h3>
      ${projectsHtml}
    </div>
  `;
}

// DRAG & DROP
function initDragAndDrop() {
  console.log('Initializing drag & drop...');
  
  // Nettoyer les instances existantes
  sortableInstances.forEach(instance => instance.destroy());
  sortableInstances = [];
  
  const cvContainer = document.getElementById('cv-container');
  if (cvContainer && editMode) {
    const sortable = Sortable.create(cvContainer, {
      animation: 150,
      ghostClass: 'cv-section-ghost',
      chosenClass: 'cv-section-chosen',
      dragClass: 'cv-section-drag',
      onEnd: function(evt) {
        console.log('Section moved from', evt.oldIndex, 'to', evt.newIndex);
        // Ici on pourrait sauvegarder l'ordre des sections
      }
    });
    sortableInstances.push(sortable);
  }
}

function toggleEditMode() {
  editMode = !editMode;
  const button = document.getElementById('btnToggleEdit');
  const cvSections = document.querySelectorAll('.cv-section');
  
  if (editMode) {
    button.textContent = 'Mode Lecture';
    button.classList.add('active');
    cvSections.forEach(section => {
      section.classList.add('editable');
      section.title = 'Glissez pour réorganiser';
    });
    initDragAndDrop();
  } else {
    button.textContent = 'Mode Édition';
    button.classList.remove('active');
    cvSections.forEach(section => {
      section.classList.remove('editable');
      section.title = '';
    });
    // Détruire les instances de drag & drop
    sortableInstances.forEach(instance => instance.destroy());
    sortableInstances = [];
  }
}

// RÉCUPÉRATION DES DONNÉES DU FORMULAIRE
function getFormData() {
  const formData = new FormData(document.getElementById('cv-form'));
  const data = {};
  
  // Informations personnelles
  data.fullName = formData.get('fullName') || '';
  data.jobTitle = formData.get('jobTitle') || '';
  data.email = formData.get('email') || '';
  data.phone = formData.get('phone') || '';
  data.address = formData.get('address') || '';
  data.linkedin = formData.get('linkedin') || '';
  data.website = formData.get('website') || '';
  data.github = formData.get('github') || '';
  data.summary = formData.get('summary') || '';
  
  // Expériences
  data.experiences = [];
  const experienceElements = document.querySelectorAll('#experience-list .form-item');
  experienceElements.forEach((element, index) => {
    const exp = {
      title: formData.get(`experience[${index}][title]`) || '',
      company: formData.get(`experience[${index}][company]`) || '',
      location: formData.get(`experience[${index}][location]`) || '',
      startDate: formData.get(`experience[${index}][startDate]`) || '',
      endDate: formData.get(`experience[${index}][endDate]`) || '',
      current: formData.get(`experience[${index}][current]`) === 'on',
      description: formData.get(`experience[${index}][description]`) || '',
      technologies: (formData.get(`experience[${index}][technologies]`) || '').split(',').map(t => t.trim()).filter(t => t)
    };
    data.experiences.push(exp);
  });
  
  // Formation
  data.education = [];
  const educationElements = document.querySelectorAll('#education-list .form-item');
  educationElements.forEach((element, index) => {
    const edu = {
      degree: formData.get(`education[${index}][degree]`) || '',
      school: formData.get(`education[${index}][school]`) || '',
      location: formData.get(`education[${index}][location]`) || '',
      startDate: formData.get(`education[${index}][startDate]`) || '',
      endDate: formData.get(`education[${index}][endDate]`) || '',
      description: formData.get(`education[${index}][description]`) || '',
      grade: formData.get(`education[${index}][grade]`) || ''
    };
    data.education.push(edu);
  });
  
  // Compétences techniques
  data.technicalSkills = [];
  const technicalSkillElements = document.querySelectorAll('#technical-skills .skill-item');
  technicalSkillElements.forEach((element, index) => {
    const skill = {
      name: formData.get(`technicalSkills[${index}][name]`) || '',
      level: parseInt(formData.get(`technicalSkills[${index}][level]`)) || 0
    };
    if (skill.name) data.technicalSkills.push(skill);
  });
  
  // Compétences transversales
  data.softSkills = [];
  const softSkillElements = document.querySelectorAll('#soft-skills .skill-item');
  softSkillElements.forEach((element, index) => {
    const skill = {
      name: formData.get(`softSkills[${index}][name]`) || '',
      level: parseInt(formData.get(`softSkills[${index}][level]`)) || 0
    };
    if (skill.name) data.softSkills.push(skill);
  });
  
  // Langues
  data.languages = [];
  const languageElements = document.querySelectorAll('#languages-list .form-item');
  languageElements.forEach((element, index) => {
    const lang = {
      name: formData.get(`languages[${index}][name]`) || '',
      level: formData.get(`languages[${index}][level]`) || ''
    };
    if (lang.name) data.languages.push(lang);
  });
  
  // Certifications
  data.certifications = [];
  const certificationElements = document.querySelectorAll('#certifications-list .form-item');
  certificationElements.forEach((element, index) => {
    const cert = {
      name: formData.get(`certifications[${index}][name]`) || '',
      issuer: formData.get(`certifications[${index}][issuer]`) || '',
      date: formData.get(`certifications[${index}][date]`) || '',
      url: formData.get(`certifications[${index}][url]`) || ''
    };
    if (cert.name) data.certifications.push(cert);
  });
  
  // Projets
  data.projects = [];
  const projectElements = document.querySelectorAll('#projects-list .form-item');
  projectElements.forEach((element, index) => {
    const project = {
      name: formData.get(`projects[${index}][name]`) || '',
      description: formData.get(`projects[${index}][description]`) || '',
      technologies: (formData.get(`projects[${index}][technologies]`) || '').split(',').map(t => t.trim()).filter(t => t),
      url: formData.get(`projects[${index}][url]`) || '',
      startDate: formData.get(`projects[${index}][startDate]`) || '',
      endDate: formData.get(`projects[${index}][endDate]`) || ''
    };
    if (project.name) data.projects.push(project);
  });
  
  return data;
}

// FONCTIONS UTILITAIRES DE FORMATAGE
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
}

function formatDescription(description) {
  if (!description) return '';
  return description.split('\n').map(line => {
    if (line.trim().startsWith('•')) {
      return `<div class="cv-bullet-point">${line.trim()}</div>`;
    }
    return `<div>${line.trim()}</div>`;
  }).join('');
}

// FONCTIONS IA (PLACEHOLDERS)
function autoFillWithAI() {
  console.log('Auto-fill with AI - Feature to implement');
  alert('Fonctionnalité IA à implémenter - Nécessite une clé API Gemini');
}

function generateSummaryAI() {
  console.log('Generate summary with AI - Feature to implement');
  alert('Fonctionnalité IA à implémenter - Nécessite une clé API Gemini');
}

function suggestSkillsAI() {
  console.log('Suggest skills with AI - Feature to implement');
  alert('Fonctionnalité IA à implémenter - Nécessite une clé API Gemini');
}

function generateFullCVWithAI() {
  console.log('Generate full CV with AI - Feature to implement');
  alert('Fonctionnalité IA à implémenter - Nécessite une clé API Gemini');
}

function analyzeCVWithAI() {
  console.log('Analyze CV with AI - Feature to implement');
  alert('Fonctionnalité IA à implémenter - Nécessite une clé API Gemini');
}

function improveWithAI(button) {
  console.log('Improve text with AI - Feature to implement');
  alert('Fonctionnalité IA à implémenter - Nécessite une clé API Gemini');
}

// EXPORT PDF
function exportToPDF() {
  console.log('Exporting to PDF...');
  
  const cvContainer = document.getElementById('cv-container');
  if (!cvContainer) {
    alert('Erreur: Impossible de trouver le contenu du CV');
    return;
  }
  
  // Utiliser html2canvas et jsPDF pour l'export
  html2canvas(cvContainer, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    const fileName = `CV_${getFormData().fullName.replace(/\s+/g, '_') || 'CV'}.pdf`;
    pdf.save(fileName);
  }).catch(error => {
    console.error('Erreur lors de l\'export PDF:', error);
    alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
  });
}