"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaignController_1 = require("../controllers/campaignController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../middleware/schemas");
const router = (0, express_1.Router)();
// Protect all campaign endpoints
router.use(auth_1.authenticateJwt);
router.get('/', campaignController_1.CampaignController.getCampaigns);
router.get('/:id', campaignController_1.CampaignController.getCampaignById);
router.post('/', (0, validate_1.validate)(schemas_1.createCampaignSchema), campaignController_1.CampaignController.createCampaign);
router.put('/:id', (0, validate_1.validate)(schemas_1.updateCampaignSchema), campaignController_1.CampaignController.updateCampaign);
router.post('/:id/launch', campaignController_1.CampaignController.launchCampaign);
router.post('/:id/leads', campaignController_1.CampaignController.addLeadToCampaign);
router.delete('/:id/leads/:leadId', campaignController_1.CampaignController.removeLeadFromCampaign);
router.delete('/:id', campaignController_1.CampaignController.deleteCampaign);
exports.default = router;
