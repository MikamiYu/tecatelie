// =====================================================
//  Tecateliê — product.js (Detalhes da Peça)
// =====================================================

const INSTAGRAM_USERNAME = 'tecatelierr';

// Fallback (Vazio)
const fallbackProducts = [];

let currentProduct = null;
let currentTab     = 'desc';

// DOM Elements
const showcaseMainImg   = document.getElementById('showcaseMainImg');
const showcaseTitle     = document.getElementById('showcaseTitle');
const showcasePrice     = document.getElementById('showcasePrice');
const showcaseSize      = document.getElementById('showcaseSize');
const showcaseCondition = document.getElementById('showcaseCondition');
const tabContent        = document.getElementById('tabContent');
const igOrderBtn        = document.getElementById('igOrderBtn');

async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10) || 1;

    try {
        const SUPABASE_URL = 'https://lsxfmfijwoourcpwlxjf.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_nWn-gcZ5igGwPkTyjeus-Q_qpNz7-nF';

        const resp = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (resp.ok) {
            const data = await resp.json();
            currentProduct = (data && data.length > 0) ? data[0] : fallbackProducts.find(p => p.id === productId) || fallbackProducts[0];
        } else {
            currentProduct = fallbackProducts.find(p => p.id === productId) || fallbackProducts[0];
        }
    } catch (e) {
        currentProduct = fallbackProducts.find(p => p.id === productId) || fallbackProducts[0];
    }

    renderProductInfo(currentProduct);
}

function renderProductInfo(product) {
    if (!product) return;
    document.title = `Tecateliê | ${product.title}`;
    const imgs = (product.images && product.images.length > 0) 
        ? product.images.filter(Boolean) 
        : (product.image ? [product.image] : []);

    if (showcaseMainImg) showcaseMainImg.src = imgs[0] || '';

    // Renderizar miniaturas dinamicamente (somente a quantidade real de fotos)
    const thumbsBar = document.getElementById('thumbsBar');
    if (thumbsBar) {
        if (imgs.length <= 1) {
            thumbsBar.style.display = 'none';
        } else {
            thumbsBar.style.display = 'flex';
            thumbsBar.innerHTML = imgs.map((imgUrl, i) => `
                <div class="thumb-item ${i === 0 ? 'active' : ''}" onclick="changeShowcaseImage(${i})">
                    <img src="${imgUrl}" alt="Miniatura ${i + 1}">
                </div>
            `).join('');
        }
    }

    showcaseTitle.innerText = product.title;
    
    const hasDiscount = product.original_price && product.original_price.trim() !== '' && product.original_price !== product.price;
    if (hasDiscount) {
        showcasePrice.innerHTML = `<span class="showcase-old-price">${product.original_price}</span> ${product.price} <span class="pix-discount-tag">5% OFF NO PIX</span>`;
    } else {
        showcasePrice.innerHTML = `${product.price} <span class="pix-discount-tag">5% OFF NO PIX</span>`;
    }

    showcaseSize.innerText      = product.size;
    showcaseCondition.innerText = product.condition || '10/10';

    currentTab = 'desc';
    updateTabContent();

    const isSold = (product.status === 'sold' || product.status === 'vendido' || product.sold === true);

    if (igOrderBtn) {
        if (isSold) {
            igOrderBtn.innerText = 'VENDIDO';
            igOrderBtn.style.backgroundColor = '#333338';
            igOrderBtn.style.color = '#aaaaaa';
            igOrderBtn.style.pointerEvents = 'none';
            igOrderBtn.style.border = '1px solid #55555e';
            igOrderBtn.style.filter = 'grayscale(100%)';
            igOrderBtn.removeAttribute('href');
        } else {
            igOrderBtn.innerText = 'RESERVAR VIA DM';
            igOrderBtn.style.backgroundColor = 'var(--hot-pink)';
            igOrderBtn.style.color = 'var(--text-main)';
            igOrderBtn.style.pointerEvents = 'auto';
            igOrderBtn.href = `https://instagram.com/${INSTAGRAM_USERNAME}`;
        }
    }
}

window.changeShowcaseImage = function(index) {
    if (!currentProduct) return;
    const imgs = (currentProduct.images && currentProduct.images.length > 0) ? currentProduct.images : [currentProduct.image];
    showcaseMainImg.src = imgs[index] || currentProduct.image;
    document.querySelectorAll('.thumb-item').forEach((t, i) => t.classList.toggle('active', i === index));
};

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
    } else if (currentTab === 'pay') {
        tabContent.innerHTML = 'Aceitamos pagamentos via <strong>Crédito</strong> e <strong>Débito</strong> (Mercado Pago) e <strong>Pix</strong> à vista (com <strong>5% de DESCONTO EXCLUSIVO</strong> no Pix!).';
    } else {
        tabContent.innerHTML = 'Clique no botão <strong>RESERVAR VIA DM</strong> abaixo para falar diretamente com a gente no Instagram!';
    }
}

loadProductDetail();
