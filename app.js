// 大学生協サンプルデータ
const mockProducts = [
    { id: 1, name: "生協特製から揚げ弁当", price: 450, category: "お弁当" },
    { id: 2, name: "サケおにぎり", price: 130, category: "軽食" },
    { id: 3, name: "ミニサラダ", price: 160, category: "サイド" },
    { id: 4, name: "緑茶 (500ml)", price: 110, category: "飲料" },
    { id: 5, name: "カツカレー", price: 500, category: "食堂" },
    { id: 6, name: "こだわり総菜パン", price: 180, category: "軽食" },
    { id: 7, name: "生協オリジナルノート (B5)", price: 90, category: "文具" },
    { id: 8, name: "黒ボールペン (0.5mm)", price: 120, category: "文具" },
    { id: 9, name: "デザートシュークリーム", price: 150, category: "スイーツ" },
    { id: 10, name: "チキンカツサンド", price: 320, category: "軽食" },
    { id: 11, name: "焼きたてクッキー", price: 120, category: "スイーツ" }
];

// 【修正箇所】localStorage から sessionStorage に変更
let appState = JSON.parse(sessionStorage.getItem('coop_cart_state')) || {
    initialBudget: 700,
    remainingBudget: 700,
    cart: []
};

// 【修正箇所】localStorage から sessionStorage に変更
function saveState() {
    sessionStorage.setItem('coop_cart_state', JSON.stringify(appState));
}

// 金額の再計算
function recalculateCart() {
    const totalCost = appState.cart.reduce((sum, item) => sum + item.price, 0);
    appState.remainingBudget = appState.initialBudget - totalCost;
    saveState();
}

// カゴに追加
function addToCart(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
        appState.cart.push(product);
        recalculateCart();
    }
}

// カゴから削除
function removeFromCart(index) {
    appState.cart.splice(index, 1);
    recalculateCart();
}

// 各画面の上部バーとバッジを更新する共通UI処理
function updateCommonUI() {
    recalculateCart();
    
    const initialBudgetEl = document.getElementById('status-initial-budget');
    const remainingEl = document.getElementById('status-remaining');
    const badgeEl = document.getElementById('cart-badge');
    const alertDiv = document.getElementById('remaining-alert');

    if (initialBudgetEl) initialBudgetEl.textContent = appState.initialBudget;
    if (remainingEl) remainingEl.textContent = appState.remainingBudget;
    if (badgeEl) badgeEl.textContent = appState.cart.length;
    
    if (alertDiv) {
        if (appState.remainingBudget < 0) {
            alertDiv.textContent = `⚠️ 予算を ${Math.abs(appState.remainingBudget)}円 オーバーしています！`;
        } else {
            alertDiv.textContent = "";
        }
    }
}

// ボタンHTML生成の共通化
function createCartButtonHtml(product) {
    const count = appState.cart.filter(item => item.id === product.id).length;
    if (count > 0) {
        return `<button class="add-cart-btn selected" onclick="actionAddToCart(${product.id})">${count}個選択済み</button>`;
    } else {
        return `<button class="add-cart-btn" onclick="actionAddToCart(${product.id})">かごへ</button>`;
    }
}