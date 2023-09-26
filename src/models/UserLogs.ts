import { Schema, model, Types } from 'mongoose';

interface BankLogs {
    _id: Types.ObjectId;
    actionId: number;
    actionName: string;
    content: string;
    time: NativeDate;
}

interface CompanyLogs {
    _id: Types.ObjectId;
    actionId: number;
    content: string;
    actionName: string;
    time: NativeDate;
}

interface IUser {
    userId: string;
    guildId: string;
    bankLogs: Types.DocumentArray<BankLogs>;
    companyLogs: Types.DocumentArray<CompanyLogs>;
}

const userLogsSchema = new Schema<IUser>({
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        bankLogs: [
            {
                actionId: {
                    type: Number,
                },
                content: {
                    type: String,
                },
                actionName: {
                    type: String,
                },
                time: {
                    type: Date,
                },
            },
        ],
        companyLogs: [
            {
                actionId: {
                    type: Number,
                },
                content: {
                    type: String,
                },
                actionName: {
                    type: String,
                },
                time: {
                    type: Date,
                }
            }
        ]
    },
    { timestamps: true }
);

const UserLogs = model('UserLogs', userLogsSchema);
export default UserLogs;