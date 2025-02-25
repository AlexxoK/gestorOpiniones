import Usuario from '../users/user.model.js';
import Admin from '../admins/admin.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : '';
        const lowerUsername = username ? username.toLowerCase() : '';

        let user = await Usuario.findOne({ $or: [{ email: lowerEmail }, { username: lowerUsername }] });

        if (user) {
            if (!user.estado) {
                return res.status(400).json({ msg: "User is inactive!" });
            }

            const validPassword = await verify(user.password, password);
            if (!validPassword) {
                return res.status(400).json({ msg: "Incorrect password!" });
            }

            const token = await generarJWT(user.id);

            return res.status(200).json({
                msg: "User Login successful!",
                userDetails: {
                    uid: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    isAdmin: false,
                    token: token
                }
            });
        }

        user = await Admin.findOne({ $or: [{ email: lowerEmail }, { username: lowerUsername }] });

        if (user) {
            if (!user.estado) {
                return res.status(400).json({ msg: "Admin is inactive!" });
            }

            const validPassword = await verify(user.password, password);
            if (!validPassword) {
                return res.status(400).json({ msg: "Incorrect password!" });
            }

            const token = await generarJWT(user.id);

            return res.status(200).json({
                msg: "Admin Login successful!",
                adminDetails: {
                    uid: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    isAdmin: true,
                    token: token
                }
            });
        }

        return res.status(400).json({ msg: "Incorrect credentials - email or username does not exist!" });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Server error!",
            error: e.message
        });
    }
};

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