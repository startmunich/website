import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: 'j77hk8qc',
  dataset: 'production',
  apiVersion: '2026-05-15',
  useCdn: false,
});
