import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { FileCode2, ExternalLink, Shield, Key } from 'lucide-react';

export const ApiDocs: React.FC = () => {
  const endpoints = [
    {
      group: 'Authentication',
      items: [
        {
          method: 'POST',
          path: '/api/auth/register',
          auth: false,
          desc: 'Register a new user account with hashed password.',
          sampleReq: `{ "name": "Jane Doe", "email": "jane@company.com", "password": "securePassword123" }`,
          sampleRes: `{ "success": true, "data": { "user": { ... }, "token": "jwt_token" } }`,
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          auth: false,
          desc: 'Authenticate existing user and receive JWT bearer token.',
          sampleReq: `{ "email": "demo@leadflow.com", "password": "Demo@123" }`,
          sampleRes: `{ "success": true, "data": { "user": { ... }, "token": "jwt_token" } }`,
        },
        {
          method: 'GET',
          path: '/api/auth/me',
          auth: true,
          desc: 'Retrieve current authenticated user session and account statistics.',
          sampleReq: `Headers: { Authorization: "Bearer <token>" }`,
          sampleRes: `{ "success": true, "data": { "id": "...", "name": "...", "email": "..." } }`,
        },
      ],
    },
    {
      group: 'Dashboard Analytics',
      items: [
        {
          method: 'GET',
          path: '/api/dashboard/stats',
          auth: true,
          desc: 'Retrieve real-time database KPIs: totalLeads, hotLeads, warmLeads, coldLeads, convertedLeads, activeCampaigns, status distribution, recent leads, and top scoring leads.',
          sampleReq: `Headers: { Authorization: "Bearer <token>" }`,
          sampleRes: `{ "success": true, "data": { "totalLeads": 12, "hotLeads": 10, "warmLeads": 1, "coldLeads": 1, ... } }`,
        },
      ],
    },
    {
      group: 'Leads & AI Scoring',
      items: [
        {
          method: 'GET',
          path: '/api/leads',
          auth: true,
          desc: 'Query leads with filters (status, industry), keyword search (name, email, company), sorting by AI score, and pagination.',
          sampleReq: `GET /api/leads?search=john&status=QUALIFIED&sortBy=score&sortOrder=desc&page=1&limit=20`,
          sampleRes: `{ "success": true, "data": [ { ... } ], "meta": { "total": 12, "page": 1, "totalPages": 1 } }`,
        },
        {
          method: 'POST',
          path: '/api/leads',
          auth: true,
          desc: 'Create a new lead. Automatically invokes the AI Lead Scoring Engine (0-100, Hot/Warm/Cold, factor breakdown).',
          sampleReq: `{ "firstName": "John", "lastName": "Carter", "email": "john@techflow.io", "company": "TechFlow", "jobTitle": "CTO", "industry": "SaaS" }`,
          sampleRes: `{ "success": true, "data": { "id": "...", "score": 95, "classification": "Hot", "scoreBreakdown": [ ... ] } }`,
        },
        {
          method: 'GET',
          path: '/api/leads/:id',
          auth: true,
          desc: 'Fetch full lead profile, factor-by-factor AI score breakdown, and campaign enrollments.',
          sampleReq: `GET /api/leads/c59fa...`,
          sampleRes: `{ "success": true, "data": { "id": "...", "scoreBreakdown": [ ... ], "campaigns": [ ... ] } }`,
        },
        {
          method: 'PUT',
          path: '/api/leads/:id',
          auth: true,
          desc: 'Update lead details. Automatically recalculates AI score based on modified parameters.',
          sampleReq: `{ "status": "QUALIFIED", "jobTitle": "Chief Technology Officer" }`,
          sampleRes: `{ "success": true, "data": { "id": "...", "score": 95 } }`,
        },
        {
          method: 'DELETE',
          path: '/api/leads/:id',
          auth: true,
          desc: 'Delete lead and remove all associated campaign enrollments.',
          sampleReq: `DELETE /api/leads/c59fa...`,
          sampleRes: `{ "success": true, "data": { "id": "c59fa..." } }`,
        },
      ],
    },
    {
      group: 'Outreach Campaigns',
      items: [
        {
          method: 'GET',
          path: '/api/campaigns',
          auth: true,
          desc: 'List all outreach campaigns with aggregate lead counts.',
          sampleReq: `GET /api/campaigns`,
          sampleRes: `{ "success": true, "data": [ { "id": "...", "name": "Q4 SaaS", "leadCount": 4 } ] }`,
        },
        {
          method: 'POST',
          path: '/api/campaigns',
          auth: true,
          desc: 'Create an outreach sequence with optional initial enrolled leads.',
          sampleReq: `{ "name": "Q4 Enterprise Outbound", "description": "...", "leadIds": ["..."] }`,
          sampleRes: `{ "success": true, "data": { "id": "...", "status": "DRAFT", "leadCount": 1 } }`,
        },
        {
          method: 'POST',
          path: '/api/campaigns/:id/launch',
          auth: true,
          desc: 'Transition sequence status to ACTIVE to initiate outbound outreach.',
          sampleReq: `POST /api/campaigns/ab12.../launch`,
          sampleRes: `{ "success": true, "data": { "id": "...", "status": "ACTIVE" } }`,
        },
        {
          method: 'POST',
          path: '/api/campaigns/:id/leads',
          auth: true,
          desc: 'Enroll an existing lead into the campaign.',
          sampleReq: `{ "leadId": "lead_uuid" }`,
          sampleRes: `{ "success": true, "data": { "campaignId": "...", "leadId": "..." } }`,
        },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Developer API Reference"
        subtitle="RESTful endpoints, schemas, authentication, and responses"
        actionButton={
          <a
            href="http://localhost:5000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <span>Raw HTML Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      />

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">LeadFlow REST API v1.0</h2>
              <p className="text-xs text-slate-400">
                Standardized JSON responses: <code>&#123; success: boolean, data: ... &#125;</code>
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-3">
            Protected endpoints require an <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono">Authorization: Bearer &lt;JWT&gt;</code> header.
          </p>
        </div>

        {endpoints.map((group, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              {group.group}
            </h3>

            <div className="space-y-3">
              {group.items.map((ep, idx) => (
                <div
                  key={idx}
                  className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 transition-colors hover:border-slate-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                          ep.method === 'GET'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : ep.method === 'POST'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : ep.method === 'PUT'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-white">
                        {ep.path}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {ep.auth && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          <Key className="w-3 h-3 text-indigo-400" /> Bearer Token
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{ep.desc}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                        Request / Query
                      </span>
                      <pre className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto">
                        {ep.sampleReq}
                      </pre>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                        Response Payload
                      </span>
                      <pre className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-emerald-300/90 overflow-x-auto">
                        {ep.sampleRes}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
