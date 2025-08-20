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
    <div class="cv-header">
      <h1>${formData.fullName || ''}</h1>
      <p>${formData.jobTitle || ''}</p>
      <p>${formData.email || ''} | ${formData.phone || ''} | ${formData.address || ''}</p>
    </div>
    <div class="cv-section">
      <h2>Résumé</h2>
      <p>${formData.summary || ''}</p>
    </div>
  `;

  if (formData.experience) {
    html += '<div class="cv-section"><h2>Expérience Professionnelle</h2>';
    formData.experience.forEach(exp => {
      html += `
        <div class="cv-item">
          <h3>${exp.title} chez ${exp.company}</h3>
          <p class="cv-period">${exp.period}</p>
          <p>${exp.description}</p>
        </div>
      `;
    });
    html += '</div>';
  }

  if (formData.education) {
    html += '<div class="cv-section"><h2>Formation</h2>';
    formData.education.forEach(edu => {
      html += `
        <div class="cv-item">
          <h3>${edu.degree} - ${edu.school}</h3>
          <p class="cv-period">${edu.period}</p>
        </div>
      `;
    });
    html += '</div>';
  }

  if (formData.skills) {
    html += `
      <div class="cv-section">
        <h2>Compétences</h2>
        <p>${formData.skills}</p>
      </div>
    `;
  }

  previewPanel.innerHTML = html;
}
