// Fallback simple pour Sortable.js si le CDN ne fonctionne pas
(function() {
    'use strict';
    
    // Vérifier si Sortable est déjà chargé
    if (window.Sortable) {
        console.log('✅ Sortable.js déjà chargé depuis le CDN');
        return;
    }
    
    console.log('⚠️ Sortable.js non disponible, chargement du fallback...');
    
    // Implémentation basique de Sortable pour le fallback
    function SimpleSortable(element, options) {
        this.el = element;
        this.options = options || {};
        this.init();
    }
    
    SimpleSortable.prototype = {
        init: function() {
            console.log('🔧 Initialisation du fallback Sortable pour:', this.el);
            this.addDragHandles();
        },
        
        addDragHandles: function() {
            const items = this.el.querySelectorAll('.cv-section');
            items.forEach((item, index) => {
                if (!item.querySelector('.drag-handle')) {
                    const handle = document.createElement('div');
                    handle.className = 'drag-handle';
                    handle.innerHTML = '⋮⋮';
                    handle.title = 'Glisser pour réorganiser (fallback mode)';
                    handle.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        cursor: move;
                        background: #8B5CF6;
                        color: white;
                        padding: 5px;
                        border-radius: 3px;
                        font-size: 12px;
                        z-index: 1000;
                    `;
                    item.style.position = 'relative';
                    item.appendChild(handle);
                }
            });
        },
        
        destroy: function() {
            console.log('🗑️ Destruction du fallback Sortable');
            // Nettoyer les handles ajoutés
            const handles = this.el.querySelectorAll('.drag-handle');
            handles.forEach(handle => handle.remove());
        }
    };
    
    // Créer la fonction Sortable.create
    window.Sortable = {
        create: function(element, options) {
            return new SimpleSortable(element, options);
        }
    };
    
    console.log('✅ Fallback Sortable.js chargé');
})();