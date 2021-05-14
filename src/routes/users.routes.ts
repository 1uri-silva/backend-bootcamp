import multer from 'multer';
import { Router } from 'express';

import uploadConfig from '../config/uploads';
import CreateUserService from '../services/CreateUserService';
import UploadService from '../services/UploadsService';
import ensureAuthenticated from '../middleware/ensureAuthenticate';

const usersRouter = Router();
const uploads = multer(uploadConfig);

// Rota POST
usersRouter.post('/', async (request, response) => {
  const { email, name, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploads.single('avatar'),
  async (request, response) => {
    const updateAvatar = new UploadService();

    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });
    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
