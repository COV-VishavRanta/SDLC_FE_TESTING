// NOTE: AppSidebar is intentionally NOT exported from this barrel.
// It is a Server Component that transitively uses next/headers (via AppSidebarNav).
// Import it directly: import AppSidebar from '@/components/app-sidebar/app-sidebar'
export { default as AppTopbar } from './app-topbar/app-topbar';
export { default as UserDialog } from './dialog/user-dialog/user-dialog';
export {
  createUserDialogSchema,
  userFormSchema,
  type UserFormData,
  type UserFormSchemaRequirements,
} from './dialog/user-dialog/user-dialog.schema';
export {
  getUserFormPermissions,
  type UserFormPermissions,
} from './dialog/user-dialog/useUserFormPermissions';
export { ErrorBoundary } from './error-boundary/error-boundary';
export { SectionErrorBoundary } from './error-boundary/section-error-boundary';
export { SectionErrorFallback } from './error-boundary/section-error-fallback';

export { ImpersonationBanner } from './impersonation-banner/ImpersonationBanner';
export { LanguageSwitcher } from './language-switcher/language-switcher';
export { PermissionGate } from './permission-gate/PermissionGate';
export { default as ScrollToTop } from './scrollToTop/scroll-to-top';
export { NoRecordFound } from './ui/no-record-found';
export { default as ViewImage } from './view-image/view-image';

// guards
export { AuthGuard } from './guards/AuthGuard';
export { CampaignGuard } from './guards/CampaignGuard';
export { CapabilitiesGuard } from './guards/CapabilitiesGuard';
export { IdleTimeoutGuard } from './guards/IdleTimeoutGuard';
export { SurveyCapabilitiesGuard } from './guards/SurveyCapabilitiesGuard';

// Survey Creator composition components
export {
  QuestionBuilder,
  QuestionSettings,
  SurveyCreatorProvider,
  SurveyPreview,
  useSurveyCreator,
} from './survey-creator';

// dialogs
export { default as BrandDialog } from './dialog/brand-dialog/brand-dialog';
export { default as CampaignDialog } from './dialog/campaign-dialog/campaign-dialog';
export { default as ChangeDetailsDialog } from './dialog/change-details-dialog/change-details-dialog';
export { DialogCreateSuccess } from './dialog/dialog-create-success/dialog-create-success';
export { default as InventoryDialog } from './dialog/inventory-dialog/inventory-dialog';
export { default as PromotionDialog } from './dialog/promotion-dialog/promotion-dialog';
export { default as PspDialog } from './dialog/psp-dialog/psp-dialog';
export { default as RejectionReasonDialog } from './dialog/rejection-reason-dialog/rejection-reason-dialog';
export { default as StoreDialog } from './dialog/store-dialog/store-dialog';
export { default as UpdateCampaignStatusDialog } from './dialog/update-campaign-status-dialog/update-campaign-status-dialog';
export { UpdateCampaignStatusDialogSkeleton } from './dialog/update-campaign-status-dialog/update-campaign-status-dialog.loading';
export { default as ViewImagesDialog } from './dialog/view-images-dialog/view-images-dialog';
export { default as WebhookDialog } from './dialog/webhook-dialog/webhook-dialog';

// Icons
export { ActivityIcon } from './icons/ActivityIcon';
export { AddResponseIcon } from './icons/AddResponseIcon';
export { AlertCircleIcon } from './icons/AlertCircleIcon';
export { AlertTriangleIcon } from './icons/AlertTriangleIcon';
export { ArchiveIcon } from './icons/ArchiveIcon';
export { ArrowLeftIcon } from './icons/ArrowLeftIcon';
export { ArrowRightIcon } from './icons/ArrowRightIcon';
export { AssignToBrandIcon } from './icons/AssignToBrandIcon';
export { AuditLogsIcon } from './icons/AuditLogsIcon';
export { BrandIcon } from './icons/BrandIcon';
export { BrandsIcon } from './icons/BrandsIcon';
export { BuildingIcon } from './icons/BuildingIcon';
export { CalendarIcon } from './icons/CalendarIcon';
export { CampaignAcknowledgedIcon } from './icons/CampaignAcknowledgedIcon';
export { CampaignIcon } from './icons/CampaignIcon';
export { CampaignInProductionIcon } from './icons/CampaignInProductionIcon';
export { CampaignInReviewIcon } from './icons/CampaignInReviewIcon';
export { CampaignNewIcon } from './icons/CampaignNewIcon';
export { CampaignOnHoldIcon } from './icons/CampaignOnHoldIcon';
export { CampaignPartiallyReceivedIcon } from './icons/CampaignPartiallyReceivedIcon';
export { CampaignPartiallyShippedIcon } from './icons/CampaignPartiallyShippedIcon';
export { CampaignReceivedIcon } from './icons/CampaignReceivedIcon';
export { CampaignShippedIcon } from './icons/CampaignShippedIcon';
export { CheckboxIcon } from './icons/CheckboxIcon';
export { CheckCircleIcon } from './icons/CheckCircleIcon';
export { CheckIcon } from './icons/CheckIcon';
export { ChevronDownIcon } from './icons/ChevronDownIcon';
export { ChevronRightIcon } from './icons/ChevronRightIcon';
export { ChevronUpIcon } from './icons/ChevronUpIcon';
export { ClockIcon } from './icons/ClockIcon';
export { ClockSmallIcon } from './icons/ClockSmallIcon';
export { CloseIcon } from './icons/CloseIcon';
export { CollapseIcon } from './icons/CollapseIcon';
export { ConditionalIcon } from './icons/ConditionalIcon';
export { CopyIcon } from './icons/CopyIcon';
export { DashboardIcon } from './icons/DashboardIcon';
export { DeactivateIcon } from './icons/DeactivateIcon';
export { DocumentPlusIcon } from './icons/DocumentPlusIcon';
export { DownloadIcon } from './icons/DownloadIcon';
export { DragHandleIcon } from './icons/DragHandleIcon';
export { DropdownIcon } from './icons/DropdownIcon';
export { EditIcon } from './icons/EditIcon';
export { EmailIcon } from './icons/EmailIcon';
export { ErrorIcon } from './icons/ErrorIcon';
export { ExpandIcon } from './icons/ExpandIcon';
export { ExternalLinkIcon } from './icons/ExternalLinkIcon';
export { EyeIcon } from './icons/EyeIcon';
export { EyeOffIcon } from './icons/EyeOffIcon';
export { FileEarmarkImageIcon } from './icons/FileEarmarkImageIcon';
export { FileTextIcon } from './icons/FileTextIcon';
export { FilterIcon } from './icons/FilterIcon';
export { GlobeIcon } from './icons/GlobeIcon';
export { ImpersonateIcon } from './icons/ImpersonateIcon';
export { InactiveCircleIcon } from './icons/InactiveCircleIcon';
export { InfoCircleIcon } from './icons/InfoCircleIcon';
export { InProductionIcon } from './icons/InProductionIcon';
export { InventoryIcon } from './icons/InventoryIcon';
export { ItemsShippedIcon } from './icons/ItemsShippedIcon';
export { KeyIcon } from './icons/KeyIcon';
export * from './icons/LanguageIcon';
export { LockIcon } from './icons/LockIcon';
export { MapPinIcon } from './icons/MapPinIcon';
export { MegaphoneIcon } from './icons/MegaphoneIcon';
export { MenuIcon } from './icons/MenuIcon';
export { NotificationIcon } from './icons/NotificationIcon';
export { PackageIcon } from './icons/PackageIcon';
export { PauseCircleIcon } from './icons/PauseCircleIcon';
export { PhoneIcon } from './icons/PhoneIcon';
export { PhotoIcon } from './icons/PhotoIcon';
export { PlayIcon } from './icons/PlayIcon';
export { PlusIcon } from './icons/PlusIcon';
export { PlusIcon2 } from './icons/PlusIcon2';
export { PowerIcon } from './icons/PowerIcon';
export { PSPManagementIcon } from './icons/PSPManagementIcon';
export { QuestionConditionalIcon } from './icons/QuestionConditionalIcon';
export { QuestionDropdownIcon } from './icons/QuestionDropdownIcon';
export { RadioButtonIcon } from './icons/RadioButtonIcon';
export { RefreshIcon } from './icons/RefreshIcon';
export { ReportsIcon } from './icons/ReportsIcon';
export { SaveIcon } from './icons/SaveIcon';
export { SearchIcon } from './icons/SearchIcon';
export { SendIcon } from './icons/SendIcon';
export { ShipmentsIcon } from './icons/ShipmentsIcon';
export { SortIcon } from './icons/SortIcon';
export { StoreIcon } from './icons/StoreIcon';
export { StoreSmallIcon } from './icons/StoreSmallIcon';
export { SurveyIcon } from './icons/SurveyIcon';
export { TagIcon } from './icons/TagIcon';
export { TagSmallIcon } from './icons/TagSmallIcon';
export { TechnicalErrorIcon } from './icons/TechnicalErrorIcon';
export { TextInputIcon } from './icons/TextInputIcon';
export { TotalCampaignsIcon } from './icons/TotalCampaignsIcon';
export { TrashIcon } from './icons/TrashIcon';
export { TrendingUpIcon } from './icons/TrendingUpIcon';
export { TruckIcon } from './icons/TruckIcon';
export { UnarchiveIcon } from './icons/UnarchiveIcon';
export { UploadIcon } from './icons/UploadIcon';
export { UserGroupIcon } from './icons/UserGroupIcon';
export { UserIcon } from './icons/UserIcon';
export { UserManagementIcon } from './icons/UserManagementIcon';
export { UserPlusIcon } from './icons/UserPlusIcon';
export { UsersGroupIcon } from './icons/UsersGroupIcon';
export { ViewInstallationProof } from './icons/ViewInstallationProof';
export { ViewMoreArrowIcon } from './icons/ViewMoreArrowIcon';
export { WebhookIcon } from './icons/WebhookIcon';

// shadcn ui components
export * from './ui/accordion';
export * from './ui/alert';
export * from './ui/badge';
export * from './ui/button';
export * from './ui/calendar';
export * from './ui/card';
export * from './ui/checkbox';
export * from './ui/combobox';
export * from './ui/detail-page';
export * from './ui/dialog';
export * from './ui/dropdown-menu';
export * from './ui/field';
export * from './ui/input';
export * from './ui/input-otp';
export * from './ui/label';
export * from './ui/page-controls';
export * from './ui/page-header';
export * from './ui/pagination';
export * from './ui/popover';
export * from './ui/select';
export * from './ui/separator';
export * from './ui/sheet';
export * from './ui/sidebar';
export * from './ui/skeleton';
export * from './ui/sonner';
export * from './ui/switch';
export * from './ui/table';
export * from './ui/table-cell';
export * from './ui/tabs';
export * from './ui/textarea';
export * from './ui/tooltip';
