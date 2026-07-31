<script lang="ts">
    import Hero from '$lib/Hero.svelte';
</script>

<!-- Hero Section -->
<section class="hero min-h-screen bg-base-100">
    <div class="hero-content flex-col lg:flex-row">
        <img src="home_small.jpg" class="rounded-lg shadow-xl" alt="computer" />
        <div>
            <Hero />
        </div>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="py-12 bg-white">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
        <div class="flex flex-col items-center">
            <p class="mb-4">
                Interested in our AWS lab activities? Reach out to us today!
            </p>
            <a class="btn btn-primary" href="/contact">Contact Us</a>
        </div>
    </div>
</section>



