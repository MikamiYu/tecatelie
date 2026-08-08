// =====================================================
//  Tecateliê — app.js  (Supabase + Mobile Responsive)
// =====================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://lsxfmfijwoourcpwlxjf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nWn-gcZ5igGwPkTyjeus-Q_qpNz7-nF';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configuration
const WHATSAPP_NUMBER    = '5511999999999';
const INSTAGRAM_USERNAME = 'tecatelierr';

// Fallback Mock Products (Used if DB table is empty initially)
const fallbackProducts = [
    {
        id: 1,
        title: "JAQUETA BOMBER CYBERPATCH",
        category: "tops",
        price: "R$ 189,00",
        size: "G",
        condition: "10/10 (UPCYCLED)",
        badge: "DESTACADO",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
        ],
        description: "Jaqueta corta-vento reconstruída à mão com patches holográficos e detalhes em viés refletivo. Peça única e resistente à água. Modelagem ampla streetwear.",
        composition: "100% Poliéster reciclado obtido através de garimpo vintage. Patches costurados individualmente em nylon resinado."
    },
    {
        id: 2,
        title: "CALÇA CARGO DECONSTRUCTED",
        category: "bottoms",
        price: "R$ 220,00",
        size: "M (40-42)",
        condition: "09/10 (CUSTOM)",
        badge: "EXCLUSIVO",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80"
        ],
        description: "Calça cargo jeans retrabalhada com bolsos utilitários sobrepostos em tons contrastantes. Ajuste com elásticos e reguladores na barra estilo Y2K.",
        composition: "100% Jeans pesado reaproveitado. Bolsos utilitários e reforços de costura dupla."
    },
    {
        id: 3,
        title: "ÓCULOS MATRIX CHROME",
        category: "accessories",
        price: "R$ 75,00",
        size: "ÚNICO",
        condition: "10/10 (NOVO)",
        badge: "Y2K VIBES",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
        ],
        description: "Óculos de sol vintage anos 2000 com armação metálica prateada cromada extremamente leve e lentes espelhadas. Proteção UV400 completa.",
        composition: "Armação de liga metálica leve e lentes de policarbonato espelhado."
    },
    {
        id: 4,
        title: "MOLETOM HOODIE ACID WASH",
        category: "tops",
        price: "R$ 160,00",
        size: "GG",
        condition: "10/10 (CUSTOM)",
        badge: "NOVO",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
        ],
        description: "Moletom oversized pesado com processo artesanal de desbotamento acid wash cinza. Estampa Tecateliê serigrafada com tinta puff com relevo na frente.",
        composition: "50% Algodão, 50% Poliéster. Felpa interna super macia e aquecida."
    }
];

// Current State
let currentProduct = null;
let currentTab     = 'desc';
let allProducts    = [];

// DOM Elements
const catalogGrid      = document.getElementById('catalogGrid');
const filterButtons    = document.querySelectorAll('.filter-btn');
const showcaseSection  = document.getElementById('featured');
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
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            console.log('Utilizando catálogo padrão...');
            allProducts = fallbackProducts;
        } else {
            allProducts = data;
        }
    } catch (e) {
        console.warn('Supabase offline ou tabela não criada. Exibindo dados padrão.', e);
        allProducts = fallbackProducts;
    }

    renderCatalog('all');
}

// ── Render Catalog ──────────────────────────────────────────────
function renderCatalog(filter = 'all') {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = filter === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === filter);

    if (!filtered.length) {
        catalogGrid.innerHTML = '<p style="color:#8e8e9e;padding:2rem;text-align:center;grid-column:1/-1;font-family:var(--font-mono)">Nenhuma peça disponível nesta categoria.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        const imgUrl = product.image || (product.images && product.images[0]) || '';
        
        card.innerHTML = `
            <div class="ticket-img-wrapper">
                <img src="${imgUrl}" alt="${product.title}" loading="lazy">
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
            showcaseSection.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Lock scroll on mobile when modal opens
        });

        catalogGrid.appendChild(card);
    });
}

// ── Load Product into Showcase ──────────────────────────────────
function loadProductToShowcase(product) {
    currentProduct = product;
    const imgs = product.images && product.images.length > 0 ? product.images : [product.image];

    showcaseMainImg.src     = imgs[0] || product.image;
    thumbImg1.src           = imgs[0] || product.image;
    thumbImg2.src           = imgs[1] || imgs[0] || product.image;
    thumbImg3.src           = imgs[2] || imgs[0] || product.image;
    
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

// ── Close Showcase Modal ────────────────────────────────────────
window.closeShowcase = function() {
    if (showcaseSection) {
        showcaseSection.style.display = 'none';
        document.body.style.overflow = 'auto'; // Unlock scroll
    }
};

// Close modal when clicking outside content box
if (showcaseSection) {
    showcaseSection.addEventListener('click', (e) => {
        if (e.target === showcaseSection) {
            window.closeShowcase();
        }
    });
}

// ── Showcase Image Switcher ─────────────────────────────────────
window.changeShowcaseImage = function(index) {
    if (!currentProduct) return;
    const imgs = currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images : [currentProduct.image];
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
        tabContent.innerHTML = `Para comprar, clique no botão <strong>GARANTIR PEÇA VIA WHATSAPP</strong> acima para falar diretamente com a equipe Tecateliê.`;
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
