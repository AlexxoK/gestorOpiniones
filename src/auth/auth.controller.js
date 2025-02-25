import Usuario from '../users/user.model.js';
import Admin from '../admins/admin.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const loginUser = async (req, res) => {

    const { email, password, username } = req.body;

    try {

        const lowerEmail = email ? email.toLowerCase() : '';
        const lowerUsername = username ? username.toLowerCase() : '';

        const user = await Usuario.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        console.log(lowerUsername)

        if (!user) {
            return res.status(400).json({
                msg: 'Incorrect credentials - email does not exist in the database!'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: 'User does not exist in the database!'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect!'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: 'Login OK!',
            userDetails: {
                username: user.username,
                token: token,
            }
        })

    } catch (e) {

        console.log(e);

        return res.status(500).json({
            message: "Server error!",
            error: e.message
        })
    }
}

export const registerUser = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
        })

        return res.status(201).json({
            message: "User registered successfully!",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "User registration failed!",
            error: err.message
        })

    }
}

export const loginAdmin = async (req, res) => {

    const { email, password, username } = req.body;

    try {

        const lowerEmail = email ? email.toLowerCase() : '';
        const lowerUsername = username ? username.toLowerCase() : '';

        const admin = await Admin.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        console.log(lowerUsername)

        if (!admin) {
            return res.status(400).json({
                msg: 'Incorrect credentials - email does not exist in the database!'
            });
        }

        if (!admin.estado) {
            return res.status(400).json({
                msg: 'Admin does not exist in the database!'
            });
        }

        const validPassword = await verify(admin.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect!'
            });
        }

        const token = await generarJWT( admin.id );

        return res.status(200).json({
            msg: 'Login OK!',
            adminDetails: {
                username: admin.username,
                token: token,
            }
        })

    } catch (e) {

        console.log(e);

        return res.status(500).json({
            message: "Server error!",
            error: e.message
        })
    }
}

export const registerAdmin = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const admin = await Admin.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
        })

        return res.status(201).json({
            message: "Admin registered successfully!",
            adminDetails: {
                admin: admin.email
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Admin registration failed!",
            error: err.message
        })

    }
}