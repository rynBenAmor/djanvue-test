
### Project Overview

This project is a testing prototype to explore the integration between Vue (with Axios) and a headless Django backend (using DRF and SimpleJWT). It’s meant as a playground to learn and push boundaries.

---

### Topics Explored

#### Django (Backend)

* **APIView over ViewSets** – for full control without too much abstraction
* **Model serialization** – converting Django models to API-friendly formats
* **Form-style data CRUD** – using `application/x-www-form-urlencoded`
* **Media file uploads** – handling binary data via `multipart/form-data`
* **JWT authentication** – using SimpleJWT with custom permissions
* **ASGI architecture** – exploring async capabilities
* **WebSocket chat room** – real-time messaging system (no auth yet, but uses a random UUID per user to distinguish them — like Omegle minus the pedophiles)

#### Vue.js (Frontend)

* **Architecture** – explored views, components, and router navigation
* **ListView and DetailView** - using query params and model slug
* **Utility components** - like loaders and loaders and loaders, did i mention loaders?
* **Axios** – http requests and utility interceptors
* **Auth guards** – simple route protection and user feedback
* **Pinia + piniaPluginPersistedstate** – used for global state management (much cleaner than prop/emit chains)
* **Client-side auth** – login, token storage, and access control
* **Form submission & response handling** – for both text and file data
* **Options API lifecycle hooks** – used for connection setup, reactivity, etc.
* **WebSocket integration** – live chat with a scrollable, dynamic UI

