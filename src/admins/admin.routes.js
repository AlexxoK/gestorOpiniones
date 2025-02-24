import { Router } from "express";
import { check } from "express-validator";
import { getAdmins, getAdminById, updateAdmin, deleteAdmin } from "./admin.controller.js";
import { existeAdminById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTAdmin } from "../middlewares/validar-jwt.js";
import { tieneRoleAdmin } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/findAllAdmins", getAdmins);

router.get(
    "/findOneAdmin/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    getAdminById
)

router.put(
    "/putAdmin/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    updateAdmin
)

router.delete(
    "/deleteAdmin/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    deleteAdmin
)

export default router;