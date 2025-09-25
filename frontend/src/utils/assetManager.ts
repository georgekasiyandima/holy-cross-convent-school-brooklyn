/**
 * Asset Management System for Holy Cross Convent School
 * 
 * This system organizes all school assets by category for easy access and maintenance.
 * Assets are categorized by type and purpose to ensure proper organization.
 */

export interface Asset {
  id: string;
  filename: string;
  path: string;
  alt: string;
  category: AssetCategory;
  description?: string;
  size?: string;
  dimensions?: string;
  // Facebook integration
  facebookUrl?: string;
  facebookPostId?: string;
  isFacebookPost?: boolean;
  fallbackImage?: string;
}

export type AssetCategory = 
  | 'logo'
  | 'staff'
  | 'grades'
  | 'events'
  | 'spiritual'
  | 'facilities'
  | 'documents'
  | 'backgrounds'
  | 'system'
  | 'computer-lab'
  | 'book-day'
  | 'youth-day'
  | 'quiz-night'
  | 'athletics'
  | 'music'
  | 'science-expo';

export interface AssetCollection {
  category: AssetCategory;
  title: string;
  description: string;
  assets: Asset[];
}

/**
 * Main logo assets
 */
export const logoAssets: Asset[] = [
  {
    id: 'main-logo',
    filename: 'Logo(1).svg',
    path: '/Logo(1).svg',
    alt: 'Holy Cross Convent School Brooklyn Logo',
    category: 'logo',
    description: 'Main school logo',
    size: '52KB',
    dimensions: '227px'
  },
  {
    id: 'jubilee-logo',
    filename: 'jubilee logo.jpg',
    path: '/jubilee logo.jpg',
    alt: 'Jubilee Logo',
    category: 'logo',
    description: 'Jubilee celebration logo',
    size: '28KB',
    dimensions: '103px'
  },
];

/**
 * Staff and leadership images
 */
export const staffAssets: Asset[] = [
  {
    id: 'staff-photo',
    filename: 'Staff.jpg',
    path: '/Staff.jpg',
    alt: 'Holy Cross Convent School Staff',
    category: 'staff',
    description: 'School staff group photo',
    size: '294KB'
  },
  {
    id: 'fr-theodosius',
    filename: 'Fr Theodosius.jpg',
    path: '/Fr Theodosius.jpg',
    alt: 'Fr Theodosius',
    category: 'staff',
    description: 'Father Theodosius',
    size: '8.7KB',
    dimensions: '46px'
  },
  {
    id: 'principal',
    filename: 'Pricipal.png',
    path: '/Pricipal.png',
    alt: 'School Principal',
    category: 'staff',
    description: 'School Principal',
    size: '279KB'
  },
  {
    id: 'teachers-08',
    filename: 'HCTEACHERS08.jpg',
    path: '/HCTEACHERS08.jpg',
    alt: 'Teachers Group Photo 2025',
    category: 'staff',
    description: 'Teachers group photo 2025',
    size: '346KB'
  },
  {
    id: 'teachers-34',
    filename: 'HCTEACHERS 34.jpg',
    path: '/HCTEACHERS 34.jpg',
    alt: 'Teachers Group Photo 2025',
    category: 'staff',
    description: 'Teachers group photo 2025',
    size: '303KB'
  }
];

/**
 * Grade level photos
 */
export const gradeAssets: Asset[] = [
  {
    id: 'grade-r',
    filename: 'GradeR.jpg',
    path: '/GradeR.jpg',
    alt: 'Grade R Class',
    category: 'grades',
    description: 'Grade R class photo',
    size: '282KB'
  },
  {
    id: 'grade-o',
    filename: 'GradeO.jpg',
    path: '/GradeO.jpg',
    alt: 'Grade O Class',
    category: 'grades',
    description: 'Grade O class photo',
    size: '263KB'
  },
  {
    id: 'grade-1',
    filename: 'Grade1.jpg',
    path: '/Grade1.jpg',
    alt: 'Grade 1 Class',
    category: 'grades',
    description: 'Grade 1 class photo',
    size: '276KB'
  },
  {
    id: 'grade-2',
    filename: 'Grade2.jpg',
    path: '/Grade2.jpg',
    alt: 'Grade 2 Class',
    category: 'grades',
    description: 'Grade 2 class photo',
    size: '287KB'
  },
  {
    id: 'grade-3',
    filename: 'Grade3.jpg',
    path: '/Grade3.jpg',
    alt: 'Grade 3 Class',
    category: 'grades',
    description: 'Grade 3 class photo',
    size: '292KB'
  },
  {
    id: 'grade-4',
    filename: 'Grade4.jpg',
    path: '/Grade4.jpg',
    alt: 'Grade 4 Class',
    category: 'grades',
    description: 'Grade 4 class photo',
    size: '292KB'
  },
  {
    id: 'grade-5',
    filename: 'Grade5.jpg',
    path: '/Grade5.jpg',
    alt: 'Grade 5 Class',
    category: 'grades',
    description: 'Grade 5 class photo',
    size: '294KB'
  },
  {
    id: 'grade-6',
    filename: 'Grade6.jpg',
    path: '/Grade6.jpg',
    alt: 'Grade 6 Class',
    category: 'grades',
    description: 'Grade 6 class photo',
    size: '288KB'
  },
  {
    id: 'grade-7',
    filename: 'Grade7.jpg',
    path: '/Grade7.jpg',
    alt: 'Grade 7 Class',
    category: 'grades',
    description: 'Grade 7 class photo',
    size: '291KB'
  }
];

/**
 * Computer Lab and ICT Hub images
 */
export const computerLabAssets: Asset[] = [
  {
    id: 'computer-lab-main',
    filename: 'COMPUTERLAB.jpg',
    path: '/COMPUTERLAB.jpg',
    alt: 'Computer Lab Overview',
    category: 'computer-lab',
    description: 'Main computer lab overview',
    size: '200KB'
  },
  {
    id: 'computer-lab-01',
    filename: 'COMPUTERLAB01.jpg',
    path: '/COMPUTERLAB01.jpg',
    alt: 'Computer Lab Activity 1',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '224KB'
  },
  {
    id: 'computer-lab-02',
    filename: 'COMPUTERLAB02.jpg',
    path: '/COMPUTERLAB02.jpg',
    alt: 'Computer Lab Activity 2',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '211KB'
  },
  {
    id: 'computer-lab-03',
    filename: 'COMPUTERLAB03.jpg',
    path: '/COMPUTERLAB03.jpg',
    alt: 'Computer Lab Activity 3',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '200KB'
  },
  {
    id: 'computer-lab-04',
    filename: 'COMPUTERLAB04.jpg',
    path: '/COMPUTERLAB04.jpg',
    alt: 'Computer Lab Activity 4',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '203KB'
  },
  {
    id: 'computer-lab-05',
    filename: 'COMPUTERLAB05.jpg',
    path: '/COMPUTERLAB05.jpg',
    alt: 'Computer Lab Activity 5',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '187KB'
  },
  {
    id: 'computer-lab-06',
    filename: 'COMPUTERLAB06.jpg',
    path: '/COMPUTERLAB06.jpg',
    alt: 'Computer Lab Activity 6',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '185KB'
  },
  {
    id: 'computer-lab-07',
    filename: 'COMPUTERLAB07.jpg',
    path: '/COMPUTERLAB07.jpg',
    alt: 'Computer Lab Activity 7',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '194KB'
  },
  {
    id: 'computer-lab-08',
    filename: 'COMPUTERLAB08.jpg',
    path: '/COMPUTERLAB08.jpg',
    alt: 'Computer Lab Activity 8',
    category: 'computer-lab',
    description: 'Computer lab activity session',
    size: '219KB'
  }
];

/**
 * Book Day events images
 */
export const bookDayAssets: Asset[] = [
  {
    id: 'book-day-main',
    filename: 'BOOKDAY.jpg',
    path: '/BOOKDAY.jpg',
    alt: 'Book Day Main Event',
    category: 'book-day',
    description: 'Main book day celebration',
    size: '794KB'
  },
  {
    id: 'book-day-01',
    filename: 'BOOKDAY01.jpg',
    path: '/BOOKDAY01.jpg',
    alt: 'Book Day Activity 1',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '835KB'
  },
  {
    id: 'book-day-02',
    filename: 'BOOKDAY02.jpg',
    path: '/BOOKDAY02.jpg',
    alt: 'Book Day Activity 2',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '626KB'
  },
  {
    id: 'book-day-03',
    filename: 'BOOKDAY03.jpg',
    path: '/BOOKDAY03.jpg',
    alt: 'Book Day Activity 3',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '589KB'
  },
  {
    id: 'book-day-04',
    filename: 'BOOKDAY04.jpg',
    path: '/BOOKDAY04.jpg',
    alt: 'Book Day Activity 4',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '563KB'
  },
  {
    id: 'book-day-05',
    filename: 'BOOKDAY05.jpg',
    path: '/BOOKDAY05.jpg',
    alt: 'Book Day Activity 5',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '679KB'
  },
  {
    id: 'book-day-06',
    filename: 'BOOKDAY06.jpg',
    path: '/BOOKDAY06.jpg',
    alt: 'Book Day Activity 6',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '555KB'
  },
  {
    id: 'book-day-07',
    filename: 'BOOKDAY07.jpg',
    path: '/BOOKDAY07.jpg',
    alt: 'Book Day Activity 7',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '705KB'
  },
  {
    id: 'book-day-08',
    filename: 'BOOKDAY08.jpg',
    path: '/BOOKDAY08.jpg',
    alt: 'Book Day Activity 8',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '902KB'
  },
  {
    id: 'book-day-09',
    filename: 'BOOKDAY09.jpg',
    path: '/BOOKDAY09.jpg',
    alt: 'Book Day Activity 9',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '504KB'
  },
  {
    id: 'book-day-10',
    filename: 'BOOKDAY10.jpg',
    path: '/BOOKDAY10.jpg',
    alt: 'Book Day Activity 10',
    category: 'book-day',
    description: 'Book day reading activity',
    size: '508KB'
  }
];

/**
 * Youth Day 2025 images
 */
export const youthDayAssets: Asset[] = [
  {
    id: 'youth-day-main',
    filename: 'YOUTHDAY25.jpg',
    path: '/YOUTHDAY25.jpg',
    alt: 'Youth Day 2025 Main Event',
    category: 'youth-day',
    description: 'Youth Day 2025 main celebration',
    size: '668KB'
  },
  {
    id: 'youth-day-01',
    filename: 'YOUTHDAY25-01.jpg',
    path: '/YOUTHDAY25-01.jpg',
    alt: 'Youth Day 2025 Activity 1',
    category: 'youth-day',
    description: 'Youth Day 2025 celebration activity',
    size: '663KB'
  },
  {
    id: 'youth-day-02',
    filename: 'YOUTHDAY25-02.jpg',
    path: '/YOUTHDAY25-02.jpg',
    alt: 'Youth Day 2025 Activity 2',
    category: 'youth-day',
    description: 'Youth Day 2025 celebration activity',
    size: '120KB'
  }
];

/**
 * Quiz Night events images
 */
export const quizNightAssets: Asset[] = [
  {
    id: 'quiz-night-25',
    filename: 'QUIZNIGHT25.jpg',
    path: '/QUIZNIGHT25.jpg',
    alt: 'Quiz Night 2025',
    category: 'quiz-night',
    description: 'Quiz Night 2025 competition',
    size: '189KB'
  }
];

/**
 * Athletics Awards images
 */
export const athleticsAssets: Asset[] = [
  {
    id: 'athletics-awards-main',
    filename: 'ATHLECTICS AWARDS25.jpg',
    path: '/ATHLECTICS AWARDS25.jpg',
    alt: 'Athletics Awards 2025',
    category: 'athletics',
    description: 'Athletics Awards 2025 ceremony',
    size: '181KB'
  },
  {
    id: 'athletics-awards-02',
    filename: 'ATHLETICSAWARDS25 02.jpg',
    path: '/ATHLETICSAWARDS25 02.jpg',
    alt: 'Athletics Awards 2025 - Award 2',
    category: 'athletics',
    description: 'Athletics Awards 2025 presentation',
    size: '190KB'
  },
  {
    id: 'athletics-awards-03',
    filename: 'ATHLETICSAWARDS25 03.jpg',
    path: '/ATHLETICSAWARDS25 03.jpg',
    alt: 'Athletics Awards 2025 - Award 3',
    category: 'athletics',
    description: 'Athletics Awards 2025 presentation',
    size: '204KB'
  },
  {
    id: 'athletics-awards-04',
    filename: 'ATHLETICSAWARDS25 04.jpg',
    path: '/ATHLETICSAWARDS25 04.jpg',
    alt: 'Athletics Awards 2025 - Award 4',
    category: 'athletics',
    description: 'Athletics Awards 2025 presentation',
    size: '180KB'
  },
  {
    id: 'athletics-awards-05',
    filename: 'ATHLECTICSAWARDS25 05.jpg',
    path: '/ATHLECTICSAWARDS25 05.jpg',
    alt: 'Athletics Awards 2025 - Award 5',
    category: 'athletics',
    description: 'Athletics Awards 2025 presentation',
    size: '157KB'
  },
  {
    id: 'sports-01',
    filename: 'Sports01.jpg',
    path: '/Sports01.jpg',
    alt: 'Sports Activity 1',
    category: 'athletics',
    description: 'Sports activity and training',
    size: '329KB'
  },
  {
    id: 'sports-02',
    filename: 'Sports02.jpg',
    path: '/Sports02.jpg',
    alt: 'Sports Activity 2',
    category: 'athletics',
    description: 'Sports activity and training',
    size: '397KB'
  }
];

/**
 * Music events images
 */
export const musicAssets: Asset[] = [
  {
    id: 'music-main',
    filename: 'MUSIC.jpg',
    path: '/MUSIC.jpg',
    alt: 'Music Performance',
    category: 'music',
    description: 'Music performance and activities',
    size: '337KB'
  },
  {
    id: 'music-03',
    filename: 'MUSIC03.jpg',
    path: '/MUSIC03.jpg',
    alt: 'Music Performance 3',
    category: 'music',
    description: 'Music performance and activities',
    size: '359KB'
  }
];

/**
 * Science Expo images
 */
export const scienceExpoAssets: Asset[] = [
  {
    id: 'science-expo-main',
    filename: 'SCIENCEEXPO24.jpg',
    path: '/SCIENCEEXPO24.jpg',
    alt: 'Science Expo 2024',
    category: 'science-expo',
    description: 'Science Expo 2024 main event',
    size: '309KB'
  },
  {
    id: 'science-expo-01',
    filename: 'SCIENCEEXPO24 01.jpg',
    path: '/SCIENCEEXPO24 01.jpg',
    alt: 'Science Expo 2024 - Project 1',
    category: 'science-expo',
    description: 'Science Expo 2024 project display',
    size: '291KB'
  },
  {
    id: 'science-expo-02',
    filename: 'SCIENCEEXPO02.jpg',
    path: '/SCIENCEEXPO02.jpg',
    alt: 'Science Expo - Project 2',
    category: 'science-expo',
    description: 'Science Expo project display',
    size: '232KB'
  },
  {
    id: 'science-expo-03',
    filename: 'SCIENCEEXPO03.jpg',
    path: '/SCIENCEEXPO03.jpg',
    alt: 'Science Expo - Project 3',
    category: 'science-expo',
    description: 'Science Expo project display',
    size: '263KB'
  },
  {
    id: 'science-expo-04',
    filename: 'SCIENCEEXPO04.jpg',
    path: '/SCIENCEEXPO04.jpg',
    alt: 'Science Expo - Project 4',
    category: 'science-expo',
    description: 'Science Expo project display',
    size: '149KB'
  },
  {
    id: 'science-expo-05',
    filename: 'SCIENCEEXPO24 05.jpg',
    path: '/SCIENCEEXPO24 05.jpg',
    alt: 'Science Expo 2024 - Project 5',
    category: 'science-expo',
    description: 'Science Expo 2024 project display',
    size: '330KB'
  },
  {
    id: 'science-expo-06',
    filename: 'SCIENCEEXPO24 06.jpg',
    path: '/SCIENCEEXPO24 06.jpg',
    alt: 'Science Expo 2024 - Project 6',
    category: 'science-expo',
    description: 'Science Expo 2024 project display',
    size: '259KB'
  }
];

/**
 * Event and celebration photos (existing)
 */
export const eventAssets: Asset[] = [
  {
    id: 'cardinal-visit-01',
    filename: 'Cardinal Visit 2023 WEB 01.jpg',
    path: '/Cardinal Visit 2023 WEB 01.jpg',
    alt: 'Cardinal Visit 2023 - Image 1',
    category: 'events',
    description: 'Cardinal visit celebration photo 1',
    size: '80KB'
  },
  {
    id: 'cardinal-visit-05',
    filename: 'Cardinal Visit 2023 WEB 05.jpg',
    path: '/Cardinal Visit 2023 WEB 05.jpg',
    alt: 'Cardinal Visit 2023 - Image 5',
    category: 'events',
    description: 'Cardinal visit celebration photo 5',
    size: '105KB'
  },
  {
    id: 'cardinal-visit-07',
    filename: 'Cardinal Visit 2023 WEB 07.jpg',
    path: '/Cardinal Visit 2023 WEB 07.jpg',
    alt: 'Cardinal Visit 2023 - Image 7',
    category: 'events',
    description: 'Cardinal visit celebration photo 7',
    size: '96KB'
  },
  {
    id: 'cardinal-visit-08',
    filename: 'Cardinal Visit 2023 WEB 08.jpg',
    path: '/Cardinal Visit 2023 WEB 08.jpg',
    alt: 'Cardinal Visit 2023 - Image 8',
    category: 'events',
    description: 'Cardinal visit celebration photo 8',
    size: '109KB'
  }
];

/**
 * Creative Arts and Garden Club images
 */
export const creativeArtsAssets: Asset[] = [
  {
    id: 'creative-art-main',
    filename: 'HCCREATIVEART.jpg',
    path: '/HCCREATIVEART.jpg',
    alt: 'Creative Art Activity',
    category: 'events',
    description: 'Creative art activities and projects',
    size: '173KB'
  },
  {
    id: 'creative-art-01',
    filename: 'HCCREATIVEART01.jpg',
    path: '/HCCREATIVEART01.jpg',
    alt: 'Creative Art Activity 1',
    category: 'events',
    description: 'Creative art activities and projects',
    size: '147KB'
  },
  {
    id: 'garden-club-04',
    filename: 'Garden Club 04.jpg',
    path: '/Garden Club 04.jpg',
    alt: 'Garden Club Activity',
    category: 'events',
    description: 'Garden Club activities and projects',
    size: '274KB'
  }
];

/**
 * Spiritual and religious images
 */
export const spiritualAssets: Asset[] = [
  {
    id: 'spiritual-main',
    filename: 'SPRITUAL.jpg',
    path: '/SPRITUAL.jpg',
    alt: 'Spiritual Activity',
    category: 'spiritual',
    description: 'Spiritual and religious activities',
    size: '249KB'
  },
  {
    id: 'spiritual-01',
    filename: 'SPRITUAL01.jpg',
    path: '/SPRITUAL01.jpg',
    alt: 'Spiritual Activity 1',
    category: 'spiritual',
    description: 'Spiritual and religious activities',
    size: '377KB'
  },
  {
    id: 'spiritual-04',
    filename: 'Spritual04.jpg',
    path: '/Spritual04.jpg',
    alt: 'Spiritual Activity 4',
    category: 'spiritual',
    description: 'Spiritual and religious activities',
    size: '329KB'
  },
  {
    id: 'jesus-child',
    filename: 'jesus_child.jpg',
    path: '/jesus_child.jpg',
    alt: 'Jesus and Child',
    category: 'spiritual',
    description: 'Religious imagery',
    size: '33KB'
  }
];

/**
 * Facility and campus images
 */
export const facilityAssets: Asset[] = [
  {
    id: 'hcc-l4',
    filename: 'HCCREATIVEART01.jpg',
    path: '/HCCREATIVEART01.jpg',
    alt: 'Holy Cross Campus View 4',
    category: 'facilities',
    description: 'Creative Minds',
    size: '255KB',
    dimensions: '1197px'
  },
  {
    id: 'hcwa-3',
    filename: 'HCWA3.jpg',
    path: '/HCWA3.jpg',
    alt: 'Holy Cross West Area 3',
    category: 'facilities',
    description: 'West area campus view',
    size: '255KB',
    dimensions: '1307px'
  },
  {
    id: 'hcl-2',
    filename: 'HCTEACHERS08.jpg',
    path: '/HCTEACHERS08.jpg',
    alt: 'Holy Cross Location 2',
    category: 'facilities',
    description: 'Annual Catholic Teachers Mass',
    size: '314KB',
    dimensions: '1098px'
  },
  {
    id: 'hcp-1',
    filename: 'Sports01.jpg',
    path: '/Sports01.jpg',
    alt: 'Holy Cross Property 1',
    category: 'facilities',
    description: 'School property view',
    size: '268KB',
    dimensions: '834px'
  }
];

/**
 * System and document assets
 */
export const systemAssets: Asset[] = [
  {
    id: 'favicon',
    filename: 'favicon.ico',
    path: '/favicon.ico',
    alt: 'Website Favicon',
    category: 'system',
    description: 'Website favicon icon',
    size: '3.8KB',
    dimensions: '13px'
  },
  {
    id: 'manifest',
    filename: 'manifest.json',
    path: '/manifest.json',
    alt: 'Web App Manifest',
    category: 'system',
    description: 'PWA manifest file',
    size: '492B',
    dimensions: '26px'
  },
  {
    id: 'robots',
    filename: 'robots.txt',
    path: '/robots.txt',
    alt: 'Robots.txt',
    category: 'system',
    description: 'Search engine robots file',
    size: '67B',
    dimensions: '4px'
  }
];

/**
 * Facebook post assets - for embedding social media content
 * These posts provide rich context and engagement from the school's Facebook page
 */
export const facebookPostAssets: Asset[] = [
  {
    id: 'fb-cardinal-visit-2023',
    filename: 'Cardinal Visit 2023',
    path: '/Cardinal Visit 2023 WEB 01.jpg',
    alt: 'Cardinal Visit 2023',
    category: 'events',
    description: 'Cardinal visit to Holy Cross Convent School Brooklyn',
    size: 'High Quality',
    isFacebookPost: true,
    facebookUrl: 'https://www.facebook.com/share/p/16ogng92kV/',
    facebookPostId: '16ogng92kV',
    fallbackImage: '/Cardinal Visit 2023 WEB 01.jpg'
  },
  {
    id: 'fb-youth-day-2025',
    filename: 'Youth Day 2025',
    path: '/YOUTHDAY25-01.jpg',
    alt: 'Youth Day 2025 Holy Cross Convent School Brooklyn',
    category: 'youth-day',
    description: 'Youth Day 2025 Holy Cross Convent School Brooklyn',
    size: 'High Quality',
    isFacebookPost: true,
    facebookUrl: 'https://www.facebook.com/share/p/1Ppkh2SyYH/',
    facebookPostId: '1Ppkh2SyYH',
    fallbackImage: '/YOUTHDAY25-01.jpg'
  },
  {
    id: 'fb-colour-fun-run-trophies',
    filename: 'Colour Fun Run Trophies',
    path: '/colour-fun-run-trophies.jpg',
    alt: 'Colour Fun Run Trophies',
    category: 'athletics',
    description: 'Colour Fun Run Trophies celebration at Holy Cross Convent School Brooklyn',
    size: 'High Quality',
    isFacebookPost: true,
    facebookUrl: 'https://www.facebook.com/share/p/1HzA7Ard9Q/',
    facebookPostId: '1HzA7Ard9Q',
    fallbackImage: '/colour-fun-run-trophies.jpg'
  },
  {
    id: 'fb-new-post-2025',
    filename: 'Colour Fun Run 2025',
    path: '/ColorFun25.jpg',
    alt: 'Colour Fun Run 2025 at Holy Cross Convent School Brooklyn',
    category: 'athletics',
    description: 'Colour Fun Run 2025 celebration and activities at Holy Cross Convent School Brooklyn',
    size: 'High Quality',
    isFacebookPost: true,
    facebookUrl: 'https://www.facebook.com/permalink.php?story_fbid=pfbid0qcjwTxL7uk77fkiCutjL6N3LVJhPWhw6wMAzGkformb2q2JzjdCNV8uymFtqANbMl&id=61553924237049',
    facebookPostId: 'pfbid0qcjwTxL7uk77fkiCutjL6N3LVJhPWhw6wMAzGkformb2q2JzjdCNV8uymFtqANbMl',
    fallbackImage: '/ColorFunRun01.jpg'
  },
  {
    id: 'fb-cardinal-visit-2023-2',
    filename: 'Cardinal Visit 2023 - Group Photo',
    path: '/Cardinal Visit 2023 WEB 05.jpg',
    alt: 'Cardinal Visit 2023 Group Photo',
    category: 'events',
    description: 'Group photo with Cardinal during visit',
    size: 'High Quality',
    isFacebookPost: true,
    facebookUrl: 'https://www.facebook.com/holycrossbrooklyn/posts/123456790', // Replace with actual URL
    facebookPostId: '123456790',
    fallbackImage: '/Cardinal Visit 2023 WEB 05.jpg'
  },
  {
    id: 'fb-cardinal-visit-2023-3',
    filename: 'Cardinal Visit 2023 - Ceremony',
    path: '/Cardinal Visit 2023 WEB 07.jpg',
    alt: 'Cardinal Visit 2023 Ceremony',
    category: 'events',
    description: 'Ceremony during Cardinal visit',
    size: 'High Quality',
    isFacebookPost: true,
    facebookUrl: 'https://www.facebook.com/holycrossbrooklyn/posts/123456791', // Replace with actual URL
    facebookPostId: '123456791',
    fallbackImage: '/Cardinal Visit 2023 WEB 07.jpg'
  },
  {
    id: 'fb-cardinal-visit-2023-4',
    filename: 'Cardinal Visit 2023 - Celebration',
    path: '/Cardinal Visit 2023 WEB 08.jpg',
    alt: 'Cardinal Visit 2023 Celebration',
    category: 'events',
    description: 'Celebration during Cardinal visit',
    size: 'High Quality',
    isFacebookPost: true,
    facebookUrl: 'https://www.facebook.com/holycrossbrooklyn/posts/123456792', // Replace with actual URL
    facebookPostId: '123456792',
    fallbackImage: '/Cardinal Visit 2023 WEB 08.jpg'
  }
];

/**
 * All assets organized by collection
 */
export const assetCollections: AssetCollection[] = [
  {
    category: 'logo',
    title: 'School Logos',
    description: 'Official school logos and branding materials',
    assets: logoAssets
  },
  {
    category: 'staff',
    title: 'Staff Photos',
    description: 'Photos of school staff and leadership',
    assets: staffAssets
  },
  {
    category: 'grades',
    title: 'Grade Photos',
    description: 'Class photos for each grade level',
    assets: gradeAssets
  },
  {
    category: 'computer-lab',
    title: 'Computer Lab & ICT Hub',
    description: 'Photos of the school computer lab and ICT facilities',
    assets: computerLabAssets
  },
  {
    category: 'book-day',
    title: 'Book Day Events',
    description: 'Photos from book day celebrations and reading events',
    assets: bookDayAssets
  },
  {
    category: 'youth-day',
    title: 'Youth Day 2025',
    description: 'Photos from Youth Day 2025 celebrations',
    assets: youthDayAssets
  },
  {
    category: 'quiz-night',
    title: 'Quiz Night Events',
    description: 'Photos from quiz night competitions',
    assets: quizNightAssets
  },
  {
    category: 'athletics',
    title: 'Athletics & Sports',
    description: 'Photos from athletics awards ceremonies and sports activities',
    assets: athleticsAssets
  },
  {
    category: 'music',
    title: 'Music Events',
    description: 'Photos from music performances and events',
    assets: musicAssets
  },
  {
    category: 'science-expo',
    title: 'Science Expo',
    description: 'Photos from science expo events and exhibitions',
    assets: scienceExpoAssets
  },
  {
    category: 'events',
    title: 'General Events',
    description: 'Photos from various school events and celebrations',
    assets: [...eventAssets, ...creativeArtsAssets]
  },
  {
    category: 'spiritual',
    title: 'Spiritual Life',
    description: 'Religious and spiritual imagery and events',
    assets: spiritualAssets
  },
  {
    category: 'facilities',
    title: 'Campus & Facilities',
    description: 'Photos of school buildings and campus',
    assets: facilityAssets
  },
  {
    category: 'system',
    title: 'System Files',
    description: 'Website system files and icons',
    assets: systemAssets
  }
];

/**
 * Utility functions for asset management
 */
export const assetManager = {
  /**
   * Get all assets
   */
  getAllAssets: (): Asset[] => {
    return [
      ...logoAssets,
      ...staffAssets,
      ...gradeAssets,
      ...computerLabAssets,
      ...bookDayAssets,
      ...youthDayAssets,
      ...quizNightAssets,
      ...athleticsAssets,
      ...musicAssets,
      ...scienceExpoAssets,
      ...eventAssets,
      ...spiritualAssets,
      ...facilityAssets,
      ...systemAssets,
      ...creativeArtsAssets,
      ...facebookPostAssets
    ];
  },

  /**
   * Get assets suitable for the main gallery (excludes system files and staff photos)
   */
  getGalleryAssets: (): Asset[] => {
    return [
      ...gradeAssets,
      ...computerLabAssets,
      ...bookDayAssets,
      ...youthDayAssets,
      ...quizNightAssets,
      ...athleticsAssets,
      ...musicAssets,
      ...scienceExpoAssets,
      ...eventAssets,
      ...spiritualAssets,
      ...facilityAssets,
      ...creativeArtsAssets
      // Temporarily removed Facebook posts: ...facebookPostAssets
    ];
  },

  /**
   * Get assets by category
   */
  getAssetsByCategory: (category: AssetCategory): Asset[] => {
    return assetCollections
      .find(collection => collection.category === category)
      ?.assets || [];
  },

  /**
   * Get asset by ID
   */
  getAssetById: (id: string): Asset | undefined => {
    return assetManager.getAllAssets().find(asset => asset.id === id);
  },

  /**
   * Get assets by filename
   */
  getAssetByFilename: (filename: string): Asset | undefined => {
    return assetManager.getAllAssets().find(asset => asset.filename === filename);
  },

  /**
   * Get collection by category
   */
  getCollectionByCategory: (category: AssetCategory): AssetCollection | undefined => {
    return assetCollections.find(collection => collection.category === category);
  },

  /**
   * Get all collections
   */
  getAllCollections: (): AssetCollection[] => {
    return assetCollections;
  },

  /**
   * Search assets by description or filename
   */
  searchAssets: (query: string): Asset[] => {
    const lowerQuery = query.toLowerCase();
    return assetManager.getAllAssets().filter(asset => 
      asset.description?.toLowerCase().includes(lowerQuery) ||
      asset.filename.toLowerCase().includes(lowerQuery) ||
      asset.alt.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get total asset count
   */
  getTotalAssetCount: (): number => {
    return assetManager.getAllAssets().length;
  },

  /**
   * Get total size of all assets
   */
  getTotalAssetSize: (): string => {
    const assets = assetManager.getAllAssets();
    const totalKB = assets.reduce((sum, asset) => {
      const size = asset.size?.replace('KB', '').replace('B', '');
      return sum + (parseFloat(size || '0') || 0);
    }, 0);
    return `${totalKB.toFixed(1)}KB`;
  }
};

export default assetManager; 