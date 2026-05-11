import { Blog } from "../../domain/entities/Blog";
import { BlogResponseDto } from "../dtos/BlogResponseDto";

export class BlogMapper {
  static toResponse(blog: Blog): BlogResponseDto {
    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      authorId: blog.authorId,
      authorName: blog.authorName || "Unknown Author",
      imageUrl: blog.imageUrl,
      createdAt: blog.createdAt?.toISOString() || "",
      updatedAt: blog.updatedAt?.toISOString() || "",
    };
  }
}
