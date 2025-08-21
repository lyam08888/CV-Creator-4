// CV Creator App - Version complète avec drag & drop
console.log('CV Creator App loaded');

// Import du module IA
import { runAI } from './ai.js';

// Import du module de personnalisation
import { initCustomization, applyCurrentCustomization } from './customization.js';

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
  loadSavedApiKey();
  populateExampleData();
  generatePreview();
  
  // Initialiser la personnalisation de manière asynchrone
  initCustomizationAsync();
  
  // Écouter l'événement de régénération depuis la personnalisation
  window.addEventListener('regeneratePreview', () => {
    generatePreview();
  });
  
  console.log('CV Creator initialized successfully');
});

// INITIALISATION DE L'APERÇU
function initPreview() {
  console.log('Initializing preview...');
  
  // S'assurer que le conteneur d'aperçu existe
  const previewContainer = document.getElementById('cv-preview');
  if (!previewContainer) {
    console.error('Preview container not found');
    return;
  }
  
  // Initialiser avec un aperçu vide
  previewContainer.innerHTML = `
    <div class="cv-page">
      <div class="cv-section" data-section="header">
        <div class="cv-header">
          <h1 class="cv-name">Votre Nom</h1>
          <h2 class="cv-title">Votre Titre</h2>
          <div class="cv-contact">
            <span>email@exemple.com</span>
            <span>+33 6 12 34 56 78</span>
          </div>
        </div>
      </div>
      <div class="cv-section" data-section="summary">
        <h3 class="cv-section-title">Résumé Professionnel</h3>
        <p>Commencez à remplir le formulaire pour voir votre CV prendre forme...</p>
      </div>
    </div>
  `;
  
  // Initialiser le drag & drop pour l'aperçu
  initDragAndDrop();
  
  console.log('Preview initialized');
}

// FONCTION POUR INITIALISER LA PERSONNALISATION DE MANIÈRE ASYNCHRONE
async function initCustomizationAsync() {
  try {
    const customizationModule = await import('./customization.js');
    if (customizationModule.initCustomization) {
      customizationModule.initCustomization();
      console.log('Customization module loaded successfully');
    }
  } catch (error) {
    console.warn('Customization module not available:', error);
    // Continuer sans la personnalisation
  }
}

// Charger la clé API sauvegardée
function loadSavedApiKey() {
  const savedApiKey = localStorage.getItem('cvpro_api_key');
  if (savedApiKey) {
    document.getElementById('geminiApiKey').value = savedApiKey;
    console.log('Clé API Gemini chargée depuis le localStorage');
  }
}

// NAVIGATION
function initNavigation() {
  console.log('Initializing navigation...');
  
  const navButtons = document.querySelectorAll('.nav-btn');
  const formSections = document.querySelectorAll('.form-section');
  
  console.log(`Found ${navButtons.length} navigation buttons`);
  console.log(`Found ${formSections.length} form sections`);
  
  if (navButtons.length === 0) {
    console.error('❌ Aucun bouton de navigation trouvé');
    return;
  }
  
  navButtons.forEach(function(button, index) {
    const targetId = button.getAttribute('data-form');
    console.log(`Setting up button ${index + 1}: ${targetId}`);
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log(`Navigation clicked: ${targetId}`);
      
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
        console.log(`✓ Section ${targetId} affichée`);
      } else {
        console.error(`❌ Section ${targetId} non trouvée`);
      }
    });
  });
  
  // Initialize first section
  const firstSection = document.getElementById('personal-info');
  if (firstSection) {
    firstSection.style.display = 'block';
    firstSection.classList.add('active');
    console.log('✓ Section personal-info initialisée');
  } else {
    console.error('❌ Section personal-info non trouvée');
  }
  
  console.log('Navigation initialization completed');
}

// GESTIONNAIRES DE FORMULAIRES
function initFormHandlers() {
  console.log('Initializing form handlers...');
  
  // Fonction utilitaire pour ajouter un listener de manière sécurisée
  function addSafeListener(id, event, handler) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener(event, handler);
      console.log(`✓ Listener ajouté pour ${id}`);
    } else {
      console.warn(`⚠️ Élément ${id} non trouvé`);
    }
  }
  
  // Boutons d'ajout
  addSafeListener('btnAddExperience', 'click', addExperience);
  addSafeListener('btnAddEducation', 'click', addEducation);
  addSafeListener('btnAddTechnicalSkill', 'click', addTechnicalSkill);
  addSafeListener('btnAddSoftSkill', 'click', addSoftSkill);
  addSafeListener('btnAddLanguage', 'click', addLanguage);
  addSafeListener('btnAddCertification', 'click', addCertification);
  addSafeListener('btnAddProject', 'click', addProject);
  
  // Boutons d'action
  addSafeListener('btnAutoFillAI', 'click', autoFillWithAI);
  addSafeListener('btnGenerateSummaryAI', 'click', generateSummaryAI);
  addSafeListener('btnSuggestSkillsAI', 'click', suggestSkillsAI);
  addSafeListener('btnGenerateIA', 'click', generateFullCVWithAI);
  addSafeListener('btnExport', 'click', exportToPDF);
  addSafeListener('btnAnalyzeCVAI', 'click', analyzeCVWithAI);
  addSafeListener('btnToggleEdit', 'click', toggleEditMode);
  addSafeListener('btnSaveApiKey', 'click', saveApiKey);
  addSafeListener('btnNewCV', 'click', createNewCV);
  addSafeListener('btnResetToDemo', 'click', loadDemoData);
  addSafeListener('btnLoadDemo', 'click', loadDemoData);
  
  // Gestionnaires pour la bannière de recrutement
  initRecruitmentBannerHandlers();
  
  // Écouter les changements dans le formulaire pour mettre à jour l'aperçu
  const cvForm = document.getElementById('cv-form');
  if (cvForm) {
    cvForm.addEventListener('input', debounce(generatePreview, 500));
    console.log('✓ Listener ajouté pour cv-form');
  } else {
    console.warn('⚠️ Formulaire cv-form non trouvé');
  }
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

function generatePreview() {
  console.log('Generating preview...');
  
  const formData = getFormData();
  
  // Utiliser le nouveau système de génération avec pagination
  import('./preview.js').then(module => {
    if (module.generatePreview) {
      module.generatePreview(formData);
      
      // Réinitialiser le mode édition si actif
      if (editMode) {
        setTimeout(() => {
          const editableElements = document.querySelectorAll('[contenteditable]');
          editableElements.forEach(element => {
            element.setAttribute('contenteditable', 'true');
          });
        }, 100);
      }
    }
  }).catch(error => {
    console.error('Erreur lors du chargement du module preview:', error);
    // Fallback vers l'ancien système
    generatePreviewFallback(formData);
  });
}

// Fonction de fallback pour la génération d'aperçu
function generatePreviewFallback(formData) {
  const previewContainer = document.getElementById('cv-preview');

  // Construire la liste des sections disponibles
  const sections = [
    { type: 'header', content: generateHeader(formData) },
    { type: 'summary', content: generateSummary(formData) },
    { type: 'experience', content: generateExperience(formData) },
    { type: 'education', content: generateEducation(formData) },
    { type: 'skills', content: generateSkills(formData) },
    { type: 'languages', content: generateLanguages(formData) },
    { type: 'certifications', content: generateCertifications(formData) },
    { type: 'projects', content: generateProjects(formData) }
  ].filter(section => section.content && section.content.trim() !== '');

  // Appliquer l'ordre sauvegardé des sections si disponible
  const savedOrder = JSON.parse(localStorage.getItem('cv-section-order') || '[]');
  if (savedOrder.length > 0) {
    sections.sort((a, b) => {
      const indexA = savedOrder.indexOf(a.type);
      const indexB = savedOrder.indexOf(b.type);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }

  previewContainer.innerHTML = `
    <div class="cv-page" data-page="1">
      ${sections.map(section => section.content).join('')}
      <div class="page-number">Page 1</div>
    </div>
  `;

  // Initialiser le drag & drop après la génération
  initializeDragAndDrop();

  // Appliquer la personnalisation
  if (window.applyCurrentCustomization) {
    window.applyCurrentCustomization();
  }
}

function generateHeader(data) {
  return `
    <div class="cv-section cv-header sortable" data-section="header">
      <div class="drag-handle">⋮⋮</div>
      <div class="cv-header-content">
        <h1 class="cv-name" contenteditable="false">${data.fullName || 'Votre Nom'}</h1>
        <h2 class="cv-title" contenteditable="false">${data.jobTitle || 'Votre Titre'}</h2>
        <div class="cv-contact">
          ${data.email ? `<span class="cv-contact-item" contenteditable="false">📧 ${data.email}</span>` : ''}
          ${data.phone ? `<span class="cv-contact-item" contenteditable="false">📱 ${data.phone}</span>` : ''}
          ${data.address ? `<span class="cv-contact-item" contenteditable="false">📍 ${data.address}</span>` : ''}
          ${data.linkedin ? `<span class="cv-contact-item" contenteditable="false">💼 <a href="${data.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
          ${data.website ? `<span class="cv-contact-item" contenteditable="false">🌐 <a href="${data.website}" target="_blank">Portfolio</a></span>` : ''}
          ${data.github ? `<span class="cv-contact-item" contenteditable="false">💻 <a href="${data.github}" target="_blank">GitHub</a></span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function generateSummary(data) {
  if (!data.summary) return '';
  
  return `
    <div class="cv-section cv-summary sortable" data-section="summary">
      <div class="drag-handle">⋮⋮</div>
      <h3 class="cv-section-title" contenteditable="false">Résumé Professionnel</h3>
      <p class="cv-summary-text" contenteditable="false">${data.summary}</p>
    </div>
  `;
}

function generateExperience(data) {
  if (!data.experiences || data.experiences.length === 0) return '';
  
  const experiencesHtml = data.experiences.map(exp => `
    <div class="cv-experience-item">
      <div class="cv-experience-header">
        <h4 class="cv-experience-title" contenteditable="false">${exp.title}</h4>
        <span class="cv-experience-period" contenteditable="false">${formatDate(exp.startDate)} - ${exp.current ? 'Présent' : formatDate(exp.endDate)}</span>
      </div>
      <div class="cv-experience-company" contenteditable="false">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
      <div class="cv-experience-description" contenteditable="false">${formatDescription(exp.description)}</div>
      ${exp.technologies && exp.technologies.length > 0 ? `
        <div class="cv-technologies">
          ${exp.technologies.map(tech => `<span class="cv-tech-tag" contenteditable="false">${tech}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
  
  return `
    <div class="cv-section cv-experience sortable" data-section="experience">
      <div class="drag-handle">⋮⋮</div>
      <h3 class="cv-section-title" contenteditable="false">Expérience Professionnelle</h3>
      ${experiencesHtml}
    </div>
  `;
}

function generateEducation(data) {
  if (!data.education || data.education.length === 0) return '';
  
  const educationHtml = data.education.map(edu => `
    <div class="cv-education-item">
      <div class="cv-education-header">
        <h4 class="cv-education-degree" contenteditable="false">${edu.degree}</h4>
        <span class="cv-education-period" contenteditable="false">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
      </div>
      <div class="cv-education-school" contenteditable="false">${edu.school}${edu.location ? ` • ${edu.location}` : ''}</div>
      ${edu.grade ? `<div class="cv-education-grade" contenteditable="false">${edu.grade}</div>` : ''}
      ${edu.description ? `<div class="cv-education-description" contenteditable="false">${edu.description}</div>` : ''}
    </div>
  `).join('');
  
  return `
    <div class="cv-section cv-education sortable" data-section="education">
      <div class="drag-handle">⋮⋮</div>
      <h3 class="cv-section-title" contenteditable="false">Formation</h3>
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
  const cvPreview = document.getElementById('cv-preview');
  const editableElements = document.querySelectorAll('[contenteditable]');
  
  if (editMode) {
    button.textContent = 'Mode Lecture';
    button.classList.add('active');
    cvPreview.classList.add('edit-mode');
    
    // Activer l'édition directe
    editableElements.forEach(element => {
      element.setAttribute('contenteditable', 'true');
    });
    
    // Ajouter les gestionnaires d'événements pour sauvegarder les modifications
    editableElements.forEach(element => {
      element.addEventListener('blur', saveDirectEdit);
      element.addEventListener('keydown', handleEditKeydown);
    });
    
    initDragAndDrop();
  } else {
    button.textContent = 'Mode Édition';
    button.classList.remove('active');
    cvPreview.classList.remove('edit-mode');
    
    // Désactiver l'édition directe
    editableElements.forEach(element => {
      element.setAttribute('contenteditable', 'false');
      element.removeEventListener('blur', saveDirectEdit);
      element.removeEventListener('keydown', handleEditKeydown);
    });
    
    // Détruire les instances de drag & drop
    sortableInstances.forEach(instance => instance.destroy());
    sortableInstances = [];
  }
}

function saveDirectEdit(event) {
  // Sauvegarder les modifications dans le localStorage ou synchroniser avec le formulaire
  const element = event.target;
  const section = element.closest('[data-section]');
  if (section) {
    const sectionType = section.dataset.section;
    const content = element.innerHTML;
    localStorage.setItem(`cv-edit-${sectionType}-${element.tagName.toLowerCase()}`, content);
  }
}

function handleEditKeydown(event) {
  // Gérer les raccourcis clavier en mode édition
  if (event.ctrlKey || event.metaKey) {
    switch(event.key) {
      case 's':
        event.preventDefault();
        saveDirectEdit(event);
        break;
      case 'z':
        if (event.shiftKey) {
          document.execCommand('redo');
        } else {
          document.execCommand('undo');
        }
        event.preventDefault();
        break;
    }
  }
}

function initializeDragAndDrop() {
  const cvContainer = document.getElementById('cv-container');
  
  if (window.Sortable && cvContainer) {
    // Détruire l'instance existante si elle existe
    if (cvContainer.sortableInstance) {
      cvContainer.sortableInstance.destroy();
    }
    
    // Créer une nouvelle instance Sortable
    cvContainer.sortableInstance = Sortable.create(cvContainer, {
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
  console.log('Section order saved:', order);
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
  
  // Données de la bannière de recrutement
  data.showRecruitmentBanner = document.getElementById('showRecruitmentBanner')?.checked || false;
  data.recruiterFirstName = document.getElementById('recruiterFirstName')?.value || '';
  data.recruiterLastName = document.getElementById('recruiterLastName')?.value || '';
  data.recruiterPosition = document.getElementById('recruiterPosition')?.value || '';
  data.recruiterPhone = document.getElementById('recruiterPhone')?.value || '';
  data.recruiterEmail = document.getElementById('recruiterEmail')?.value || '';
  data.companyName = document.getElementById('companyName')?.value || '';
  data.companyLogoUrl = document.getElementById('companyLogoUrl')?.value || '';
  data.bannerImageUrl = document.getElementById('bannerImageUrl')?.value || '';
  data.bannerMessage = document.getElementById('bannerMessage')?.value || '';
  data.bannerStyle = document.getElementById('bannerStyle')?.value || 'modern';
  data.bannerColor = document.getElementById('bannerColor')?.value || '#3B82F6';
  data.bannerHeight = document.getElementById('bannerHeight')?.value || '50';
  
  return data;
}

// FONCTIONS UTILITAIRES DE FORMATAGE
function formatDate(dateString) {
  if (!dateString) return '';
  // Support "YYYY-MM" as well as full date strings like "YYYY-MM-DD"
  const normalized = dateString.length > 7 ? dateString.slice(0, 7) : dateString;
  const date = new Date(normalized + '-01');
  if (isNaN(date)) return '';
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

// Parse a period string like "Mars 2021 - Présent" or "Janvier 2019 - Février 2021"
// and return an object with startDate/endDate in YYYY-MM format and a current flag.
function parsePeriodString(period) {
  if (!period) return { startDate: '', endDate: '', current: false };
  const months = {
    'janvier': '01',
    'février': '02', 'fevrier': '02',
    'mars': '03',
    'avril': '04',
    'mai': '05',
    'juin': '06',
    'juillet': '07',
    'août': '08', 'aout': '08',
    'septembre': '09',
    'octobre': '10',
    'novembre': '11',
    'décembre': '12', 'decembre': '12'
  };

  const parts = period.split('-').map(p => p.trim());
  const startMatch = parts[0]?.match(/([a-zA-Zéû]+)\s*(\d{4})/i);
  let startDate = '';
  if (startMatch) {
    const month = months[startMatch[1].toLowerCase()] || '01';
    startDate = `${startMatch[2]}-${month}`;
  }

  let endDate = '';
  let current = false;
  if (parts[1]) {
    if (/présent|present/i.test(parts[1])) {
      current = true;
    } else {
      const endMatch = parts[1].match(/([a-zA-Zéû]+)\s*(\d{4})/i);
      if (endMatch) {
        const month = months[endMatch[1].toLowerCase()] || '01';
        endDate = `${endMatch[2]}-${month}`;
      }
    }
  }

  return { startDate, endDate, current };
}

function normalizeMonth(dateStr) {
  if (!dateStr) return '';
  const match = dateStr.match(/\d{4}-\d{2}/);
  return match ? match[0] : '';
}

// GESTION DE LA CLÉ API
function saveApiKey() {
  const apiKeyInput = document.getElementById('geminiApiKey');
  const apiKey = apiKeyInput.value.trim();
  
  if (!apiKey) {
    alert('Veuillez saisir une clé API Gemini valide.');
    return;
  }
  
  // Sauvegarder dans localStorage
  localStorage.setItem('cvpro_api_key', apiKey);
  
  // Feedback visuel
  const button = document.getElementById('btnSaveApiKey');
  const originalText = button.textContent;
  button.textContent = '✓ Sauvegardée';
  button.style.backgroundColor = '#10b981';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.backgroundColor = '';
  }, 2000);
  
  console.log('Clé API Gemini sauvegardée');
}

// FONCTIONS IA COMPLÈTES
async function autoFillWithAI() {
  console.log('Auto-fill with AI...');
  
  const rawText = document.getElementById('rawInfoText').value.trim();
  if (!rawText) {
    alert('Veuillez coller les informations brutes du candidat dans le champ prévu à cet effet.');
    return;
  }
  
  const button = document.getElementById('btnAutoFillAI');
  const originalText = button.textContent;
  button.textContent = 'Traitement en cours...';
  button.disabled = true;
  
  try {
    const prompt = `
Analyse ce texte contenant les informations d'un candidat et extrait les données structurées pour remplir un formulaire de CV.
Retourne UNIQUEMENT un objet JSON valide avec cette structure exacte :

{
  "fullName": "Nom complet du candidat",
  "jobTitle": "Titre du poste recherché ou actuel",
  "email": "adresse@email.com",
  "phone": "+33 X XX XX XX XX",
  "address": "Adresse complète",
  "linkedin": "URL LinkedIn si mentionnée",
  "website": "URL site web/portfolio si mentionné",
  "github": "URL GitHub si mentionnée",
  "summary": "Résumé professionnel de 2-3 phrases",
  "experiences": [
    {
      "title": "Titre du poste",
      "company": "Nom de l'entreprise",
      "location": "Lieu",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM ou vide si actuel",
      "current": true/false,
      "description": "Description des missions",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "education": [
    {
      "degree": "Nom du diplôme",
      "school": "Nom de l'école",
      "location": "Lieu",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "Description optionnelle",
      "grade": "Mention si mentionnée"
    }
  ],
  "technicalSkills": [
    {"name": "Compétence", "level": 85}
  ],
  "softSkills": [
    {"name": "Compétence transversale", "level": 90}
  ],
  "languages": [
    {"name": "Français", "level": "Natif"}
  ],
  "certifications": [
    {
      "name": "Nom de la certification",
      "issuer": "Organisme",
      "date": "YYYY-MM",
      "url": "URL si mentionnée"
    }
  ],
  "projects": [
    {
      "name": "Nom du projet",
      "description": "Description",
      "technologies": ["Tech1", "Tech2"],
      "url": "URL si mentionnée",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }
  ]
}

Texte à analyser :
${rawText}
`;

    const result = await runAI({
      action: 'auto-fill-cv',
      prompt: prompt
    });
    
    if (result) {
      try {
        // Nettoyer le résultat pour extraire le JSON
        let jsonStr = result.trim();
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
        }
        if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
        }
        
        const data = JSON.parse(jsonStr);
        
        // Remplir le formulaire avec les données extraites
        fillFormWithData(data);
        
        alert('Formulaire rempli automatiquement avec succès !');
        generatePreview();
        
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        console.log('Résultat brut:', result);
        alert('Erreur lors de l\'analyse des données. Veuillez réessayer.');
      }
    }
    
  } catch (error) {
    console.error('Erreur Auto-fill AI:', error);
    alert('Erreur lors du traitement automatique. Vérifiez votre clé API.');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

async function generateSummaryAI() {
  console.log('Generate summary with AI...');
  
  const formData = getFormData();
  if (!formData.fullName || !formData.jobTitle) {
    alert('Veuillez remplir au moins le nom et le titre du poste pour générer un résumé.');
    return;
  }
  
  const button = document.getElementById('btnGenerateSummaryAI');
  const originalText = button.textContent;
  button.textContent = 'Génération...';
  button.disabled = true;
  
  try {
    const prompt = `
Génère un résumé professionnel percutant de 2-3 phrases pour ce profil :

Nom: ${formData.fullName}
Titre: ${formData.jobTitle}
Expériences: ${formData.experiences ? formData.experiences.map(exp => `${exp.title} chez ${exp.company}`).join(', ') : 'Non spécifiées'}
Compétences techniques: ${formData.technicalSkills ? formData.technicalSkills.map(skill => skill.name).join(', ') : 'Non spécifiées'}

Le résumé doit :
- Être professionnel et impactant
- Mettre en valeur les points forts
- Être adapté au poste recherché
- Faire environ 50-80 mots
- Être en français

Retourne UNIQUEMENT le texte du résumé, sans guillemets ni formatage.
`;

    const result = await runAI({
      action: 'generate-summary',
      prompt: prompt
    });
    
    if (result) {
      document.getElementById('summary-text').value = result.trim();
      generatePreview();
      alert('Résumé généré avec succès !');
    }
    
  } catch (error) {
    console.error('Erreur Generate Summary AI:', error);
    alert('Erreur lors de la génération du résumé. Vérifiez votre clé API.');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

async function suggestSkillsAI() {
  console.log('Suggest skills with AI...');
  
  const formData = getFormData();
  if (!formData.jobTitle) {
    alert('Veuillez remplir le titre du poste pour obtenir des suggestions de compétences.');
    return;
  }
  
  const button = document.getElementById('btnSuggestSkillsAI');
  const originalText = button.textContent;
  button.textContent = 'Suggestion...';
  button.disabled = true;
  
  try {
    const prompt = `
Suggère des compétences techniques et transversales pertinentes pour le poste de "${formData.jobTitle}".

Retourne UNIQUEMENT un objet JSON avec cette structure :
{
  "technicalSkills": [
    {"name": "Nom de la compétence", "level": 75}
  ],
  "softSkills": [
    {"name": "Nom de la compétence transversale", "level": 80}
  ]
}

Critères :
- 8-12 compétences techniques maximum
- 5-8 compétences transversales maximum
- Niveaux entre 60 et 95
- Compétences réellement pertinentes pour le poste
- Noms en français
`;

    const result = await runAI({
      action: 'suggest-skills',
      prompt: prompt
    });
    
    if (result) {
      try {
        let jsonStr = result.trim();
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
        }
        
        const skills = JSON.parse(jsonStr);
        
        // Ajouter les compétences techniques
        if (skills.technicalSkills) {
          skills.technicalSkills.forEach(skill => {
            addTechnicalSkill(skill);
          });
        }
        
        // Ajouter les compétences transversales
        if (skills.softSkills) {
          skills.softSkills.forEach(skill => {
            addSoftSkill(skill);
          });
        }
        
        generatePreview();
        alert('Compétences suggérées ajoutées avec succès !');
        
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        alert('Erreur lors de l\'analyse des suggestions. Veuillez réessayer.');
      }
    }
    
  } catch (error) {
    console.error('Erreur Suggest Skills AI:', error);
    alert('Erreur lors de la suggestion de compétences. Vérifiez votre clé API.');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

async function generateFullCVWithAI() {
  console.log('Generate full CV with AI...');
  
  const rawText = document.getElementById('rawInfoText').value.trim();
  if (!rawText) {
    alert('Veuillez coller les informations brutes du candidat pour générer un CV complet.');
    return;
  }
  
  const button = document.getElementById('btnGenerateIA');
  const originalText = button.textContent;
  button.textContent = 'Génération complète...';
  button.disabled = true;
  
  try {
    // Utiliser la même logique que autoFillWithAI mais avec un prompt plus complet
    await autoFillWithAI();
    
    // Puis générer un résumé
    setTimeout(async () => {
      await generateSummaryAI();
    }, 1000);
    
    alert('CV complet généré avec succès !');
    
  } catch (error) {
    console.error('Erreur Generate Full CV AI:', error);
    alert('Erreur lors de la génération complète. Vérifiez votre clé API.');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

async function analyzeCVWithAI() {
  console.log('Analyze CV with AI...');
  
  const formData = getFormData();
  if (!formData.fullName || !formData.jobTitle) {
    alert('Veuillez remplir au moins les informations de base pour analyser le CV.');
    return;
  }
  
  const button = document.getElementById('btnAnalyzeCVAI');
  const originalText = button.textContent;
  button.textContent = 'Analyse...';
  button.disabled = true;
  
  try {
    const cvText = document.getElementById('cv-preview').innerText;
    
    const prompt = `
Analyse ce CV et fournis des recommandations d'amélioration :

${cvText}

Fournis une analyse structurée avec :
1. Points forts du CV
2. Points à améliorer
3. Suggestions concrètes
4. Note globale sur 10

Sois constructif et professionnel.
`;

    const result = await runAI({
      action: 'analyze-cv',
      prompt: prompt
    });
    
    if (result) {
      // Afficher l'analyse dans une modal ou alert
      const analysisWindow = window.open('', '_blank', 'width=600,height=400');
      analysisWindow.document.write(`
        <html>
          <head><title>Analyse du CV</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Analyse de votre CV</h2>
            <div style="white-space: pre-wrap; line-height: 1.6;">${result}</div>
            <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px;">Fermer</button>
          </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('Erreur Analyze CV AI:', error);
    alert('Erreur lors de l\'analyse du CV. Vérifiez votre clé API.');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

async function improveWithAI(button) {
  console.log('Improve text with AI...');
  
  const textarea = button.previousElementSibling;
  const currentText = textarea.value.trim();
  
  if (!currentText) {
    alert('Veuillez saisir du texte à améliorer.');
    return;
  }
  
  const originalText = button.textContent;
  button.textContent = 'Amélioration...';
  button.disabled = true;
  
  try {
    const prompt = `
Améliore ce texte professionnel pour un CV :

"${currentText}"

Critères d'amélioration :
- Plus impactant et professionnel
- Utilise des verbes d'action
- Quantifie les résultats quand possible
- Garde le même sens mais améliore la formulation
- Reste concis et pertinent
- En français

Retourne UNIQUEMENT le texte amélioré, sans guillemets.
`;

    const result = await runAI({
      action: 'improve-text',
      prompt: prompt
    });
    
    if (result) {
      textarea.value = result.trim();
      generatePreview();
      alert('Texte amélioré avec succès !');
    }
    
  } catch (error) {
    console.error('Erreur Improve Text AI:', error);
    alert('Erreur lors de l\'amélioration du texte. Vérifiez votre clé API.');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

// FONCTION UTILITAIRE POUR REMPLIR LE FORMULAIRE
function fillFormWithData(data) {
  // Informations personnelles
  if (data.fullName) document.getElementById('fullName').value = data.fullName;
  if (data.jobTitle) document.getElementById('jobTitle').value = data.jobTitle;
  if (data.email) document.getElementById('email').value = data.email;
  if (data.phone) document.getElementById('phone').value = data.phone;
  if (data.address) document.getElementById('address').value = data.address;
  if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
  if (data.website) document.getElementById('website').value = data.website;
  if (data.github) document.getElementById('github').value = data.github;
  if (data.summary) document.getElementById('summary-text').value = data.summary;
  
  // Vider les listes existantes
  document.getElementById('experience-list').innerHTML = '';
  document.getElementById('education-list').innerHTML = '';
  document.getElementById('technical-skills').innerHTML = '';
  document.getElementById('soft-skills').innerHTML = '';
  document.getElementById('languages-list').innerHTML = '';
  document.getElementById('certifications-list').innerHTML = '';
  document.getElementById('projects-list').innerHTML = '';

  // Ajouter les expériences
  if (data.experiences) {
    data.experiences.forEach(exp => {
      if ((!exp.startDate || !exp.endDate) && exp.period) {
        const parsed = parsePeriodString(exp.period);
        exp.startDate = exp.startDate || parsed.startDate;
        exp.endDate = exp.endDate || parsed.endDate;
        if (parsed.current) exp.current = true;
      }
      exp.startDate = normalizeMonth(exp.startDate);
      exp.endDate = normalizeMonth(exp.endDate);
      addExperience(exp);
    });
  }

  // Ajouter les formations
  if (data.education) {
    data.education.forEach(edu => {
      if ((!edu.startDate || !edu.endDate) && edu.period) {
        const parsed = parsePeriodString(edu.period);
        edu.startDate = edu.startDate || parsed.startDate;
        edu.endDate = edu.endDate || parsed.endDate;
      }
      edu.startDate = normalizeMonth(edu.startDate);
      edu.endDate = normalizeMonth(edu.endDate);
      addEducation(edu);
    });
  }
  
  // Ajouter les compétences techniques
  if (data.technicalSkills) {
    data.technicalSkills.forEach(skill => addTechnicalSkill(skill));
  }
  
  // Ajouter les compétences transversales
  if (data.softSkills) {
    data.softSkills.forEach(skill => addSoftSkill(skill));
  }
  
  // Ajouter les langues
  if (data.languages) {
    data.languages.forEach(lang => addLanguage(lang));
  }
  
  // Ajouter les certifications
  if (data.certifications) {
    data.certifications.forEach(cert => addCertification(cert));
  }
  
  // Ajouter les projets
  if (data.projects) {
    data.projects.forEach(project => {
      if ((!project.startDate || !project.endDate) && project.period) {
        const parsed = parsePeriodString(project.period);
        project.startDate = project.startDate || parsed.startDate;
        project.endDate = project.endDate || parsed.endDate;
      }
      project.startDate = normalizeMonth(project.startDate);
      project.endDate = normalizeMonth(project.endDate);
      addProject(project);
    });
  }
}

// EXPORT PDF
function exportToPDF() {
  console.log('Exporting to PDF...');
  
  const cvPreview = document.getElementById('cv-preview');
  if (!cvPreview) {
    alert('Erreur: Impossible de trouver le contenu du CV');
    return;
  }
  
  // Afficher un indicateur de chargement
  const button = document.getElementById('btnExport');
  const originalText = button.textContent;
  button.textContent = 'Export en cours...';
  button.disabled = true;
  
  // Utiliser html2canvas et jsPDF pour l'export
  html2canvas(cvPreview, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: cvPreview.scrollWidth,
    height: cvPreview.scrollHeight
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
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
    
    const formData = getFormData();
    const fileName = `CV_${(formData.fullName || 'CV').replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
    
    alert('PDF exporté avec succès !');
  }).catch(error => {
    console.error('Erreur lors de l\'export PDF:', error);
    alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
  }).finally(() => {
    button.textContent = originalText;
    button.disabled = false;
  });
}

// GESTIONNAIRES POUR LA BANNIÈRE DE RECRUTEMENT
function initRecruitmentBannerHandlers() {
  console.log('Initializing recruitment banner handlers...');
  
  // Gestionnaire pour la checkbox d'affichage de la bannière
  const showBannerCheckbox = document.getElementById('showRecruitmentBanner');
  const bannerControls = document.getElementById('recruitmentBannerControls');
  
  if (showBannerCheckbox && bannerControls) {
    showBannerCheckbox.addEventListener('change', function() {
      if (this.checked) {
        bannerControls.style.display = 'block';
        // Animation d'apparition
        bannerControls.style.opacity = '0';
        bannerControls.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          bannerControls.style.transition = 'all 0.3s ease';
          bannerControls.style.opacity = '1';
          bannerControls.style.transform = 'translateY(0)';
        }, 10);
      } else {
        bannerControls.style.display = 'none';
      }
      // Régénérer l'aperçu
      generatePreview();
    });
  }
  
  // Gestionnaire pour le slider de hauteur
  const bannerHeightSlider = document.getElementById('bannerHeight');
  const bannerHeightValue = document.querySelector('.range-value');
  
  if (bannerHeightSlider && bannerHeightValue) {
    bannerHeightSlider.addEventListener('input', function() {
      bannerHeightValue.textContent = this.value + 'mm';
      // Régénérer l'aperçu en temps réel
      generatePreview();
    });
  }
  
  // Gestionnaires pour les changements de style et couleur
  const bannerStyleSelect = document.getElementById('bannerStyle');
  const bannerColorInput = document.getElementById('bannerColor');
  
  if (bannerStyleSelect) {
    bannerStyleSelect.addEventListener('change', generatePreview);
  }
  
  if (bannerColorInput) {
    bannerColorInput.addEventListener('input', generatePreview);
  }
  
  // Gestionnaires pour les champs de texte de la bannière
  const bannerTextFields = [
    'recruiterFirstName', 'recruiterLastName', 'recruiterPosition',
    'recruiterPhone', 'recruiterEmail', 'companyName',
    'companyLogoUrl', 'bannerImageUrl', 'bannerMessage'
  ];
  
  bannerTextFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', debounce(generatePreview, 300));
    }
  });
  
  console.log('Recruitment banner handlers initialized');
}

// FONCTION POUR CRÉER UN NOUVEAU CV
function createNewCV() {
  if (confirm('Êtes-vous sûr de vouloir créer un nouveau CV ? Toutes les données actuelles seront perdues.')) {
    // Vider tous les champs du formulaire
    clearAllFormFields();
    
    // Régénérer l'aperçu vide
    generatePreview();
    
    // Retourner à la première section
    const firstNavBtn = document.querySelector('.nav-btn[data-form="personal-info"]');
    if (firstNavBtn) {
      firstNavBtn.click();
    }
    
    alert('Nouveau CV créé ! Vous pouvez maintenant saisir vos informations.');
  }
}

// FONCTION POUR VIDER TOUS LES CHAMPS
function clearAllFormFields() {
  // Vider les champs de base
  const basicFields = [
    'fullName', 'jobTitle', 'email', 'phone', 'address', 
    'linkedin', 'website', 'github', 'summary-text', 'rawInfoText'
  ];
  
  basicFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) field.value = '';
  });
  
  // Vider les listes dynamiques
  const lists = [
    'experience-list', 'education-list', 'technical-skills', 
    'soft-skills', 'languages-list', 'certifications-list', 'projects-list'
  ];
  
  lists.forEach(listId => {
    const list = document.getElementById(listId);
    if (list) list.innerHTML = '';
  });
  
  // Vider les champs de recrutement
  const recruitmentFields = [
    'recruiterFirstName', 'recruiterLastName', 'recruiterPosition',
    'recruiterPhone', 'recruiterEmail', 'companyName',
    'companyLogoUrl', 'bannerImageUrl', 'bannerMessage'
  ];
  
  recruitmentFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) field.value = '';
  });
  
  // Décocher la bannière de recrutement
  const showBannerCheckbox = document.getElementById('showRecruitmentBanner');
  if (showBannerCheckbox) {
    showBannerCheckbox.checked = false;
    const bannerControls = document.getElementById('recruitmentBannerControls');
    if (bannerControls) bannerControls.style.display = 'none';
  }
  
  console.log('Tous les champs ont été vidés');
}

// FONCTION POUR CHARGER LES DONNÉES DE DÉMONSTRATION
function loadDemoData() {
  if (confirm('Charger les données de démonstration ? Cela remplacera les données actuelles.')) {
    // Vider d'abord les champs
    clearAllFormFields();
    
    // Remplir avec les données d'exemple
    populateExampleData();
    
    // Régénérer l'aperçu
    generatePreview();
    
    alert('✅ Données de démonstration chargées ! Vous pouvez maintenant tester toutes les fonctionnalités.');
  }
}

// FONCTIONS UTILITAIRES POUR LE FORMATAGE
function formatExperiencePeriod(exp) {
  if (!exp.startDate) return '';
  
  const start = formatDate(exp.startDate);
  if (exp.current) {
    return `${start} - Présent`;
  } else if (exp.endDate) {
    return `${start} - ${formatDate(exp.endDate)}`;
  }
  return start;
}

function formatEducationPeriod(edu) {
  if (!edu.startDate) return '';
  
  const start = formatDate(edu.startDate);
  if (edu.endDate) {
    return `${start} - ${formatDate(edu.endDate)}`;
  }
  return start;
}

function formatProjectPeriod(project) {
  if (!project.startDate) return '';
  
  const start = formatDate(project.startDate);
  if (project.endDate) {
    return `${start} - ${formatDate(project.endDate)}`;
  }
  return start;
}



// FONCTIONS UTILITAIRES SUPPLÉMENTAIRES









// Rendre les fonctions disponibles globalement
window.toggleCurrentJob = toggleCurrentJob;
window.removeFormItem = removeFormItem;
window.toggleEditMode = toggleEditMode;