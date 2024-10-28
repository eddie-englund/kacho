export const variant = { Primary: 'primary', Secondary: 'secondary' } as const;
export type variant = (typeof variant)[keyof typeof variant];
