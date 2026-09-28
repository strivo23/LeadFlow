import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { LeadScoringService } from '../src/services/leadScoringService';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LeadFlow database seed...');

  // 1. Create or update Demo User
  const demoEmail = 'demo@leadflow.com';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Demo@123', salt);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      password: hashedPassword,
      name: 'Alex Vance (Demo)',
    },
    create: {
      email: demoEmail,
      name: 'Alex Vance (Demo)',
      password: hashedPassword,
    },
  });

  console.log(`👤 Demo user created/verified: ${demoUser.email} (ID: ${demoUser.id})`);

  // Clear existing demo leads & campaigns to ensure clean idempotency
  await prisma.campaignLead.deleteMany({});
  await prisma.campaign.deleteMany({ where: { createdById: demoUser.id } });
  await prisma.lead.deleteMany({ where: { createdById: demoUser.id } });

  // 2. Realistic B2B Leads
  const rawLeads = [
    {
      firstName: 'John',
      lastName: 'Carter',
      email: 'john.carter@techflow.io',
      company: 'TechFlow Solutions',
      jobTitle: 'Chief Technology Officer',
      industry: 'SaaS',
      status: 'QUALIFIED',
      phone: '+1-415-555-0101',
      website: 'https://techflow.io',
      source: 'LinkedIn Outbound',
      notes: 'Evaluating automated lead routing and CRM integration. Team of 65 engineers.',
    },
    {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 's.wilson@growthlabs.tech',
      company: 'GrowthLabs Inc',
      jobTitle: 'VP of Marketing',
      industry: 'Technology',
      status: 'CONTACTED',
      phone: '+1-212-555-0142',
      website: 'https://growthlabs.tech',
      source: 'Webinar Attendee',
      notes: 'Interested in boosting outbound campaign open rates across EMEA.',
    },
    {
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena@cloudscale.ai',
      company: 'CloudScale AI',
      jobTitle: 'CEO & Co-Founder',
      industry: 'Artificial Intelligence',
      status: 'CONVERTED',
      phone: '+1-650-555-0188',
      website: 'https://cloudscale.ai',
      source: 'Referral',
      notes: 'Closed annual enterprise contract for 25 seats. High priority customer.',
    },
    {
      firstName: 'Marcus',
      lastName: 'Sterling',
      email: 'marcus@finpeak.com',
      company: 'FinPeak Capital',
      jobTitle: 'Managing Director',
      industry: 'Finance',
      status: 'QUALIFIED',
      phone: '+1-312-555-0176',
      website: 'https://finpeak.com',
      source: 'Cold Outreach',
      notes: 'Looking for SOC2 compliant outreach tooling for wealth management advisors.',
    },
    {
      firstName: 'Priya',
      lastName: 'Nair',
      email: 'priya.nair@cybershield.net',
      company: 'CyberShield Systems',
      jobTitle: 'Head of Sales Operations',
      industry: 'Cybersecurity',
      status: 'NEW',
      phone: '+1-512-555-0199',
      website: 'https://cybershield.net',
      source: 'Demo Request',
      notes: 'Requested product walkthrough for SDR team onboarding next month.',
    },
    {
      firstName: 'David',
      lastName: 'Kim',
      email: 'david.kim@datasync.org',
      company: 'DataSync Global',
      jobTitle: 'Lead Software Architect',
      industry: 'Software',
      status: 'NEW',
      phone: '+1-206-555-0133',
      website: 'https://datasync.org',
      source: 'Inbound Organic',
      notes: 'Interested in REST API webhooks and developer documentation.',
    },
    {
      firstName: 'Amara',
      lastName: 'Okafor',
      email: 'amara.okafor@pulsehealth.co',
      company: 'PulseHealth Tech',
      jobTitle: 'Chief Revenue Officer',
      industry: 'Healthcare Tech',
      status: 'CONTACTED',
      phone: '+1-617-555-0125',
      website: 'https://pulsehealth.co',
      source: 'Conference',
      notes: 'Spoke at HealthTech Expo. Wants to streamline regional hospital outreach.',
    },
    {
      firstName: 'Tyler',
      lastName: 'Brooks',
      email: 'tyler.brooks@nexacorp.com',
      company: 'NexaCorp',
      jobTitle: 'Director of Business Development',
      industry: 'SaaS',
      status: 'QUALIFIED',
      phone: '+1-404-555-0164',
      website: 'https://nexacorp.com',
      source: 'LinkedIn Outbound',
      notes: 'Demo scheduled for Thursday 2pm. Focus on lead scoring transparency.',
    },
    {
      firstName: 'Chloe',
      lastName: 'Dupont',
      email: 'cdupont@vertexai.cloud',
      company: 'Vertex Systems',
      jobTitle: 'Product Manager',
      industry: 'Cloud',
      status: 'LOST',
      phone: '+1-720-555-0158',
      website: 'https://vertexai.cloud',
      source: 'Website',
      notes: 'Chose incumbent vendor due to existing multi-year vendor bundle.',
    },
    {
      firstName: 'Liam',
      lastName: 'O\'Connor',
      email: 'liam@blueshift.io',
      company: 'BlueShift Media',
      jobTitle: 'Content Strategist',
      industry: 'Media & Marketing',
      status: 'NEW',
      phone: '+1-305-555-0112',
      website: 'https://blueshift.io',
      source: 'Newsletter Signup',
      notes: 'Individual practitioner evaluating free trial tier.',
    },
    {
      firstName: 'Rachel',
      lastName: 'Greenberg',
      email: 'rchel@apexlogistics.io',
      company: 'Apex Logistics',
      jobTitle: 'VP Supply Chain Strategy',
      industry: 'Logistics Tech',
      status: 'CONTACTED',
      phone: '+1-847-555-0149',
      website: 'https://apexlogistics.io',
      source: 'Referral',
      notes: 'Follow-up email dispatched regarding automated pipeline alerts.',
    },
    {
      firstName: 'Robert',
      lastName: 'Chen',
      email: 'robert.chen@gmail.com',
      company: 'Chen Consulting',
      jobTitle: 'Freelance Consultant',
      industry: 'Consulting',
      status: 'NEW',
      phone: null,
      website: null,
      source: 'Website Form',
      notes: 'Inquired about pricing plans for solo consultants.',
    },
  ];

  const createdLeads = [];
  for (const rawLead of rawLeads) {
    const scoreResult = LeadScoringService.calculate(rawLead);
    const lead = await prisma.lead.create({
      data: {
        ...rawLead,
        score: scoreResult.score,
        createdById: demoUser.id,
      },
    });
    createdLeads.push(lead);
  }

  console.log(`✅ Seeded ${createdLeads.length} realistic B2B leads`);

  // 3. Create 3 Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Q4 Enterprise SaaS Outbound',
      description: 'Targeting VP of Engineering and CTOs at Series A-C SaaS scaleups across North America.',
      status: 'ACTIVE',
      createdById: demoUser.id,
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Series B FinTech Decision Makers',
      description: 'Reaching out to Managing Directors and Heads of Risk in NYC and Chicago regarding compliance pipeline tooling.',
      status: 'ACTIVE',
      createdById: demoUser.id,
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      name: 'AI Infrastructure Outreach 2026',
      description: 'Nurturing founders and AI lab directors with our transparent scoring & enrichment engine whitepaper.',
      status: 'DRAFT',
      createdById: demoUser.id,
    },
  });

  console.log('✅ Created 3 outreach campaigns');

  // 4. Associate Leads with Campaigns
  // Campaign 1: SaaS Leads (John Carter, Sarah Wilson, Tyler Brooks, David Kim)
  const c1LeadIds = [createdLeads[0].id, createdLeads[1].id, createdLeads[5].id, createdLeads[7].id];
  for (const leadId of c1LeadIds) {
    await prisma.campaignLead.create({
      data: { campaignId: campaign1.id, leadId },
    });
  }

  // Campaign 2: FinTech & Cyber (Marcus Sterling, Priya Nair, Amara Okafor)
  const c2LeadIds = [createdLeads[3].id, createdLeads[4].id, createdLeads[6].id];
  for (const leadId of c2LeadIds) {
    await prisma.campaignLead.create({
      data: { campaignId: campaign2.id, leadId },
    });
  }

  // Campaign 3: AI & Cloud (Elena Rostova, Chloe Dupont)
  const c3LeadIds = [createdLeads[2].id, createdLeads[8].id];
  for (const leadId of c3LeadIds) {
    await prisma.campaignLead.create({
      data: { campaignId: campaign3.id, leadId },
    });
  }

  console.log('✅ Linked leads with campaigns');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
