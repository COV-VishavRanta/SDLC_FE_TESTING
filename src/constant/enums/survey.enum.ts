export enum SurveyTemplateSortField {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export enum SurveyStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  SUBMITTED = 'SUBMITTED',
  NOT_SUBMITTED = 'NOT_SUBMITTED',
}

export enum SurveySortField {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  STATUS = 'STATUS',
}

/* ── Status badge styles ── */
const STATUS_STYLES: Record<SurveyStatusEnum, { bg: string; text: string; border: string }> = {
  [SurveyStatusEnum.DRAFT]: {
    bg: 'var(--badge-draft-bg)',
    text: 'var(--badge-draft-text)',
    border: 'var(--badge-draft-border)',
  },
  [SurveyStatusEnum.ACTIVE]: {
    bg: 'var(--badge-active-bg)',
    text: 'var(--badge-active-text)',
    border: 'var(--badge-active-border)',
  },
  [SurveyStatusEnum.CLOSED]: {
    bg: 'var(--badge-closed-bg)',
    text: 'var(--badge-closed-text)',
    border: 'var(--badge-closed-border)',
  },
  [SurveyStatusEnum.SUBMITTED]: {
    bg: 'var(--badge-submitted-bg)',
    text: 'var(--badge-submitted-text)',
    border: 'var(--badge-submitted-border)',
  },
  [SurveyStatusEnum.NOT_SUBMITTED]: {
    bg: 'var(--badge-warning-bg)',
    text: 'var(--badge-warning-text)',
    border: 'var(--badge-warning-border)',
  },
};

export const getSurveyStatusStyles = (status: SurveyStatusEnum) => STATUS_STYLES[status];
