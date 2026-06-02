import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type CampaignValidationT = ReturnType<
  typeof useTranslations<'campaignManagement.dialog.validation'>
>;

/* ─── Schema Factory Function ─── */
export const createCampaignFormSchema = (
  t: CampaignValidationT,
  isManagerOnlyEdit = false,
  initialStartDate?: string,
  initialShipByDate?: string,
) =>
  z
    .object({
      campaignName: z
        .string()
        .trim()
        .min(1, t('campaignNameRequired'))
        .min(VALIDATION_LENGTH.CAMPAIGN.NAME.MIN, t('campaignNameMinLength'))
        .max(VALIDATION_LENGTH.CAMPAIGN.NAME.MAX, t('campaignNameMaxLength')),

      campaignObjective: z
        .string()
        .trim()
        .min(1, t('campaignObjectiveRequired'))
        .min(VALIDATION_LENGTH.CAMPAIGN.OBJECTIVE.MIN, t('campaignObjectiveMinLength'))
        .max(VALIDATION_LENGTH.CAMPAIGN.OBJECTIVE.MAX, t('campaignObjectiveMaxLength')),

      description: z
        .string()
        .trim()
        .min(1, t('descriptionRequired'))
        .min(VALIDATION_LENGTH.CAMPAIGN.DESCRIPTION.MIN, t('descriptionMinLength'))
        .max(VALIDATION_LENGTH.CAMPAIGN.DESCRIPTION.MAX, t('descriptionMaxLength')),

      isPermanent: z.boolean(),

      startDate: z.string().trim().min(1, t('startDateRequired')),

      endDate: z.string().trim().optional().or(z.literal('')),

      shipByDate: z.string().trim().min(1, t('shipByDateRequired')),

      campaignManagerId: z.string().optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      if (isManagerOnlyEdit) return;

      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Start date must be in the future (tomorrow or later)
      // Skip this check in edit mode if the start date hasn't changed
      const startDateChanged = !initialStartDate || data.startDate !== initialStartDate;
      if (data.startDate && startDateChanged) {
        if (data.startDate <= todayStr) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('startDateFuture'),
            path: ['startDate'],
          });
        }
      }

      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('endDateRequired'),
          path: ['endDate'],
        });
      } else if (data.startDate && data.endDate <= data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('endDateAfterStartDate'),
          path: ['endDate'],
        });
      }

      // Ship by date must be in the future (tomorrow or later)
      // Skip this check in edit mode if the ship by date hasn't changed
      const shipByDateChanged = !initialShipByDate || data.shipByDate !== initialShipByDate;
      if (data.shipByDate && shipByDateChanged) {
        if (data.shipByDate <= todayStr) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('shipByDateFuture'),
            path: ['shipByDate'],
          });
        }
      }

      // Ship by date must be before start date
      if (data.shipByDate && data.startDate && data.shipByDate >= data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('shipByDateBeforeStartDate'),
          path: ['shipByDate'],
        });
      }
    });

/* ─── Types ─── */
export type CampaignFormData = z.infer<ReturnType<typeof createCampaignFormSchema>>;
