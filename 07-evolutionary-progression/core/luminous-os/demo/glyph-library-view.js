/**
 * Complete Glyph Library View for LuminousOS
 * 
 * Displays all 87 glyphs with:
 * - Category organization
 * - Coherence requirements
 * - Practice steps
 * - Group variations
 * - Progress tracking
 */

function createGlyphLibraryView() {
    const modal = document.createElement('div');
    modal.id = 'glyphLibraryModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.98);
        z-index: 2000;
        overflow-y: auto;
        display: none;
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
        color: #fff;
    `;
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
    `;
    
    header.innerHTML = `
        <h1 style="
            font-size: 48px;
            background: linear-gradient(135deg, #6B46C1, #EC4899);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        ">The 87 Sacred Glyphs</h1>
        <button onclick="closeGlyphLibrary()" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 15px 30px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 18px;
        ">Close</button>
    `;
    
    container.appendChild(header);
    
    // Progress overview
    const progressSection = createProgressOverview();
    container.appendChild(progressSection);
    
    // Category tabs
    const tabs = createCategoryTabs();
    container.appendChild(tabs);
    
    // Glyph grid container
    const glyphGrid = document.createElement('div');
    glyphGrid.id = 'glyphGrid';
    glyphGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 30px;
    `;
    
    container.appendChild(glyphGrid);
    
    modal.appendChild(container);
    document.body.appendChild(modal);
    
    // Show foundational glyphs by default
    showGlyphCategory('foundational');
    
    return modal;
}

function createProgressOverview() {
    const userCoherence = window.state ? window.state.coherence.personal : 0.7;
    const progression = window.getPracticeProgression ? 
        window.getPracticeProgression(userCoherence) : null;
    
    const section = document.createElement('div');
    section.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 30px;
    `;
    
    if (progression) {
        section.innerHTML = `
            <h2 style="margin-bottom: 20px;">Your Progress</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <h3 style="color: #10B981;">Accessible Now</h3>
                    <p style="font-size: 36px; margin: 10px 0;">${progression.accessible.length}</p>
                    <p style="opacity: 0.7;">glyphs available</p>
                </div>
                <div>
                    <h3 style="color: #6B46C1;">Current Coherence</h3>
                    <p style="font-size: 36px; margin: 10px 0;">${Math.round(userCoherence * 100)}%</p>
                    <p style="opacity: 0.7;">personal field</p>
                </div>
                <div>
                    <h3 style="color: #EC4899;">Next Unlock</h3>
                    <p style="font-size: 24px; margin: 10px 0;">${progression.nextUnlock ? progression.nextUnlock.name : 'All unlocked!'}</p>
                    <p style="opacity: 0.7;">${progression.nextUnlock ? `Requires ${Math.round(progression.nextUnlock.coherenceRequired * 100)}%` : 'Master level achieved'}</p>
                </div>
            </div>
        `;
    } else {
        section.innerHTML = '<p>Loading progress...</p>';
    }
    
    return section;
}

function createCategoryTabs() {
    const tabContainer = document.createElement('div');
    tabContainer.style.cssText = `
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
    `;
    
    const categories = [
        { id: 'foundational', name: 'Foundational (45)', color: '#6B46C1' },
        { id: 'applied', name: 'Applied Harmonies (11)', color: '#10B981' },
        { id: 'threshold', name: 'Threshold (9)', color: '#EC4899' },
        { id: 'meta', name: 'Meta-Glyphs (33)', color: '#F59E0B' },
        { id: 'all', name: 'All Glyphs (87+)', color: '#3B82F6' }
    ];
    
    categories.forEach(cat => {
        const tab = document.createElement('button');
        tab.style.cssText = `
            background: transparent;
            color: white;
            border: 2px solid ${cat.color};
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        `;
        
        tab.textContent = cat.name;
        tab.dataset.category = cat.id;
        
        tab.onmouseover = () => {
            tab.style.background = cat.color;
            tab.style.transform = 'scale(1.05)';
        };
        
        tab.onmouseout = () => {
            if (!tab.classList.contains('active')) {
                tab.style.background = 'transparent';
                tab.style.transform = 'scale(1)';
            }
        };
        
        tab.onclick = () => {
            // Reset all tabs
            tabContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'transparent';
                btn.style.transform = 'scale(1)';
            });
            
            // Activate this tab
            tab.classList.add('active');
            tab.style.background = cat.color;
            tab.style.transform = 'scale(1.05)';
            
            showGlyphCategory(cat.id);
        };
        
        tabContainer.appendChild(tab);
    });
    
    return tabContainer;
}

function showGlyphCategory(category) {
    const grid = document.getElementById('glyphGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    let glyphs = [];
    
    if (window.COMPLETE_GLYPH_LIBRARY) {
        switch(category) {
            case 'foundational':
                glyphs = window.COMPLETE_GLYPH_LIBRARY.foundational;
                break;
            case 'applied':
                glyphs = window.COMPLETE_GLYPH_LIBRARY.appliedHarmonies;
                break;
            case 'threshold':
                glyphs = window.COMPLETE_GLYPH_LIBRARY.threshold;
                break;
            case 'meta':
                glyphs = window.COMPLETE_GLYPH_LIBRARY.meta;
                break;
            case 'all':
                glyphs = window.getAllGlyphs();
                break;
        }
    }
    
    glyphs.forEach(glyph => {
        const card = createGlyphCard(glyph, category);
        grid.appendChild(card);
    });
}

function createGlyphCard(glyph, category) {
    const userCoherence = window.state ? window.state.coherence.personal : 0.7;
    const isAccessible = userCoherence >= glyph.coherenceRequired;
    
    const card = document.createElement('div');
    card.style.cssText = `
        background: ${isAccessible ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
        border: 1px solid ${isAccessible ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
        border-radius: 15px;
        padding: 20px;
        cursor: ${isAccessible ? 'pointer' : 'default'};
        transition: all 0.3s ease;
        opacity: ${isAccessible ? '1' : '0.5'};
        position: relative;
        overflow: hidden;
    `;
    
    if (isAccessible) {
        card.onmouseover = () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 30px rgba(107, 70, 193, 0.3)';
        };
        
        card.onmouseout = () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        };
        
        card.onclick = () => openGlyphPractice(glyph);
    }
    
    // Glyph symbol
    const symbol = document.createElement('div');
    symbol.style.cssText = `
        font-size: 48px;
        text-align: center;
        margin-bottom: 15px;
        filter: ${isAccessible ? 'none' : 'grayscale(100%)'};
    `;
    symbol.textContent = glyph.id;
    
    // Glyph name
    const name = document.createElement('h3');
    name.style.cssText = `
        font-size: 18px;
        margin-bottom: 10px;
        color: ${isAccessible ? '#fff' : '#888'};
    `;
    name.textContent = glyph.name;
    
    // Alternative name if exists
    if (glyph.alternativeName) {
        const altName = document.createElement('p');
        altName.style.cssText = `
            font-size: 14px;
            opacity: 0.7;
            margin-bottom: 10px;
            font-style: italic;
        `;
        altName.textContent = glyph.alternativeName;
        card.appendChild(altName);
    }
    
    // Description
    const desc = document.createElement('p');
    desc.style.cssText = `
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 15px;
        line-height: 1.4;
    `;
    desc.textContent = glyph.description;
    
    // Coherence requirement
    const coherence = document.createElement('div');
    coherence.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    coherence.innerHTML = `
        <span style="font-size: 12px; opacity: 0.7;">Required Coherence</span>
        <span style="
            font-size: 16px; 
            font-weight: bold;
            color: ${isAccessible ? '#10B981' : '#EF4444'};
        ">${Math.round(glyph.coherenceRequired * 100)}%</span>
    `;
    
    // Special badges
    if (glyph.appliedHarmony) {
        const badge = document.createElement('div');
        badge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #10B981;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
        `;
        badge.textContent = 'Applied';
        card.appendChild(badge);
    }
    
    if (glyph.mysticBridge) {
        const bridge = document.createElement('div');
        bridge.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: #6B46C1;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
        `;
        bridge.textContent = `→ ${glyph.mysticBridge}`;
        card.appendChild(bridge);
    }
    
    card.appendChild(symbol);
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(coherence);
    
    return card;
}

function openGlyphPractice(glyph) {
    // If in main UI, use existing practice chamber
    if (window.selectGlyph) {
        window.selectGlyph(glyph);
        closeGlyphLibrary();
        return;
    }
    
    // Otherwise create detailed practice view
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 40px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    content.innerHTML = `
        <h2 style="
            font-size: 36px;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #6B46C1, #EC4899);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        ">${glyph.id} - ${glyph.name}</h2>
        
        ${glyph.alternativeName ? `<h3 style="font-size: 24px; opacity: 0.8; margin-bottom: 20px;">${glyph.alternativeName}</h3>` : ''}
        
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px;">${glyph.description}</p>
        
        ${glyph.practiceSteps ? `
            <div style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px;">Practice Steps</h3>
                <ol style="line-height: 1.8; opacity: 0.9;">
                    ${glyph.practiceSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        ` : ''}
        
        ${glyph.groupVariation ? `
            <div style="
                background: rgba(107, 70, 193, 0.1);
                border: 1px solid rgba(107, 70, 193, 0.3);
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 30px;
            ">
                <h3 style="margin-bottom: 10px;">Group Practice</h3>
                <p>${glyph.groupVariation}</p>
            </div>
        ` : ''}
        
        ${glyph.components ? `
            <div style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px;">Component Glyphs</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${glyph.components.map(comp => `
                        <span style="
                            background: rgba(255, 255, 255, 0.1);
                            padding: 8px 16px;
                            border-radius: 20px;
                            font-size: 14px;
                        ">${comp}</span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 40px;">
            <button onclick="this.closest('div[style*=\"z-index: 3000\"]').remove()" style="
                background: linear-gradient(135deg, #6B46C1, #EC4899);
                color: white;
                border: none;
                padding: 15px 40px;
                border-radius: 30px;
                font-size: 18px;
                cursor: pointer;
            ">Begin Practice</button>
            
            <button onclick="this.closest('div[style*=\"z-index: 3000\"]').remove()" style="
                background: transparent;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 15px 40px;
                border-radius: 30px;
                font-size: 18px;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function closeGlyphLibrary() {
    const modal = document.getElementById('glyphLibraryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showGlyphLibrary() {
    let modal = document.getElementById('glyphLibraryModal');
    if (!modal) {
        modal = createGlyphLibraryView();
    }
    modal.style.display = 'block';
}

// Make functions globally available
window.showGlyphLibrary = showGlyphLibrary;
window.closeGlyphLibrary = closeGlyphLibrary;
window.showGlyphCategory = showGlyphCategory;