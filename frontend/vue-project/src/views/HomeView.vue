<template>
    <div v-if="profilePicUrl" class="container mt-4">
        <h2 class="mb-3">Profile Picture</h2>

        <!-- Display current profile picture -->
        <div class="mb-3">
            <img v-if="profilePicUrl" :src="profilePicUrl" alt="Profile" class="img-thumbnail" style="max-width: 200px;"
                @error="onImgError" />
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
</template>

<script>
import axios from 'axios';
import { BACKEND_URL } from '@/config';


export default {
    name: 'ProfilePic',
    data() {
        return {
            selectedFile: null,
            profilePicUrl: null,
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
            axios.get(`${BACKEND_URL}/user/me/`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            })
                .then(res => {

                    this.profilePicUrl = res.data.get_profile_pic;
                    this.message = '';
                })
                .catch(err => {
                    console.error(err);
                    this.message = 'Failed to load profile.';
                    this.success = false;
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

                    this.profilePicUrl = res.data.get_profile_pic;
                    this.message = 'Profile picture updated!';
                    this.success = true;
                    this.selectedFile = null;
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