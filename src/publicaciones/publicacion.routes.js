import { Router } from "express";
import { check } from "express-validator";
import { savePublicacion, findAllPublicaciones, findPublicacionesByCategoryId, putPublicacionById, deletePublicacionById } from "./publicacion.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTUser } from "../middlewares/validar-jwt.js";
import { tieneRoleUser } from "../middlewares/validar-roles.js";
import { existeCategoryById, existePublicacionById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/savePublicacion",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        validarCampos
    ],
    savePublicacion
)

router.get("/findAllPublicaciones", findAllPublicaciones);

router.get(
    "/findPublicacionesByCategoryId/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos
    ],
    findPublicacionesByCategoryId
)

router.put(
    "/putPublicacionById/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existePublicacionById),
        validarCampos
    ],
    putPublicacionById
)

router.delete(
    "/deletePublicacionById/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existePublicacionById),
        validarCampos
    ],
    deletePublicacionById
)

export default router;