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

  // Ensure workflow role users exist
  const workflowPasswordHash = await bcrypt.hash('workflow123', 12);
  const workflowUsers = [
    {
      email: 'secretary@holycross.co.za',
      name: 'Admissions Secretary',
      role: 'SECRETARY',
    },
    {
      email: 'bursar@holycross.co.za',
      name: 'School Bursar',
      role: 'BURSAR',
    },
    {
      email: 'principal@holycross.co.za',
      name: 'School Principal',
      role: 'PRINCIPAL',
    },
    {
      email: 'teacher.assessments@holycross.co.za',
      name: 'Assessment Teacher',
      role: 'TEACHER',
    },
  ];

  for (const user of workflowUsers) {
    const seededUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        isActive: true,
      },
      create: {
        email: user.email,
        password: workflowPasswordHash,
        name: user.name,
        role: user.role,
        isActive: true,
      },
    });
    console.log(`✅ Workflow user ready: ${seededUser.email} (${seededUser.role})`);
  }

  // Create sample staff members
  const staffMembers = [
    {
      name: 'Mrs Du Plesis',
      role: 'Principal',
      email: 'admin@holycrossbrooklyn.co.za',
      phone: '+27 21 511 4337',
      grade: 'All',
      subjects: JSON.stringify(['Leadership', 'Religious Education']),
      isActive: true,
      order: 1,
      category: 'LEADERSHIP' as const
    },
    {
      name: 'Mrs. Sarah Johnson',
      role: 'Deputy Principal',
      email: 'deputy@holycross.co.za',
      phone: '+27 21 123 4568',
      grade: 'All',
      subjects: JSON.stringify(['Mathematics', 'Curriculum Development']),
      isActive: true,
      order: 2,
      category: 'LEADERSHIP' as const
    },
    {
      name: 'Mr. David Smith',
      role: 'Grade 7 Teacher',
      email: 'david.smith@holycross.co.za',
      phone: '+27 21 123 4569',
      grade: '7',
      subjects: JSON.stringify(['Mathematics', 'Natural Sciences']),
      isActive: true,
      order: 3,
      category: 'TEACHING' as const
    },
    {
      name: 'Ms. Lisa Brown',
      role: 'Grade 5 Teacher',
      email: 'lisa.brown@holycross.co.za',
      phone: '+27 21 123 4570',
      grade: '5',
      subjects: JSON.stringify(['English', 'Social Sciences']),
      isActive: true,
      order: 4,
      category: 'TEACHING' as const
    },
    {
      name: 'Mrs. Patricia Wilson',
      role: 'School Secretary',
      email: 'patricia.wilson@holycross.co.za',
      phone: '+27 21 123 4571',
      grade: 'All',
      subjects: JSON.stringify(['Administration']),
      isActive: true,
      order: 5,
      category: 'SUPPORT' as const
    }
  ];

  for (const staff of staffMembers) {
    await prisma.staffMember.create({
      data: staff
    });
  }

  console.log('✅ Staff members created');

  // Governing body chairperson
  await prisma.governingBodyMember.upsert({
    where: { email: 'arwill@telkomsa.net' },
    update: {
      name: 'Mrs Nancy Will',
      designation: 'Chairperson',
      sector: '',
      address: '13 Julianaveld, North Pinelands',
      phone: '+27 83 555 8100',
      order: 1,
      isActive: true,
    },
    create: {
      name: 'Mrs Nancy Will',
      designation: 'Chairperson',
      sector: '',
      address: '13 Julianaveld, North Pinelands',
      phone: '+27 83 555 8100',
      email: 'arwill@telkomsa.net',
      order: 1,
      isActive: true,
    },
  });

  console.log('✅ Governing body member seeded');

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