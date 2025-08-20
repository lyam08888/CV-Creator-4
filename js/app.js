// Import modules with error handling
let initForm, generatePreview, runAI;

async function loadModules() {
  try {
    const formModule = await import('./form.js');
    initForm = formModule.initForm;
    
    const previewModule = await import('./preview.js');
    generatePreview = previewModule.generatePreview;
    
    const aiModule = await import('./ai.js');
    runAI = aiModule.runAI;
  } catch (error) {
    console.warn('Some modules failed to load:', error);
    // Provide fallback functions
    initForm = initForm || (() => console.log('Form module not loaded'));
    generatePreview = generatePreview || (() => console.log('Preview module not loaded'));
    runAI = runAI || (() => Promise.resolve('AI module not loaded'));
  }
}

const exampleCVData = {
    fullName: "Jean Dupont",
    jobTitle: "Développeur Web Full Stack",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    address: "Paris, France",
    summary: "Développeur web full stack passionné avec 5 ans d'expérience dans la création d'applications web robustes et évolutives. Expert en JavaScript, React, Node.js et bases de données NoSQL. Capable de travailler en équipe et de livrer des projets de haute qualité dans des délais serrés.",
    experience: [
        {
            title: "Développeur Full Stack Senior",
            company: "Tech Solutions Inc.",
            period: "Janvier 2022 - Présent",
            description: "Conception et développement d'applications web complexes en utilisant React et Node.js. Optimisation des performances et de l'expérience utilisateur. Collaboration avec les équipes de produit et de design pour définir les spécifications."
        },
        {
            title: "Développeur Web Junior",
            company: "Innovate Startup",
            period: "Septembre 2019 - Décembre 2021",
            description: "Développement de nouvelles fonctionnalités pour une plateforme e-commerce. Participation à la refonte de l'architecture front-end. Maintenance et débogage des applications existantes."
        }
    ],
    education: [
        {
            degree: "Master en Informatique",
            school: "Université Paris-Saclay",
            period: "Septembre 2017 - Juin 2019"
        },
        {
            degree: "Licence en Informatique",
            school: "Université de Lille",
            period: "Septembre 2014 - Juin 2017"
        }
    ],
    skills: "JavaScript, React, Node.js, Express.js, MongoDB, SQL, Git, Agile, Scrum, HTML, CSS, UI/UX Design",
    recruiterName: "Sophie Martin",
    recruiterContact: "sophie.martin@recrutement.com",
    companyName: "Global Recrutement",
    companyLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Google_for_Developers_logo.svg/1200px-Google_for_Developers_logo.svg.png" // Example logo URL
};

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize navigation first (doesn't depend on modules)
  initNav();
  
  // Load modules and initialize other features
  await loadModules();
  
  if (initForm) initForm();
  initActions();
  populateFormFields(exampleCVData); // Pre-fill form with example data
  if (generatePreview) generatePreview(getFormData()); // Generate initial preview
});

function initNav() {
  console.log('Initializing navigation...');
  
  // Get all navigation buttons and form sections
  const navButtons = document.querySelectorAll('.nav-btn');
  const formSections = document.querySelectorAll('.form-section');
  
  console.log('Found nav buttons:', navButtons.length);
  console.log('Found form sections:', formSections.length);
  
  // List all buttons and sections for debugging
  navButtons.forEach((btn, i) => {
    console.log(`Button ${i}:`, btn.dataset.form, btn.textContent.trim());
  });
  
  formSections.forEach((section, i) => {
    console.log(`Section ${i}:`, section.id);
  });

  // Add click event to each navigation button
  navButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetFormId = this.dataset.form;
      console.log(`Clicked button ${index}: targeting "${targetFormId}"`);
      
      // Remove active class from all buttons
      navButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      console.log('Button activated:', this.textContent.trim());
      
      // Hide all sections first
      formSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });
      
      // Show target section
      const targetSection = document.getElementById(targetFormId);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        console.log('Section shown:', targetFormId);
      } else {
        console.error('Target section not found:', targetFormId);
      }
    });
  });
  
  // Ensure first section is visible on load
  if (formSections.length > 0) {
    formSections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });
    
    const firstSection = document.getElementById('personal-info');
    if (firstSection) {
      firstSection.classList.add('active');
      firstSection.style.display = 'block';
      console.log('First section activated: personal-info');
    }
  }
}

function initActions() {
    const btnGenerateIA = document.getElementById('btnGenerateIA');
    btnGenerateIA.addEventListener('click', async () => {
        const formData = getFormData();
        const cvText = await runAI(formData);
        generatePreview(cvText);
    });

    const btnExport = document.getElementById('btnExport');
    btnExport.addEventListener('click', () => {
        const cvContent = document.getElementById('cv-preview').innerHTML;
        const blob = new Blob([cvContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_cv.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    const btnGenerateSummaryAI = document.getElementById('btnGenerateSummaryAI');
    if (btnGenerateSummaryAI) { // Check if button exists
        btnGenerateSummaryAI.addEventListener('click', async () => {
            const formData = getFormData();
            const prompt = `Génère un résumé professionnel percutant pour un CV, basé sur les informations suivantes:\n\n` +
                           `Expérience: ${formData.experience ? formData.experience.map(exp => `${exp.title} chez ${exp.company} (${exp.period}): ${exp.description}`).join('\n') : 'Aucune expérience fournie.'}\n\n` +
                           `Formation: ${formData.education ? formData.education.map(edu => `${edu.degree} à ${edu.school} (${edu.period})`).join('\n') : 'Aucune formation fournie.'}\n\n` +
                           `Compétences: ${formData.skills || 'Aucune compétence fournie.'}\n\n` +
                           `Le résumé doit être concis (3-4 phrases) et mettre en avant les points forts.`;
            
            const generatedSummary = await runAI({ action: 'generate-summary', prompt: prompt });
            if (generatedSummary) {
                document.getElementById('summary-text').value = generatedSummary;
            }
        });
    }

    const btnSuggestSkillsAI = document.getElementById('btnSuggestSkillsAI');
    if (btnSuggestSkillsAI) { // Check if button exists
        btnSuggestSkillsAI.addEventListener('click', async () => {
            const formData = getFormData();
            const prompt = `Suggère une liste de compétences techniques et non techniques pertinentes pour un CV, basée sur les informations suivantes:\n\n` +
                           `Titre du poste: ${formData.jobTitle || 'Non spécifié.'}\n\n` +
                           `Expérience: ${formData.experience ? formData.experience.map(exp => `${exp.title} chez ${exp.company}`).join(', ') : 'Aucune expérience fournie.'}\n\n` +
                           `Formation: ${formData.education ? formData.education.map(edu => `${edu.degree} à ${edu.school}`).join(', ') : 'Aucune formation fournie.'}\n\n` +
                           `Les compétences doivent être séparées par des virgules.`;
            
            const suggestedSkills = await runAI({ action: 'suggest-skills', prompt: prompt });
            if (suggestedSkills) {
                const currentSkills = document.getElementById('skills-text').value;
                document.getElementById('skills-text').value = currentSkills ? `${currentSkills}, ${suggestedSkills}` : suggestedSkills;
            }
        });
    }

    const btnAnalyzeCVAI = document.getElementById('btnAnalyzeCVAI');
    if (btnAnalyzeCVAI) { // Check if button exists
        btnAnalyzeCVAI.addEventListener('click', async () => {
            const formData = getFormData();
            const prompt = `Analyse le CV basé sur les informations suivantes et fournis des retours constructifs sur sa qualité, les mots-clés utilisés, et son impact général. Suggère des améliorations spécifiques pour chaque section (informations personnelles, résumé, expérience, formation, compétences).\n\n` +
                           `Informations Personnelles:\n- Nom complet: ${formData.fullName}\n- Titre du poste: ${formData.jobTitle}\n- Email: ${formData.email}\n- Téléphone: ${formData.phone}\n- Adresse: ${formData.address}\n\n` +
                           `Résumé:\n${formData.summary}\n\n` +
                           `Expérience Professionnelle:\n${formData.experience ? formData.experience.map(exp => `- ${exp.title} chez ${exp.company} (${exp.period}): ${exp.description}`).join('\n') : 'Aucune expérience fournie.'}\n\n` +
                           `Formation:\n${formData.education ? formData.education.map(edu => `- ${edu.degree} à ${edu.school} (${edu.period})`).join('\n') : 'Aucune formation fournie.'}\n\n` +
                           `Compétences:\n${formData.skills}\n\n` +
                           `Le retour doit être structuré et facile à lire.`;
            
            const analysisResult = await runAI({ action: 'analyze-cv', prompt: prompt });
            if (analysisResult) {
                alert(`Analyse du CV par l'IA:\n\n${analysisResult}`);
            }
        });
    }

    const btnSaveApiKey = document.getElementById('btnSaveApiKey');
    const geminiApiKeyInput = document.getElementById('geminiApiKey');

    // Pre-fill API key if already saved
    if (geminiApiKeyInput) {
        geminiApiKeyInput.value = localStorage.getItem('cvpro_api_key') || '';
    }

    if (btnSaveApiKey) {
        btnSaveApiKey.addEventListener('click', () => {
            const apiKey = geminiApiKeyInput.value.trim();
            if (apiKey) {
                localStorage.setItem('cvpro_api_key', apiKey);
                alert('Clé API Gemini sauvegardée avec succès !');
            } else {
                localStorage.removeItem('cvpro_api_key');
                alert('Clé API Gemini supprimée.');
            }
        });
    }

    const btnAutoFillAI = document.getElementById('btnAutoFillAI');
    if (btnAutoFillAI) {
        btnAutoFillAI.addEventListener('click', async () => {
            const rawInfoText = document.getElementById('rawInfoText').value;
            if (!rawInfoText.trim()) {
                alert('Veuillez coller les informations brutes du candidat dans la zone de texte.');
                return;
            }

            const prompt = `Extrait les informations suivantes du texte brut fourni et renvoie-les sous forme d'objet JSON. Assure-toi que les noms des champs JSON correspondent exactement aux noms des champs HTML (fullName, jobTitle, email, phone, address, summary, experience, education, skills). Pour l'expérience et la formation, utilise un tableau d'objets. Pour l'expérience, chaque objet doit avoir 'title', 'company', 'period', 'description'. Pour la formation, chaque objet doit avoir 'degree', 'school', 'period'. Si un champ est manquant, laisse-le vide ou null.

Texte brut:
${rawInfoText}

Exemple de format JSON attendu:
{
  "fullName": "Nom Prénom",
  "jobTitle": "Titre du poste",
  "email": "email@example.com",
  "phone": "+33612345678",
  "address": "Ville, Pays",
  "summary": "Résumé professionnel...",
  "experience": [
    {
      "title": "Titre 1",
      "company": "Entreprise 1",
      "period": "Date début - Date fin",
      "description": "Description des missions et réalisations..."
    },
    {
      "title": "Titre 2",
      "company": "Entreprise 2",
      "period": "Date début - Date fin",
      "description": "Description des missions et réalisations..."
    }
  ],
  "education": [
    {
      "degree": "Diplôme 1",
      "school": "École 1",
      "period": "Date début - Date fin"
    }
  ],
  "skills": "Compétence 1, Compétence 2, Compétence 3"
}
`;
            
            const extractedDataJson = await runAI({ action: 'auto-fill-cv', prompt: prompt });
            if (extractedDataJson) {
                try {
                    const extractedData = JSON.parse(extractedDataJson);
                    populateFormFields(extractedData);
                    generatePreview(getFormData()); // Update preview after populating form
                } catch (e) {
                    alert('Erreur lors de l\'analyse des données extraites par l\'IA. Le format JSON est invalide.');
                    console.error('JSON parsing error:', e);
                }
            }
        });
    }
}

function populateFormFields(data) {
    // Clear all fields first
    document.getElementById('cv-form').reset(); // Resets all form fields to their initial values

    // Personal Info
    document.getElementById('fullName').value = data.fullName || '';
    document.getElementById('jobTitle').value = data.jobTitle || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('address').value = data.address || '';

    // Summary
    document.getElementById('summary-text').value = data.summary || '';

    // Experience
    const experienceList = document.getElementById('experience-list');
    experienceList.innerHTML = ''; // Clear existing
    if (data.experience && Array.isArray(data.experience)) {
        data.experience.forEach((exp, index) => {
            const item = document.createElement('div');
            item.classList.add('form-group');
            item.innerHTML = `
                <input type="text" name="experience[${index}][title]" class="input" placeholder="Titre du poste" value="${exp.title || ''}">
                <input type="text" name="experience[${index}][company]" class="input" placeholder="Entreprise" value="${exp.company || ''}">
                <input type="text" name="experience[${index}][period]" class="input" placeholder="Période (ex: 2020 - 2022)" value="${exp.period || ''}">
                <div class="textarea-wrapper">
                  <textarea name="experience[${index}][description]" class="textarea" placeholder="Description des missions">${exp.description || ''}</textarea>
                  <button type="button" class="btn-ai-icon hidden" data-target="experience[${index}][description]" title="Améliorer avec IA">✨</button>
                </div>
            `;
            experienceList.appendChild(item);
            // Re-attach AI button listeners for newly added items
            const textarea = item.querySelector('.textarea');
            const aiButton = item.querySelector('.btn-ai-icon');
            if (textarea && aiButton) {
                textarea.addEventListener('focus', () => aiButton.classList.remove('hidden'));
                textarea.addEventListener('blur', () => {
                    if (textarea.value.trim() === '') {
                        aiButton.classList.add('hidden');
                    }
                });
                aiButton.addEventListener('click', async (e) => {
                    const targetName = e.target.dataset.target;
                    const targetTextarea = item.querySelector(`textarea[name="${targetName}"]`);
                    const currentText = targetTextarea.value;
                    const prompt = `Reformule et améliore la description suivante pour un CV professionnel, en la rendant plus percutante et orientée résultats:

${currentText}`;
                    const improvedText = await runAI({ action: 'improve-text', prompt: prompt });
                    if (improvedText) {
                        targetTextarea.value = improvedText;
                    }
                });
            }
        });
    }

    // Education
    const educationList = document.getElementById('education-list');
    educationList.innerHTML = ''; // Clear existing
    if (data.education && Array.isArray(data.education)) {
        data.education.forEach((edu, index) => {
            const item = document.createElement('div');
            item.classList.add('form-group');
            item.innerHTML = `
                <input type="text" name="education[${index}][degree]" class="input" placeholder="Diplôme" value="${edu.degree || ''}">
                <input type="text" name="education[${index}][school]" class="input" placeholder="École ou université" value="${edu.school || ''}">
                <input type="text" name="education[${index}][period]" class="input" placeholder="Période (ex: 2018 - 2020)" value="${edu.period || ''}">
                <div class="textarea-wrapper">
                  <textarea name="education[${index}][description]" class="textarea" placeholder="Description de la formation">${edu.description || ''}</textarea>
                  <button type="button" class="btn-ai-icon hidden" data-target="education[${index}][description]" title="Améliorer avec IA">✨</button>
                </div>
            `;
            educationList.appendChild(item);
            // Re-attach AI button listeners for newly added items
            const textarea = item.querySelector('.textarea');
            const aiButton = item.querySelector('.btn-ai-icon');
            if (textarea && aiButton) {
                textarea.addEventListener('focus', () => aiButton.classList.remove('hidden'));
                textarea.addEventListener('blur', () => {
                    if (textarea.value.trim() === '') {
                        aiButton.classList.add('hidden');
                    }
                });
                aiButton.addEventListener('click', async (e) => {
                    const targetName = e.target.dataset.target;
                    const targetTextarea = item.querySelector(`textarea[name="${targetName}"]`);
                    const currentText = targetTextarea.value;
                    const prompt = `Reformule et améliore la description suivante pour un CV professionnel, en la rendant plus percutante et orientée résultats:

${currentText}`;
                    const improvedText = await runAI({ action: 'improve-text', prompt: prompt });
                    if (improvedText) {
                        targetTextarea.value = improvedText;
                    }
                });
            }
        });
    }

    // Skills
    document.getElementById('skills-text').value = data.skills || '';

    // Recruitment Info
    document.getElementById('recruiterName').value = data.recruiterName || '';
    document.getElementById('recruiterContact').value = data.recruiterContact || '';
    document.getElementById('companyName').value = data.companyName || '';
    document.getElementById('companyLogoUrl').value = data.companyLogoUrl || '';
}

function getFormData() {
    const form = document.getElementById('cv-form');
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }

    // Handle nested arrays for experience and education
    const experience = [];
    for (let i = 0; ; i++) {
        const title = data[`experience[${i}][title]`];
        if (!title) break;
        experience.push({
            title: title,
            company: data[`experience[${i}][company]`],
            period: data[`experience[${i}][period]`],
            description: data[`experience[${i}][description]`]
        });
        delete data[`experience[${i}][title]`];
        delete data[`experience[${i}][company]`];
        delete data[`experience[${i}][period]`];
        delete data[`experience[${i}][description]`];
    }
    data.experience = experience;

    const education = [];
    for (let i = 0; ; i++) {
        const degree = data[`education[${i}][degree]`];
        if (!degree) break;
        education.push({
            degree: degree,
            school: data[`education[${i}][school]`],
            period: data[`education[${i}][period]`]
        });
        delete data[`education[${i}][degree]`];
        delete data[`education[${i}][school]`];
        delete data[`education[${i}][period]`];
    }
    data.education = education;

    return data;
}