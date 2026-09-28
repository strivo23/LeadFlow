import { Router } from 'express';
import { LeadController } from '../controllers/leadController';
import { authenticateJwt } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema } from '../middleware/schemas';

const router = Router();

// Protect all lead endpoints
router.use(authenticateJwt);

router.get('/', LeadController.getLeads);
router.get('/industries', LeadController.getIndustries);
router.get('/:id', LeadController.getLeadById);
router.post('/', validate(createLeadSchema), LeadController.createLead);
router.put('/:id', validate(updateLeadSchema), LeadController.updateLead);
router.delete('/:id', LeadController.deleteLead);

export default router;
