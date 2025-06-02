<template>
    <!-- Loader -->
    <loader-spinner v-if="loading" loading="loading"></loader-spinner>
    <div v-else-if="user.id" class="container mt-4">
        <h1 class="text-center text-success">Welcome, {{ user.username }}!</h1>
        <h2 class="mb-3">Profile Picture</h2>

        <!-- Display current profile picture -->
        <div class="mb-3">
            <img v-if="user.get_profile_pic" :src="user.get_profile_pic" alt="Profile" class="img-thumbnail"
                style="max-width: 200px;" @error="onImgError" />
            <div v-else class="text-muted">No profile picture.</div>
        </div>

        <!-- Upload new picture -->
        <form @submit.prevent="uploadPicture">
            <input type="file" @change="onFileChange" accept="image/*" />
            <button class="btn btn-primary mt-2" :disabled="!selectedFile">Upload</button>
        </form>

        <div v-if="message" class="alert mt-2" :class="{ 'alert-success': success, 'alert-danger': !success }">
            {{ message }}
        </div>
    </div>

    <h1 v-else class="text-center text-info">Please Log In to see your profile !</h1>
</template>

<script>
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import LoaderSpinner from '@/components/LoaderSpinner.vue';

export default {
    name: 'HomeView',
    components: {LoaderSpinner, },
    
    data() {
        return {
            user: {},
            loading: false,
            selectedFile: null,

            message: '',
            success: false,
        };
    },
    mounted() {
        this.fetchProfile();
    },
    methods: {
        onFileChange(e) {
            this.selectedFile = e.target.files[0];
        },
        fetchProfile() {
            this.loading = true;
            axios.get(BACKEND_URL + '/user/me/', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            })
            .then(res => {
                this.user = res.data;
                this.message = '';
            })
            .catch(err => {
                console.error(err);
                this.message = 'Failed to load profile.';
                this.success = false;
            }).finally(() => {
                this.loading = false;
            });
        },
        uploadPicture() {
            const formData = new FormData();
            formData.append('profile_pic', this.selectedFile);

            axios.patch(BACKEND_URL + '/user/me/', formData, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    this.user = res.data;
                    this.message = 'Profile picture updated!';
                    this.success = true;
                    this.selectedFile = null;
                    this.fetchProfile();
                })
                .catch(err => {
                    console.error(err);
                    this.message = 'Upload failed.';
                    this.success = false;
                });
        },

        onImgError(e) {
            e.target.src = 'https://via.placeholder.com/200?text=No+Image';
        }
    }
};
</script>

<style scoped>
img {
    border-radius: 12px;
}
</style>