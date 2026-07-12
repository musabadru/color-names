let allColors = [];
let displayedColors = [];
const BATCH_SIZE = 50;
let currentIndex = 0;
let isSearching = false;

const grid = document.getElementById('color-grid');
const toast = document.getElementById('toast');
const searchInput = document.getElementById('search-input');

// Initialize
async function init() {
    grid.innerHTML = '<div class="loading">Fetching colors...</div>';
    try {
        const response = await fetch('https://unpkg.com/color-name-list@latest/dist/colornames.json');
        allColors = await response.json();
        
        // Randomize the initial array so we get a good mix on load
        // But keep a copy of the original for deterministic search if we want, 
        // actually shuffling is fine or just show as-is. Let's show as-is to save CPU.
        displayedColors = allColors;
        
        grid.innerHTML = '';
        loadMoreColors();
        
        // Setup infinite scroll
        window.addEventListener('scroll', handleScroll);
        
        // Setup search
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    } catch (err) {
        console.error('Failed to load colors:', err);
        grid.innerHTML = '<div class="loading">Failed to load colors. Check console.</div>';
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text}!`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy');
    });
}

function createCard(color) {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.onclick = () => copyToClipboard(color.hex);

    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color.hex;

    const name = document.createElement('div');
    name.className = 'color-name';
    name.textContent = color.name;

    const hex = document.createElement('div');
    hex.className = 'color-hex';
    hex.textContent = color.hex;

    card.appendChild(swatch);
    card.appendChild(name);
    card.appendChild(hex);

    return card;
}

function loadMoreColors() {
    if (currentIndex >= displayedColors.length) return;
    
    const fragment = document.createDocumentFragment();
    const endIndex = Math.min(currentIndex + BATCH_SIZE, displayedColors.length);
    
    for (let i = currentIndex; i < endIndex; i++) {
        fragment.appendChild(createCard(displayedColors[i]));
    }
    
    grid.appendChild(fragment);
    currentIndex = endIndex;
}

function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
        loadMoreColors();
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
        displayedColors = allColors;
    } else {
        displayedColors = allColors.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.hex.toLowerCase().includes(query)
        );
    }
    
    grid.innerHTML = '';
    currentIndex = 0;
    
    if (displayedColors.length === 0) {
        grid.innerHTML = '<div class="no-results">No colors found.</div>';
    } else {
        loadMoreColors();
    }
}

// Utility: Debounce function to limit search rate
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Start
init();
