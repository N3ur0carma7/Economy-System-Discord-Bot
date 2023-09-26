import { Schema, model, Types } from 'mongoose';

interface Salaries {
    _id: Types.ObjectId;
    id: number;
    name: string;
    amount: number;
    cooldown: number;
}

interface IUser {
    userId: string;
    guildId: string;
    salaries: Types.DocumentArray<Salaries>;
}

const userSalariesSchema = new Schema<IUser>({
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        salaries: [
            {
                id: Number,
                name: String,
                amount: Number,
                cooldown: Number,
            }
        ],
    },
    { timestamps: true }
);

const UserSalaries = model('UserSalaries', userSalariesSchema);
export default UserSalaries;