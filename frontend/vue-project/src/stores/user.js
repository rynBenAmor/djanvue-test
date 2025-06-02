// src/stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: null,
        isAuthenticated: false,
    }),

    actions: {
        setUser(username) {
            this.username = username;
            this.isAuthenticated = true;
        },
        logout() {
            this.username = null;
            this.isAuthenticated = false;
        },
    },
    
    getters: {
        getUsername: (state) => state.username,
        isLoggedIn: (state) => state.isAuthenticated,
    },

    persist: {
        enabled: true, // Enable persistence for this store
        strategies: [
            {
                key: 'userState', // Key under which the state will be stored
                storage: localStorage, // or use sessionStorage for tab-exclusive persistence
            },
        ],
    }

});
// This store manages user authentication state.