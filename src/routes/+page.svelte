<script lang="ts">
    import Hero from '$lib/Hero.svelte';
    import Testimonial from '$lib/Testimonial.svelte';
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

<section id="labs" class="py-12 bg-white">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">What Others Say</h2>
        <!-- Testimonials Grid -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Testimonial
                image="person1a.jpg"
                text="The labs were clear, intuitive, and easy to follow. Thanks guys!"
                author="Aisha"
            />

            <Testimonial
                image="person2a.jpg"
                text="I love how hands-on and practical these labs are. Really helpful!"
                author="James"
            />

            <Testimonial
                image="person3a.jpg"
                text="The integration with Canvas LMS makes everything seamless."
                author="Sophia"
            />
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



