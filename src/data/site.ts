export const contactEmail =
  import.meta.env.PUBLIC_CONTACT_EMAIL || 'laurens.bolle@heartbit.be';

// Add only the confirmed profile URL. Until then, no LinkedIn link is published.
export const linkedInUrl: string | null = null;

export const capabilities = [
  {
    name: 'Software engineering',
    description:
      'From understanding what people need to building and delivering the application, I enjoy taking responsibility for the whole picture. My experience includes .NET, Angular, PostgreSQL, Azure, and Azure DevOps.',
  },
  {
    name: 'Cloud architecture',
    description:
      'I turn requirements into a design the team can build on: how the application is structured, how its parts communicate, and how it runs in the cloud. I stay involved in implementation, too.',
  },
  {
    name: 'AI engineering',
    description:
      'I help teams put AI to work: adopting coding agents in their development workflow, and designing and building AI-powered features and applications. At Waterleau, I also coach and mentor the team on using AI effectively in development, drawing on coding agents and agentic workflows in my own work.',
  },
] as const;

export const cvUrl = '/cv/Laurens_Bolle_CV_2026_public.pdf';

export const experience = [
  {
    company: 'Waterleau',
    role: 'Development lead, architect & AI evangelist',
    dates: 'May 2022–present',
    description:
      'I design and build cloud-first applications for water and wastewater treatment, including the renewal of the Smartlab platform. The work connects data from existing plants with a new cloud architecture while keeping operations running. I work with operational technology colleagues on reusable data structures and dashboards, and coach the development team on using AI effectively.',
    technologies:
      '.NET, Angular, PostgreSQL, Azure, Terraform, Docker, Azure DevOps.',
  },
  {
    company: 'Farmad',
    role: 'Full-stack developer & Scrum master',
    dates: 'August 2021–April 2022',
    description:
      'I helped design and build a cloud-first replacement for software used in pharmacies. Alongside development, I worked on legacy data migration, keeping the initial release focused, and introducing domain-driven design to developers unfamiliar with it.',
    technologies: '.NET, Angular, PostgreSQL, AWS, Terraform, Docker.',
  },
  {
    company: 'Atrias',
    role: 'Lead developer',
    dates: 'November 2020–July 2021',
    description:
      'I led the design and delivery of a cloud-based test tool for the Belgian energy market, covering functional acceptance and high-load testing of the Central Market System. My responsibilities spanned application and cloud architecture, implementation, deployment and cloud security support, and coaching junior developers.',
    technologies:
      '.NET, React, PostgreSQL, Azure, Terraform, Docker, Azure DevOps.',
  },
  {
    company: 'SESVanderHave',
    role: 'Full-stack developer & Scrum master',
    dates: 'July 2018–October 2020',
    description:
      'I developed features for an R&D platform supporting sugar beet breeding, genetics, seed management, and automated sowing. I also coached fellow developers and helped the team improve its way of working through Scrum.',
    technologies: '.NET Core, Angular, Oracle.',
  },
] as const;
