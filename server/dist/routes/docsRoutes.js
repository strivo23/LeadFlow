"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LeadFlow API Documentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #3b82f6;
      --accent: #6366f1;
      --green: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
      --purple: #8b5cf6;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 40px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      margin-bottom: 12px;
    }
    h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
    p.lead { color: var(--text-muted); font-size: 16px; }
    .section-title {
      font-size: 22px;
      font-weight: 600;
      margin: 36px 0 16px;
      color: #e5e7eb;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .endpoint-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      transition: border-color 0.2s;
    }
    .endpoint-card:hover {
      border-color: #374151;
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .method {
      padding: 4px 8px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
    }
    .method.get { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .method.post { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .method.put { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .method.delete { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 500;
      color: #f9fafb;
    }
    .auth-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      background: #374151;
      color: #d1d5db;
      margin-left: auto;
    }
    .endpoint-desc {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 12px;
    }
    pre {
      background: #0d1117;
      padding: 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      overflow-x: auto;
      color: #e5e7eb;
      border: 1px solid #1f2937;
      margin-top: 8px;
    }
    code { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">LeadFlow REST API v1.0</span>
      <h1>API Reference Documentation</h1>
      <p class="lead">All endpoints accept and return JSON. Authenticated endpoints require an <code>Authorization: Bearer &lt;JWT&gt;</code> header.</p>
    </header>

    <h2 class="section-title">🔐 Authentication</h2>
    
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/auth/register</span>
      </div>
      <p class="endpoint-desc">Register a new user account.</p>
      <pre>Payload: { "name": "Jane Doe", "email": "jane@company.com", "password": "securePassword123" }
Response: { "success": true, "data": { "user": { ... }, "token": "jwt_token_string" } }</pre>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/auth/login</span>
      </div>
      <p class="endpoint-desc">Authenticate existing user and retrieve JWT token. Demo user available.</p>
      <pre>Payload: { "email": "demo@leadflow.com", "password": "Demo@123" }
Response: { "success": true, "data": { "user": { ... }, "token": "jwt_token_string" } }</pre>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/auth/me</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Get current authenticated user's profile and stats.</p>
    </div>

    <h2 class="section-title">📊 Dashboard</h2>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/dashboard/stats</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Calculates live database statistics: Total Leads, Hot/Warm/Cold counts, Active Campaigns, Status Distribution, Recent Leads, Top Scoring Leads.</p>
    </div>

    <h2 class="section-title">👥 Leads & AI Scoring</h2>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/leads</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Query leads with search (name, email, company), status filter, industry filter, sorting by score, and pagination.</p>
      <pre>Query params: ?search=john&status=QUALIFIED&industry=SaaS&sortBy=score&sortOrder=desc&page=1&limit=20</pre>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/leads</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Create a new B2B lead. Automatically executes the AI Lead Scoring Engine (0-100, Hot/Warm/Cold classification with factor breakdown).</p>
      <pre>Payload: {
  "firstName": "Alex",
  "lastName": "Rivera",
  "email": "alex@techcorp.io",
  "company": "TechCorp",
  "jobTitle": "Chief Technology Officer",
  "industry": "SaaS",
  "status": "NEW",
  "phone": "+1-555-0192",
  "website": "https://techcorp.io",
  "notes": "Met at Cloud Summit 2026"
}</pre>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/leads/:id</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Fetch lead profile, AI score breakdown factors, and associated outreach campaigns.</p>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method put">PUT</span>
        <span class="path">/api/leads/:id</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Update lead details. Automatically recalculates AI Lead Score.</p>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method delete">DELETE</span>
        <span class="path">/api/leads/:id</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Delete a lead record and remove all campaign associations.</p>
    </div>

    <h2 class="section-title">🚀 Outreach Campaigns</h2>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/campaigns</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Get all user outreach campaigns with attached lead counts.</p>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/campaigns</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Create a new outreach campaign with optional initial leads.</p>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/campaigns/:id/launch</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Launches the outreach campaign, transitioning status to ACTIVE.</p>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/campaigns/:id/leads</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Associate a lead with a campaign: <code>{ "leadId": "..." }</code></p>
    </div>

    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method delete">DELETE</span>
        <span class="path">/api/campaigns/:id</span>
        <span class="auth-badge">Bearer Token Required</span>
      </div>
      <p class="endpoint-desc">Delete campaign and its associations.</p>
    </div>
  </div>
</body>
</html>
`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});
exports.default = router;
