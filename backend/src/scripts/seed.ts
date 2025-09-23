import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@holycross.co.za' },
    update: {},
    create: {
      email: 'admin@holycross.co.za',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample staff members
  const staffMembers = [
    {
      name: 'Sr. Mary Principal',
      role: 'Principal',
      email: 'principal@holycross.co.za',
      phone: '+27 21 123 4567',
      bio: 'Dedicated principal with over 20 years of experience in Catholic education.',
      grade: 'All',
      subjects: JSON.stringify(['Leadership', 'Religious Education']),
      qualifications: 'M.Ed in Educational Leadership, B.Ed in Primary Education',
      experience: '20+ years in Catholic education',
      isActive: true,
      order: 1
    },
    {
      name: 'Mrs. Sarah Johnson',
      role: 'Deputy Principal',
      email: 'deputy@holycross.co.za',
      phone: '+27 21 123 4568',
      bio: 'Experienced educator specializing in curriculum development and student support.',
      grade: 'All',
      subjects: JSON.stringify(['Mathematics', 'Curriculum Development']),
      qualifications: 'B.Ed Honours, Advanced Certificate in Education',
      experience: '15 years in primary education',
      isActive: true,
      order: 2
    },
    {
      name: 'Mr. David Smith',
      role: 'Grade 7 Teacher',
      email: 'david.smith@holycross.co.za',
      phone: '+27 21 123 4569',
      bio: 'Passionate mathematics and science teacher with innovative teaching methods.',
      grade: '7',
      subjects: JSON.stringify(['Mathematics', 'Natural Sciences']),
      qualifications: 'B.Ed in Intermediate Phase, Mathematics Specialization',
      experience: '8 years teaching experience',
      isActive: true,
      order: 3
    }
  ];

  for (const staff of staffMembers) {
    await prisma.staffMember.create({
      data: staff
    });
  }

  console.log('✅ Staff members created');

  // Create sample school information
  const schoolInfo = [
    {
      key: 'school_name',
      value: 'Holy Cross Convent School Brooklyn',
      type: 'text',
      category: 'general',
      isPublic: true,
      order: 1
    },
    {
      key: 'school_motto',
      value: 'Faith, Excellence, Service',
      type: 'text',
      category: 'general',
      isPublic: true,
      order: 2
    },
    {
      key: 'school_address',
      value: '123 Main Street, Brooklyn, Cape Town, 7405',
      type: 'text',
      category: 'contact',
      isPublic: true,
      order: 1
    },
    {
      key: 'school_phone',
      value: '+27 21 123 4567',
      type: 'text',
      category: 'contact',
      isPublic: true,
      order: 2
    },
    {
      key: 'school_email',
      value: 'info@holycross.co.za',
      type: 'text',
      category: 'contact',
      isPublic: true,
      order: 3
    },
    {
      key: 'school_hours',
      value: 'Monday - Friday: 7:30 AM - 2:30 PM',
      type: 'text',
      category: 'general',
      isPublic: true,
      order: 3
    },
    {
      key: 'school_established',
      value: '1985',
      type: 'text',
      category: 'general',
      isPublic: true,
      order: 4
    },
    {
      key: 'school_principal',
      value: 'Sr. Mary Principal',
      type: 'text',
      category: 'leadership',
      isPublic: true,
      order: 1
    },
    {
      key: 'school_mission',
      value: 'To provide quality Catholic education that nurtures the whole child - spiritually, academically, socially, and physically.',
      type: 'text',
      category: 'mission_vision',
      isPublic: true,
      order: 1
    }
  ];

  for (const info of schoolInfo) {
    await prisma.schoolInfo.upsert({
      where: { key: info.key },
      update: {},
      create: info
    });
  }

  console.log('✅ School information created');

  // Create sample settings
  const settings = [
    {
      key: 'site_title',
      value: 'Holy Cross Convent School Brooklyn',
      type: 'string',
      category: 'site'
    },
    {
      key: 'contact_email',
      value: 'info@holycross.co.za',
      type: 'string',
      category: 'contact'
    },
    {
      key: 'contact_phone',
      value: '+27 21 123 4567',
      type: 'string',
      category: 'contact'
    },
    {
      key: 'maintenance_mode',
      value: 'false',
      type: 'boolean',
      category: 'system'
    }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }

  console.log('✅ Settings created');

  // Create sample tags
  const tags = [
    { name: 'Academic', color: '#1a237e' },
    { name: 'Sports', color: '#4caf50' },
    { name: 'Cultural', color: '#ff9800' },
    { name: 'Spiritual', color: '#9c27b0' }
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
  console.log('📧 Admin login: admin@holycross.co.za / admin123');
  console.log('📝 Note: Policies and other enum-based data can be added via the API');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 