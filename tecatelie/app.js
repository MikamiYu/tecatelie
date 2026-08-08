// =====================================================
//  Tecateliê — app.js  (conectado ao Supabase)
// =====================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://lsxfmfijwoourcpwlxjf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nWn-gcZ5igGwPkTyjeus-Q_qpNz7-nF';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configuration
const WHATSAPP_NUMBER    = '5511999999999';
const INSTAGRAM_USERNAME = 'tecatelierr';

// Current State
let currentProduct = null;
let currentTab     = 'desc';
let allProducts    = [];

// DOM Elements
const catalogGrid     = document.getElementById('catalogGrid');
const filterButtons   = document.querySelectorAll('.filter-btn');
const showcaseSection = document.getElementById('featured');
const showcaseMainImg  = document.getElementById('showcaseMainImg');
const showcaseTitle    = document.getElementById('showcaseTitle');
const showcasePrice    = document.getElementById('showcasePrice');
const showcaseCategory = document.getElementById('showcaseCategory');
const showcaseSize     = document.getElementById('showcaseSize');
const showcaseCondition= document.getElementById('showcaseCondition');
const tabContent       = document.getElementById('tabContent');
const waOrderBtn       = document.getElementById('waOrderBtn');
const igOrderBtn       = document.getElementById('igOrderBtn');
const thumbImg1        = document.getElementById('thumbImg1');
const thumbImg2        = document.getElementById('thumbImg2');
const thumbImg3        = document.getElementById('thumbImg3');

// ── Fetch products from Supabase ────────────────────────────────
async function fetchProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar peças:', error.message);
        catalogGrid.innerHTML = '<p style="color:#e8478b;padding:2rem;text-align:center">Erro ao carregar peças. Tente novamente.</p>';
        return;
    }

    allProducts = data || [];
    renderCatalog('all');
}

// ── Render Catalog ──────────────────────────────────────────────
function renderCatalog(filter = 'all') {
    catalogGrid.innerHTML = '';

    const filtered = filter === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === filter);

    if (!filtered.length) {
        catalogGrid.innerHTML = '<p style="color:#8888a0;padding:2rem;text-align:center;grid-column:1/-1">Nenhuma peça disponível nesta categoria no momento.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.innerHTML = `
            <div class="ticket-img-wrapper">
                <img src="${product.image || product.images?.[0] || ''}" alt="${product.title}" loading="lazy">
            </div>
            <div class="ticket-content">
                <span class="ticket-tag">${product.category}</span>
                <h3 class="ticket-title">${product.title}</h3>
                <div class="ticket-footer">
                    <span class="ticket-price">${product.price}</span>
                    <span class="ticket-size">TAM: ${product.size}</span>
                    <span class="ticket-buy-badge">COMPRAR</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            loadProductToShowcase(product);
            showcaseSection.style.display = 'block';
            showcaseSection.scrollIntoView({ behavior: 'smooth' });
        });

        catalogGrid.appendChild(card);
    });
}

// ── Load Product into Showcase ──────────────────────────────────
function loadProductToShowcase(product) {
    currentProduct = product;
    const imgs = product.images || [product.image];

    showcaseMainImg.src     = imgs[0] || '';
    thumbImg1.src           = imgs[0] || '';
    thumbImg2.src           = imgs[1] || imgs[0] || '';
    thumbImg3.src           = imgs[2] || imgs[0] || '';
    showcaseTitle.innerText    = product.title;
    showcasePrice.innerText    = product.price;
    showcaseCategory.innerText = product.category;
    showcaseSize.innerText     = product.size;
    showcaseCondition.innerText= product.condition || '—';

    currentTab = 'desc';
    updateTabContent();

    const textMsg = encodeURIComponent(`Olá! Gostaria de comprar a peça "${product.title}" (${product.price}, TAM ${product.size}). Poderia me confirmar se está disponível?`);
    waOrderBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${textMsg}`;
    igOrderBtn.href = `https://instagram.com/${INSTAGRAM_USERNAME}`;
}

// ── Showcase Image Switch ───────────────────────────────────────
window.changeShowcaseImage = function(index) {
    if (!currentProduct) return;
    const imgs = currentProduct.images || [currentProduct.image];
    showcaseMainImg.src = imgs[index] || currentProduct.image;

    document.querySelectorAll('.thumb-item').forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });
};

// ── Tab Switching ───────────────────────────────────────────────
window.switchTab = function(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabName));
    });
    updateTabContent();
};

function updateTabContent() {
    if (!currentProduct) return;
    if (currentTab === 'desc') {
        tabContent.innerHTML = currentProduct.description || 'Sem descrição.';
    } else if (currentTab === 'comp') {
        tabContent.innerHTML = currentProduct.composition || 'Sem informação de composição.';
    } else if (currentTab === 'ship') {
        tabContent.innerHTML = `Para comprar, clique no botão <strong>GARANTIR PEÇA VIA WHATSAPP</strong> acima para falar diretamente com a equipe.`;
    }
}

// ── Filters ─────────────────────────────────────────────────────
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCatalog(btn.getAttribute('data-filter'));
    });
});

// ── Boot ────────────────────────────────────────────────────────
fetchProducts();
