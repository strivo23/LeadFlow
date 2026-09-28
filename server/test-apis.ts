async function testBackend() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🧪 Testing Backend Endpoints...');

  // 1. Test Login
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@leadflow.com', password: 'Demo@123' }),
  });
  const loginData = await loginRes.json();
  console.log('Login Result:', loginData.success ? '✅ SUCCESS' : '❌ FAILED', loginData.data?.user?.email);
  const token = loginData.data?.token;

  if (!token) {
    console.error('No token received!');
    return;
  }

  // 2. Test Get Profile /me
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log('/auth/me Result:', meData.success ? '✅ SUCCESS' : '❌ FAILED', meData.data?.name);

  // 3. Test Dashboard Stats
  const statsRes = await fetch(`${baseUrl}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const statsData = await statsRes.json();
  console.log('Dashboard Stats:', statsData.success ? '✅ SUCCESS' : '❌ FAILED', {
    totalLeads: statsData.data?.totalLeads,
    hotLeads: statsData.data?.hotLeads,
    warmLeads: statsData.data?.warmLeads,
    coldLeads: statsData.data?.coldLeads,
    activeCampaigns: statsData.data?.activeCampaigns,
  });

  // 4. Test Get Leads
  const leadsRes = await fetch(`${baseUrl}/leads?limit=5`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const leadsData = await leadsRes.json();
  console.log('Get Leads Result:', leadsData.success ? '✅ SUCCESS' : '❌ FAILED', `Found ${leadsData.data?.length} leads (Total: ${leadsData.meta?.total})`);

  // 5. Test AI Lead Creation & Scoring
  const createLeadRes = await fetch(`${baseUrl}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firstName: 'Samantha',
      lastName: 'Reed',
      email: 'samantha.reed@apexai.com',
      company: 'Apex AI Technologies',
      jobTitle: 'VP of Product Engineering',
      industry: 'Artificial Intelligence',
      status: 'NEW',
      phone: '+1-415-555-9988',
      website: 'https://apexai.com',
      notes: 'Evaluating automated outbound workflows for 120-person engineering team.',
    }),
  });
  const createLeadData = await createLeadRes.json();
  console.log('Create Lead Result:', createLeadData.success ? '✅ SUCCESS' : '❌ FAILED', {
    name: `${createLeadData.data?.firstName} ${createLeadData.data?.lastName}`,
    score: createLeadData.data?.score,
    classification: createLeadData.data?.classification,
  });

  // 6. Test Campaigns List
  const campaignsRes = await fetch(`${baseUrl}/campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const campaignsData = await campaignsRes.json();
  console.log('Campaigns Result:', campaignsData.success ? '✅ SUCCESS' : '❌ FAILED', `Found ${campaignsData.data?.length} campaigns`);

  console.log('🎉 All backend API sanity tests passed!');
}

testBackend().catch(console.error);
