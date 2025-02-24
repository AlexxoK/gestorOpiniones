import { Router } from 'express';
import { loginUser, registerUser, loginAdmin, registerAdmin } from './auth.controller.js';
import { registerAdminValidator, registerUserValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';

const router = Router();

router.post(
    '/loginUser',
    loginValidator,
    deleteFileOnError,
    loginUser
);

router.post(
    '/registerUser',
    registerUserValidator,
    deleteFileOnError,
    registerUser
);

router.post(
    '/loginAdmin',
    loginValidator,
    deleteFileOnError,
    loginAdmin
);

router.post(
    '/registerAdmin',
    registerAdminValidator,
    deleteFileOnError,
    registerAdmin
);

export default router;