import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

class UserService {

    async register(data) {
        const { documentos, nombres, email, password } = data;

        const userExist = await UserModel.findOne({
            where: { email: email }
        });

        if (userExist) {
            throw new Error("El usuario ya existe");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userUuid = uuidv4();

        const user = await UserModel.create({
            documentos,
            nombres,
            email,
            password: hashedPassword,
            uuid: userUuid
        });

        return user;
    }

    async loginUser(data) {
        const { email, password } = data;

        const user = await UserModel.findOne({
            where: { email: email }
        });

        if (!user) {
            throw new Error("Usuario y contraseña incorrectos");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error("Usuario y contraseña incorrectos");
        }

        const token = jwt.sign(
            { id: user.id, uuid: user.uuid },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        user.token = token;
        await user.save();

        const { password: _, ...userSinPassword } = user.toJSON();

        return { user: userSinPassword };
    }
}

export default new UserService();