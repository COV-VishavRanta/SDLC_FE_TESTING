const MAX_FILE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ?? 10);

export const ZIP_CODE_REGEX = /^\d+$/;
// Allows digits, spaces, parentheses, plus, minus (often used for international formats or loose validation)
export const GENERIC_ZIP_CODE_REGEX = /^[\d\s()+-]+$/;
export const PHONE_NUMBER_REGEX = /^\d+$/;
export const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export const INPUT_BLOCKED_KEYS = ['.', '—', 'e', 'E', '+'];

const IMAGE_VALIDATION = {
  MAX_SIZE_BYTES: MAX_FILE_SIZE_MB * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
};

export const VALIDATION_LENGTH = {
  NAME: {
    MIN: 2,
    MAX: 200, // Used for Brand, Store, PSP names
  },
  CAMPAIGN: {
    NAME: {
      MIN: 3,
      MAX: 100,
    },
    OBJECTIVE: {
      MIN: 3,
      MAX: 200,
    },
    DESCRIPTION: {
      MIN: 3,
      MAX: 500,
    },
  },
  ADDRESS: {
    STREET: {
      MIN: 5,
      MAX: 200,
    },
    CITY: {
      MIN: 2,
      MAX: 100,
    },
    STATE: {
      MIN: 2,
      MAX: 50,
    },
    COUNTRY: {
      MIN: 2,
      MAX: 100,
    },
    ZIP_CODE: {
      MIN: 5,
      MAX: 5,
    },
  },
  CONTACT: {
    WEBSITE: {
      MAX: 255,
    },
    PHONE: {
      LENGTH: 10,
    },
    EMAIL: {
      MAX: 255,
    },
  },
  STORE: {
    NUMBER: {
      MAX: 50,
    },
  },
  USER: {
    FULL_NAME: {
      MIN: 2,
      MAX: 100,
    },
  },
  PROMOTION: {
    NAME: {
      MIN: 2,
      MAX: 100,
    },
    DIMENSION: {
      MIN: 1,
    },
    MATERIAL: {
      MAX: 100,
    },
    SPECIFICATIONS: {
      MAX: 200,
    },
    DESCRIPTION: {
      MAX: 200,
    },
    IMAGE: IMAGE_VALIDATION,
  },
  SHIPMENT: {
    TRACKING_NUMBER: {
      MIN: 1,
      MAX: 50,
    },
    CARRIER_NAME: {
      MIN: 1,
      MAX: 50,
    },
    NOTES: {
      MAX: 500,
    },
  },
  SHIPMENT_EXCEPTION: {
    REASON: {
      MAX: 500,
    },
    IMAGE: IMAGE_VALIDATION,
  },
  INVENTORY: {
    NAME: {
      MIN: 2,
      MAX: 100,
    },
    MATERIAL: {
      MAX: 100,
    },
    SPECIFICATIONS: {
      MAX: 200,
    },
    DESCRIPTION: {
      MAX: 200,
    },
    IMAGE: IMAGE_VALIDATION,
  },
  SURVEY: {
    NAME: {
      MIN: 2,
      MAX: 100,
    },
    TEMPLATE_NAME: {
      MAX: 100,
    },
    DESCRIPTION: {
      MAX: 500,
    },
  },
  INSTALLATION_PROOF: {
    NOTES: {
      MAX: 500,
    },
    REJECTION_REASON: {
      MAX: 500,
    },
    IMAGE: IMAGE_VALIDATION,
  },
};
