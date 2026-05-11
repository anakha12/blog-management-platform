import { injectable } from "tsyringe";
import { IBlogRepository, CreateBlogInput, UpdateBlogInput } from "../../domain/repositories/IBlogRepository";
import { Blog } from "../../domain/models/Blog";
import { apiClient } from "../api/apiClient";

@injectable()
export class ApiBlogRepository implements IBlogRepository {
  async getAll(): Promise<Blog[]> {
    const response = await apiClient.get("/blogs");
    return response.data.data;
  }

  async getById(id: string): Promise<Blog> {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data.data;
  }

  async create(data: CreateBlogInput): Promise<Blog> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.image) formData.append("image", data.image);

    const response = await apiClient.post("/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  }

  async update(id: string, data: UpdateBlogInput): Promise<Blog> {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.image) formData.append("image", data.image);

    const response = await apiClient.put(`/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/blogs/${id}`);
  }
}
