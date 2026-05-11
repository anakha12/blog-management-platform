import bcrypt from "bcryptjs";
import { IHashService } from "../../domain/services/IHashService";

import { injectable } from "tsyringe";

@injectable()
export class BcryptHashService implements IHashService {
  private readonly saltRounds = 10;

  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
