import { Schema, model, Types } from 'mongoose';

interface SalariesCooldowns {
    _id: Types.ObjectId;
    salaryId: number;
    salaryName: string;
    endsAt: NativeDate;
}

interface IUser {
    userId: string;
    guildId: string;
    salariesCooldowns: Types.DocumentArray<SalariesCooldowns>;
}

const userCooldownsSchema = new Schema<IUser>({
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        salariesCooldowns: [
            {
                salaryId: {
                    type: Number,
                },
                salaryName: {
                    type: String,
                },
                endsAt: {
                    type: Date,
                },
            },
        ],
    },
    { timestamps: true }
);

const UserCooldowns = model('UserCooldowns', userCooldownsSchema);

export default UserCooldowns;