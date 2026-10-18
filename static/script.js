// script.js
const STORAGE_KEY = 'just-click-state';
const COMBO_WINDOW_MS = 600; // a click within this window keeps the combo going
const CPS_WINDOW_MS = 1000;

const ACHIEVEMENTS = [
    { id: 'first', icon: '👆', name: 'First click', test: s => s.count >= 1 },
    { id: 'c100', icon: '💯', name: '100 clicks', test: s => s.count >= 100 },
    { id: 'c1000', icon: '🔥', name: '1,000 clicks', test: s => s.count >= 1000 },
    { id: 'c10000', icon: '🏆', name: '10,000 clicks', test: s => s.count >= 10000 },
    { id: 'combo25', icon: '⚡', name: '25 combo', test: s => s.bestCombo >= 25 },
    { id: 'combo100', icon: '🌪️', name: '100 combo', test: s => s.bestCombo >= 100 },
    { id: 'cps8', icon: '🚀', name: '8 CPS', test: s => s.bestCps >= 8 },
    { id: 'cps12', icon: '🤖', name: '12 CPS (are you a bot?)', test: s => s.bestCps >= 12 },
];

const el = id => document.getElementById(id);
const counterEl = el('counter-value');
const buttonEl = el('counter-button');
const comboEl = el('combo');
const cpsEl = el('stat-cps');
const bestCpsEl = el('stat-best-cps');
const bestComboEl = el('stat-best-combo');
const soundButton = el('sound-button');
const toastEl = el('toast');

function loadState() {
    const fallback = { count: 0, bestCombo: 0, bestCps: 0, unlocked: [], sound: true };
    try {
        return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
    } catch {
        return fallback;
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Storage can be unavailable (private mode); the game still works.
    }
}

const state = loadState();
let combo = 0;
let lastClick = 0;
let recentClicks = [];

// --- Sound -----------------------------------------------------------------
let audioCtx;
function beep(freq, duration = 0.06, type = 'square') {
    if (!state.sound) return;
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'triangle'), i * 90));
}

// --- Effects ---------------------------------------------------------------
function restartAnimation(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth; // force reflow so the animation replays
    node.classList.add(cls);
}

function spawnFloat(x, y, text) {
    const node = document.createElement('span');
    node.className = 'float-text';
    node.textContent = text;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    document.body.appendChild(node);
    node.addEventListener('animationend', () => node.remove());
}

function spawnParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        const node = document.createElement('span');
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 80;
        node.className = 'particle';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
        node.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        node.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        document.body.appendChild(node);
        node.addEventListener('animationend', () => node.remove());
    }
}

let toastTimer;
function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// --- Rendering -------------------------------------------------------------
function renderAchievements() {
    el('achievement-list').innerHTML = ACHIEVEMENTS.map(a => {
        const unlocked = state.unlocked.includes(a.id);
        return `<li class="${unlocked ? 'unlocked' : ''}">${a.icon} ${a.name}</li>`;
    }).join('');
}

function render() {
    counterEl.textContent = state.count.toLocaleString();
    bestCpsEl.textContent = state.bestCps;
    bestComboEl.textContent = state.bestCombo;
    soundButton.textContent = state.sound ? '🔊 Sound' : '🔇 Muted';
    soundButton.setAttribute('aria-pressed', String(state.sound));
    // Shift the theme colour as the count grows.
    document.documentElement.style.setProperty('--hue', String((255 + state.count) % 360));
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
        if (!state.unlocked.includes(a.id) && a.test(state)) {
            state.unlocked.push(a.id);
            toast(`${a.icon} Achievement unlocked: ${a.name}`);
            fanfare();
            renderAchievements();
        }
    });
}

// --- Game loop -------------------------------------------------------------
function handleClick(x, y) {
    const now = performance.now();
    combo = now - lastClick <= COMBO_WINDOW_MS ? combo + 1 : 1;
    lastClick = now;

    recentClicks = recentClicks.filter(t => now - t < CPS_WINDOW_MS);
    recentClicks.push(now);
    const cps = recentClicks.length;

    state.count++;
    state.bestCombo = Math.max(state.bestCombo, combo);
    state.bestCps = Math.max(state.bestCps, cps);

    render();
    cpsEl.textContent = cps;
    comboEl.textContent = combo >= 5 ? `${combo}x combo!` : '';
    restartAnimation(counterEl, 'bump');
    spawnFloat(x, y, combo >= 10 ? `+1 ×${combo}` : '+1');
    spawnParticles(x, y, Math.min(4 + Math.floor(combo / 5), 16));
    beep(300 + Math.min(combo, 60) * 15);

    if (state.count % 100 === 0) {
        restartAnimation(document.querySelector('.container'), 'shake');
        spawnParticles(x, y, 40);
        toast(`🎉 ${state.count.toLocaleString()} clicks!`);
    }

    checkAchievements();
    saveState();
}

buttonEl.addEventListener('click', event => {
    // Keyboard-triggered clicks report (0, 0); use the button centre instead.
    const rect = buttonEl.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    handleClick(x, y);
});

document.addEventListener('keydown', event => {
    const isClickKey = event.code === 'Space' || event.code === 'Enter';
    // Let other focused buttons handle their own keys.
    if (!isClickKey || event.repeat || (event.target.tagName === 'BUTTON' && event.target !== buttonEl)) return;
    event.preventDefault();
    buttonEl.classList.add('pressed');
    buttonEl.click();
});

document.addEventListener('keyup', () => buttonEl.classList.remove('pressed'));

// Decay the live CPS display when the player stops clicking.
setInterval(() => {
    const now = performance.now();
    recentClicks = recentClicks.filter(t => now - t < CPS_WINDOW_MS);
    cpsEl.textContent = recentClicks.length;
    if (now - lastClick > COMBO_WINDOW_MS) comboEl.textContent = '';
}, 250);

soundButton.addEventListener('click', () => {
    state.sound = !state.sound;
    render();
    saveState();
});

el('reset-button').addEventListener('click', () => {
    if (!confirm('Reset your counter, records and achievements?')) return;
    Object.assign(state, { count: 0, bestCombo: 0, bestCps: 0, unlocked: [] });
    render();
    renderAchievements();
    saveState();
});

el('share-button').addEventListener('click', async () => {
    const text = `I clicked ${state.count.toLocaleString()} times on Just Click (best: ${state.bestCps} CPS, ${state.bestCombo}x combo). Can you beat me?`;
    const url = location.origin + '/';
    try {
        if (navigator.share) {
            await navigator.share({ title: 'Just Click', text, url });
        } else {
            await navigator.clipboard.writeText(`${text} ${url}`);
            toast('📋 Copied to clipboard!');
        }
    } catch {
        // User cancelled the share sheet; nothing to do.
    }
});

render();
renderAchievements();
