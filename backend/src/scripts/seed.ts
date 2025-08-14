import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create initial admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@holycrossbrooklyn.edu' },
    update: {},
    create: {
      email: 'admin@holycrossbrooklyn.edu',
      password: hashedPassword,
      name: 'School Administrator',
      role: 'SUPER_ADMIN'
    }
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create staff members
  const staffMembers = [
    {
      name: 'Principal',
      role: 'Principal',
      email: 'principal@holycrossbrooklyn.edu',
      bio: 'Leading our school with dedication and vision.',
      imageUrl: '/Principal.png',
      order: 1
    },
    {
      name: 'Vice Principal',
      role: 'Vice Principal',
      email: 'viceprincipal@holycrossbrooklyn.edu',
      bio: 'Supporting academic excellence and student development.',
      order: 2
    },
    {
      name: 'Head of Academics',
      role: 'Head of Academics',
      email: 'academics@holycrossbrooklyn.edu',
      bio: 'Overseeing curriculum development and academic standards.',
      order: 3
    },
    {
      name: 'School Counselor',
      role: 'School Counselor',
      email: 'counselor@holycrossbrooklyn.edu',
      bio: 'Providing guidance and support to students.',
      order: 4
    }
  ];

  // Create staff members (using createMany for better performance)
  await prisma.staffMember.createMany({
    data: staffMembers
  });

  console.log('✅ Staff members created');

  // Create sample news articles
  const newsArticles = [
    {
      title: 'Welcome to the New Academic Year',
      content: 'We are excited to welcome all students and families to the new academic year. This year promises to be filled with learning, growth, and achievement.',
      summary: 'A warm welcome to all students for the new academic year.',
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id
    },
    {
      title: 'Annual Science Fair Success',
      content: 'Our annual science fair was a tremendous success with over 50 projects showcased by students from grades 6-12. The creativity and scientific thinking displayed was outstanding.',
      summary: 'Students showcase innovative projects at annual science fair.',
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      authorId: adminUser.id
    }
  ];

  for (const article of newsArticles) {
    await prisma.newsArticle.create({
      data: article
    });
  }

  console.log('✅ Sample news articles created');

  // Create sample events
  const events = [
    {
      title: 'Open House',
      description: 'Join us for our annual open house to learn more about our programs and meet our faculty.',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      location: 'School Auditorium',
      isPublished: true,
      authorId: adminUser.id
    },
    {
      title: 'Parent-Teacher Conference',
      description: 'Scheduled parent-teacher conferences to discuss student progress.',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      location: 'Classrooms',
      isPublished: true,
      authorId: adminUser.id
    }
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event
    });
  }

  console.log('✅ Sample events created');

  // Create system settings
  const settings = [
    { key: 'school_name', value: 'Holy Cross Convent School Brooklyn', type: 'string' },
    { key: 'school_address', value: '123 School Street, Brooklyn, NY 11201', type: 'string' },
    { key: 'school_phone', value: '(555) 123-4567', type: 'string' },
    { key: 'school_email', value: 'info@holycrossbrooklyn.edu', type: 'string' },
    { key: 'school_website', value: 'https://holycrossbrooklyn.edu', type: 'string' },
    { key: 'school_founded', value: '1950', type: 'string' },
    { key: 'school_mission', value: 'Nurturing Excellence, Building Character, Inspiring Faith', type: 'string' },
    { key: 'school_grades', value: 'K-12', type: 'string' },
    { key: 'school_type', value: 'Private Catholic School', type: 'string' },
    { key: 'contact_form_enabled', value: 'true', type: 'boolean' },
    { key: 'newsletter_subscription_enabled', value: 'true', type: 'boolean' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean' }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }

  console.log('✅ System settings created');

  // Create sample tags
  const tags = [
    { name: 'Academic', color: '#1976d2' },
    { name: 'Events', color: '#388e3c' },
    { name: 'Sports', color: '#f57c00' },
    { name: 'Arts', color: '#7b1fa2' },
    { name: 'Technology', color: '#0288d1' },
    { name: 'Community', color: '#d32f2f' }
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag
    });
  }

  console.log('✅ Tags created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('📧 Admin login: admin@holycrossbrooklyn.edu');
  console.log('🔑 Admin password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 