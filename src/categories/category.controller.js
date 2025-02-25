import Category from "../categories/category.model.js";
import Publicacion from "../publicaciones/publicacion.model.js";

export const saveCategory = async (req, res) => {
    try {
        const data = req.body;

        const category = new Category(data);

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category saved successfully!',
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving category!',
            error
        })
    }
}

export const findAllCategories = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            categories
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting categories!',
            error
        })
    }
}

export const findOneCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;

        const category = await Category.findOne({ name });

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: 'Category not found!'
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting category!',
            error: error.message
        });
    }
};

export const putCategoryById = async (req, res = response) => {
    try {

        const { id } = req.params;
        const data = req.body;

        const category = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Category update!',
            category
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error update!',
            error
        })
    }
}

export const deleteCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const categoryToDelete = await Category.findById(id);

        if (!categoryToDelete || !categoryToDelete.status) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada o ya eliminada!'
            });
        }

        let sinCategoria = await Category.findOne({ name: 'Sin categoría' });

        if (!sinCategoria) {
            sinCategoria = new Category({
                name: 'Sin categoría',
                description: 'Categoría para publicaciones sin clasificación',
                status: true
            });
            await sinCategoria.save();
        }

        const publicacionesToReassign = await Publicacion.find({ categories: categoryToDelete._id });

        if (publicacionesToReassign.length > 0) {
            await Publicacion.updateMany(
                { _id: { $in: publicacionesToReassign.map(p => p._id) } },
                { $set: { categories: [sinCategoria._id] } }
            );
        }

        categoryToDelete.status = false;
        await categoryToDelete.save();

        res.status(200).json({
            success: true,
            message: 'Categoría eliminada correctamente! Las publicaciones han sido reasociadas a "Sin categoría".'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error eliminando la categoría!',
            error: error.message
        });
    }
};