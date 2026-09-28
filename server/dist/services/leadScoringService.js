"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadScoringService = void 0;
const DECISION_MAKER_KEYWORDS = [
    'ceo', 'cto', 'cfo', 'coo', 'cmo', 'cio', 'cpo', 'cro',
    'founder', 'co-founder', 'owner', 'partner',
    'vp', 'vice president', 'director', 'head', 'lead',
    'chief', 'principal', 'president', 'manager'
];
const HIGH_VALUE_INDUSTRIES = [
    'saas', 'technology', 'tech', 'software', 'finance', 'fintech',
    'artificial intelligence', 'ai', 'cloud', 'cybersecurity', 'enterprise software',
    'e-commerce', 'ecommerce', 'biotech', 'healthcare tech'
];
const FREE_EMAIL_PROVIDERS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'mail.com', 'aol.com'
];
class LeadScoringService {
    /**
     * Calculates an AI-style lead score (0-100) based on title, industry, company, email, website, phone and metadata.
     */
    static calculate(input) {
        let score = 0;
        const breakdown = [];
        // 1. Decision-maker Job Title (+25 pts)
        const title = (input.jobTitle || '').toLowerCase().trim();
        const isDecisionMaker = DECISION_MAKER_KEYWORDS.some((kw) => title.includes(kw));
        if (isDecisionMaker) {
            score += 25;
            breakdown.push({
                factor: 'Decision Maker Title',
                points: 25,
                maxPoints: 25,
                reason: `Title "${input.jobTitle}" exhibits executive/decision-making authority`,
            });
        }
        else if (title.length > 0) {
            score += 10;
            breakdown.push({
                factor: 'Job Title Present',
                points: 10,
                maxPoints: 25,
                reason: `Title "${input.jobTitle}" provided (non-executive)`,
            });
        }
        else {
            breakdown.push({
                factor: 'Job Title Missing',
                points: 0,
                maxPoints: 25,
                reason: 'No job title provided',
            });
        }
        // 2. High-Value Industry (+20 pts)
        const industry = (input.industry || '').toLowerCase().trim();
        const isHighValueIndustry = HIGH_VALUE_INDUSTRIES.some((ind) => industry.includes(ind));
        if (isHighValueIndustry) {
            score += 20;
            breakdown.push({
                factor: 'High-Growth Industry',
                points: 20,
                maxPoints: 20,
                reason: `Target industry "${input.industry}" has high B2B budget propensity`,
            });
        }
        else if (industry.length > 0) {
            score += 10;
            breakdown.push({
                factor: 'Industry Specified',
                points: 10,
                maxPoints: 20,
                reason: `Standard sector "${input.industry}"`,
            });
        }
        else {
            breakdown.push({
                factor: 'Industry Unspecified',
                points: 0,
                maxPoints: 20,
                reason: 'No industry specified',
            });
        }
        // 3. Company Presence (+15 pts)
        const company = (input.company || '').trim();
        if (company.length >= 2) {
            score += 15;
            breakdown.push({
                factor: 'Verified Company',
                points: 15,
                maxPoints: 15,
                reason: `Associated corporate account: "${company}"`,
            });
        }
        else {
            breakdown.push({
                factor: 'Company Missing',
                points: 0,
                maxPoints: 15,
                reason: 'Missing corporate affiliation',
            });
        }
        // 4. Business Email vs Free Email (+15 pts)
        const email = (input.email || '').toLowerCase().trim();
        if (email && email.includes('@')) {
            const domain = email.split('@')[1];
            const isFreeEmail = FREE_EMAIL_PROVIDERS.includes(domain);
            if (!isFreeEmail) {
                score += 15;
                breakdown.push({
                    factor: 'Corporate Domain Email',
                    points: 15,
                    maxPoints: 15,
                    reason: `Work domain (@${domain}) indicates direct corporate contact`,
                });
            }
            else {
                score += 5;
                breakdown.push({
                    factor: 'Personal Email Domain',
                    points: 5,
                    maxPoints: 15,
                    reason: `Consumer provider (@${domain}) used rather than business domain`,
                });
            }
        }
        else {
            breakdown.push({
                factor: 'Email Missing',
                points: 0,
                maxPoints: 15,
                reason: 'No valid email address recorded',
            });
        }
        // 5. Website Presence (+10 pts)
        const website = (input.website || '').trim();
        if (website.length > 3) {
            score += 10;
            breakdown.push({
                factor: 'Digital Footprint (Website)',
                points: 10,
                maxPoints: 10,
                reason: `Digital company footprint verified: ${website}`,
            });
        }
        else {
            breakdown.push({
                factor: 'Website Missing',
                points: 0,
                maxPoints: 10,
                reason: 'No web presence recorded',
            });
        }
        // 6. Direct Phone Number (+10 pts)
        const phone = (input.phone || '').trim();
        if (phone.length >= 7) {
            score += 10;
            breakdown.push({
                factor: 'Direct Phone Line',
                points: 10,
                maxPoints: 10,
                reason: `Direct telephonic outreach channel available`,
            });
        }
        else {
            breakdown.push({
                factor: 'Phone Missing',
                points: 0,
                maxPoints: 10,
                reason: 'No phone number available',
            });
        }
        // 7. Context & Notes / Source (+5 pts)
        const hasNotes = Boolean(input.notes && input.notes.trim().length > 5);
        const hasSource = Boolean(input.source && input.source.trim().length > 0);
        if (hasNotes || hasSource) {
            score += 5;
            breakdown.push({
                factor: 'Enriched Metadata & Notes',
                points: 5,
                maxPoints: 5,
                reason: 'Lead contains qualitative qualification notes or source context',
            });
        }
        else {
            breakdown.push({
                factor: 'Metadata Limited',
                points: 0,
                maxPoints: 5,
                reason: 'No background notes or referral source documented',
            });
        }
        // Cap score at 100
        score = Math.min(100, Math.max(0, score));
        // Determine classification
        let classification = 'Cold';
        if (score >= 80) {
            classification = 'Hot';
        }
        else if (score >= 60) {
            classification = 'Warm';
        }
        else {
            classification = 'Cold';
        }
        return {
            score,
            classification,
            breakdown,
        };
    }
    static getClassification(score) {
        if (score >= 80)
            return 'Hot';
        if (score >= 60)
            return 'Warm';
        return 'Cold';
    }
}
exports.LeadScoringService = LeadScoringService;
