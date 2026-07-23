// api.js - small wrapper to fetch warranty plans
const demoPlans = [
  { id: 'w1', name: '1 Year Protection', price: '9.99', price_display: '$9.99', term: '1 year' },
  { id: 'w2', name: '2 Year Protection', price: '16.99', price_display: '$16.99', term: '2 years' }
];

export async function fetchPlans(productId, apiUrl) {
  // If apiUrl is not provided, return demo data
  if (!apiUrl) {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 250));
    return demoPlans;
  }

  // Append product query param if needed
  const url = new URL(apiUrl, window.location.origin);
  if (productId) url.searchParams.set('product_id', productId);

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch warranty plans');
  const data = await res.json();
  return data.plans || data;
}
