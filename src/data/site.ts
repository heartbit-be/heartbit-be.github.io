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
      'I help teams put AI to work: adopting coding agents in their development workflow, and designing and building AI-powered features and applications.',
  },
] as const;
