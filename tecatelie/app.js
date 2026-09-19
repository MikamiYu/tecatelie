// =====================================================
//  Tecateliê — app.js (sem import, funciona local)
// =====================================================

const INSTAGRAM_USERNAME = 'tecatelierr';

// ── Placeholder (Vazio) ──────────────────────────────────────────
const fallbackProducts = [];

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

        const resp = await fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.desc`, {
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

// ── Nav Drawer Controls ──────────────────────────────────────────
window.openNavDrawer = function() {
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('navDrawerOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
};

window.closeNavDrawer = function() {
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('navDrawerOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
};

window.toggleDrawerSubmenu = function() {
    const sub = document.getElementById('drawerSubmenu');
    const arrow = document.getElementById('subArrow');
    if (!sub) return;
    const isOpen = sub.classList.contains('open');
    if (isOpen) {
        sub.classList.remove('open');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        sub.classList.add('open');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
};

window.selectDrawerCategory = function(filterVal) {
    window.closeNavDrawer();
    const targetItem = document.querySelector(`.filter-item[data-filter="${filterVal}"]`);
    if (targetItem) {
        targetItem.click();
    } else {
        renderCatalog(filterVal);
    }
};

// ── Renderizar catálogo ──────────────────────────────────────────
function renderCatalog(filter) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = (!filter || filter === 'all')
        ? allProducts
        : allProducts.filter(p => {
            const cat = (p.category || '').toLowerCase();
            if (filter === 'superior') {
                return cat === 'superior' || cat === 'blusas' || cat === 'jaquetas';
            }
            if (filter === 'inferior') {
                return cat === 'inferior' || cat === 'calcas' || cat === 'shorts';
            }
            if (filter === 'acessorios') {
                return cat === 'acessorios' || cat === 'sapatos';
            }
            return cat === filter;
        });

    if (!filtered.length) {
        catalogGrid.innerHTML = '<p style="color:#8e8e9e;padding:2.5rem;text-align:center;grid-column:1/-1;font-family:var(--font-body)">Nenhuma peça nesta categoria no momento.</p>';
        return;
    }

    filtered.forEach(product => {
        const isSold = (product.status === 'sold' || product.status === 'vendido' || product.sold === true);
        const hasDiscount = product.original_price && product.original_price.trim() !== '' && product.original_price !== product.price;

        const card = document.createElement('div');
        card.className = `ticket-card ${isSold ? 'sold' : ''}`;
        const imgUrl = product.image || (product.images && product.images[0]) || '';

        let badgeHtml = '';
        if (isSold) {
            badgeHtml = '<span class="sold-badge">VENDIDO</span>';
        } else if (hasDiscount) {
            badgeHtml = '<span class="discount-badge">PROMO</span>';
        }

        let priceHtml = '';
        if (hasDiscount) {
            priceHtml = `<span class="ticket-old-price">${product.original_price}</span> <span class="ticket-price promo">${product.price}</span>`;
        } else {
            priceHtml = `<span class="ticket-price">${product.price}</span>`;
        }

        card.innerHTML = `
            <div class="ticket-img-wrapper">
                ${badgeHtml}
                <img src="${imgUrl}" alt="${product.title}" loading="lazy">
            </div>
            <div class="ticket-content">
                <h3 class="ticket-title">${product.title}</h3>
                <div class="ticket-footer">
                    <div>${priceHtml}</div>
                    <span class="ticket-size">TAM: ${product.size}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
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

// ── Hero Slider Controls ─────────────────────────────────────────
let currentHeroSlide = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots   = document.querySelectorAll('.hero-slider-dot');
let heroSlideTimer = null;

window.setHeroSlide = function(index) {
    if (!heroSlides.length) return;
    currentHeroSlide = index;
    if (currentHeroSlide < 0) currentHeroSlide = heroSlides.length - 1;
    if (currentHeroSlide >= heroSlides.length) currentHeroSlide = 0;

    heroSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentHeroSlide);
        const video = slide.querySelector('video');
        if (video) {
            if (i === currentHeroSlide) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        }
    });

    heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentHeroSlide);
    });

    resetHeroAutoSlide();
};

window.prevHeroSlide = function() {
    setHeroSlide(currentHeroSlide - 1);
};

window.nextHeroSlide = function() {
    setHeroSlide(currentHeroSlide + 1);
};

function resetHeroAutoSlide() {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
        setHeroSlide(currentHeroSlide + 1);
    }, 6000);
}

if (heroSlides.length > 1) {
    resetHeroAutoSlide();
}

