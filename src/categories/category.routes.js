import { Router } from "express";
import { check } from "express-validator";
import { saveCategory, findAllCategories, findOneCategoryByName, putCategoryById, deleteCategoryById } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTAdmin } from "../middlewares/validar-jwt.js";
import { tieneRoleAdmin } from "../middlewares/validar-roles.js";
import { existeCategoryByName, existeCategoryById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/saveCategory",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        validarCampos
    ],
    saveCategory
)

router.get("/findAllCategories", findAllCategories)

router.get(
    "/findOneCategoryByName/:name",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeCategoryByName),
        validarCampos
    ],
    findOneCategoryByName
)

router.put(
    "/putCategoryById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos
    ],
    putCategoryById
)

router.delete(
    "/deleteCategoryById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos
    ],
    deleteCategoryById
)

export default router;