export type UserRole = 'admin' | 'core' | 'extended' | 'pending';
export type ArtisticRole = 'musician' | 'actor' | 'visual' | 'other';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  artisticRole: ArtisticRole;
  photoURL?: string;
  createdAt: Date;
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  imageURL?: string;
  linkURL?: string;
  projectId?: string;
  projectTitle?: string;
  createdAt: Date;
  commentCount: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  datetime: Date;
  projectId?: string;
  projectTitle?: string;
  createdBy: string;
  createdAt: Date;
}

export type FileType = 'audio' | 'video' | 'document' | 'image';

export interface AppFile {
  id: string;
  name: string;
  url: string;
  type: FileType;
  projectId?: string;
  projectTitle?: string;
  uploadedBy: string;
  uploaderName: string;
  size: number;
  createdAt: Date;
}
