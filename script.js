// CONFIGURATION
// Set to FALSE to use real PHP backend, TRUE for testing in browser
const USE_MOCK_DATA = true; 
const API_URL = 'api.php';

// --- Mock Data ---
let alumniData = [
    { id: 1, name: 'Dr. Taimur Khan', batch: '2008', profession: 'Neurosurgeon', company: 'Shifa Int.', story: 'IMCB H-9 gave me the discipline to pursue medicine.', linkedin: '#', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Engr. Bilal Ahmed', batch: '2012', profession: 'Software Architect', company: 'Systems Ltd', story: 'From the computer labs of H-9 to leading tech teams.', linkedin: '#', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Lt. Col. Hamza Farooq', batch: '2005', profession: 'Army Officer', company: 'Pakistan Army', story: 'Discipline, honor, and duty. Values I learned at college serve me every day.', linkedin: '#', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' }
];

let memoriesData = [
    { id: 1, author: 'Ahmed Raza', content: 'Found this old photo from our final year trip to Murree.', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800', timestamp: '2 hours ago', likes: 24, comments: 5 },
    { id: 2, author: 'Kashif Mehmood', content: 'Just visited the college after 20 years. The new computer block looks amazing.', image: null, timestamp: '1 day ago', likes: 45, comments: 12 }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    fetchAlumni();
    fetchMemories();
});

// --- Navigation ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden-tab'));
    document.getElementById(tabId).classList.remove('hidden-tab');
    
    // Scroll to top
    window.scrollTo(0,0);
    
    // Nav highlighting
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
    const btn = document.getElementById('nav-' + tabId);
    if(btn && tabId !== 'join') {
        btn.classList.add('active-nav');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// --- Data Fetching ---
async function fetchAlumni() {
    if (USE_MOCK_DATA) {
        renderDirectory();
        renderSuccessStories();
        return;
    }
    try {
        const res = await fetch(`${API_URL}?action=get_alumni`);
        const data = await res.json();
        if(data.status === 'success') {
            alumniData = data.data;
            renderDirectory();
            renderSuccessStories();
        }
    } catch (e) { console.error("API Error", e); }
}

async function fetchMemories() {
    if (USE_MOCK_DATA) {
        renderMemories();
        return;
    }
    try {
        const res = await fetch(`${API_URL}?action=get_memories`);
        const data = await res.json();
        if(data.status === 'success') {
            memoriesData = data.data;
            renderMemories();
        }
    } catch (e) { console.error("API Error", e); }
}

// --- Rendering ---
function renderDirectory() {
    const grid = document.getElementById('directory-grid');
    const search = document.getElementById('dir-search').value.toLowerCase();
    const batchFilter = document.getElementById('dir-batch').value;
    
    grid.innerHTML = '';
    
    // Populate Batch Dropdown
    const batches = [...new Set(alumniData.map(a => a.batch))].sort().reverse();
    const batchSelect = document.getElementById('dir-batch');
    if (batchSelect.options.length === 1) { // Only populate once
        batches.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b;
            opt.innerText = b;
            batchSelect.appendChild(opt);
        });
    }

    const filtered = alumniData.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(search) || a.profession.toLowerCase().includes(search);
        const matchesBatch = batchFilter === 'All' || a.batch === batchFilter;
        return matchesSearch && matchesBatch;
    });

    filtered.forEach(alum => {
        const card = `
        <div class="card">
            <div class="card-header">
                <div class="card-avatar">
                    <img src="${alum.image}">
                </div>
            </div>
            <div class="card-body">
                <div class="card-top-row">
                    <div>
                        <h3 class="card-name">${alum.name}</h3>
                        <p class="card-batch">Batch of ${alum.batch}</p>
                    </div>
                    <a href="${alum.linkedin}" class="icon-btn"><i data-lucide="linkedin" style="height: 1.25rem; width: 1.25rem;"></i></a>
                </div>
                <div class="card-details">
                    <div class="card-detail-item"><i data-lucide="award" style="height: 1rem; width: 1rem; margin-right: 0.5rem;"></i> ${alum.profession}</div>
                    <div class="card-detail-item"><i data-lucide="map-pin" style="height: 1rem; width: 1rem; margin-right: 0.5rem;"></i> ${alum.company}</div>
                </div>
            </div>
        </div>`;
        grid.innerHTML += card;
    });
    lucide.createIcons();
}

function renderMemories() {
    const feed = document.getElementById('memories-feed');
    feed.innerHTML = '';

    memoriesData.forEach(mem => {
        const post = `
        <div class="memory-card">
            <div class="memory-header">
                <div class="composer-avatar" style="font-weight: 700; color: #475569;">
                    ${mem.author.charAt(0)}
                </div>
                <div>
                    <p style="font-size: 0.875rem; font-weight: 700;">${mem.author}</p>
                    <p style="font-size: 0.75rem; color: #6b7280;">${mem.timestamp}</p>
                </div>
            </div>
            <div class="memory-body">
                <p>${mem.content}</p>
            </div>
            ${mem.image ? `<div class="memory-img-container"><img src="${mem.image}" class="memory-img"></div>` : ''}
            <div class="memory-footer">
                <button class="btn-action"><i data-lucide="thumbs-up" style="height: 1rem; width: 1rem;"></i> Like</button>
                <button class="btn-action"><i data-lucide="message-square" style="height: 1rem; width: 1rem;"></i> Comment</button>
            </div>
        </div>`;
        feed.innerHTML += post;
    });
    lucide.createIcons();
}

function renderSuccessStories() {
    const container = document.getElementById('success-stories-container');
    const stories = alumniData.slice(0, 3).map((alum, idx) => `
        <div class="container" style="margin-bottom: 3rem;">
            <div class="story-container ${idx % 2 !== 0 ? 'reverse' : ''}">
                <div class="story-img-wrapper">
                    <img src="${alum.image}" class="story-img">
                </div>
                <div class="story-content">
                    <h3 style="font-size: 1.5rem; color: var(--slate-900); margin-bottom: 0.5rem;">${alum.name} <span style="color: var(--primary-blue); font-size: 1rem;">(Batch ${alum.batch})</span></h3>
                    <h4 style="font-size: 1.125rem; color: #4b5563; margin-bottom: 1rem;">${alum.profession} at ${alum.company}</h4>
                    <blockquote class="story-quote">"${alum.story}"</blockquote>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="text-center mb-12"><h2 style="font-size: 1.875rem; color: var(--slate-900);">Success Stories</h2></div>
        ${stories}
    `;
}

// --- Handlers ---
async function handleJoin(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('join-name').value,
        batch: document.getElementById('join-batch').value,
        profession: document.getElementById('join-profession').value,
        company: document.getElementById('join-company').value,
        linkedin: document.getElementById('join-linkedin').value,
        whatsapp: document.getElementById('join-whatsapp').value,
        story: document.getElementById('join-story').value,
        image: 'https://ui-avatars.com/api/?name=' + document.getElementById('join-name').value
    };

    if(USE_MOCK_DATA) {
        alumniData.unshift({...data, id: Date.now()});
        alert("Registered Successfully (Mock Mode)");
        switchTab('directory');
        renderDirectory();
    } else {
        const fd = new FormData();
        fd.append('action', 'add_alumni');
        fd.append('data', JSON.stringify(data));
        await fetch(API_URL, { method: 'POST', body: fd });
        alert("Registered Successfully!");
        window.location.reload();
    }
}

async function handlePostMemory(e) {
    e.preventDefault();
    const data = {
        author: document.getElementById('mem-author').value || 'Anonymous',
        content: document.getElementById('mem-content').value,
        image: document.getElementById('mem-image').value,
        timestamp: 'Just now'
    };

    if(USE_MOCK_DATA) {
        memoriesData.unshift({...data, id: Date.now(), likes:0, comments:0});
        renderMemories();
        document.getElementById('mem-content').value = '';
    } else {
        const fd = new FormData();
        fd.append('action', 'add_memory');
        fd.append('data', JSON.stringify(data));
        await fetch(API_URL, { method: 'POST', body: fd });
        window.location.reload();
    }
}