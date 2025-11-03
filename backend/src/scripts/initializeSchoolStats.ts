import { PrismaClient } from '@prisma/client';
import { SchoolStatsService } from '../services/schoolStatsService';

const prisma = new PrismaClient();

async function initializeSchoolStats() {
  try {
    console.log('🚀 Initializing school statistics...');
    
    const schoolStatsService = SchoolStatsService.getInstance();
    
    // Initialize default statistics
    await schoolStatsService.initializeDefaultStats();
    
    console.log('✅ School statistics initialized successfully!');
    
    // Display the created statistics
    const stats = await schoolStatsService.getAllStats();
    console.log('\n📊 Created statistics:');
    stats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.label}: ${stat.value} (${stat.key})`);
    });
    
  } catch (error) {
    console.error('❌ Error initializing school statistics:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initializeSchoolStats();













