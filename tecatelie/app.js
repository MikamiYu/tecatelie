// =====================================================
//  Tecateliê — app.js (sem import, funciona local)
// =====================================================

const INSTAGRAM_USERNAME = 'tecatelierr';

// ── Placeholder ──────────────────────────────────────────────────
const fallbackProducts = [
    {
        id: 1,
        title: "JAQUETA VINTAGE UPCYCLED",
        category: "jaquetas",
        price: "R$ 189,00",
        size: "G",
        condition: "10/10 (UPCYCLED)",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
        ],
        description: "Jaqueta vintage reconstruída à mão com patches exclusivos e detalhes únicos. Peça única — não existe outra igual.",
        composition: "100% Poliéster reciclado de garimpo vintage. Patches costurados individualmente."
    }
];

// ── Estado ───────────────────────────────────────────────────────
let currentProduct = null;
let currentTab     = 'desc';
let allProducts    = [];

// ── DOM ──────────────────────────────────────────────────────────
const catalogGrid       = document.getElementById('catalogGrid');
const showcaseSection   = document.getElementById('featured');
const showcaseMainImg   = document.getElementById('showcaseMainImg');
const showcaseTitle     = document.getElementById('showcaseTitle');
const showcasePrice     = document.getElementById('showcasePrice');
const showcaseCategory  = document.getElementById('showcaseCategory');
const showcaseSize      = document.getElementById('showcaseSize');
const showcaseCondition = document.getElementById('showcaseCondition');
const tabContent        = document.getElementById('tabContent');
const igOrderBtn        = document.getElementById('igOrderBtn');
const thumbImg1         = document.getElementById('thumbImg1');
const thumbImg2         = document.getElementById('thumbImg2');
const thumbImg3         = document.getElementById('thumbImg3');

// ── Buscar do Supabase (se disponível) ───────────────────────────
async function fetchProducts() {
    try {
        const SUPABASE_URL = 'https://lsxfmfijwoourcpwlxjf.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_nWn-gcZ5igGwPkTyjeus-Q_qpNz7-nF';

        const resp = await fetch(`${SUPABASE_URL}/rest/v1/products?status=eq.available&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (resp.ok) {
            const data = await resp.json();
            allProducts = (data && data.length > 0) ? data : fallbackProducts;
        } else {
            allProducts = fallbackProducts;
        }
    } catch (e) {
        allProducts = fallbackProducts;
    }
    renderCatalog('all');
}

// ── Renderizar catálogo ──────────────────────────────────────────
function renderCatalog(filter) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = (!filter || filter === 'all')
        ? allProducts
        : allProducts.filter(p => p.category === filter);

    if (!filtered.length) {
        catalogGrid.innerHTML = '<p style="color:#8e8e9e;padding:2.5rem;text-align:center;grid-column:1/-1;font-family:monospace">Nenhuma peça nesta categoria no momento.</p>';
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
                <span class="ticket-tag">${product.category.toUpperCase()}</span>
                <h3 class="ticket-title">${product.title}</h3>
                <div class="ticket-footer">
                    <span class="ticket-price">${product.price}</span>
                    <span class="ticket-size">TAM: ${product.size}</span>
                    <span class="ticket-buy-badge">VER</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            loadShowcase(product);
            showcaseSection.style.display = 'block';
            showcaseSection.scrollIntoView({ behavior: 'smooth' });
        });

        catalogGrid.appendChild(card);
    });
}

// ── Carregar produto na vitrine ──────────────────────────────────
function loadShowcase(product) {
    currentProduct = product;
    const imgs = (product.images && product.images.length > 0) ? product.images : [product.image];

    showcaseMainImg.src         = imgs[0] || product.image;
    thumbImg1.src               = imgs[0] || product.image;
    thumbImg2.src               = imgs[1] || imgs[0] || product.image;
    thumbImg3.src               = imgs[2] || imgs[0] || product.image;
    showcaseTitle.innerText     = product.title;
    showcasePrice.innerText     = product.price;
    showcaseCategory.innerText  = product.category.toUpperCase();
    showcaseSize.innerText      = product.size;
    showcaseCondition.innerText = product.condition || '—';

    currentTab = 'desc';
    updateTabContent();
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const firstTab = document.querySelector('.tab-btn');
    if (firstTab) firstTab.classList.add('active');

    if (igOrderBtn) igOrderBtn.href = `https://instagram.com/${INSTAGRAM_USERNAME}`;
}

// ── Trocar imagem ────────────────────────────────────────────────
window.changeShowcaseImage = function(index) {
    if (!currentProduct) return;
    const imgs = (currentProduct.images && currentProduct.images.length > 0) ? currentProduct.images : [currentProduct.image];
    showcaseMainImg.src = imgs[index] || currentProduct.image;
    document.querySelectorAll('.thumb-item').forEach((t, i) => t.classList.toggle('active', i === index));
};

// ── Trocar aba ───────────────────────────────────────────────────
window.switchTab = function(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabName));
    });
    updateTabContent();
};

function updateTabContent() {
    if (!currentProduct || !tabContent) return;
    if (currentTab === 'desc') {
        tabContent.innerHTML = currentProduct.description || 'Sem descrição.';
    } else if (currentTab === 'comp') {
        tabContent.innerHTML = currentProduct.composition || 'Sem informação de composição.';
    } else {
        tabContent.innerHTML = 'Clique no botão <strong>FALAR NO INSTAGRAM DM</strong> abaixo para falar diretamente com a gente!';
    }
}

// ── Filtro dropdown ──────────────────────────────────────────────
const filterToggle = document.getElementById('filterToggle');
const filterList   = document.getElementById('filterList');
const filterArrow  = document.getElementById('filterArrow');
const filterLabel  = document.getElementById('filterLabel');
const filterItems  = document.querySelectorAll('.filter-item');

if (filterToggle && filterList) {
    filterToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        filterList.classList.toggle('open');
        if (filterArrow) filterArrow.classList.toggle('open');
    });

    document.addEventListener('click', function() {
        filterList.classList.remove('open');
        if (filterArrow) filterArrow.classList.remove('open');
    });

    filterList.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

filterItems.forEach(function(item) {
    item.addEventListener('click', function() {
        filterItems.forEach(function(i) { i.classList.remove('active'); });
        item.classList.add('active');
        if (filterLabel) filterLabel.textContent = item.textContent;
        if (filterList)  filterList.classList.remove('open');
        if (filterArrow) filterArrow.classList.remove('open');
        renderCatalog(item.getAttribute('data-filter'));
    });
});

// ── Iniciar ──────────────────────────────────────────────────────
fetchProducts();
