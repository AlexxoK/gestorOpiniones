import { Router } from 'express';
import { login, registerUser } from './auth.controller.js';
import { registerUserValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    deleteFileOnError,
    login
);

router.post(
    '/registerUser',
    registerUserValidator,
    deleteFileOnError,
    registerUser
);

export default router;