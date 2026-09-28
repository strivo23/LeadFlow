"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leadController_1 = require("../controllers/leadController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../middleware/schemas");
const router = (0, express_1.Router)();
// Protect all lead endpoints
router.use(auth_1.authenticateJwt);
router.get('/', leadController_1.LeadController.getLeads);
router.get('/industries', leadController_1.LeadController.getIndustries);
router.get('/:id', leadController_1.LeadController.getLeadById);
router.post('/', (0, validate_1.validate)(schemas_1.createLeadSchema), leadController_1.LeadController.createLead);
router.put('/:id', (0, validate_1.validate)(schemas_1.updateLeadSchema), leadController_1.LeadController.updateLead);
router.delete('/:id', leadController_1.LeadController.deleteLead);
exports.default = router;
