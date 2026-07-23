// widget.js - renders warranty options and handles interactions
import { fetchPlans } from "./api.js";
import './styles.css';

export const WarrantyWidget = (() => {
  const defaultOptions = {
    mountSelector: '#warranty-widget',
    apiUrl: null,
    productId: null,
    storeKey: null,
    onPlanSelected: null // callback(plan)
  };

  function createRoot(mountEl) {
    const root = document.createElement('div');
    root.className = 'warranty-widget-root';
    root.innerHTML = `
      <div class="warranty-header">Warranty</div>
      <div class="warranty-body">Loading plans…</div>
    `;
    mountEl.appendChild(root);
    return root;
  }

  function renderPlans(container, plans) {
    if (!plans || plans.length === 0) {
      container.innerHTML = '<div class="warranty-none">No warranty available for this product.</div>';
      return;
    }
    const list = document.createElement('div');
    list.className = 'warranty-list';
    plans.forEach(plan => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'warranty-item';
      item.setAttribute('aria-pressed', 'false');
      item.innerHTML = `
        <div class="warranty-name">${escapeHtml(plan.name)}</div>
        <div class="warranty-price">${escapeHtml(plan.price_display || plan.price)}</div>
        <div class="warranty-term">${escapeHtml(plan.term || '')}</div>
      `;
      item.addEventListener('click', () => {
        document.querySelectorAll('.warranty-item').forEach(i => i.setAttribute('aria-pressed', 'false'));
        item.setAttribute('aria-pressed', 'true');
        onSelectPlan(plan);
      });
      list.appendChild(item);
    });
    container.innerHTML = '';
    container.appendChild(list);
  }

  function escapeHtml(s){
    if (!s) return '';
    return String(s).replace(/[&<>\"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function onSelectPlan(plan) {
    // Default action: find add-to-cart form and add a hidden property input
    const form = document.querySelector('form[action*="/cart/add"], form[action*="cart/add"], form#add_to_cart, form.product-form');
    if (form) {
      // Remove previous property inputs we added
      const prev = form.querySelector('input[name="properties[Warranty]"]');
      if (prev) prev.remove();
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'properties[Warranty]';
      input.value = plan.name + ' — ' + (plan.price_display || plan.price || '');
      form.appendChild(input);
      // Optionally trigger user callback
      if (currentOptions.onPlanSelected) currentOptions.onPlanSelected(plan);
      // Small UI feedback
      const note = document.querySelector('.warranty-selected-note');
      if (note) note.textContent = `Selected warranty: ${plan.name}`;
      else {
        const el = document.createElement('div');
        el.className = 'warranty-selected-note';
        el.textContent = `Selected warranty: ${plan.name}`;
        form.parentNode.insertBefore(el, form.nextSibling);
      }
    } else {
      if (currentOptions.onPlanSelected) currentOptions.onPlanSelected(plan);
      console.warn('WarrantyWidget: No add-to-cart form found; plan selected callback invoked.');
    }
  }

  let currentOptions = Object.assign({}, defaultOptions);

  async function init(options = {}){
    currentOptions = Object.assign({}, defaultOptions, options);
    const mountEl = options.mountElement || document.querySelector(currentOptions.mountSelector);
    if (!mountEl) {
      console.warn('WarrantyWidget: mount element not found:', currentOptions.mountSelector);
      return;
    }
    const root = createRoot(mountEl);
    try {
      const plans = await fetchPlans(currentOptions.productId, currentOptions.apiUrl);
      const container = root.querySelector('.warranty-body');
      renderPlans(container, plans);
    } catch (err) {
      const container = root.querySelector('.warranty-body');
      container.innerHTML = '<div class="warranty-error">Unable to load warranty plans.</div>';
      console.error('WarrantyWidget: failed to fetch plans', err);
    }
  }

  return { init };
})();

export default WarrantyWidget;
