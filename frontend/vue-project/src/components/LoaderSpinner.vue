<template>
    <!-- Loader -->
    <div v-if="loading" class="d-flex justify-content-center my-4">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>


<script>

export default {
    name: 'LoaderSpinner',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    }
};

</script>