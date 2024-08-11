import { Router } from 'express';
import { Op } from 'sequelize';
import Contact from '../models/contact';

const router = Router();

router.post('/identify', async (req, res) => {
  console.log("request ",req.body)
  const { email, phoneNumber } = req.body;
  
  
  // Fetch existing contacts with matching email or phoneNumber
  const existingContacts = await Contact.findAll({
    where: {
      [Op.or]: [{ email }, { phoneNumber }],
    },
  });

  let primaryContact: Contact | null = null;
  let secondaryContacts: Contact[] = [];

  if (existingContacts.length > 0) {
    // If there are existing contacts, link them
    primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];

    if (primaryContact) {
      secondaryContacts = existingContacts.filter(contact => contact.id !== primaryContact!.id);

      // Update secondary contacts to link to the primary contact
      for (let contact of secondaryContacts) {
        await contact.update({ linkedId: primaryContact.id, linkPrecedence: 'secondary' });
      }
    }

    // If new information is provided, create a new secondary contact
    if (!existingContacts.some(contact => contact.email === email && contact.phoneNumber === phoneNumber)) {
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact?.id || null,
        linkPrecedence: 'secondary',
      });
      secondaryContacts.push(newContact);
    }
  } else {
    // No existing contacts, create a new primary contact
    primaryContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    });
  }

  const response = {
    contact: {
      primaryContactId: primaryContact?.id || null,
      emails: [primaryContact?.email, ...secondaryContacts.map(contact => contact.email)].filter(Boolean),
      phoneNumbers: [primaryContact?.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(Boolean),
      secondaryContactIds: secondaryContacts.map(contact => contact.id),
    }
  };

  res.status(200).json(response);
});

export default router;
