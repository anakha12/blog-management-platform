export interface BlogResponseDto {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
