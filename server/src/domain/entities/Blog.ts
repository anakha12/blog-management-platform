export class Blog {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public readonly authorId: string,
    public authorName?: string,
    public imageUrl?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
