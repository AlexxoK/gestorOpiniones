import { Router } from "express";
import { check } from "express-validator";
import { findAllUsers, findOneUserById, putUserById, /*deleteUserById*/ } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTUser } from "../middlewares/validar-jwt.js";
import { tieneRoleUser } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/findAllUsers", findAllUsers);

router.get(
    "/findOneUserById/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    findOneUserById
)

router.put(
    "/putUserById/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    putUserById
)

/*router.delete(
    "/deleteUserById/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUserById
)*/

export default router;