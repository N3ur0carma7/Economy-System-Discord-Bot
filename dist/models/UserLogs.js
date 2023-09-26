"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userLogsSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const UserLogs = (0, mongoose_1.model)('UserLogs', userLogsSchema);
exports.default = UserLogs;
