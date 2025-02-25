import { Router } from "express";
import { check } from "express-validator";
import { findAllAdmins, findOneAdminById, putAdminById, /*deleteAdminById*/ } from "./admin.controller.js";
import { existeAdminById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTAdmin } from "../middlewares/validar-jwt.js";
import { tieneRoleAdmin } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/findAllAdmins", findAllAdmins);

router.get(
    "/findOneAdminById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    findOneAdminById
)

router.put(
    "/putAdminById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    putAdminById
)

/*router.delete(
    "/deleteAdminById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    deleteAdminById
)*/

export default router;