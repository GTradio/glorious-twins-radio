const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to get random date in the past year
const getRandomDate = (daysBack = 365) => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  return new Date(now.getTime() - (randomDays * 24 * 60 * 60 * 1000));
};

// Image URLs to alternate between
const imageUrls = [
  'https://images.unsplash.com/photo-1755541516453-201559bec161?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1755380749653-4e815e2f57bc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1757684945606-7644757a3eb9?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

// Audio URLs to alternate between
const audioUrls = [
  'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
  'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race2.ogg',
  'http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg'
];

// Helper function to get alternating image URL
const getImageUrl = (index) => imageUrls[index % imageUrls.length];

// Helper function to get alternating audio URL
const getAudioUrl = (index) => audioUrls[index % audioUrls.length];

// Sample data arrays
const nigerianNames = {
  first: ['Adebayo', 'Folake', 'Chukwudi', 'Ngozi', 'Ibrahim', 'Fatima', 'Olumide', 'Kemi', 'Emeka', 'Blessing', 'Yakubu', 'Zainab', 'Tunde', 'Funmi', 'Chioma', 'Damilola', 'Sade', 'Biodun', 'Chiamaka', 'Uche'],
  last: ['Adebayo', 'Okafor', 'Williams', 'Johnson', 'Bello', 'Abubakar', 'Ojo', 'Adeleke', 'Okonkwo', 'Yusuf', 'Ogbonna', 'Aliyu', 'Fashola', 'Okoro', 'Mohammed', 'Babatunde', 'Chukwu', 'Eze', 'Sanni', 'Akintola']
};

const newsCategories = ['Politics', 'Sports', 'Entertainment', 'Business', 'Technology', 'Health', 'Education', 'Culture'];

const newsTitles = [
  'New Infrastructure Project Launched in Lagos',
  'Nigeria Wins African Cup Championship',
  'Technology Hub Opens in Abuja',
  'Educational Reform Initiative Announced',
  'Healthcare System Receives Major Upgrade',
  'Cultural Festival Draws International Attention',
  'Economic Growth Shows Positive Trends',
  'Youth Empowerment Program Launched',
  'Renewable Energy Project Begins',
  'Agricultural Innovation Center Opens'
];

const podcastTitles = [
  'Voices of Nigeria',
  'Tech Talk Africa',
  'Cultural Conversations',
  'Business Insights',
  'Youth Perspectives',
  'Health Matters',
  'Education Focus',
  'Sports Commentary',
  'Political Analysis',
  'Innovation Stories'
];

const programNames = [
  'Morning Glory',
  'Afternoon Delight',
  'Evening News',
  'Night Talk',
  'Weekend Special',
  'Youth Hour',
  'Cultural Heritage',
  'Business Today',
  'Sports Central',
  'Health Focus'
];

const hosts = [
  'Adunni Olorunnisola',
  'Emeka Okafor',
  'Fatima Aliyu',
  'Biodun Williams',
  'Chika Eze',
  'Musa Ibrahim',
  'Kemi Adeleke',
  'Tunde Johnson',
  'Ngozi Okoro',
  'Yakubu Mohammed'
];

const teamRoles = [
  { en: 'Station Manager', yo: 'Alakoso Ibomirin' },
  { en: 'Program Director', yo: 'Oludari Eto' },
  { en: 'News Editor', yo: 'Olotu Iroyin' },
  { en: 'Radio Presenter', yo: 'Agbewadi' },
  { en: 'Technical Producer', yo: 'Olutunto' },
  { en: 'Marketing Manager', yo: 'Alakoso Titaja' },
  { en: 'Social Media Manager', yo: 'Alakoso Awujo' },
  { en: 'Sound Engineer', yo: 'Onimo Ohun' }
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.contactMessage.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.podcast.deleteMany({});
  await prisma.news.deleteMany({});
  await prisma.team.deleteMany({});

  // Create Team members
  console.log('👥 Creating team members...');
  const teamMembers = [];

  for (let i = 0; i < 8; i++) {
    const role = getRandomItem(teamRoles);
    const firstName = getRandomItem(nigerianNames.first);
    const lastName = getRandomItem(nigerianNames.last);
    const name = `${firstName} ${lastName}`;

    teamMembers.push(
      prisma.team.create({
        data: {
          name,
          role: role.en,
          roleYoruba: role.yo,
          imageUrl: getImageUrl(i),
          description: `${name} is a dedicated professional with years of experience in ${role.en.toLowerCase()}. Known for excellence and commitment to quality broadcasting.`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@radiostation.com`,
          phone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          bio: `With over ${Math.floor(Math.random() * 10) + 5} years of experience in broadcasting, ${name} brings passion and expertise to our team. Specializing in ${role.en.toLowerCase()}, they have contributed significantly to our station's success.`,
          socialLinks: {
            twitter: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
            linkedin: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
            instagram: `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`
          },
          featured: i < 3, // Make first 3 featured
          active: true,
          displayOrder: i
        }
      })
    );
  }

  const createdTeamMembers = await Promise.all(teamMembers);
  console.log(`✅ Created ${createdTeamMembers.length} team members`);

  // Create Programs
  console.log('📻 Creating radio programs...');
  const programs = [];

  for (let i = 0; i < 10; i++) {
    const startHour = Math.floor(Math.random() * 22) + 1; // 1-22
    const endHour = startHour + Math.floor(Math.random() * 3) + 1; // 1-3 hours later

    programs.push(
      prisma.program.create({
        data: {
          name: getRandomItem(programNames),
          host: getRandomItem(hosts),
          day: getRandomItem(days),
          startTime: `${startHour.toString().padStart(2, '0')}:00`,
          endTime: `${endHour.toString().padStart(2, '0')}:00`,
          description: `Join us for an exciting ${Math.floor(Math.random() * 3) + 1}-hour program featuring the best in music, news, and entertainment.`,
          imageUrl: getImageUrl(i),
          featured: i < 3, // Make first 3 featured
          active: Math.random() > 0.1 // 90% active
        }
      })
    );
  }

  const createdPrograms = await Promise.all(programs);
  console.log(`✅ Created ${createdPrograms.length} programs`);

  // Create News articles
  console.log('📰 Creating news articles...');
  const newsArticles = [];

  for (let i = 0; i < 20; i++) {
    const title = getRandomItem(newsTitles);
    const category = getRandomItem(newsCategories);
    const author = `${getRandomItem(nigerianNames.first)} ${getRandomItem(nigerianNames.last)}`;

    newsArticles.push(
      prisma.news.create({
        data: {
          title,
          description: `Breaking news about ${title.toLowerCase()}. This important development affects our community and deserves your attention.`,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
          imageUrl: getImageUrl(i),
          category,
          author,
          featured: i < 5, // Make first 5 featured
          published: Math.random() > 0.1, // 90% published
          publishDate: getRandomDate(30),
          views: Math.floor(Math.random() * 1000)
        }
      })
    );
  }

  const createdNews = await Promise.all(newsArticles);
  console.log(`✅ Created ${createdNews.length} news articles`);

  // Create Podcasts
  console.log('🎧 Creating podcasts...');
  const podcasts = [];

  for (let i = 0; i < 15; i++) {
    const title = `${getRandomItem(podcastTitles)} - Episode ${i + 1}`;
    const duration = `${Math.floor(Math.random() * 60) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;

    podcasts.push(
      prisma.podcast.create({
        data: {
          title,
          description: `Join us for another exciting episode of our popular podcast series. This episode covers important topics and features interesting discussions.`,
          content: `In this episode, we dive deep into current affairs and cultural topics that matter to our community. Our expert guests share insights and perspectives that will inform and inspire you.

We explore various themes including community development, youth empowerment, and cultural preservation. Don't miss the engaging conversations and thought-provoking discussions.

This episode is part of our ongoing series dedicated to bringing you quality content that educates, entertains, and empowers our listeners.`,
          imageUrl: getImageUrl(i),
          audioUrl: getAudioUrl(i),
          duration,
          episodeNumber: i + 1,
          season: Math.floor(i / 10) + 1,
          featured: i < 4, // Make first 4 featured
          published: Math.random() > 0.05, // 95% published
          publishDate: getRandomDate(60)
        }
      })
    );
  }

  const createdPodcasts = await Promise.all(podcasts);
  console.log(`✅ Created ${createdPodcasts.length} podcasts`);


  // Create Contact Messages
  console.log('📧 Creating contact messages...');
  const contactMessages = [];
  const subjects = [
    'Program Inquiry',
    'Advertising Opportunity',
    'Technical Support',
    'General Feedback',
    'Partnership Proposal',
    'Event Coverage Request',
    'Interview Request',
    'Complaint'
  ];

  const messageTemplates = [
    'I would like to inquire about your services and how I can get involved with your programs.',
    'Hello, I am interested in advertising opportunities with your radio station.',
    'I am experiencing technical difficulties with your online streaming service.',
    'I wanted to share some feedback about your recent programming.',
    'I represent a company that would like to explore partnership opportunities.',
    'We have an upcoming event and would like to request coverage.',
    'I would like to schedule an interview to discuss important community topics.',
    'I have a concern about recent programming that I would like to address.'
  ];

  for (let i = 0; i < 25; i++) {
    const firstName = getRandomItem(nigerianNames.first);
    const lastName = getRandomItem(nigerianNames.last);
    const subject = getRandomItem(subjects);
    const message = getRandomItem(messageTemplates);

    contactMessages.push(
      prisma.contactMessage.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          phone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          subject,
          message: `${message} I look forward to hearing from you soon. Thank you for your time and consideration.`,
          status: Math.random() > 0.3 ? 'unread' : Math.random() > 0.5 ? 'read' : 'responded',
          metadata: {
            source: Math.random() > 0.6 ? 'website_form' : 'direct_email',
            priority: Math.random() > 0.8 ? 'high' : 'normal'
          },
          createdAt: getRandomDate(45)
        }
      })
    );
  }

  const createdContactMessages = await Promise.all(contactMessages);
  console.log(`✅ Created ${createdContactMessages.length} contact messages`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Team Members: ${createdTeamMembers.length}`);
  console.log(`- Programs: ${createdPrograms.length}`);
  console.log(`- News Articles: ${createdNews.length}`);
  console.log(`- Podcasts: ${createdPodcasts.length}`);
  console.log(`- Contact Messages: ${createdContactMessages.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });