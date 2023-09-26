"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userBankSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const UserBank = (0, mongoose_1.model)('UserBank', userBankSchema);
exports.default = UserBank;
