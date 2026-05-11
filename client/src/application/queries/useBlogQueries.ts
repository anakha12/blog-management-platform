import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "../../di/container";
import { Tokens } from "../../di/tokens";
import { IBlogRepository, CreateBlogInput, UpdateBlogInput } from "../../domain/repositories/IBlogRepository";

const blogRepo = container.resolve<IBlogRepository>(Tokens.BlogRepository);
const BLOGS_KEY = ["blogs"] as const;

export const useBlogsQuery = () =>
  useQuery({
    queryKey: BLOGS_KEY,
    queryFn: () => blogRepo.getAll(),
  });

export const useBlogByIdQuery = (id: string) =>
  useQuery({
    queryKey: [...BLOGS_KEY, id],
    queryFn: () => blogRepo.getById(id),
    enabled: !!id,
  });

export const useCreateBlogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBlogInput) => blogRepo.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BLOGS_KEY }),
  });
};

export const useUpdateBlogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogInput }) =>
      blogRepo.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BLOGS_KEY }),
  });
};

export const useDeleteBlogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogRepo.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BLOGS_KEY }),
  });
};
