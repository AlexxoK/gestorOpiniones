import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteUserEmail, esRoleValido } from "../helpers/db-validator.js";

export const registerUserValidator = [
    body("name", "The name is required!").not().isEmpty(),
    body("surname", "The surname is required!").not().isEmpty(),
    body("email", "You must enter a valid email!").isEmail(),
    body("email").custom(existenteUserEmail),
    body('role').custom(esRoleValido),
    body("password", "Password must be at least 8 cahracters!").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address!"),
    body("username").optional().isString().withMessage("Enter a valid username!"),
    body("password", "Password must be at least 8 characters!").isLength({ min: 8 }),
    validarCampos
];