import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, updatePassword, deleteUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTUser } from "../middlewares/validar-jwt.js";
import { tieneRoleUser } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/findAllUsers", getUsers);

router.get(
    "/findOneUser/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/putUser/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.put(
    "/putPassword/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updatePassword
)

router.delete(
    "/deleteUser/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

export default router;