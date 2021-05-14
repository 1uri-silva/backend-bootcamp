import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppErrors';
import uploadConfig from '../config/uploads';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UploadService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UploadService;
