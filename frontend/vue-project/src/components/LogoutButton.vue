<template>

    <form @submit.prevent="logout">
        <button class="btn btn-outline-danger" type="submit">Logout</button>
    </form>
</template>


<script>
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { useUserStore } from '@/stores/user';

export default {
    name: 'LogoutButton',

    computed: {
        // initiate the store reactively and make it a property
        userStore() {
            return useUserStore();
        }
    },
    methods: {
        async logout() {
            try {
                const refresh = localStorage.getItem('refresh_token');
                await axios.post(BACKEND_URL + '/user/logout/', { refresh });

            } catch (err) {
                console.error('Logout error:', err);
            } finally {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                delete axios.defaults.headers.common['Authorization'];

                this.userStore.logout(); // Clear user store state

                this.$router.push('/login'); // optional redirect
            }
        }

    }
}
</script>