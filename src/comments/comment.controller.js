import { request, response } from "express";
import Comment from "./comment.model.js";
import Publicacion from "../publicaciones/publicacion.model.js";
import User from "../users/user.model.js";

export const saveComment = async (req = request, res = response) => {
    const { content, publicacionId } = req.body;
    const userId = req.usuario.id;

    try {
        const publicacionExiste = await Publicacion.findById(publicacionId);
        if (!publicacionExiste) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada!"
            });
        }

        const author = await User.findById(userId);
        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Autor no encontrado!"
            });
        }

        const comment = new Comment({ content, author: userId, publicacion: publicacionId });
        await comment.save();

        res.status(201).json({
            success: true,
            message: "Comentario agregado!",
            comment: {
                _id: comment._id,
                content: comment.content,
                author: author.name,
                publicacion: publicacionExiste.tittle,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al agregar comentario!",
            error: error.message
        });
    }
};

export const findAllComments = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, comments] = await Promise.all([
            Comment.countDocuments(query),
            Comment.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        const commentsWithDetails = await Promise.all(comments.map(async (comment) => {
            const author = await User.findById(comment.author);
            const publicacion = await Publicacion.findById(comment.publicacion);

            return {
                _id: comment._id,
                content: comment.content,
                author: author ? author.name : 'Autor no encontrado',
                publicacion: publicacion ? publicacion.title : 'Publicación no encontrada',
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            };
        }));

        res.status(200).json({
            success: true,
            total,
            comments: commentsWithDetails
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting comments!',
            error: error.message
        });
    }
};

export const putCommentById = async (req = request, res = response) => {
    const { content } = req.body;
    const { id } = req.params;
    const userId = req.usuario.id;

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado!"
            });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para editar este comentario!"
            });
        }

        comment.content = content;
        await comment.save();

        const author = await User.findById(comment.author);
        const publicacion = await Publicacion.findById(comment.publicacion);

        res.status(200).json({
            success: true,
            message: "Comentario actualizado!",
            comment: {
                _id: comment._id,
                content: comment.content,
                author: author ? author.name : 'Autor no encontrado',
                publicacion: publicacion ? publicacion.title : 'Publicación no encontrada',
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar comentario!",
            error: error.message
        });
    }
};

export const deleteCommentById = async (req = request, res = response) => {
    const { id } = req.params;
    const userId = req.usuario.id;

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado!"
            });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar este comentario!"
            });
        }

        await comment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Comentario eliminado!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar comentario!",
            error: error.message
        });
    }
};