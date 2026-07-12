const colors = [
    { name: 'Neon Yellow', hex: '#FFDE59' },
    { name: 'Hot Pink', hex: '#FF3131' },
    { name: 'Electric Blue', hex: '#004AAD' },
    { name: 'Cyber Green', hex: '#00BF63' },
    { name: 'Vibrant Orange', hex: '#FF914D' },
    { name: 'Toxic Purple', hex: '#CB6CE6' },
    { name: 'Bubblegum', hex: '#FF66C4' },
    { name: 'Aqua Splash', hex: '#38B6FF' },
    { name: 'Acid Lime', hex: '#C1FF72' },
    { name: 'Deep Magenta', hex: '#8C52FF' },
    { name: 'Retro Red', hex: '#FF5757' },
    { name: 'Mint Freeze', hex: '#00E676' }
];

const grid = document.getElementById('color-grid');
const toast = document.getElementById('toast');

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

// Populate grid
colors.forEach(color => {
    grid.appendChild(createCard(color));
});
