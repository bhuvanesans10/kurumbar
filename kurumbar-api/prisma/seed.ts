import { PrismaClient } from "../src/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import {
  Gender,
  MatrimonyStatus,
  ProductCategory,
  ProductStatus,
  JobType,
  JobStatus,
  NewsCategory,
} from "../src/prisma/generated/enums";

const primaryUrl = process.env.POSTGRES_PRIMARY_DB_URL;
if (!primaryUrl) {
  throw new Error("POSTGRES_PRIMARY_DB_URL is required for seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: primaryUrl }),
});

async function main() {
  console.log("🌱 Starting Kurumbar Community Platform database seeding...");

  // 1. Seed Matrimony Profiles
  console.log("💍 Seeding Matrimony Profiles...");
  const matrimonyProfiles = [
    {
      profileId: "KMP-M-101",
      nameTa: "சு. ஆனந்தகுமார்",
      nameEn: "S. Anandhakumar",
      gender: Gender.MALE,
      age: 28,
      dob: "1998-05-14",
      height: "5' 9\"",
      education: "B.Tech Information Technology",
      profession: "Senior Software Engineer (TCS, Chennai)",
      income: "₹14,00,000 / ஆண்டு",
      kulam: "செல்ல குலம் (Chella Kulam)",
      subKulam: "பெரியான குலம்",
      raasi: "ரிஷபம் (Taurus)",
      nakshatram: "ரோகிணி (Rohini)",
      district: "ஈரோடு (Erode)",
      city: "அந்தியூர்",
      fatherName: "கே. சுப்பிரமணியன் (விவசாயம்)",
      motherName: "சாந்தி (இல்லத்தரசி)",
      contactPhone: "9443212345",
      photoUrl: "/images/realistic/groom_karthikeyan.jpg",
      expectations: "குடும்ப பாங்கான, பட்டதாரி குறும்பர் சமுதாய மணமகள் தேவை.",
      status: MatrimonyStatus.APPROVED,
    },
    {
      profileId: "KMP-F-102",
      nameTa: "ஆர். பவித்ரா",
      nameEn: "R. Pavithra",
      gender: Gender.FEMALE,
      age: 25,
      dob: "2001-09-22",
      height: "5' 4\"",
      education: "M.Sc Mathematics, B.Ed",
      profession: "அரசு உதவிபெறும் பள்ளி ஆசிரியை",
      income: "₹4,80,000 / ஆண்டு",
      kulam: "அத்தி குலம் (Athi Kulam)",
      subKulam: "காடை குலம்",
      raasi: "துலாம் (Libra)",
      nakshatram: "சுவாதி (Swati)",
      district: "சேலம் (Salem)",
      city: "மேட்டூர்",
      fatherName: "எம். ராமசாமி (தொழிலதிபர்)",
      motherName: "கமலா",
      contactPhone: "9842154321",
      photoUrl: "/images/realistic/bride_priyadarshini.jpg",
      expectations: "நல்ல பழக்கவழக்கம் உள்ள குறும்பர் சமுதாய வரன் தேவை.",
      status: MatrimonyStatus.APPROVED,
    },
    {
      profileId: "KMP-M-103",
      nameTa: "கே. சக்திவேல்",
      nameEn: "K. Sakthivel",
      gender: Gender.MALE,
      age: 30,
      dob: "1996-02-18",
      height: "5' 11\"",
      education: "M.B.B.S, M.D (General Medicine)",
      profession: "மருத்துவர் (Govt Medical College Hospital)",
      income: "₹18,00,000 / ஆண்டு",
      kulam: "மன்னாடியார் குலம் (Mannadiyar)",
      subKulam: "கோனார் குலம்",
      raasi: "மகரம் (Capricorn)",
      nakshatram: "திருவோணம் (Shravana)",
      district: "கோயம்புத்தூர் (Coimbatore)",
      city: "பொள்ளாச்சி",
      fatherName: "எஸ். கிருஷ்ணன் (ஓய்வுபெற்ற ஆசிரியர்)",
      motherName: "சரஸ்வதி",
      contactPhone: "9789012345",
      photoUrl: "/images/realistic/groom_dinesh.jpg",
      expectations: "மருத்துவர் அல்லது உயர் கல்வி பயின்ற மணமகள்.",
      status: MatrimonyStatus.APPROVED,
    },
    {
      profileId: "KMP-F-104",
      nameTa: "எம். தீபிகா",
      nameEn: "M. Deepika",
      gender: Gender.FEMALE,
      age: 26,
      dob: "2000-11-05",
      height: "5' 5\"",
      education: "B.E Electronics & Communication",
      profession: "Hardware Design Engineer (Bosch, CBE)",
      income: "₹9,50,000 / ஆண்டு",
      kulam: "காடை குலம் (Kaadai Kulam)",
      subKulam: "மல்லி குலம்",
      raasi: "கன்னி (Virgo)",
      nakshatram: "ஹஸ்தம் (Hasta)",
      district: "திருப்பூர் (Tiruppur)",
      city: "உடுமலைப்பேட்டை",
      fatherName: "பி. முருகேசன் (ஜவுளி வியாபாரம்)",
      motherName: "லட்சுமி",
      contactPhone: "9442198765",
      photoUrl: "/images/realistic/bride_sowmiya.jpg",
      expectations: "பொறியாளர் அல்லது அரசுப் பணி மணமகன் தேவை.",
      status: MatrimonyStatus.APPROVED,
    },
  ];

  for (const p of matrimonyProfiles) {
    await prisma.matrimonyProfile.upsert({
      where: { profileId: p.profileId },
      update: p,
      create: p,
    });
  }

  // 2. Seed Marketplace Products
  console.log("🛍️ Seeding Marketplace Products...");
  const marketProducts = [
    {
      titleTa: "பாரம்பரிய குறும்பர் ஆட்டுக்கம்பளி (Pure Handwoven Kurumba Wool Rug)",
      titleEn: "Pure Handwoven Kurumba Sheep Wool Blanket / Rug",
      category: ProductCategory.WOOL_RUGS,
      price: 3200,
      unit: "ஒரு கம்பளி (Per Rug)",
      sellerName: "ஆர். சின்னசாமி",
      sellerPhone: "9842154321",
      sellerDistrict: "சேலம் (Salem)",
      location: "மேச்சேரி, சேலம்",
      descriptionTa:
        "100% தூய குறும்பை நாட்டு ஆட்டு உரோமத்தால் கைத்தறியில் பாரம்பரிய முறையில் நெய்யப்பட்ட தடிமனான கதகதப்பான கம்பளி. ஆயுள் 30 ஆண்டுகள்.",
      descriptionEn:
        "100% pure native Kurumba sheep wool handwoven thick blanket. Extreme winter thermal durability lasting over 30 years.",
      imageUrl: "/images/realistic/wool_kambli.jpg",
      isVerified: true,
      status: ProductStatus.ACTIVE,
    },
    {
      titleTa: "நாட்டு குறும்பை செம்மறியாடுகள் விற்பனைக்கு (Herd of Kurumbai Sheep)",
      titleEn: "Pure Breed Kurumbai Sheep Herd (Healthy Graziers)",
      category: ProductCategory.LIVESTOCK,
      price: 8500,
      unit: "ஒரு ஆடு (Per Sheep)",
      sellerName: "எஸ். மாரிமுத்து",
      sellerPhone: "9443212345",
      sellerDistrict: "ஈரோடு (Erode)",
      location: "அந்தியூர் காடுகள் பகுதி, ஈரோடு",
      descriptionTa:
        "மேய்ச்சல் முறையில் வளர்க்கப்பட்ட ஆரோக்கியமான 25 நாட்டு குறும்பை ஆடுகள் & கிடாய்கள் விற்பனைக்கு. நோய் எதிர்ப்பு சக்தி வாய்ந்தவை.",
      descriptionEn:
        "25 naturally grazed healthy indigenous Kurumbai sheep and rams available for breeding and farming.",
      imageUrl: "/images/realistic/sheep_kurumba.jpg",
      isVerified: true,
      status: ProductStatus.ACTIVE,
    },
    {
      titleTa: "மலைச்சாரல் தூய கொம்புத்தேன் (Natural Mountain Forest Honey)",
      titleEn: "Raw Wild Forest Honey Harvested by Kurumba Gatherers",
      category: ProductCategory.HONEY,
      price: 750,
      unit: "1 கிலோ (1 Kg Bottle)",
      sellerName: "கே. வேலுசாமி",
      sellerPhone: "9789012345",
      sellerDistrict: "தருமபுரி (Dharmapuri)",
      location: "ஒகேனக்கல் வனப்பகுதி, தருமபுரி",
      descriptionTa:
        "காடுகளிலிருந்து இயற்கையாக எடுக்கப்பட்ட 100% தூய இயற்கை மலைத்தேன். எந்த ரசாயன கலப்பும் இன்றி பாரம்பரியமாக வடிகட்டப்பட்டது.",
      descriptionEn:
        "100% raw, unpasteurized natural honey collected traditionally from dense mountain forests. Pure medicinal grade.",
      imageUrl: "/images/realistic/turmeric_spices.jpg",
      isVerified: true,
      status: ProductStatus.ACTIVE,
    },
    {
      titleTa:
        "பாரம்பரிய நாட்டு தினை & சாமை (Organic Native Millets - Thinai & Saamai)",
      titleEn: "Organic Native Millets Cultivated by Community Farmers",
      category: ProductCategory.MILLETS,
      price: 180,
      unit: "1 கிலோ (1 Kg Pack)",
      sellerName: "பி. காளியப்பன்",
      sellerPhone: "9894056789",
      sellerDistrict: "கிருஷ்ணகிரி (Krishnagiri)",
      location: "ஊத்தங்கரை, கிருஷ்ணகிரி",
      descriptionTa:
        "மானாவாரி விவசாய முறையில் இயற்கை உரங்களால் விளைவிக்கப்பட்ட ஊட்டச்சத்து மிகுந்த பாரம்பரிய சிறுதானியங்கள்.",
      descriptionEn:
        "Naturally grown, pesticide-free heritage millets rich in fiber and iron, direct from Kurumbar dryland farming families.",
      imageUrl: "/images/realistic/sesame_oil.jpg",
      isVerified: true,
      status: ProductStatus.ACTIVE,
    },
  ];

  for (const m of marketProducts) {
    const existing = await prisma.marketProduct.findFirst({
      where: { titleTa: m.titleTa },
    });
    if (!existing) {
      await prisma.marketProduct.create({ data: m });
    } else {
      await prisma.marketProduct.update({
        where: { id: existing.id },
        data: { imageUrl: m.imageUrl },
      });
    }
  }

  // 3. Seed Job Postings
  console.log("💼 Seeding Job Postings...");
  const jobPostings = [
    {
      titleTa: "சீனியர் ஃபுல் ஸ்டாக் டெவலப்பர் (Senior Full-Stack Developer)",
      titleEn: "Senior Full-Stack TypeScript Developer",
      company: "Apex Tech Innovations",
      location: "கோயம்புத்தூர் & ரிமோட் (Hybrid)",
      district: "கோயம்புத்தூர் (Coimbatore)",
      jobType: JobType.FULL_TIME,
      salaryRange: "₹8,00,000 - ₹14,00,000 / ஆண்டு",
      experience: "3+ ஆண்டுகள் அனுபவம்",
      education: "B.E / B.Tech / MCA",
      description:
        "React, Node.js, Fastify மற்றும் PostgreSQL தொழில்நுட்பங்களில் திறமை வாய்ந்த சமுதாய பட்டதாரிகளுக்கு முன்னுரிமை.",
      contactPhone: "9443212345",
      contactEmail: "careers@apextech.com",
      status: JobStatus.ACTIVE,
    },
    {
      titleTa: "ஜவுளி மற்றும் தறி ஆலை மேற்பார்வையாளர் (Textile Spinning Supervisor)",
      titleEn: "Textile Mill Operations & Spinning Supervisor",
      company: "கொங்குடெக்ஸ் டெக்ஸ்டைல்ஸ் மில்ஸ்",
      location: "பல்லடம், திருப்பூர்",
      district: "திருப்பூர் (Tiruppur)",
      jobType: JobType.FULL_TIME,
      salaryRange: "₹25,000 - ₹35,000 / மாதம்",
      experience: "2 ஆண்டுகள் அனுபவம்",
      education: "Diploma in Textile / Any Degree",
      description:
        "நூல் தறி உற்பத்தி மற்றும் தொழிலாளர் மேலாண்மை பணிகளுக்கான மேற்பார்வையாளர் வேலைவாய்ப்பு.",
      contactPhone: "9842154321",
      contactEmail: "jobs@kongutex.in",
      status: JobStatus.ACTIVE,
    },
    {
      titleTa: "பண்ணை மேலாளர் & கால்நடை பராமரிப்பு (Livestock Farm Manager)",
      titleEn: "Integrated Livestock & Organic Farm Manager",
      company: "கிரீன் பாஸ்டர்ஸ் அக்ரோ ஃபார்ம்ஸ்",
      location: "மேட்டூர், சேலம்",
      district: "சேலம் (Salem)",
      jobType: JobType.FULL_TIME,
      salaryRange: "₹20,000 - ₹30,000 / மாதம்",
      experience: "முன் அனுபவம் வரவேற்கப்படுகிறது",
      education: "Diploma in Agri/Livestock or Any Degree",
      description:
        "செம்மறி ஆடு வளர்ப்பு, மேய்ச்சல் பராமரிப்பு மற்றும் இயற்கை உழவு பணிகளை மேற்பார்வையிட சமுதாய இளைஞர்கள் தேவை.",
      contactPhone: "9789012345",
      contactEmail: "farms@greenpastures.in",
      status: JobStatus.ACTIVE,
    },
  ];

  for (const j of jobPostings) {
    const existing = await prisma.jobPosting.findFirst({
      where: { titleTa: j.titleTa },
    });
    if (!existing) {
      await prisma.jobPosting.create({ data: j });
    }
  }

  // 4. Seed News Articles
  console.log("📰 Seeding News Articles...");
  const newsArticles = [
    {
      titleTa:
        "ஸ்ரீ பீரேஸ்வர சுவாமி & மல்லிகார்ஜுன சுவாமி மகா கும்பாபிஷேக விழா அழைப்பிதழ்",
      titleEn:
        "Sri Beereswarar & Mallikarjuna Swamy Temple Maha Kumbabishekam Invitation",
      category: NewsCategory.FESTIVAL,
      summaryTa:
        "நமது குறும்பர் சமூக குலதெய்வ திருத்தலத்தில் நடைபெற உள்ள மகா கும்பாபிஷேக திருவிழா. அனைத்து மாவட்ட சமுதாய சொந்தங்களும் குடும்பத்துடன் பங்கேற்று நலம் பெற வேண்டுகிறோம்.",
      summaryEn:
        "Grand Maha Kumbabishekam temple festival of our sacred ancestral heritage deity. Cordial invitation to all community families.",
      content:
        "சேலம் மாவட்டம் மேச்சேரி அருகே அமைந்துள்ள அருள்மிகு ஸ்ரீ பீரேஸ்வர சுவாமி திருத்தலத்தில் வரும் மார்ச் 12, 2026 அன்று மகா கும்பாபிஷேகம் வெகுவிமரிசையாக நடைபெற உள்ளது.",
      imageUrl: "/images/realistic/temple_gopuram.jpg",
      eventDate: "12 மார்ச் 2026",
      eventLocation: "மேச்சேரி திருத்தலம், சேலம் மாவட்டம்",
      isPublished: true,
    },
    {
      titleTa:
        "2026-ஆம் கல்வி ஆண்டு: குறும்பர் சமூக மாணவர்களுக்கான கல்வி உதவித்தொகை விண்ணப்பம் துவக்கம்",
      titleEn:
        "Academic Year 2026: Educational Scholarships for Kurumbar Community Students",
      category: NewsCategory.SCHOLARSHIP,
      summaryTa:
        "10 மற்றும் 12-ஆம் வகுப்பு பொதுத்தேர்வில் 85% மேல் மதிப்பெண் பெற்ற மற்றும் மருத்துவம்/பொறியியல் பயிலும் சமூக ஏழை மாணவர்களுக்கு ₹25,000 வரை கல்வி உதவித்தொகை.",
      summaryEn:
        "Merit-cum-means scholarship grant of up to ₹25,000 for high-achieving community students enrolled in higher education.",
      content:
        "தமிழ்நாடு குறும்பர் சமுதாய நல அறக்கட்டளை மூலம் உயர்கல்வி பயிலும் மாணவ, மாணவியருக்கு கல்வி உதவித்தொகை வழங்க விண்ணப்பங்கள் வரவேற்கப்படுகின்றன.",
      imageUrl: "/images/realistic/student_education.jpg",
      eventDate: "28 பிப்ரவரி 2026",
      eventLocation: "மாநில தலைமை அலுவலகம், ஈரோடு",
      isPublished: true,
    },
    {
      titleTa:
        "தமிழ்நாடு மாநில அளவிலான குறும்பர் சமூக மாநாடு & மாபெரும் இலவச திருமண சுயவரம்",
      titleEn:
        "Tamil Nadu State Kurumbar Community Convention & Free Matrimony Swayamvaram",
      category: NewsCategory.MEETING,
      summaryTa:
        "கோயம்புத்தூரில் 38 மாவட்ட பிரதிநிதிகள் மற்றும் இளைஞரணி பங்கேற்கும் மாநில மாநாடு. அன்றைய தினம் 500+ வரன்களுக்கான இலவச சுயவர மேடை அமைக்கப்படுகிறது.",
      summaryEn:
        "Statewide community convention in Coimbatore uniting 38 district delegates along with a massive free matrimony matching event.",
      content:
        "சமுதாய ஒற்றுமை, இளைஞர் தொழில்முனைவு மற்றும் கலாச்சார விழிப்புணர்வை முன்னிறுத்தி கோயம்புத்தூரில் மாபெரும் மாநாடு நடைபெற உள்ளது.",
      imageUrl: "/images/realistic/community_meeting.jpg",
      eventDate: "15 ஏப்ரல் 2026",
      eventLocation: "கொடிசியா வளாகம், கோயம்புத்தூர்",
      isPublished: true,
    },
  ];

  for (const n of newsArticles) {
    const existing = await prisma.newsArticle.findFirst({
      where: { titleTa: n.titleTa },
    });
    if (!existing) {
      await prisma.newsArticle.create({ data: n });
    } else {
      await prisma.newsArticle.update({
        where: { id: existing.id },
        data: { imageUrl: n.imageUrl },
      });
    }
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
