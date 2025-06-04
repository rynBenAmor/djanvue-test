/**
 * 1 - Axios rule of thumb (GET or with optional body for POST/PUT):
 * 
 * async function fetchData() {
 *   try {
 *     // For GET requests, just omit `data`
 *     // For POST/PUT, pass body as second argument (JS object, auto JSON stringified)
 *     const response = await axios.get('https://api.example.com/data', {
 *       headers: { Authorization: 'Bearer token' }
 *     });
 * 
 *     // Example POST with body:
 *     // const response = await axios.post('https://api.example.com/data', { name: 'John' }, {
 *     //   headers: { Authorization: 'Bearer token' }
 *     // });
 * 
 *     console.log('Success:', response.data);
 *   } catch (error) {
 *     console.error('Error:', error.response?.data || error.message);
 *   }
 * }
 * fetchData();
 *
 *
 * 2 - Fetch rule of thumb (GET or with optional body for POST/PUT):
 * 
 * async function fetchData() {
 *   try {
 *     const response = await fetch('https://api.example.com/data', {
 *       method: 'GET', // Change to POST, PUT etc when sending body
 *       headers: {
 *         Authorization: 'Bearer token',
 *         'Content-Type': 'application/json' // needed if sending JSON body
 *       },
 *       // For POST/PUT, include body as JSON string:
 *       // body: JSON.stringify({ name: 'John' })
 *     });
 * 
 *     if (!response.ok) throw new Error(`Error: ${response.status}`);
 * 
 *     const data = await response.json();
 *     console.log('Success:', data);
 *   } catch (error) {
 *     console.error('Error:', error.message);
 *   }
 * }
 * fetchData();
 */




## ✅ Honorable Mentions

| Plugin                   | Use Case                        |
| ------------------------ | ------------------------------- |
| `vue-chartjs`            | Chart rendering                 |
| `vue3-perfect-scrollbar` | Custom scrollbars               |
| `vue3-lottie`            | Animated illustrations (Lottie) |
| `vue-the-mask`           | Input masking                   |
| `vue-good-table`         | Advanced tables                 |

---

## 🔚 TL;DR – Best Addons for Options API

| Rank | Addon                  | Why You Want It        |
| ---- | ---------------------- | ---------------------- |
| 1    | Vue Router             | Routing, navigation    |
| 2    | Pinia                  | State management       |
| 3    | Pinia Persist          | Save state to storage  |
| 4    | VueUse (partial)       | Extra reactivity utils |
| 5    | VeeValidate            | Form validation        |
| 6    | Vue Meta / vueuse/head | SEO tags               |
| 7    | Vue I18n               | Translations           |
| 8    | Axios                  | HTTP requests          |
| 9    | Toastification         | Notifications          |
| 10   | Vue Modal              | Modals made simple     |

---
