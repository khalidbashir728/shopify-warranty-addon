// Entry point for the Warranty Widget
import { WarrantyWidget } from "./widget.js";

// Expose a global API and auto-init if markup present
window.WarrantyWidget = window.WarrantyWidget || {};
window.WarrantyWidget.init = (options) => WarrantyWidget.init(options);

// Auto-initialize elements with data-warranty-mount attribute
document.addEventListener('DOMContentLoaded', () => {
  const mounts = document.querySelectorAll('[data-warranty-mount], #warranty-widget');
  mounts.forEach(el => {
    const api = el.getAttribute('data-warranty-api');
    const productId = el.getAttribute('data-product-id') || el.dataset.productId;
    const storeKey = el.getAttribute('data-store-key') || el.dataset.storeKey;
    const mount = el.getAttribute('data-warranty-mount') || `#${el.id}`;
    WarrantyWidget.init({ mountSelector: mount, apiUrl: api, productId, storeKey, mountElement: el });
  });
});
