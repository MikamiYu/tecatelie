// =====================================================
//  Tecateliê — product.js (Detalhes da Peça)
// =====================================================

const INSTAGRAM_USERNAME = 'tecatelierr';

// Fallback Mock Products
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
    },
    {
        id: 2,
        title: "CALÇA CARGO CUSTOM",
        category: "calcas",
        price: "R$ 220,00",
        size: "M",
        condition: "09/10 (CUSTOM)",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"
        ],
        description: "Calça cargo retrabalhada com bolsos utilitários e ajuste nas barras.",
        composition: "100% Jeans garimpado."
    }
];

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
const thumbImg1         = document.getElementById('thumbImg1');
const thumbImg2         = document.getElementById('thumbImg2');
const thumbImg3         = document.getElementById('thumbImg3');

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
    const imgs = (product.images && product.images.length > 0) ? product.images : [product.image];

    showcaseMainImg.src         = imgs[0] || product.image;
    thumbImg1.src               = imgs[0] || product.image;
    thumbImg2.src               = imgs[1] || imgs[0] || product.image;
    thumbImg3.src               = imgs[2] || imgs[0] || product.image;
    showcaseTitle.innerText     = product.title;
    showcasePrice.innerText     = product.price;
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
        tabContent.innerHTML = 'Aceitamos pagamentos via <strong>Crédito</strong> e <strong>Débito</strong> (Mercado Pago) e <strong>Pix</strong> à vista.';
    } else {
        tabContent.innerHTML = 'Clique no botão <strong>RESERVAR VIA DM</strong> abaixo para falar diretamente com a gente no Instagram!';
    }
}

loadProductDetail();
