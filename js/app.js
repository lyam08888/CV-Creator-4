// Simple navigation without ES6 modules
console.log('App.js loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');
  initNavigation();
});

function initNavigation() {
  console.log('Starting navigation initialization...');
  
  const navButtons = document.querySelectorAll('.nav-btn');
  const formSections = document.querySelectorAll('.form-section');
  
  console.log('Found buttons:', navButtons.length);
  console.log('Found sections:', formSections.length);
  
  // Debug: list all elements
  navButtons.forEach(function(btn, i) {
    console.log('Button ' + i + ':', btn.getAttribute('data-form'));
  });
  
  formSections.forEach(function(section, i) {
    console.log('Section ' + i + ':', section.id);
  });
  
  // Add click handlers
  navButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('data-form');
      console.log('Clicked button for:', targetId);
      
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
        console.log('Showing section:', targetId);
      } else {
        console.error('Section not found:', targetId);
      }
    });
  });
  
  // Initialize first section
  if (formSections.length > 0) {
    formSections.forEach(function(section) {
      section.style.display = 'none';
      section.classList.remove('active');
    });
    
    const firstSection = document.getElementById('personal-info');
    if (firstSection) {
      firstSection.style.display = 'block';
      firstSection.classList.add('active');
      console.log('Initialized first section');
    }
  }
  
  console.log('Navigation initialization complete');
}

// Dummy functions to prevent errors
function getFormData() {
  return {};
}

function populateFormFields(data) {
  console.log('populateFormFields called with:', data);
}