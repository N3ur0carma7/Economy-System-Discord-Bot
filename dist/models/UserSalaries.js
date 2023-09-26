"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSalariesSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const UserSalaries = (0, mongoose_1.model)('UserSalaries', userSalariesSchema);
exports.default = UserSalaries;
