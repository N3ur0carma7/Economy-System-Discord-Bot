import { Schema, model } from 'mongoose';

interface IUser {
    userId: string;
    guildId: string;
    bankBalance: number;
    walletBalance: number;
    lastDaily: NativeDate;
    casinoEnd: NativeDate;
}

const userBankSchema = new Schema<IUser>({
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        bankBalance: {
            type: Number,
            default: 0,
        },
        walletBalance: {
            type: Number,
            default: 0,
        },
        lastDaily: {
            type: Date,
            default: 0,
        },
        casinoEnd: {
            type: Date,
            default: 0,
        }
    },
    { timestamps: true }
);

const UserBank= model<IUser>('UserBank', userBankSchema);
export default UserBank;