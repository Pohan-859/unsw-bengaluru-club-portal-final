import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const clubs = [
  {
    name: "Finance & Investment Society",
    slug: "finance-investment-society",
    category: "Business & Finance",
    tagline: "Markets, models, and the odd stock pitch.",
    description:
      "Weekly market briefings, a stock-pitch competition each term, and direct lines to alumni working across banking and consulting.",
    execName: "Ananya Rao",
    execEmail: "president@fis.unswbengaluru.edu",
    execPhone: "+91 90000 00001",
    meetingInfo: "Thursdays, 6:00 PM — Block C, Room 204",
  },
  {
    name: "Founders' Collective",
    slug: "founders-collective",
    category: "Entrepreneurship",
    tagline: "For students building something on the side.",
    description:
      "A working group for student founders: pitch nights, a peer feedback rotation, and workshops with operators from Bengaluru's startup scene.",
    execName: "Kabir Shah",
    execEmail: "hello@founderscollective.unswbengaluru.edu",
    execPhone: "+91 90000 00002",
    meetingInfo: "Alternate Fridays, 5:30 PM — Innovation Hub",
  },
  {
    name: "Cultural Exchange Club",
    slug: "cultural-exchange-club",
    category: "Culture & Community",
    tagline: "Campus-wide potlucks and festival celebrations.",
    description:
      "Runs the campus's biggest cultural events across the year, from Diwali to international food nights, and pairs incoming students with a peer buddy.",
    execName: "Meera Nair",
    execEmail: "cec@unswbengaluru.edu",
    execPhone: "+91 90000 00003",
    meetingInfo: "Mondays, 4:30 PM — Student Commons",
  },
  {
    name: "Debate & Public Speaking Society",
    slug: "debate-society",
    category: "Academic",
    tagline: "British Parliamentary debate, every week.",
    description:
      "Competitive BP debate training for all experience levels, plus travel funding for members attending inter-university tournaments.",
    execName: "Arjun Mehta",
    execEmail: "debate@unswbengaluru.edu",
    execPhone: "+91 90000 00004",
    meetingInfo: "Wednesdays, 6:30 PM — Block A, Debate Room",
  },
  {
    name: "Sports & Fitness Committee",
    slug: "sports-fitness-committee",
    category: "Sports & Wellbeing",
    tagline: "Intramurals, gym crews, and the annual sports day.",
    description:
      "Organises intramural leagues in cricket, football and badminton, plus subsidised gym sessions and campus sports day.",
    execName: "Priya Iyer",
    execEmail: "sports@unswbengaluru.edu",
    execPhone: "+91 90000 00005",
    meetingInfo: "Tuesdays, 5:00 PM — Sports Complex",
  },
  {
    name: "Tech & Product Society",
    slug: "tech-product-society",
    category: "Technology",
    tagline: "Build nights, hackathons, and PM case studies.",
    description:
      "Fortnightly build nights, an internal hackathon each semester, and case-study sessions on product management drawn from real Bengaluru tech companies.",
    execName: "Rohan Bahadur",
    execEmail: "tech@unswbengaluru.edu",
    execPhone: "+91 90000 00006",
    meetingInfo: "Thursdays, 7:00 PM — Innovation Hub",
  },
];

async function main() {
  console.log("Seeding clubs…");
  for (const club of clubs) {
    await prisma.club.upsert({
      where: { slug: club.slug },
      update: {},
      create: club,
    });
  }
  console.log(`Seeded ${clubs.length} clubs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
