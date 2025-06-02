<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/blog">blog</router-link>
                    </li>

                    <li v-if="username" class="nav-item">
                        <span class="nav-link disabled" aria-disabled="true">{{ username }}</span>
                    </li>
                    <li v-if="username" class="nav-item">
                        <logout-button />
                    </li>
                    <li v-else class="nav-item">
                        <router-link class="nav-link" to="/login">Login</router-link>
                    </li>

                </ul>

            </div>
        </div>
    </nav>
</template>

<script>
import LogoutButton from '@/components/LogoutButton.vue';
import { useUserStore } from '@/stores/user';

export default {
    name: 'NavBar',
    components: { LogoutButton },
    data() {
        return {
            username: null,
        };
    },
    computed: {
        userStore() {
            return useUserStore();
        },
    },
    mounted() {
        this.username = this.userStore.username;
    },
    watch: {
        'userStore.username'(newUsername) {
            this.username = newUsername;
        },
    },
};

</script>