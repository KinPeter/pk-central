export type UUID = string;

export interface BaseEntity {
  id: UUID;
  createdAt: Date;
}

export interface IdObject {
  id: UUID;
}
