"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const contact_1 = __importDefault(require("./models/contact"));
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.sync({ force: true });
        const contacts = [
            {
                id: 1,
                phoneNumber: '123456',
                email: 'lorraine@hillvalley.edu',
                linkedId: null,
                linkPrecedence: 'primary',
                createdAt: new Date('2023-04-01T00:00:00.374Z'),
                updatedAt: new Date('2023-04-01T00:00:00.374Z'),
                deletedAt: null,
            },
            {
                id: 23,
                phoneNumber: '123456',
                email: 'mcfly@hillvalley.edu',
                linkedId: 1,
                linkPrecedence: 'secondary',
                createdAt: new Date('2023-04-20T05:30:00.11Z'),
                updatedAt: new Date('2023-04-20T05:30:00.11Z'),
                deletedAt: null,
            },
        ];
        yield contact_1.default.bulkCreate(contacts);
        console.log('Database seeded successfully!');
        process.exit(0);
    });
}
seedDatabase();
