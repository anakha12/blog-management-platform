import { User } from "../../domain/entities/User";
import { UserResponseDto } from "../dtos/UserResponseDto";

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt?.toISOString(),
    };
  }
}
