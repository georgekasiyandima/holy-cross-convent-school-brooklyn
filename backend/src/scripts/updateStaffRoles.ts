import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to update staff member roles
 * Run with: npx ts-node src/scripts/updateStaffRoles.ts
 */
async function updateStaffRoles() {
  console.log('🔄 Starting staff role updates...');

  try {
    // Update Sister Eileen Kenny - Religious Education
    const sisterEileen = await prisma.staffMember.updateMany({
      where: {
        OR: [
          { name: { contains: 'Eileen' } },
          { name: { contains: 'Kenny' } }
        ]
      },
      data: {
        role: 'Religious Education'
      }
    });
    console.log(`✅ Updated Sister Eileen Kenny: ${sisterEileen.count} record(s)`);

    // Update Sister Wadzanai Mubaiwa - After School Programme
    const sisterWadzanai = await prisma.staffMember.updateMany({
      where: {
        OR: [
          { name: { contains: 'Wadzanai' } },
          { name: { contains: 'Mubaiwa' } },
          { name: { contains: 'Wadzie' } }
        ]
      },
      data: {
        role: 'After School Programme'
      }
    });
    console.log(`✅ Updated Sister Wadzanai Mubaiwa: ${sisterWadzanai.count} record(s)`);

    // Update Mrs Faulmann - After School Programme
    const mrsFaulmann = await prisma.staffMember.updateMany({
      where: {
        name: {
          contains: 'Faulmann'
        }
      },
      data: {
        role: 'After School Programme'
      }
    });
    console.log(`✅ Updated Mrs Faulmann: ${mrsFaulmann.count} record(s)`);

    // Update Mr Thelen - Music/Computers (remove grade if exists)
    const mrThelen = await prisma.staffMember.updateMany({
      where: {
        name: {
          contains: 'Thelen'
        }
      },
      data: {
        role: 'Music/Computers',
        grade: null // Remove grade to hide "All Grades" card
      }
    });
    console.log(`✅ Updated Mr Thelen: ${mrThelen.count} record(s)`);

    // Update Ms De Sousa - Computers/Robotics
    const msDeSousa = await prisma.staffMember.updateMany({
      where: {
        OR: [
          { name: { contains: 'De Sousa' } },
          { name: { contains: 'DeSousa' } }
        ]
      },
      data: {
        role: 'Computers/Robotics'
      }
    });
    console.log(`✅ Updated Ms De Sousa: ${msDeSousa.count} record(s)`);

    // Update Mrs Welcomets - Principal PA/Secretary
    const mrsWelcomets = await prisma.staffMember.updateMany({
      where: {
        name: {
          contains: 'Welcomets'
        }
      },
      data: {
        role: 'Principal PA/Secretary'
      }
    });
    console.log(`✅ Updated Mrs Welcomets: ${mrsWelcomets.count} record(s)`);

    // Update Mrs McLeod - RE Co-ordinator
    const mrsMcLeod = await prisma.staffMember.updateMany({
      where: {
        name: {
          contains: 'McLeod'
        }
      },
      data: {
        role: 'RE Co-ordinator'
      }
    });
    console.log(`✅ Updated Mrs McLeod: ${mrsMcLeod.count} record(s)`);

    // Update Mrs Afonso - Bursar
    const mrsAfonso = await prisma.staffMember.updateMany({
      where: {
        name: {
          contains: 'Afonso'
        }
      },
      data: {
        role: 'Bursar'
      }
    });
    console.log(`✅ Updated Mrs Afonso: ${mrsAfonso.count} record(s)`);

    // Update Mrs Lennox - Bursar Assistant
    const mrsLennox = await prisma.staffMember.updateMany({
      where: {
        name: {
          contains: 'Lennox'
        }
      },
      data: {
        role: 'Bursar Assistant'
      }
    });
    console.log(`✅ Updated Mrs Lennox: ${mrsLennox.count} record(s)`);

    // Update Mrs Peters - Librarian/ Fundraising
    const mrsPeters = await prisma.staffMember.updateMany({
      where: {
        name: {
          contains: 'Peters'
        }
      },
      data: {
        role: 'Librarian/ Fundraising'
      }
    });
    console.log(`✅ Updated Mrs Peters: ${mrsPeters.count} record(s)`);

    console.log('✅ Staff role updates completed successfully!');
  } catch (error) {
    console.error('❌ Error updating staff roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateStaffRoles()
  .then(() => {
    console.log('✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

