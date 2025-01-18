import { Note, type NoteRequest } from '../../common';

export const notes: Note[] = [
  {
    archived: false,
    createdAt: new Date(),
    id: 'c2197832-6a6e-46c3-97a9-dd2a8de8a267',
    links: [],
    pinned: false,
    text: 'hello',
    userId: '123',
  },
  {
    archived: false,
    createdAt: new Date(),
    id: 'b2197832-6a6e-46c3-97a9-dd2a8de8a267',
    links: [
      {
        name: 'google',
        url: 'www.google.com',
      },
    ],
    pinned: false,
    text: 'world',
    userId: '123',
  },
];

export const validNoteRequests: NoteRequest[] = [
  {
    text: 'a note',
    archived: false,
    pinned: false,
    links: [
      {
        name: 'google',
        url: 'https://www.google.com',
      },
      {
        name: 'yahoo',
        url: 'https://yahoo.com',
      },
    ],
  },
  {
    text: 'a note only text',
    archived: false,
    pinned: false,
    links: [],
  },
  {
    text: '',
    archived: false,
    pinned: false,
    links: [
      {
        name: 'google',
        url: 'https://www.google.com',
      },
    ],
  },
];

export const invalidNoteRequests = [
  {
    text: 'text',
    archived: false,
    pinned: false,
    links: { name: 'google', url: 'https://www.google.com' },
  },
  {
    text: '',
    archived: false,
    pinned: false,
    links: [],
  },
  {
    text: 123,
    archived: false,
    pinned: false,
    links: [{ name: 'google', url: 'https://www.google.com' }],
  },
  {
    text: 'text',
    archived: 'false',
    pinned: false,
    links: [],
  },
  {
    text: '',
    archived: false,
    pinned: false,
    links: [{ name: 'google', url: 'wwwgooglecom' }],
  },
  {
    text: 'text',
    archived: false,
    pinned: false,
    links: [{ name: 123, url: 'https://www.google.com' }],
  },
  {
    text: '',
    archived: false,
    pinned: 'false',
    links: [{ name: 'google', url: 'https://www.google.com' }],
  },
];
