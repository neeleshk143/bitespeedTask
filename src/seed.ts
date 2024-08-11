import sequelize from './config/database';
import Contact from './models/contact';

async function seedDatabase() {
  await sequelize.sync({ force: true }); 

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

  await Contact.bulkCreate(contacts);

  console.log('Database seeded successfully!');
  process.exit(0);
}

seedDatabase();
