"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userCooldownsSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const UserCooldowns = (0, mongoose_1.model)('UserCooldowns', userCooldownsSchema);
exports.default = UserCooldowns;
