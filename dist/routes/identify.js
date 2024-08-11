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
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const contact_1 = __importDefault(require("../models/contact"));
const router = (0, express_1.Router)();
router.post('/identify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request ", req.body);
    const { email, phoneNumber } = req.body;
    // Fetch existing contacts with matching email or phoneNumber
    const existingContacts = yield contact_1.default.findAll({
        where: {
            [sequelize_1.Op.or]: [{ email }, { phoneNumber }],
        },
    });
    let primaryContact = null;
    let secondaryContacts = [];
    if (existingContacts.length > 0) {
        // If there are existing contacts, link them
        primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];
        if (primaryContact) {
            secondaryContacts = existingContacts.filter(contact => contact.id !== primaryContact.id);
            // Update secondary contacts to link to the primary contact
            for (let contact of secondaryContacts) {
                yield contact.update({ linkedId: primaryContact.id, linkPrecedence: 'secondary' });
            }
        }
        // If new information is provided, create a new secondary contact
        if (!existingContacts.some(contact => contact.email === email && contact.phoneNumber === phoneNumber)) {
            const newContact = yield contact_1.default.create({
                email,
                phoneNumber,
                linkedId: (primaryContact === null || primaryContact === void 0 ? void 0 : primaryContact.id) || null,
                linkPrecedence: 'secondary',
            });
            secondaryContacts.push(newContact);
        }
    }
    else {
        // No existing contacts, create a new primary contact
        primaryContact = yield contact_1.default.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary',
        });
    }
    const response = {
        contact: {
            primaryContactId: (primaryContact === null || primaryContact === void 0 ? void 0 : primaryContact.id) || null,
            emails: [primaryContact === null || primaryContact === void 0 ? void 0 : primaryContact.email, ...secondaryContacts.map(contact => contact.email)].filter(Boolean),
            phoneNumbers: [primaryContact === null || primaryContact === void 0 ? void 0 : primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(Boolean),
            secondaryContactIds: secondaryContacts.map(contact => contact.id),
        }
    };
    res.status(200).json(response);
}));
exports.default = router;
