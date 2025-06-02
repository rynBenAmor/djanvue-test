<template>
    <div class="container">
        <h2 class="mb-3">Blog Posts</h2>
        <div class="row justify-content-center gap-2">
            <!-- Loader -->
             <loader-spinner v-if="loading" loading="loading"></loader-spinner>
            
            <!-- Display blog posts -->
            <div v-else-if="posts.length === 0" class="alert alert-info">No blog posts available.</div>
            
            <div v-else v-for="post in posts" :key="post.id" class="card col-4 mb-3">
                <img :src="post.get_blog_image" class="card-img-top object-fit-contain" style="height: 200px;"
                    :alt="post.title">
                <div class="card-body">
                    <h5 class="card-title">{{ post.title }}</h5>
                    <p class="card-text">{{ truncateText(post.content, 15 ) }}</p>
                    <router-link :to="post.get_absolute_url" class="btn btn-primary">Read More</router-link>
                    <p class="card-text">
                        <small class="text-muted">
                            Posted by {{ post.get_author }} on {{ post.created_at }}
                        </small>
                    </p>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import LoaderSpinner from '@/components/LoaderSpinner.vue';

export default {
    name: 'BlogView',
    components: {LoaderSpinner,},
        
    
    data() {
        return {
            posts: [],
            loading: false,
        };
    },
    mounted() {
        this.fetchPosts();
    },
    methods: {
        async fetchPosts() {
            this.loading = true;
            try {
                const res = await axios.get(`${BACKEND_URL}/blog/posts/`);
                this.posts = res.data;
            } catch (error) {
                console.error('Error fetching blog posts:', error);
                this.posts = [];
            } finally {
                this.loading = false;
            }
        },
        truncateText(text, length = 100) {
            if (!text) return '';
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        },
    },
};
</script>