<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Seo from '$lib/Seo.svelte';

  // One source for both the rendered page and the FAQPage structured data, so
  // the schema can never claim something the page doesn't actually say.
  const faq = [
    {
      question: 'What is Clearbyte?',
      answer:
        'Clearbyte is a tool for creating custom cloud computing lab activities. An instructor authors the lab as small ordered steps, students complete it in a real AWS account launched from the course LMS, and the work is graded automatically against what was built in that account.',
    },
    {
      question: 'How do I create a custom cloud computing lab for my course?',
      answer:
        'You write the lab as a sequence of small steps, deciding what is covered, in what order, and how far it goes. Because the steps are small, you can see which one a class stalls on and rewrite just that part before the next section meets.',
    },
    {
      question: 'Can I modify the labs that come with AWS Academy?',
      answer:
        'No. Prebuilt catalogs such as AWS Academy are used as provided, which is exactly the gap Clearbyte was built to fill. If you need to add steps for a topic your students are struggling with, or drop material your course does not cover, you need labs you can author and revise yourself.',
    },
    {
      question: 'How do students get AWS accounts?',
      answer:
        'Each student gets credentials and console access to a real AWS account, provisioned for the lab when they launch it. There is no separate signup, and students do not use their own AWS accounts or payment details.',
    },
    {
      question: 'What happens to the AWS account after the lab ends?',
      answer:
        'The account is torn down automatically when the lab finishes. Nothing keeps running and nothing keeps accruing cost after the student is done.',
    },
    {
      question: 'Which LMS does it work with?',
      answer:
        'Labs launch from the course over LTI 1.3, and the integration is used with Canvas today. Students sign in the way they already do for your course, and scores return to your gradebook.',
    },
    {
      question: 'How is student work graded?',
      answer:
        'Grading inspects what was actually built in the AWS account, rather than a screenshot or a written answer, and the resulting score is returned to the LMS gradebook.',
    },
    {
      question: 'What platform does Clearbyte run on?',
      answer:
        'Clearbyte runs exclusively on AWS. Every part of the platform — lab delivery, account provisioning, grading and teardown — is built on AWS services, so there is nothing hosted elsewhere and no second vendor in the stack.',
    },
    {
      question: 'Is Clearbyte expensive to run?',
      answer:
        'No, and that was a deliberate design decision. The platform is built on on-demand AWS services such as Lambda, Step Functions and DynamoDB on-demand billing, with no servers, load balancers or databases running between labs. Cost tracks actual use, so when nobody is running a lab there is almost nothing to pay for. Student AWS accounts exist only for the duration of the lab and are destroyed afterwards.',
    },
    {
      question: 'Who is Clearbyte for?',
      answer:
        'Instructors teaching cloud computing at colleges and universities who already know the material and want more control over how labs are delivered. It is a tool for authoring and running labs, not a drop-in curriculum.',
    },
    {
      question: 'Who built Clearbyte?',
      answer:
        'A cloud computing instructor who wanted lab activities that could be shaped around what students were actually struggling with, and built the tool to do it. It is now shared with other institutions.',
    },
    {
      question: 'How do I get access, and what does it cost?',
      answer:
        'Access is arranged directly rather than by signing up. Get in touch with what you teach and the number of students, and setup can be worked out from there.',
    },
  ];
</script>

<Seo
  title="FAQ"
  description="Common questions about creating custom cloud computing lab activities with Clearbyte: authoring labs, student AWS accounts, LMS integration, grading and access."
  {faq}
/>

<Section>
  <Container width="readable">
    <h1 class="text-h1">Questions</h1>
    <p class="mt-4 text-lead text-base-content/70">
      What instructors usually want to know before running a cloud computing lab
      with their class.
    </p>
  </Container>
</Section>

<Section tone="muted">
  <Container width="readable">
    <div class="space-y-10">
      {#each faq as item (item.question)}
        <div>
          <h2 class="text-h3">{item.question}</h2>
          <p class="mt-3 text-base-content/80">{item.answer}</p>
        </div>
      {/each}
    </div>

    <div class="mt-14 rounded-box border border-base-300 bg-base-100 p-8 text-center">
      <h2 class="text-h3">Still have a question?</h2>
      <p class="mx-auto mt-2 max-w-readable text-base-content/70">
        Anything not covered here is worth asking about directly.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <a href="/contact" class="btn btn-primary">Get in touch</a>
        <a href="/demo" class="btn btn-outline">Try it with your class</a>
      </div>
    </div>
  </Container>
</Section>
