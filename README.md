# Shopify Warranty Addon Widget

This repository adds a simple, theme-installable warranty widget for Shopify Product Detail Pages (PDP).

Features
- Vanilla JS widget that fetches warranty plans and renders them on the PDP
- Configurable via data-attributes in the Liquid snippet
- Defaults to demo/stub API if no API is provided
- Adds selected warranty as a line item property when adding to cart (default behavior)

Installation
1. Checkout the `add/warranty-widget` branch.
2. Upload `dist/widget.min.js` and `src/styles.css` (or `dist/warranty-widget.css`) to your theme assets.
3. Include the snippet `snippets/warranty-widget.liquid` into your product template where you want the widget to appear:

   {% raw %}{% include 'warranty-widget' %}{% endraw %}

4. Configure `settings.warranty_api_url` in your theme settings (optional). The snippet will pass the `product.id` to the widget so it can fetch plans.

Usage & Configuration
- data-warranty-api: URL to fetch warranty plans. If omitted, demo data will be used.
- data-mount: CSS selector to mount the widget. Defaults to `#warranty-widget`.

Behavior
- The widget fetches plans and renders user-selectable warranty options.
- When a plan is selected it will attach the selected warranty to the product add-to-cart form as a line item property named `Warranty` (if a form is detected). Otherwise it calls a configured callback.

Developer
- Build: none required for this initial release; `dist/widget.min.js` is provided.

License: MIT
