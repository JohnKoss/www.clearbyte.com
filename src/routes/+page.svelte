<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import LabCard from '$lib/LabCard.svelte';
  import Picture from '$lib/Picture.svelte';
  import Seo from '$lib/Seo.svelte';
  import { labs } from '$lib/labs';

  const featured = labs.slice(0, 3);

  const steps = [
    {
      title: 'You write the lab',
      body: 'Lay it out as small, ordered steps. You decide what gets covered, in what order, and how far it goes.',
    },
    {
      title: 'You change it when the class struggles',
      body: "If a cohort stalls on the same step, rewrite that part and reissue it. You're not waiting on anyone's release cycle.",
    },
    {
      title: 'Students work in real AWS',
      body: 'Each student gets credentials and console access to a live AWS account, launched from your LMS over LTI 1.3.',
    },
    {
      title: 'Graded, then torn down',
      body: 'Work is checked against what was actually built in the account. The score goes to your gradebook and the account is destroyed.',
    },
  ];
</script>

<Seo
  title="Create custom cloud computing lab activities for your class"
  description="Clearbyte is a tool for creating custom cloud computing lab activities. You author the lab as small ordered steps, students complete it in a real AWS account launched from your LMS, and work is graded automatically against what they built."
/>

<!-- Hero -->
<Section>
  <Container>
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-accent">
          Built by an instructor, for instructors
        </p>
        <h1 class="mt-3 text-h1">
          Create custom cloud computing lab activities for your class.
        </h1>
        <!-- Front-loaded answer: states plainly what this is, before any story. -->
        <p class="mt-6 text-lead text-base-content/70">
          Clearbyte is a tool for creating custom cloud computing labs. You
          author the lab as small ordered steps, students complete it in a real
          AWS account launched from your LMS, and their work is graded
          automatically against what they actually built.
        </p>
        <p class="mt-4 text-base-content/70">
          AWS Academy gives you a solid set of labs, but they're fixed. This
          exists for the times you need to go further &mdash; to add steps where
          students are getting stuck, and drop the ones they don't need.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="/demo" class="btn btn-primary btn-lg">Try it with your class</a>
          <a href="/labs" class="btn btn-outline btn-lg">Browse the labs</a>
        </div>
      </div>

      <!-- priority: this is the LCP image, so it loads eagerly. -->
      <div class="mx-auto w-full max-w-[600px] lg:mx-0">
        <Picture
          base="/person-at-computer"
          alt="A student working through a lab on a laptop"
          width={600}
          height={400}
          priority
          class="h-auto w-full rounded-box shadow-card"
        />
      </div>
    </div>
  </Container>
</Section>

<!-- How it works -->
<Section tone="muted">
  <Container>
    <h2 class="text-h2">How it works</h2>
    <p class="mt-3 max-w-readable text-base-content/70">
      The part that matters is the second step. Everything else is plumbing.
    </p>

    <ol class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {#each steps as step, i (step.title)}
        <li class="rounded-box border border-base-300 bg-base-100 p-6">
          <span
            class="inline-flex h-8 w-8 items-center justify-center rounded-selector bg-primary font-semibold text-primary-content"
          >
            {i + 1}
          </span>
          <h3 class="mt-4 font-semibold">{step.title}</h3>
          <p class="mt-2 text-sm text-base-content/70">{step.body}</p>
        </li>
      {/each}
    </ol>
  </Container>
</Section>

<!-- Why small steps -->
<Section>
  <Container>
    <div class="max-w-readable">
      <h2 class="text-h2">Why small steps</h2>
      <p class="mt-4 text-base-content/70">
        Small steps are easier to follow, but that isn't really the point. They
        tell you <em>where</em> the class is stuck. When eleven students stall
        on the same step, you know exactly which step to rewrite &mdash; and you
        can have it rewritten before the next section meets.
      </p>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-3">
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">You can see where it breaks</h3>
        <p class="mt-2 text-base-content/70">
          A stalled step is a specific thing you can fix, not a vague sense that
          the lab was hard.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Fits the time you have</h3>
        <p class="mt-2 text-base-content/70">
          Sized to a class period, not a corporate training calendar.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Real AWS, not a mock</h3>
        <p class="mt-2 text-base-content/70">
          Small steps, but the account and the credentials are the real thing.
        </p>
      </div>
    </div>
  </Container>
</Section>

<!-- Comparison -->
<Section tone="muted">
  <Container>
    <h2 class="text-h2">Compared with the alternatives</h2>
    <p class="mt-3 max-w-readable text-base-content/70">
      Most instructors teaching cloud end up choosing between a provided lab
      catalog and building the whole thing themselves.
    </p>

    <div class="mt-8 overflow-x-auto">
      <table class="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-base-300">
            <th class="py-3 pr-4 font-semibold"></th>
            <th class="py-3 pr-4 font-semibold">Clearbyte</th>
            <th class="py-3 pr-4 font-semibold">A provided lab catalog</th>
            <th class="py-3 font-semibold">Building it yourself</th>
          </tr>
        </thead>
        <tbody class="text-base-content/80">
          <tr class="border-b border-base-300">
            <td class="py-3 pr-4 font-medium text-base-content">Write your own labs</td>
            <td class="py-3 pr-4">Yes</td>
            <td class="py-3 pr-4">No &mdash; used as provided</td>
            <td class="py-3">Yes</td>
          </tr>
          <tr class="border-b border-base-300">
            <td class="py-3 pr-4 font-medium text-base-content">Revise a lab mid-semester</td>
            <td class="py-3 pr-4">Yes</td>
            <td class="py-3 pr-4">No</td>
            <td class="py-3">Yes</td>
          </tr>
          <tr class="border-b border-base-300">
            <td class="py-3 pr-4 font-medium text-base-content">Real AWS account per student</td>
            <td class="py-3 pr-4">Yes</td>
            <td class="py-3 pr-4">Usually</td>
            <td class="py-3">You build it</td>
          </tr>
          <tr class="border-b border-base-300">
            <td class="py-3 pr-4 font-medium text-base-content">Launches from your LMS</td>
            <td class="py-3 pr-4">Yes, over LTI 1.3</td>
            <td class="py-3 pr-4">Varies</td>
            <td class="py-3">You build it</td>
          </tr>
          <tr class="border-b border-base-300">
            <td class="py-3 pr-4 font-medium text-base-content">Graded against the account</td>
            <td class="py-3 pr-4">Yes</td>
            <td class="py-3 pr-4">Varies</td>
            <td class="py-3">You build it</td>
          </tr>
          <tr>
            <td class="py-3 pr-4 font-medium text-base-content">Account destroyed after</td>
            <td class="py-3 pr-4">Yes, automatically</td>
            <td class="py-3 pr-4">Usually</td>
            <td class="py-3">You build it</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-4 text-sm text-base-content/60">
      "A provided lab catalog" covers the prebuilt labs that ship with cloud
      curricula such as AWS Academy. They're a reasonable starting point; the
      difference is whether you can change them.
    </p>
  </Container>
</Section>

<!-- Lab preview -->
<Section>
  <Container>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="text-h2">The labs so far</h2>
        <p class="mt-3 max-w-readable text-base-content/70">
          These run in real cloud courses today. Use them as they are, or as a
          starting point for your own.
        </p>
      </div>
      <a href="/labs" class="text-sm font-medium text-primary hover:underline">
        View all labs &rarr;
      </a>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-3">
      {#each featured as lab (lab.slug)}
        <LabCard {lab} />
      {/each}
    </div>
  </Container>
</Section>

<!-- Built on AWS -->
<Section tone="muted">
  <Container>
    <h2 class="text-h2">Built on AWS, and built to stay cheap</h2>
    <p class="mt-3 max-w-readable text-base-content/70">
      Clearbyte runs exclusively on AWS. It was deliberately designed around
      on-demand services, so what it costs to run tracks actual use rather than
      sitting on the clock.
    </p>

    <div class="mt-10 grid gap-6 md:grid-cols-3">
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Entirely AWS</h3>
        <p class="mt-2 text-base-content/70">
          Every part of the platform runs on AWS services &mdash; nothing hosted
          elsewhere, and no second vendor in the stack.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">On-demand by design</h3>
        <p class="mt-2 text-base-content/70">
          Lambda, Step Functions and DynamoDB on-demand billing. No servers,
          load balancers or databases idling between labs.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Cost follows usage</h3>
        <p class="mt-2 text-base-content/70">
          When nobody is running a lab there is almost nothing to pay for, and
          student accounts exist only for the length of the lab.
        </p>
      </div>
    </div>
  </Container>
</Section>

<!-- Closing -->
<Section>
  <Container>
    <div class="rounded-box bg-primary p-10 text-center text-primary-content sm:p-14">
      <h2 class="text-h2">Teaching a cloud course?</h2>
      <p class="mx-auto mt-4 max-w-readable opacity-90">
        If this would help your students, send over what you're teaching and
        your class can be set up with the right labs.
      </p>
      <a href="/demo" class="btn btn-accent btn-lg mt-8">Try it with your class</a>
    </div>
  </Container>
</Section>
