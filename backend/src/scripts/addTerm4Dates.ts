import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: string;
  category: string;
  grade?: string;
  location?: string;
  time?: string;
  isHoliday?: boolean;
  isExam?: boolean;
  isPublicHoliday?: boolean;
}

async function addTerm4Dates() {
  try {
    console.log('Adding Term 4 dates to calendar...');

    // Define all Term 4 dates
    const events: CalendarEvent[] = [
      // October 2025
      {
        title: 'Systemic Tests Grade 3 and Grade 6',
        description: 'Details to follow',
        startDate: new Date('2025-10-20'),
        type: 'EXAM',
        category: 'academic',
        grade: 'all',
        isExam: true
      },
      {
        title: 'AGM',
        description: 'Details to follow',
        startDate: new Date('2025-10-21'),
        type: 'PARENT_MEETING',
        category: 'community',
        grade: 'all'
      },
      {
        title: 'Grade 7 Holy Childhood Mass',
        description: 'Grade 7 Holy Childhood Mass',
        startDate: new Date('2025-10-30'),
        type: 'OTHER',
        category: 'spiritual',
        grade: '7',
        time: 'School Mass time - All welcome to attend'
      },
      
      // November 2025
      {
        title: 'All Saints Day',
        description: 'All Saints Day',
        startDate: new Date('2025-11-02'),
        type: 'OTHER',
        category: 'spiritual',
        grade: 'all',
        isPublicHoliday: true
      },
      {
        title: 'All Souls Day',
        description: 'All Souls Day',
        startDate: new Date('2025-11-03'),
        type: 'OTHER',
        category: 'spiritual',
        grade: 'all'
      },
      {
        title: 'Feast Day of St Charles Borromeo',
        description: 'Feast Day of St Charles Borromeo',
        startDate: new Date('2025-11-04'),
        type: 'OTHER',
        category: 'spiritual',
        grade: 'all',
        time: 'School Mass time - All welcome to attend'
      },
      {
        title: 'Confessions - Grade 3 to 7',
        description: 'Confessions for Grade 3 to Grade 7',
        startDate: new Date('2025-11-11'),
        type: 'OTHER',
        category: 'spiritual',
        grade: 'all'
      },
      {
        title: 'Grade 7 Exams',
        description: 'Grade 7 Examination period',
        startDate: new Date('2025-11-12'),
        endDate: new Date('2025-11-21'),
        type: 'EXAM',
        category: 'academic',
        grade: '7',
        isExam: true
      },
      {
        title: 'Grade 4 - Grade 6 Exams',
        description: 'Grade 4 to Grade 6 Examination period',
        startDate: new Date('2025-11-17'),
        endDate: new Date('2025-11-21'),
        type: 'EXAM',
        category: 'academic',
        grade: 'all',
        isExam: true
      },
      {
        title: 'Outing for Grade R - Grade 3',
        description: 'Details to follow',
        startDate: new Date('2025-11-20'),
        type: 'OTHER',
        category: 'community',
        grade: 'all'
      },
      {
        title: 'Caxton Books Online Orders Close',
        description: 'Caxton Books online orders close',
        startDate: new Date('2025-11-21'),
        type: 'OTHER',
        category: 'academic',
        grade: 'all'
      },
      {
        title: 'Orientation of Grade R and Grade 1',
        description: 'Orientation session for Grade R and Grade 1 learners',
        startDate: new Date('2025-11-22'),
        type: 'PARENT_MEETING',
        category: 'community',
        grade: 'all',
        time: '9:00 AM'
      },
      {
        title: 'Feast of Christ the King - End of the Liturgical Year',
        description: 'Feast of Christ the King - End of the Liturgical Year',
        startDate: new Date('2025-11-23'),
        type: 'OTHER',
        category: 'spiritual',
        grade: 'all',
        time: 'School Mass time - All welcome to attend'
      },
      {
        title: 'Grade 7 Retreat',
        description: 'Details to follow',
        startDate: new Date('2025-11-24'),
        type: 'OTHER',
        category: 'spiritual',
        grade: '7'
      },
      {
        title: 'Grade R to Grade 3 Christmas Event',
        description: 'Details to follow',
        startDate: new Date('2025-11-26'),
        type: 'CULTURAL_DAY',
        category: 'cultural',
        grade: 'all'
      },
      {
        title: 'Senior Citizen Christmas Tea',
        description: 'Senior Citizen Christmas Tea',
        startDate: new Date('2025-11-28'),
        type: 'OTHER',
        category: 'community',
        grade: 'all'
      },
      {
        title: '1st Sunday of Advent',
        description: '1st Sunday of Advent',
        startDate: new Date('2025-11-30'),
        type: 'OTHER',
        category: 'spiritual',
        grade: 'all',
        time: 'School Mass time - All welcome to attend'
      },
      
      // December 2025
      {
        title: 'Delivery of Waltons Stationery Orders',
        description: 'Delivery of Waltons Stationery orders (Orders close 1 Nov)',
        startDate: new Date('2025-12-01'),
        type: 'OTHER',
        category: 'academic',
        grade: 'all'
      },
      {
        title: 'Final School Mass (Gr 7s hand over light of leadership to Gr 6 learners)',
        description: 'Final School Mass - Grade 7s hand over light of leadership to Grade 6 learners',
        startDate: new Date('2025-12-02'),
        type: 'OTHER',
        category: 'spiritual',
        grade: 'all',
        time: 'School Mass time - All welcome to attend'
      },
      {
        title: 'Senior Prize Giving',
        description: 'Details to follow',
        startDate: new Date('2025-12-02'),
        type: 'CULTURAL_DAY',
        category: 'cultural',
        grade: 'all'
      }
    ];

    // Add events to database
    let added = 0;
    let skipped = 0;

    for (const event of events) {
      // Check if event already exists
      const existing = await prisma.academicCalendar.findFirst({
        where: {
          title: event.title,
          startDate: event.startDate
        }
      });

      if (existing) {
        console.log(`Skipping existing event: ${event.title}`);
        skipped++;
        continue;
      }

      await prisma.academicCalendar.create({
        data: {
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          type: event.type,
          category: event.category,
          grade: event.grade || 'all',
          location: event.location,
          time: event.time,
          isHoliday: event.isHoliday || false,
          isExam: event.isExam || false,
          isPublicHoliday: event.isPublicHoliday || false
        }
      });

      console.log(`Added: ${event.title} - ${event.startDate.toISOString().split('T')[0]}`);
      added++;
    }

    console.log(`\n✅ Successfully added ${added} events`);
    console.log(`⏭️  Skipped ${skipped} existing events`);
    console.log(`📅 Total events in Term 4: ${events.length}`);

  } catch (error) {
    console.error('Error adding Term 4 dates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addTerm4Dates()
  .then(() => {
    console.log('\n✨ Term 4 dates added successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

