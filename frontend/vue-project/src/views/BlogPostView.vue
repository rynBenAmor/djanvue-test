<template>
    <div class="container">
<h1>post detail</h1>
        <div class="row">
            <!-- Loader -->
            <div v-if="loading" class="d-flex justify-content-center my-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <div v-else-if="post.id" class="col-12 my-3">
                <h2 class="display-2"> {{ post.title }} </h2>
                <p class="text-muted">Posted by {{ post.get_author }} on {{ post.created_at }}</p>
                <img v-if="post.get_blog_image" :src="post.get_blog_image" class="img-fluid mb-3 w-25" alt="Blog Image">
                <div v-html="post.content" class="lead"></div>

            </div>
            <div v-else class="alert alert-danger">Post not found.</div>
        </div>

        

    </div>
</template>



<script>
import axios from 'axios';
import { BACKEND_URL } from '@/config';
export default {
    name: 'BlogPostView',

    data() {
        return {
            post: {},
            loading: false,
        };
    },
    mounted() {
        this.fetchPost();
    },
    methods: {
        async fetchPost() {
            this.loading = true;
            try {
                const postSlug = this.$route.params.post_slug;
                const res = await axios.get(`${BACKEND_URL}/blog/posts/${postSlug}/`);
                this.post = res.data;
            } catch (error) {
                console.error('Error fetching blog post:', error);
                this.post = {};
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>