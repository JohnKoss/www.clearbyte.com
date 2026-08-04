<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Prose from '$lib/Prose.svelte';
  import Picture from '$lib/Picture.svelte';
  import Seo from '$lib/Seo.svelte';
</script>

<Seo
  title="About"
  description="Clearbyte was built by a cloud computing instructor who wanted more control over lab activities than AWS Academy allows, and is shared with other institutions."
/>

<Section>
  <Container>
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <h1 class="text-h1">I built this because I needed it.</h1>
        <p class="mt-6 text-lead text-base-content/70">
          I teach cloud computing. I wanted lab activities I could shape around
          what my students were actually struggling with &mdash; so I wrote the
          tool that lets me do it.
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
  <Container width="readable">
    <Prose>
      <h2>Where it came from</h2>
      <p>
        AWS Academy comes with a set of lab activities, and they are a
        reasonable place to start. But they are fixed. When half my class got
        stuck on the same thing, I couldn't add three more steps to walk them
        through it. I couldn't trim the parts we didn't need. I couldn't write
        a lab for the topic I actually wanted to cover that week.
      </p>
      <p>
        That gap is the whole reason this exists. Clearbyte lets me write the
        lab myself, break it into small steps, and rework the specific step a
        cohort is stalling on &mdash; without waiting on anyone else's
        curriculum cycle.
      </p>

      <h2>Why it's cheap to run</h2>
      <p>
        Since I was paying for it, cost was a design constraint from the start.
        Clearbyte runs exclusively on AWS and is built entirely on on-demand
        services &mdash; Lambda, Step Functions, DynamoDB on-demand billing.
        There are no servers, load balancers or databases sitting idle between
        labs, so the bill tracks what is actually used rather than what is
        provisioned.
      </p>
      <p>
        The same logic applies to the student side: an AWS account exists for
        the length of a lab and is destroyed afterwards. Nothing keeps running,
        and nothing keeps costing.
      </p>

      <h2>Who it's for</h2>
      <p>
        Other instructors. I'm not trying to build a company here; I built
        something for my own courses and it turned out to be worth sharing. If
        you teach cloud at a college or university and this would help your
        students, <a href="/contact">get in touch</a>.
      </p>
      <p>
        It's most useful if you already teach the material and want more control
        over how it's delivered. It is not a curriculum you drop in and walk
        away from.
      </p>
    </Prose>
  </Container>
</Section>

<Section>
  <Container>
    <h2 class="text-h2">What it actually does</h2>

    <div class="mt-10 grid gap-6 md:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">You write the labs</h3>
        <p class="mt-2 text-base-content/70">
          Small, ordered steps you control, and can change between sections when
          something isn't landing.
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

    <div class="mt-12 text-center">
      <p class="mx-auto max-w-readable text-base-content/70">
        If you want to see it running with your own course material, that's the
        easiest way to judge whether it's useful.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a href="/demo" class="btn btn-primary btn-lg">Try it with your class</a>
        <a href="/contact" class="btn btn-outline btn-lg">Ask a question</a>
      </div>
    </div>
  </Container>
</Section>
