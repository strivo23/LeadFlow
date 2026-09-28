import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController';
import { authenticateJwt } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCampaignSchema, updateCampaignSchema } from '../middleware/schemas';

const router = Router();

// Protect all campaign endpoints
router.use(authenticateJwt);

router.get('/', CampaignController.getCampaigns);
router.get('/:id', CampaignController.getCampaignById);
router.post('/', validate(createCampaignSchema), CampaignController.createCampaign);
router.put('/:id', validate(updateCampaignSchema), CampaignController.updateCampaign);
router.post('/:id/launch', CampaignController.launchCampaign);
router.post('/:id/leads', CampaignController.addLeadToCampaign);
router.delete('/:id/leads/:leadId', CampaignController.removeLeadFromCampaign);
router.delete('/:id', CampaignController.deleteCampaign);

export default router;
