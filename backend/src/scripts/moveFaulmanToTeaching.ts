import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to move Mrs Benita Faulman to Teaching Staff category
 * Run with: npx ts-node src/scripts/moveFaulmanToTeaching.ts
 */
async function moveFaulmanToTeaching() {
  console.log('🔄 Moving Mrs Benita Faulman to Teaching Staff...');

  try {
    // Find and update Mrs Benita Faulman
    const result = await prisma.staffMember.updateMany({
      where: {
        OR: [
          { name: { contains: 'Faulman', mode: 'insensitive' } },
          { name: { contains: 'Benita', mode: 'insensitive' } }
        ]
      },
      data: {
        category: 'TEACHING',
        role: 'Teaching Staff' // Update role if needed
      }
    });

    if (result.count === 0) {
      console.log('⚠️  No staff member found with name containing "Faulman" or "Benita"');
      console.log('💡 Available staff members:');
      const allStaff = await prisma.staffMember.findMany({
        select: { id: true, name: true, category: true, role: true }
      });
      allStaff.forEach(staff => {
        console.log(`   - ${staff.name} (${staff.category}) - ${staff.role}`);
      });
    } else {
      console.log(`✅ Updated ${result.count} staff member(s) to TEACHING category`);
      
      // Show updated record
      const updated = await prisma.staffMember.findFirst({
        where: {
          OR: [
            { name: { contains: 'Faulman', mode: 'insensitive' } },
            { name: { contains: 'Benita', mode: 'insensitive' } }
          ]
        }
      });
      
      if (updated) {
        console.log(`   Name: ${updated.name}`);
        console.log(`   Category: ${updated.category}`);
        console.log(`   Role: ${updated.role}`);
      }
    }
  } catch (error) {
    console.error('❌ Error updating staff member:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
moveFaulmanToTeaching()
  .then(() => {
    console.log('✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

