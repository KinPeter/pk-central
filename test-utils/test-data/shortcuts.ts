import { Shortcut, ShortcutCategory, type ShortcutRequest } from '../../common';

export const shortcuts: Shortcut[] = [
  {
    createdAt: new Date(),
    id: 'c2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
    url: 'https://google.com',
    iconUrl: 'google.png',
    name: 'Google',
    priority: 1,
    category: ShortcutCategory.CODING,
  },
  {
    createdAt: new Date(),
    id: 'b2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 'Yahoo',
    priority: 1,
    category: ShortcutCategory.FUN,
  },
];

export const validShortcutRequests: ShortcutRequest[] = [
  {
    url: 'https://google.com',
    iconUrl: 'google.png',
    name: 'Google',
    priority: 1,
    category: ShortcutCategory.CODING,
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 'Yahoo',
    priority: 9,
    category: ShortcutCategory.FUN,
  },
];

export const invalidShortcutRequests = [
  {
    url: 'httpsgoogle.com',
    iconUrl: 'google.png',
    name: 'Google',
    priority: 1,
    category: ShortcutCategory.CODING,
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoopng',
    name: 'Yahoo',
    priority: 9,
    category: ShortcutCategory.FUN,
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 123,
    priority: 9,
    category: ShortcutCategory.FUN,
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 'Yahoo',
    priority: 11,
    category: ShortcutCategory.FUN,
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 'Yahoo',
    priority: 9,
    category: 'NOT_FUN',
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 'Yahoo',
    priority: null,
    category: ShortcutCategory.FUN,
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 'Yahoo',
    priority: 9,
  },
  {
    url: 'https://yahoo.com',
    iconUrl: 'yahoo.png',
    name: 'Yahoo',
    priority: 9,
    category: null,
  },
];
