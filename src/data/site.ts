export const contactEmail =
  import.meta.env.PUBLIC_CONTACT_EMAIL || 'laurens.bolle@heartbit.be';

export const services = [
  {
    id: 'architecture',
    name: 'Software architecture',
    description:
      'System design, technical direction, and decisions that make a software project easier to build and evolve.',
    action: 'Talk architecture',
  },
  {
    id: 'software',
    name: 'Software engineering',
    description:
      'Building, integrating, and improving software, from a new idea to an existing application.',
    action: 'Discuss software',
  },
  {
    id: 'ai',
    name: 'AI engineering',
    description:
      'Putting AI to work inside products and workflows, with attention to how it behaves in practice.',
    action: 'Explore an AI project',
  },
  {
    id: '3d-printing',
    name: '3D printing',
    description:
      'Turning digital models into physical objects. Tell me what you want to print and what it needs to do.',
    action: 'Discuss a print',
  },
] as const;

// Add a verified URL when each store opens. Null renders an honest coming-soon state.
export const shops: {
  name: string;
  description: string;
  url: string | null;
}[] = [
  {
    name: 'Heartbit webshop',
    description: 'A future home for things made by Heartbit.',
    url: null,
  },
  {
    name: 'Heartbit on Etsy',
    description: 'Another place to discover what comes out of the workshop.',
    url: null,
  },
];
