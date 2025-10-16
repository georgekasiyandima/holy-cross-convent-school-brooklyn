#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function remoteSeed() {
  console.log('🌱 Starting remote database seeding...');
  console.log('🔗 Database URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Create default admin user
    console.log('\n📝 Creating admin user...');
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@holycross.co.za' },
      update: {},
      create: {
        email: 'admin@holycross.co.za',
        name: 'System Administrator',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create sample staff members
    console.log('\n📝 Creating staff members...');
    const staffMembers = [
      {
        name: 'Mrs Du Plessis',
        role: 'Principal',
        email: 'admin@holycrossbrooklyn.co.za',
        phone: '+27 21 511 4337',
        grade: 'All',
        subjects: JSON.stringify(['Leadership', 'Religious Education']),
        category: 'LEADERSHIP',
        isActive: true,
        order: 1
      },
      {
        name: 'Mrs. Sarah Johnson',
        role: 'Deputy Principal',
        email: 'deputy@holycross.co.za',
        phone: '+27 21 123 4568',
        grade: 'All',
        subjects: JSON.stringify(['Mathematics', 'Curriculum Development']),
        category: 'LEADERSHIP',
        isActive: true,
        order: 2
      },
      {
        name: 'Mr. David Smith',
        role: 'Grade 7 Teacher',
        email: 'david.smith@holycross.co.za',
        phone: '+27 21 123 4569',
        grade: 'Grade 7',
        subjects: JSON.stringify(['Mathematics', 'Science']),
        category: 'TEACHING',
        isActive: true,
        order: 3
      },
      {
        name: 'Ms. Emily Brown',
        role: 'Grade 6 Teacher',
        email: 'emily.brown@holycross.co.za',
        phone: '+27 21 123 4570',
        grade: 'Grade 6',
        subjects: JSON.stringify(['English', 'Life Orientation']),
        category: 'TEACHING',
        isActive: true,
        order: 4
      },
      {
        name: 'Mrs. Jennifer Wilson',
        role: 'Grade 5 Teacher',
        email: 'jennifer.wilson@holycross.co.za',
        phone: '+27 21 123 4571',
        grade: 'Grade 5',
        subjects: JSON.stringify(['Natural Sciences', 'Social Sciences']),
        category: 'TEACHING',
        isActive: true,
        order: 5
      }
    ];

    for (const staff of staffMembers) {
      // Check if staff member already exists by name
      const existing = await prisma.staffMember.findFirst({
        where: { name: staff.name }
      });
      
      if (!existing) {
        await prisma.staffMember.create({
          data: staff
        });
      }
    }

    console.log('✅ Staff members created');

    // Create sample news articles
    console.log('\n📝 Creating news articles...');
    const newsArticles = [
      {
        title: 'Welcome to the New School Year 2025',
        content: 'We are excited to welcome all students back for another wonderful year of learning and growth at Holy Cross Convent School Brooklyn.',
        summary: 'Welcome message for the 2025 school year',
        isPublished: true,
        publishedAt: new Date(),
        priority: 'HIGH'
      },
      {
        title: 'Annual Sports Day Success',
        content: 'Our annual sports day was a tremendous success with over 200 students participating in various athletic events.',
        summary: 'Sports day highlights and results',
        isPublished: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        priority: 'MEDIUM'
      },
      {
        title: 'Academic Excellence Awards',
        content: 'Congratulations to all students who received academic excellence awards this term.',
        summary: 'Academic awards ceremony',
        isPublished: true,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        priority: 'MEDIUM'
      }
    ];

    for (const article of newsArticles) {
      await prisma.newsArticle.create({
        data: article
      });
    }

    console.log('✅ News articles created');

    // Create sample events
    console.log('\n📝 Creating events...');
    const events = [
      {
        title: 'Parent-Teacher Meetings',
        description: 'Schedule individual meetings with your child\'s teachers to discuss progress and goals.',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        location: 'School Hall',
        category: 'ACADEMIC',
        isPublished: true
      },
      {
        title: 'School Feast Day',
        description: 'Join us in celebrating our school\'s patron saint with Mass and festivities.',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'School Grounds',
        category: 'SPIRITUAL',
        isPublished: true
      },
      {
        title: 'End of Term Assembly',
        description: 'Final assembly of the term with awards and performances.',
        startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        location: 'School Hall',
        category: 'CELEBRATION',
        isPublished: true
      },
      {
        title: 'Science Fair',
        description: 'Annual science fair showcasing student projects and experiments.',
        startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        location: 'Science Lab',
        category: 'ACADEMIC',
        isPublished: true
      }
    ];

    for (const event of events) {
      await prisma.event.create({
        data: event
      });
    }

    console.log('✅ Events created');

    // Create sample board members
    console.log('\n📝 Creating board members...');
    const boardMembers = [
      {
        name: 'Sister Mary Principal',
        role: 'Chairperson',
        type: 'EXECUTIVE',
        email: 'chairperson@holycross.co.za',
        bio: 'Dedicated to providing quality Catholic education',
        order: 1,
        isActive: true
      },
      {
        name: 'Mr. John Thompson',
        role: 'Treasurer',
        type: 'EXECUTIVE',
        email: 'treasurer@holycross.co.za',
        bio: 'Financial oversight and planning',
        order: 2,
        isActive: true
      },
      {
        name: 'Mrs. Patricia Green',
        role: 'Secretary',
        type: 'EXECUTIVE',
        email: 'secretary@holycross.co.za',
        bio: 'Administrative coordination',
        order: 3,
        isActive: true
      },
      {
        name: 'Mr. Robert Davis',
        role: 'Parent Representative',
        type: 'REPRESENTATIVE',
        email: 'parent.rep@holycross.co.za',
        order: 4,
        isActive: true
      }
    ];

    for (const member of boardMembers) {
      // Check if board member already exists by name
      const existing = await prisma.boardMember.findFirst({
        where: { name: member.name }
      });
      
      if (!existing) {
        await prisma.boardMember.create({
          data: member
        });
      }
    }

    console.log('✅ Board members created');

    console.log('\n🎉 Remote database seeding completed successfully!');
    console.log('📧 Admin user created: admin@holycross.co.za');
    console.log('\n📊 Database Summary:');
    
    const counts = {
      users: await prisma.user.count(),
      staff: await prisma.staffMember.count(),
      news: await prisma.newsArticle.count(),
      events: await prisma.event.count(),
      board: await prisma.boardMember.count()
    };
    
    console.log('  - Users:', counts.users);
    console.log('  - Staff Members:', counts.staff);
    console.log('  - News Articles:', counts.news);
    console.log('  - Events:', counts.events);
    console.log('  - Board Members:', counts.board);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Database connection closed');
  }
}

// Run the seed function
remoteSeed()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

