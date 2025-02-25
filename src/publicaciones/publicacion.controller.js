import mongoose from "mongoose";
import Publicacion from "../publicaciones/publicacion.model.js";
import Category from "../categories/category.model.js";

export const savePublicacion = async (req, res) => {
    try {
        const data = req.body;

        let categoryIds = [];

        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            const categories = await Category.find({ name: { $in: data.categories } });

            if (categories.length !== data.categories.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Una o más categorías no fueron encontradas!'
                });
            }

            categoryIds = categories.map(category => category._id);
        } else {
            let sinCategoria = await Category.findOne({ name: 'Sin categoría' });

            if (!sinCategoria) {
                sinCategoria = new Category({
                    name: 'Sin categoría',
                    description: 'Categoría para publicaciones sin clasificación',
                    status: true,
                });
                await sinCategoria.save();
                console.log('Categoría "Sin categoría" creada correctamente!');
            }

            categoryIds = [sinCategoria._id];
        }

        const publicacion = new Publicacion({
            ...data,
            categories: categoryIds,
            userId: req.usuario._id
        });

        await publicacion.save();

        const populatedPublicacion = await Publicacion.findById(publicacion._id).populate('categories', 'name');

        res.status(200).json({
            success: true,
            message: 'Publicación creada correctamente!',
            publicacion: populatedPublicacion
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error guardando la publicación!',
            error: error.message
        });
    }
};

export const findAllPublicaciones = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        const publicaciones = await Publicacion.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('categories', 'name');

        const total = await Publicacion.countDocuments(query);

        const publicacionesConCategorias = publicaciones.map(publicacion => ({
            ...publicacion.toObject(),
            categories: publicacion.categories.map(category => category.name)
        }));

        res.status(200).json({
            success: true,
            total,
            publicaciones: publicacionesConCategorias
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting Categories!',
            error: error.message
        });
    }
};

export const findPublicacionesByCategoryId = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format!'
            });
        }

        const publicaciones = await Publicacion.find({ categories: id }).populate('categories', 'name');

        if (publicaciones.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No publications found for this category!'
            });
        }

        const publicacionesConCategorias = publicaciones.map(publicacion => ({
            ...publicacion.toObject(),
            categories: publicacion.categories.map(category => category.name)
        }));

        res.status(200).json({
            success: true,
            publicaciones: publicacionesConCategorias
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching publications by category!',
            error: error.message
        });
    }
};

export const putPublicacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const userId = req.usuario._id;

        const existingPublicacion = await Publicacion.findById(id).populate('categories');

        if (!existingPublicacion) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada!'
            });
        }

        if (existingPublicacion.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No puedes editar una publicación que no es tuya!'
            });
        }

        let categoryIds = existingPublicacion.categories;

        if (data.categories && Array.isArray(data.categories)) {
            const categories = await Category.find({ name: { $in: data.categories } });

            if (categories.length !== data.categories.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Una o más categorías no fueron encontradas!'
                });
            }

            categoryIds = categories.map(category => category._id);
        } else {
            let sinCategoria = await Category.findOne({ name: 'Sin categoría' });

            if (!sinCategoria) {
                sinCategoria = new Category({
                    name: 'Sin categoría',
                    description: 'Categoría para publicaciones sin clasificación',
                    status: true,
                });
                await sinCategoria.save();
                console.log('Categoría "Sin categoría" creada correctamente!');
            }

            categoryIds = [sinCategoria._id];
        }

        const updatedPublicacion = await Publicacion.findByIdAndUpdate(
            id,
            {
                ...data,
                categories: categoryIds
            },
            { new: true }
        ).populate('categories', 'name');

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada con éxito!',
            publicacion: {
                ...updatedPublicacion.toObject(),
                categories: updatedPublicacion.categories.map(category => category.name)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error actualizando la publicación!',
            error: error.message
        });
    }
};

export const deletePublicacionById = async (req, res) => {
    const { id } = req.params;
    const userId = req.usuario._id;

    try {
        const publicacionToDelete = await Publicacion.findById(id);

        if (!publicacionToDelete || !publicacionToDelete.status) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada o ya eliminada!'
            });
        }

        if (publicacionToDelete.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No puedes eliminar una publicación que no es tuya!'
            });
        }

        publicacionToDelete.status = false;
        await publicacionToDelete.save();

        res.status(200).json({
            success: true,
            message: 'Publicación eliminada correctamente!'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error eliminando la publicación!',
            error: error.message
        });
    }
};