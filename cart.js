var cart = JSON.parse(localStorage.getItem('drydrop_cart') || '[]');

function saveCart() { localStorage.setItem('drydrop_cart', JSON.stringify(cart)); }

function addToCart(name, color, colorHex, qty) {
  qty = qty || 1;
  var id = 'drydrop-' + color;
  var existing = cart.find(function(i){ return i.id === id; });
  if (existing) existing.qty += qty;
  else cart.push({ id: id, name: name, color: color, colorHex: colorHex, price: 399, qty: qty, icon: '☂' });
  saveCart();
  updateCartUI();
  showToast('✅ ' + qty + ' × DryDrop ' + color + ' ajouté !');
  bumpCount();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(function(i){ return i.id !== id; });
  saveCart(); updateCartUI();
}

function changeQty(id, delta) {
  var item = cart.find(function(i){ return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

function clearCart() {
  cart = []; saveCart(); updateCartUI();
  showToast('🗑️ Panier vidé');
}

function updateCartUI() {
  var total = cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
  var count = cart.reduce(function(s,i){ return s + i.qty; }, 0);
  var countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = count;
  var body = document.getElementById('cart-body');
  var footer = document.getElementById('cart-footer');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty"><span class="empty-icon">🛒</span>Votre panier est vide.</div>';
    if (footer) footer.style.display = 'none';
  } else {
    body.innerHTML = cart.map(function(item) {
      return '<div class="cart-item"><div class="cart-item-icon" style="background:' + item.colorHex + ';font-size:24px;color:#fff;">☂</div><div class="cart-item-info"><strong>' + item.name + '</strong><div style="font-size:12px;color:#888;margin-bottom:2px;">' + item.color + '</div><div class="item-price">' + (item.price * item.qty).toLocaleString('fr-MA') + ' MAD</div><div class="cart-item-qty"><button class="qty-btn" onclick="changeQty(\'' + item.id + '\',-1)">−</button><span class="qty-val">' + item.qty + '</span><button class="qty-btn" onclick="changeQty(\'' + item.id + '\',1)">+</button></div></div><button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')">✕</button></div>';
    }).join('');
    if (footer) { footer.style.display = 'block'; }
    var totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = total.toLocaleString('fr-MA') + ' MAD';
  }
}

function openCart() {
  var s = document.getElementById('cart-sidebar');
  var o = document.getElementById('cart-overlay');
  if (s) s.classList.add('open');
  if (o) o.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  var s = document.getElementById('cart-sidebar');
  var o = document.getElementById('cart-overlay');
  if (s) s.classList.remove('open');
  if (o) o.classList.remove('open');
  document.body.style.overflow = '';
}

function checkout() {
  showToast('🎉 Commande confirmée ! Merci pour votre achat.');
  cart = []; saveCart(); updateCartUI(); closeCart();
}

function bumpCount() {
  var el = document.getElementById('cart-count');
  if (!el) return;
  el.classList.add('bump');
  setTimeout(function(){ el.classList.remove('bump'); }, 300);
}

var toastTimer;
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2800);
}

function toggleFaq(el) { el.parentElement.classList.toggle('open'); }

document.addEventListener('DOMContentLoaded', function(){ updateCartUI(); });
