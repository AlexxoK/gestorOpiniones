import Role from '../role/role.model.js';
import User from '../users/user.model.js';
import Admin from '../admins/admin.model.js';
import Category from '../categories/category.model.js';
import Publicacion from '../publicaciones/publicacion.model.js';
import Comment from '../comments/comment.model.js';

export const esRoleValido = async (role = ' ') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`Role ${role} does not exist in the database!`);
    }
}

export const existenteUserEmail = async (email = ' ') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`Email ${email} exists in the database!`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existeAdminById = async (id = '') => {
    const existeAdmin = await Admin.findById(id);

    if (!existeAdmin) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existeCategoryByName = async (name = '') => {
    const existeCategory = await Category.findById(name);

    if (!existeCategory) {
        throw new Error(`name ${name} dont exists!`);
    }
}

export const existeCategoryById = async (id = '') => {
    const existeCategory = await Category.findById(id);

    if (!existeCategory) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existePublicacionById = async (id = '') => {
    const existePublicacion = await Publicacion.findById(id);

    if (!existePublicacion) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existeCommentById = async (id = '') => {
    const existeComment = await Comment.findById(id);

    if (!existeComment) {
        throw new Error(`id ${id} dont exists!`);
    }
}