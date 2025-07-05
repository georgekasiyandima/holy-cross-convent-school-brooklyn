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
    filename: 'HCLOGO1.png',
    path: '/HCLOGO1.png',
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
  {
    id: 'react-logo-192',
    filename: 'logo192.png',
    path: '/logo192.png',
    alt: 'React Logo 192px',
    category: 'logo',
    description: 'React default logo 192px',
    size: '5.2KB',
    dimensions: '20px'
  },
  {
    id: 'react-logo-512',
    filename: 'logo512.png',
    path: '/logo512.png',
    alt: 'React Logo 512px',
    category: 'logo',
    description: 'React default logo 512px',
    size: '9.4KB',
    dimensions: '43px'
  }
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
    size: '200KB',
    dimensions: '803px'
  },
  {
    id: 'computer-lab-01',
    filename: 'COMPUTERLAB01.jpg',
    path: '/COMPUTERLAB01.jpg',
    alt: 'Computer Lab View 1',
    category: 'computer-lab',
    description: 'Computer lab view 1',
    size: '224KB',
    dimensions: '761px'
  },
  {
    id: 'computer-lab-02',
    filename: 'COMPUTERLAB02.jpg',
    path: '/COMPUTERLAB02.jpg',
    alt: 'Computer Lab View 2',
    category: 'computer-lab',
    description: 'Computer lab view 2',
    size: '211KB',
    dimensions: '774px'
  },
  {
    id: 'computer-lab-03',
    filename: 'COMPUTERLAB03.jpg',
    path: '/COMPUTERLAB03.jpg',
    alt: 'Computer Lab View 3',
    category: 'computer-lab',
    description: 'Computer lab view 3',
    size: '200KB',
    dimensions: '739px'
  },
  {
    id: 'computer-lab-04',
    filename: 'COMPUTERLAB04.jpg',
    path: '/COMPUTERLAB04.jpg',
    alt: 'Computer Lab View 4',
    category: 'computer-lab',
    description: 'Computer lab view 4',
    size: '203KB',
    dimensions: '753px'
  },
  {
    id: 'computer-lab-05',
    filename: 'COMPUTERLAB05.jpg',
    path: '/COMPUTERLAB05.jpg',
    alt: 'Computer Lab View 5',
    category: 'computer-lab',
    description: 'Computer lab view 5',
    size: '187KB',
    dimensions: '697px'
  },
  {
    id: 'computer-lab-06',
    filename: 'COMPUTERLAB06.jpg',
    path: '/COMPUTERLAB06.jpg',
    alt: 'Computer Lab View 6',
    category: 'computer-lab',
    description: 'Computer lab view 6',
    size: '185KB',
    dimensions: '724px'
  },
  {
    id: 'computer-lab-07',
    filename: 'COMPUTERLAB07.jpg',
    path: '/COMPUTERLAB07.jpg',
    alt: 'Computer Lab View 7',
    category: 'computer-lab',
    description: 'Computer lab view 7',
    size: '194KB',
    dimensions: '785px'
  },
  {
    id: 'computer-lab-08',
    filename: 'COMPUTERLAB08.jpg',
    path: '/COMPUTERLAB08.jpg',
    alt: 'Computer Lab View 8',
    category: 'computer-lab',
    description: 'Computer lab view 8',
    size: '219KB',
    dimensions: '797px'
  }
];

/**
 * Book Day event images
 */
export const bookDayAssets: Asset[] = [
  {
    id: 'book-day-main',
    filename: 'BOOKDAY.jpg',
    path: '/BOOKDAY.jpg',
    alt: 'Book Day Main Event',
    category: 'book-day',
    description: 'Main book day event photo',
    size: '794KB',
    dimensions: '3468px'
  },
  {
    id: 'book-day-01',
    filename: 'BOOKDAY01.jpg',
    path: '/BOOKDAY01.jpg',
    alt: 'Book Day Event 1',
    category: 'book-day',
    description: 'Book day event photo 1',
    size: '835KB',
    dimensions: '3709px'
  },
  {
    id: 'book-day-02',
    filename: 'BOOKDAY02.jpg',
    path: '/BOOKDAY02.jpg',
    alt: 'Book Day Event 2',
    category: 'book-day',
    description: 'Book day event photo 2',
    size: '626KB',
    dimensions: '2724px'
  },
  {
    id: 'book-day-03',
    filename: 'BOOKDAY03.jpg',
    path: '/BOOKDAY03.jpg',
    alt: 'Book Day Event 3',
    category: 'book-day',
    description: 'Book day event photo 3',
    size: '589KB',
    dimensions: '2695px'
  },
  {
    id: 'book-day-04',
    filename: 'BOOKDAY04.jpg',
    path: '/BOOKDAY04.jpg',
    alt: 'Book Day Event 4',
    category: 'book-day',
    description: 'Book day event photo 4',
    size: '563KB',
    dimensions: '2520px'
  },
  {
    id: 'book-day-05',
    filename: 'BOOKDAY05.jpg',
    path: '/BOOKDAY05.jpg',
    alt: 'Book Day Event 5',
    category: 'book-day',
    description: 'Book day event photo 5',
    size: '679KB',
    dimensions: '3101px'
  },
  {
    id: 'book-day-06',
    filename: 'BOOKDAY06.jpg',
    path: '/BOOKDAY06.jpg',
    alt: 'Book Day Event 6',
    category: 'book-day',
    description: 'Book day event photo 6',
    size: '555KB',
    dimensions: '2646px'
  },
  {
    id: 'book-day-07',
    filename: 'BOOKDAY07.jpg',
    path: '/BOOKDAY07.jpg',
    alt: 'Book Day Event 7',
    category: 'book-day',
    description: 'Book day event photo 7',
    size: '705KB',
    dimensions: '2847px'
  },
  {
    id: 'book-day-08',
    filename: 'BOOKDAY08.jpg',
    path: '/BOOKDAY08.jpg',
    alt: 'Book Day Event 8',
    category: 'book-day',
    description: 'Book day event photo 8',
    size: '902KB',
    dimensions: '3961px'
  },
  {
    id: 'book-day-09',
    filename: 'BOOKDAY09.jpg',
    path: '/BOOKDAY09.jpg',
    alt: 'Book Day Event 9',
    category: 'book-day',
    description: 'Book day event photo 9',
    size: '504KB',
    dimensions: '1966px'
  },
  {
    id: 'book-day-10',
    filename: 'BOOKDAY10.jpg',
    path: '/BOOKDAY10.jpg',
    alt: 'Book Day Event 10',
    category: 'book-day',
    description: 'Book day event photo 10',
    size: '508KB',
    dimensions: '2241px'
  }
];

/**
 * Youth Day event images
 */
export const youthDayAssets: Asset[] = [
  {
    id: 'youth-day-main',
    filename: 'YOUTHDAY25.jpg',
    path: '/YOUTHDAY25.jpg',
    alt: 'Youth Day 2025 Main Event',
    category: 'youth-day',
    description: 'Main youth day 2025 event photo',
    size: '668KB',
    dimensions: '3195px'
  },
  {
    id: 'youth-day-01',
    filename: 'YOUTHDAY25-01.jpg',
    path: '/YOUTHDAY25-01.jpg',
    alt: 'Youth Day 2025 Event 1',
    category: 'youth-day',
    description: 'Youth day 2025 event photo 1',
    size: '663KB',
    dimensions: '2986px'
  },
  {
    id: 'youth-day-02',
    filename: 'YOUTHDAY25-02.jpg',
    path: '/YOUTHDAY25-02.jpg',
    alt: 'Youth Day 2025 Event 2',
    category: 'youth-day',
    description: 'Youth day 2025 event photo 2',
    size: '120KB',
    dimensions: '512px'
  }
];

/**
 * Quiz Night event images
 */
export const quizNightAssets: Asset[] = [
  {
    id: 'quiz-night-25',
    filename: 'QUIZNIGHT25.jpg',
    path: '/QUIZNIGHT25.jpg',
    alt: 'Quiz Night 2025',
    category: 'quiz-night',
    description: 'Quiz night 2025 event photo',
    size: '189KB',
    dimensions: '819px'
  }
];

/**
 * Athletics Awards event images
 */
export const athleticsAssets: Asset[] = [
  {
    id: 'athletics-awards-main',
    filename: 'ATHLECTICS AWARDS25.jpg',
    path: '/ATHLECTICS AWARDS25.jpg',
    alt: 'Athletics Awards 2025 Main',
    category: 'athletics',
    description: 'Main athletics awards 2025 photo',
    size: '181KB',
    dimensions: '892px'
  },
  {
    id: 'athletics-awards-02',
    filename: 'ATHLETICSAWARDS25 02.jpg',
    path: '/ATHLETICSAWARDS25 02.jpg',
    alt: 'Athletics Awards 2025 Event 2',
    category: 'athletics',
    description: 'Athletics awards 2025 photo 2',
    size: '190KB',
    dimensions: '931px'
  },
  {
    id: 'athletics-awards-03',
    filename: 'ATHLETICSAWARDS25 03.jpg',
    path: '/ATHLETICSAWARDS25 03.jpg',
    alt: 'Athletics Awards 2025 Event 3',
    category: 'athletics',
    description: 'Athletics awards 2025 photo 3',
    size: '204KB',
    dimensions: '922px'
  },
  {
    id: 'athletics-awards-04',
    filename: 'ATHLETICSAWARDS25 04.jpg',
    path: '/ATHLETICSAWARDS25 04.jpg',
    alt: 'Athletics Awards 2025 Event 4',
    category: 'athletics',
    description: 'Athletics awards 2025 photo 4',
    size: '180KB',
    dimensions: '959px'
  },
  {
    id: 'athletics-awards-05',
    filename: 'ATHLECTICSAWARDS25 05.jpg',
    path: '/ATHLECTICSAWARDS25 05.jpg',
    alt: 'Athletics Awards 2025 Event 5',
    category: 'athletics',
    description: 'Athletics awards 2025 photo 5',
    size: '157KB',
    dimensions: '911px'
  }
];

/**
 * Music event images
 */
export const musicAssets: Asset[] = [
  {
    id: 'music-main',
    filename: 'MUSIC.jpg',
    path: '/MUSIC.jpg',
    alt: 'Music Event Main',
    category: 'music',
    description: 'Main music event photo',
    size: '337KB',
    dimensions: '1373px'
  },
  {
    id: 'music-03',
    filename: 'MUSIC03.jpg',
    path: '/MUSIC03.jpg',
    alt: 'Music Event 3',
    category: 'music',
    description: 'Music event photo 3',
    size: '359KB',
    dimensions: '1431px'
  }
];

/**
 * Science Expo event images
 */
export const scienceExpoAssets: Asset[] = [
  {
    id: 'science-expo-main',
    filename: 'SCIENCEEXPO24.jpg',
    path: '/SCIENCEEXPO24.jpg',
    alt: 'Science Expo 2024 Main',
    category: 'science-expo',
    description: 'Main science expo 2024 photo',
    size: '309KB',
    dimensions: '1168px'
  },
  {
    id: 'science-expo-01',
    filename: 'SCIENCEEXPO24 01.jpg',
    path: '/SCIENCEEXPO24 01.jpg',
    alt: 'Science Expo 2024 Event 1',
    category: 'science-expo',
    description: 'Science expo 2024 photo 1',
    size: '291KB',
    dimensions: '1110px'
  },
  {
    id: 'science-expo-02',
    filename: 'SCIENCEEXPO02.jpg',
    path: '/SCIENCEEXPO02.jpg',
    alt: 'Science Expo Event 2',
    category: 'science-expo',
    description: 'Science expo photo 2',
    size: '232KB',
    dimensions: '1068px'
  },
  {
    id: 'science-expo-03',
    filename: 'SCIENCEEXPO03.jpg',
    path: '/SCIENCEEXPO03.jpg',
    alt: 'Science Expo Event 3',
    category: 'science-expo',
    description: 'Science expo photo 3',
    size: '263KB',
    dimensions: '922px'
  },
  {
    id: 'science-expo-04',
    filename: 'SCIENCEEXPO04.jpg',
    path: '/SCIENCEEXPO04.jpg',
    alt: 'Science Expo Event 4',
    category: 'science-expo',
    description: 'Science expo photo 4',
    size: '149KB',
    dimensions: '538px'
  },
  {
    id: 'science-expo-05',
    filename: 'SCIENCEEXPO24 05.jpg',
    path: '/SCIENCEEXPO24 05.jpg',
    alt: 'Science Expo 2024 Event 5',
    category: 'science-expo',
    description: 'Science expo 2024 photo 5',
    size: '330KB',
    dimensions: '1375px'
  },
  {
    id: 'science-expo-06',
    filename: 'SCIENCEEXPO24 06.jpg',
    path: '/SCIENCEEXPO24 06.jpg',
    alt: 'Science Expo 2024 Event 6',
    category: 'science-expo',
    description: 'Science expo 2024 photo 6',
    size: '259KB',
    dimensions: '829px'
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
 * Spiritual and religious images (updated)
 */
export const spiritualAssets: Asset[] = [
  {
    id: 'jesus-child',
    filename: 'jesus_child.jpg',
    path: '/jesus_child.jpg',
    alt: 'Jesus and Child',
    category: 'spiritual',
    description: 'Religious image of Jesus with child',
    size: '33KB',
    dimensions: '132px'
  },
  {
    id: 'philomena',
    filename: 'Philomena.jpg',
    path: '/Philomena.jpg',
    alt: 'Saint Philomena',
    category: 'spiritual',
    description: 'Image of Saint Philomena',
    size: '30KB',
    dimensions: '147px'
  },
  {
    id: 'bernarda-bg',
    filename: 'Bernarda BG.jpg',
    path: '/Bernarda BG.jpg',
    alt: 'Bernarda Background',
    category: 'spiritual',
    description: 'Bernarda background image',
    size: '32KB',
    dimensions: '104px'
  },
  {
    id: 'spiritual-main',
    filename: 'SPRITUAL.jpg',
    path: '/SPRITUAL.jpg',
    alt: 'Spiritual Event Main',
    category: 'spiritual',
    description: 'Main spiritual event photo',
    size: '249KB',
    dimensions: '860px'
  },
  {
    id: 'spiritual-01',
    filename: 'SPRITUAL01.jpg',
    path: '/SPRITUAL01.jpg',
    alt: 'Spiritual Event 1',
    category: 'spiritual',
    description: 'Spiritual event photo 1',
    size: '377KB',
    dimensions: '1562px'
  }
];

/**
 * Facility and campus images
 */
export const facilityAssets: Asset[] = [
  {
    id: 'hcc-l4',
    filename: 'HCCL4.jpg',
    path: '/HCCL4.jpg',
    alt: 'Holy Cross Campus View 4',
    category: 'facilities',
    description: 'Campus facility view',
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
    filename: 'HCL2.jpg',
    path: '/HCL2.jpg',
    alt: 'Holy Cross Location 2',
    category: 'facilities',
    description: 'School location view',
    size: '314KB',
    dimensions: '1098px'
  },
  {
    id: 'hcp-1',
    filename: 'HCP1.jpg',
    path: '/HCP1.jpg',
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
    title: 'Athletics Awards',
    description: 'Photos from athletics awards ceremonies',
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
    assets: eventAssets
  },
  {
    category: 'spiritual',
    title: 'Spiritual Images',
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
      ...systemAssets
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