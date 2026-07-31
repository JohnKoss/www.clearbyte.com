// The public lab catalogue.
//
// Seeded from lab names found in the zenzoom platform. The copy below says only
// what each lab's own title supports - no invented durations, learning
// objectives or grading criteria. Enrich each entry with the real details
// before treating this as finished marketing copy.
//
// Not seeded: the "Magic 8 Ball" lab, because its title does not say which
// services it covers. Add it here once you can describe it accurately.

export type Lab = {
  slug: string;
  title: string;
  /**
   * One line, shown on the catalogue card. Lead with how the lab is broken up -
   * small steps are the product, the AWS service is just the subject matter.
   */
  summary: string;
  /** Services and tools named by the lab itself. */
  services: string[];
};

export const labs: Lab[] = [
  {
    slug: 'aws-vpc',
    title: 'Introduction to AWS VPC',
    summary:
      'The Virtual Private Cloud in small, checkable steps: finish one, confirm it worked, move to the next.',
    services: ['VPC'],
  },
  {
    slug: 'amazon-ec2',
    title: 'Introduction to Amazon EC2',
    summary:
      'Elastic Compute Cloud in short steps, so nobody is left guessing which instruction broke.',
    services: ['EC2'],
  },
  {
    slug: 'amazon-efs',
    title: 'Introduction to Amazon EFS',
    summary:
      'The Elastic File System, split into steps small enough to verify one at a time.',
    services: ['EFS'],
  },
  {
    slug: 'sql-on-amazon-rds',
    title: 'First Steps with SQL on Amazon RDS',
    summary:
      'First steps with SQL on a managed database, and they really are first steps, taken one at a time.',
    services: ['RDS'],
  },
  {
    slug: 'cicd-lambda-terraform',
    title: 'CI/CD: Deploy Lambda using Terraform',
    summary:
      'A Lambda CI/CD pipeline in Terraform, added a piece at a time rather than all at once.',
    services: ['Lambda', 'Terraform'],
  },
  {
    slug: 'ecs-scaling',
    title: 'ECS Scaling',
    summary:
      'Scaling on Elastic Container Service in small increments, not one long exercise.',
    services: ['ECS'],
  },
  {
    slug: 'docker-cicd-blue-green',
    title: 'Docker CI/CD Blue/Green',
    summary:
      'A blue/green container deployment, broken into steps a student can complete and check individually.',
    services: ['Docker'],
  },
];

export const labBySlug = (slug: string): Lab | undefined =>
  labs.find((lab) => lab.slug === slug);
