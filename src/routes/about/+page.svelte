<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Picture from '$lib/Picture.svelte';
  import Seo from '$lib/Seo.svelte';
</script>

<Seo
  title="About"
  description="Clearbyte helps schools build hands-on AWS lab activities out of byte-size steps, delivered inside the LMS they already use."
/>

<Section>
  <Container>
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <h1 class="text-h1">Cloud skills need a real cloud &mdash; and smaller steps.</h1>
        <p class="mt-6 text-lead text-base-content/70">
          Clearbyte is built for schools. It gives instructors a way to create
          AWS lab activities out of byte-size steps, and gives students a real
          AWS account to do the work in.
        </p>
      </div>

      <figure class="overflow-hidden rounded-box shadow-card">
        <!-- retina off: the source is 500x333, so there is no honest 2x. -->
        <Picture
          base="/students-collaborating"
          alt="Students working together on laptops"
          width={500}
          height={333}
          retina={false}
          class="h-auto w-full"
        />
      </figure>
    </div>
  </Container>
</Section>

<Section tone="muted">
  <Container>
    <h2 class="text-h2">For classrooms, not corporate training</h2>
    <p class="mt-4 max-w-readable text-base-content/70">
      Everything here is shaped around how a course actually runs &mdash; a
      class period to finish the work, and a gradebook at the end.
    </p>

    <div class="mt-10 grid gap-6 md:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Labs are built from small steps</h3>
        <p class="mt-2 text-base-content/70">
          More steps, each one small enough that a student can tell whether it
          worked before moving on.
        </p>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">It lives in your LMS</h3>
        <p class="mt-2 text-base-content/70">
          Labs launch from your course over LTI 1.3. Students sign in the way
          they already do, and scores return to your gradebook.
        </p>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Accounts are disposable</h3>
        <p class="mt-2 text-base-content/70">
          Each lab runs in an account provisioned for it and destroyed when it
          ends. No lingering resources, no surprise bills.
        </p>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Grading looks at the account</h3>
        <p class="mt-2 text-base-content/70">
          Work is assessed against what was actually built in AWS, rather than a
          screenshot pasted into a document.
        </p>
      </div>
    </div>
  </Container>
</Section>

<Section>
  <Container>
    <div class="text-center">
      <h2 class="text-h2">Teaching a cloud course this term?</h2>
      <p class="mx-auto mt-4 max-w-readable text-base-content/70">
        We'll set up demo seats matched to what you're covering.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a href="/demo" class="btn btn-primary btn-lg">Request a demo</a>
        <a href="/contact" class="btn btn-outline btn-lg">Contact us</a>
      </div>
    </div>
  </Container>
</Section>
