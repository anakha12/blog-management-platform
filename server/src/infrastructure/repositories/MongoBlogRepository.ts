import { IBlogRepository } from "../../domain/repositories/IBlogRepository";
import { Blog } from "../../domain/entities/Blog";
import { BlogModel, BlogDocument } from "../database/models/BlogModel";
import { injectable } from "tsyringe";

@injectable()
export class MongoBlogRepository implements IBlogRepository {
  async create(blog: Omit<Blog, "id">): Promise<Blog> {
    const createdBlog = await BlogModel.create(blog);
    return this.mapToDomain(createdBlog);
  }

  async findById(id: string): Promise<Blog | null> {
    const blog = await BlogModel.findById(id).populate("authorId", "name");
    return blog ? this.mapToDomain(blog) : null;
  }

  async findAll(): Promise<Blog[]> {
    const blogs = await BlogModel.find()
      .populate("authorId", "name")
      .sort({ createdAt: -1 });
    return blogs.map(doc => this.mapToDomain(doc));
  }

  async update(id: string, blogData: Partial<Blog>): Promise<Blog | null> {
    const updatedBlog = await BlogModel.findByIdAndUpdate(id, blogData, {
      new: true,
    }).populate("authorId", "name");
    return updatedBlog ? this.mapToDomain(updatedBlog) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await BlogModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToDomain(doc: any): Blog {
    return {
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      imageUrl: doc.imageUrl,
      authorId: doc.authorId?._id?.toString() || doc.authorId?.toString(),
      authorName: doc.authorId?.name || "Unknown Author",
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
