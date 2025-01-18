export const ShortcutCategory = {
  TOP: 'TOP',
  CODING: 'CODING',
  GOOGLE: 'GOOGLE',
  CYCLING: 'CYCLING',
  FUN: 'FUN',
  OTHERS: 'OTHERS',
} as const;

export type ShortcutCategory = (typeof ShortcutCategory)[keyof typeof ShortcutCategory];
