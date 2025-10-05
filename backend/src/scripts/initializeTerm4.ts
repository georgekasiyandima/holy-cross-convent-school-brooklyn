import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeTerm4() {
  try {
    console.log('🚀 Initializing Term 4 2025...');

    // Create Term 4 2025
    const term4 = await prisma.term.create({
      data: {
        year: 2025,
        termNumber: 4,
        name: 'Term 4',
        startDate: new Date('2025-10-07'),
        endDate: new Date('2025-12-12'),
        isActive: false, // Will be activated when needed
        description: 'Term 4 2025 - Final term of the academic year'
      }
    });

    console.log('✅ Term 4 created:', term4.id);

    // Term 4 2025 Important Dates
    const term4Events = [
      // October 2025
      {
        title: 'Term 4 Begins',
        description: 'Start of Term 4 2025',
        startDate: new Date('2025-10-07'),
        endDate: new Date('2025-10-07'),
        type: 'TERM_START' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'academic',
        termId: term4.id
      },
      {
        title: 'Heritage Day',
        description: 'Public Holiday - Heritage Day',
        startDate: new Date('2025-10-24'),
        endDate: new Date('2025-10-24'),
        type: 'HOLIDAY' as const,
        isHoliday: true,
        isExam: false,
        isPublicHoliday: true,
        grade: 'all',
        category: 'community',
        termId: term4.id
      },
      {
        title: 'Halloween Celebration',
        description: 'School Halloween celebration and activities',
        startDate: new Date('2025-10-31'),
        endDate: new Date('2025-10-31'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'cultural',
        termId: term4.id
      },

      // November 2025
      {
        title: 'Grade 7 Final Exams Begin',
        description: 'Grade 7 final examinations start',
        startDate: new Date('2025-11-03'),
        endDate: new Date('2025-11-14'),
        type: 'EXAM' as const,
        isHoliday: false,
        isExam: true,
        isPublicHoliday: false,
        grade: '7',
        category: 'academic',
        termId: term4.id
      },
      {
        title: 'Remembrance Day',
        description: 'Remembrance Day observance',
        startDate: new Date('2025-11-11'),
        endDate: new Date('2025-11-11'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'spiritual',
        termId: term4.id
      },
      {
        title: 'Grade 7 Valedictory Service',
        description: 'Grade 7 farewell and valedictory service',
        startDate: new Date('2025-11-15'),
        endDate: new Date('2025-11-15'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: '7',
        category: 'spiritual',
        termId: term4.id
      },
      {
        title: 'Grade 7 Graduation Ceremony',
        description: 'Grade 7 graduation ceremony and celebration',
        startDate: new Date('2025-11-22'),
        endDate: new Date('2025-11-22'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: '7',
        category: 'academic',
        termId: term4.id
      },
      {
        title: 'Advent Begins',
        description: 'Beginning of Advent season',
        startDate: new Date('2025-11-30'),
        endDate: new Date('2025-11-30'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'spiritual',
        termId: term4.id
      },

      // December 2025
      {
        title: 'Advent Wreath Lighting',
        description: 'Weekly Advent wreath lighting ceremony',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-01'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'spiritual',
        termId: term4.id
      },
      {
        title: 'Christmas Concert Rehearsals',
        description: 'Christmas concert preparation and rehearsals',
        startDate: new Date('2025-12-02'),
        endDate: new Date('2025-12-05'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'cultural',
        termId: term4.id
      },
      {
        title: 'Christmas Concert',
        description: 'Annual Christmas concert and celebration',
        startDate: new Date('2025-12-06'),
        endDate: new Date('2025-12-06'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'cultural',
        termId: term4.id
      },
      {
        title: 'Final Assembly',
        description: 'End of year assembly and awards ceremony',
        startDate: new Date('2025-12-11'),
        endDate: new Date('2025-12-11'),
        type: 'OTHER' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'academic',
        termId: term4.id
      },
      {
        title: 'Term 4 Ends',
        description: 'End of Term 4 and academic year 2025',
        startDate: new Date('2025-12-12'),
        endDate: new Date('2025-12-12'),
        type: 'TERM_END' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'academic',
        termId: term4.id
      },
      {
        title: 'Christmas Holidays Begin',
        description: 'Christmas holiday break begins',
        startDate: new Date('2025-12-13'),
        endDate: new Date('2025-12-31'),
        type: 'HOLIDAY' as const,
        isHoliday: true,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'community',
        termId: term4.id
      }
    ];

    // Create all Term 4 events
    for (const eventData of term4Events) {
      await prisma.academicCalendar.create({
        data: eventData
      });
    }

    console.log(`✅ Created ${term4Events.length} Term 4 events`);

    // Also create some general events not tied to a specific term
    const generalEvents = [
      {
        title: 'Parent-Teacher Meetings',
        description: 'Scheduled parent-teacher meetings',
        startDate: new Date('2025-11-20'),
        endDate: new Date('2025-11-20'),
        type: 'PARENT_MEETING' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'academic',
        termId: null
      },
      {
        title: 'Sports Day',
        description: 'Annual sports day and athletics competition',
        startDate: new Date('2025-11-08'),
        endDate: new Date('2025-11-08'),
        type: 'SPORTS_DAY' as const,
        isHoliday: false,
        isExam: false,
        isPublicHoliday: false,
        grade: 'all',
        category: 'sports',
        termId: null
      }
    ];

    for (const eventData of generalEvents) {
      await prisma.academicCalendar.create({
        data: eventData
      });
    }

    console.log(`✅ Created ${generalEvents.length} general events`);

    console.log('🎉 Term 4 2025 initialization completed successfully!');
    console.log('📅 Term 4 runs from October 7, 2025 to December 12, 2025');
    console.log('🎓 Grade 7 graduation scheduled for November 22, 2025');
    console.log('🎄 Christmas concert on December 6, 2025');

  } catch (error) {
    console.error('❌ Error initializing Term 4:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initializeTerm4()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
