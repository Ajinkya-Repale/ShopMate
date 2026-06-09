const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'your-admin-secret';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const text = await res.text();
  if (!text) throw new Error(`Request failed (HTTP ${res.status})`);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response (HTTP ${res.status})`);
  }
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data.data;
};

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password, phone) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    }).then(handleResponse),

  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  adminRegister: (name, email, password, phone) =>
    fetch(`${BASE_URL}/auth/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': ADMIN_SECRET,
      },
      body: JSON.stringify({ name, email, password, phone }),
    }).then(handleResponse),
};

// ── Products ──────────────────────────────────────────
export const productAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/products`, { headers: getAuthHeaders() }).then(handleResponse),

  getById: (id) =>
    fetch(`${BASE_URL}/products/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

  getByCategory: (category) =>
    fetch(`${BASE_URL}/products/category/${category}`, { headers: getAuthHeaders() }).then(handleResponse),

  search: (q) =>
    fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(q)}`, { headers: getAuthHeaders() }).then(handleResponse),

  getByBrand: (brand) =>
    fetch(`${BASE_URL}/products/brand/${brand}`, { headers: getAuthHeaders() }).then(handleResponse),
};

// ── Cart ──────────────────────────────────────────────
export const cartAPI = {
  getCart: () =>
    fetch(`${BASE_URL}/cart`, { headers: getAuthHeaders() }).then(handleResponse),

  addToCart: (productId, quantity = 1) =>
    fetch(`${BASE_URL}/cart/add?productId=${productId}&quantity=${quantity}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateItem: (productId, quantity) =>
    fetch(`${BASE_URL}/cart/update?productId=${productId}&quantity=${quantity}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  removeItem: (productId) =>
    fetch(`${BASE_URL}/cart/remove?productId=${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  clearCart: () =>
    fetch(`${BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ── Wishlist ──────────────────────────────────────────
export const wishlistAPI = {
  getWishlist: () =>
    fetch(`${BASE_URL}/wishlist`, { headers: getAuthHeaders() }).then(handleResponse),

  add: (productId) =>
    fetch(`${BASE_URL}/wishlist/add/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  remove: (productId) =>
    fetch(`${BASE_URL}/wishlist/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ── Orders ────────────────────────────────────────────
export const buildAddress = (rawText) => ({
  street: rawText,
  city: '',
  state: '',
  pincode: '',
  country: '',
});

export const orderAPI = {
  placeOrder: (shippingAddress, paymentMethod, couponCode) =>
    fetch(`${BASE_URL}/orders/place`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ shippingAddress, paymentMethod, couponCode }),
    }).then(handleResponse),

  getMyOrders: () =>
    fetch(`${BASE_URL}/orders/my-orders`, { headers: getAuthHeaders() }).then(handleResponse),

  getById: (id) =>
    fetch(`${BASE_URL}/orders/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

  cancelOrder: (id) =>
    fetch(`${BASE_URL}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ── Reviews ───────────────────────────────────────────
export const reviewAPI = {
  getProductReviews: (productId) =>
    fetch(`${BASE_URL}/reviews/${productId}`, { headers: getAuthHeaders() }).then(handleResponse),

  addReview: (productId, rating, comment, productName = '') =>
    fetch(`${BASE_URL}/reviews/${productId}?rating=${rating}&comment=${encodeURIComponent(comment)}&productName=${encodeURIComponent(productName)}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getMyReviews: () =>
    fetch(`${BASE_URL}/reviews/my-reviews`, { headers: getAuthHeaders() }).then(handleResponse),

  getAllReviews: () =>
    fetch(`${BASE_URL}/reviews/all`).then(handleResponse),
};

// ── Coupon (User) ─────────────────────────────────────
export const couponAPI = {
  apply: (code, orderTotal) =>
    fetch(`${BASE_URL}/coupon/apply?orderTotal=${orderTotal}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code }),
    }).then(handleResponse),
};

// ── Coupon (Admin) ────────────────────────────────────
export const adminCouponAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/coupon/admin/all`, { headers: getAuthHeaders() }).then(handleResponse),

  create: (coupon) =>
    fetch(`${BASE_URL}/coupon/admin/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(coupon),
    }).then(handleResponse),

  toggle: (id) =>
    fetch(`${BASE_URL}/coupon/admin/${id}/toggle`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/coupon/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ── User Profile ──────────────────────────────────────
export const userAPI = {
  getProfile: () =>
    fetch(`${BASE_URL}/user/profile`, { headers: getAuthHeaders() }).then(handleResponse),

  updateProfile: (data) =>
    fetch(`${BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// ── Addresses ─────────────────────────────────────────
export const addressAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/user/addresses`, { headers: getAuthHeaders() }).then(handleResponse),

  add: (address) =>
    fetch(`${BASE_URL}/user/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    }).then(handleResponse),

  delete: (index) =>
    fetch(`${BASE_URL}/user/addresses/${index}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  setDefault: (index) =>
    fetch(`${BASE_URL}/user/addresses/${index}/default`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ── Return / Exchange ─────────────────────────────────
export const returnAPI = {
  submit: (orderId, productId, productName, quantity, type, reason) =>
    fetch(`${BASE_URL}/returns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, productId, productName, quantity, type, reason }),
    }).then(handleResponse),

  getMyRequests: () =>
    fetch(`${BASE_URL}/returns/my`, { headers: getAuthHeaders() }).then(handleResponse),

  getAll: () =>
    fetch(`${BASE_URL}/admin/returns`, { headers: getAuthHeaders() }).then(handleResponse),

  updateStatus: (id, status, adminNote = '') =>
    fetch(`${BASE_URL}/admin/returns/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminNote }),
    }).then(handleResponse),
};




