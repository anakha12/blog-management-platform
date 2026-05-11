import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel, UserDocument } from "../database/models/UserModel";

import { injectable } from "tsyringe";

@injectable()
export class MongoUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);
    return this.mapToDomain(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? this.mapToDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? this.mapToDomain(user) : null;
  }

  private mapToDomain(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
