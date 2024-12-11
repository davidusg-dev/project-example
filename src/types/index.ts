export type Project = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string | null;
};

export type Task = {
  id: number;
  projectId: number;
  userId?: string | null;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name: string;
  username: string | null;
  imageUrl: string;
};
