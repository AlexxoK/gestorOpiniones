import { Router } from "express";
import { check } from "express-validator";
import { saveComment, findAllComments, putCommentById, deleteCommentById } from "./comment.controller.js";
import { existeCommentById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTUser } from "../middlewares/validar-jwt.js";
import { tieneRoleUser } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/saveComment",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        validarCampos
    ],
    saveComment
)

router.get("/findAllComments", findAllComments)

router.put(
    "/putCommentById/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeCommentById),
        validarCampos
    ],
    putCommentById
)

router.delete(
    "/deleteCommentById/:id",
    [
        validarJWTUser,
        tieneRoleUser("USER_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeCommentById),
        validarCampos
    ],
    deleteCommentById
)

export default router;