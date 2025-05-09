// Helper code for the API consumer to understand the error and handle is accordingly
export enum StatusCode {
  OK = "10000",
  CREATED = "10001",
  NO_CONTENT = "10002",
  FAILURE = "10003",
  RETRY = "10004",
  INVALID_ACCESS_TOKEN = "10005",
}

// Response status codes
export enum ResponseStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UN_AUTHORISED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  ENTITY_TOO_LARGE = 413,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_ERROR = 500,
}

export enum EVerification {
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_CONFIRMATION = "password_confirmation",
  PASSWORD_RESET = "password_reset_token",
  OTP_TOKEN = "otp_token",
}

export enum EVisibility {
  PUBLIC = "public",
  ONLY_ME = "only_me",
}

export enum EComm {
  CHAT = "in-app",
  SMS = "sms",
  EMAIL = "email",
}

export enum EIDType {
  NATIONAL_ID = "national_id",
  INTERNATIONAL_ID = "international_id",
  VOTER_CARD = "voter_card",
}

export enum AccountType {
  VENDOR = "vendor",
  ORGANIZER = "organizer",
  ATTENDEE = "attendee",
  ADMIN = "admin",
  SUPERADMIN = "superadmin",
}

export enum EBooking {
  VENUE = "venue",
  SERVICE = "service",
}

export enum EBookingStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  CONFIRMED = "confirmed",
  DELETED = "deleted",
}

export enum EEventStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
  DELETED = "deleted",
  CANCELLED = "cancelled",
  POSTPONED = "postponed",
}

export enum EEventType {
  HYBRID = "hybrid",
  PHYSICAL = "in-person",
  VIRTUAL = "virtual",
}

export enum ETicketType {
  REGULAR = "regular",
  VIP = "vip",
  VVIP = "vvip",
  FREE = "free",
}

export enum EContentHeadRange {
  MIN = 3,
  MAX = 50,
}

export enum EContentBodyRange {
  MIN = 5,
  MAX = 512,
}

export enum ENotifCategory {
  EVENT = "event-notification",
  TICKET = "ticket-notification",
  CONVERSATION = "conversation-notification",
  TRANSACTION = "transaction-notification",
  CALENDAR = "calendar-notification",
  REMINDER = "reminder-notification",
  OTHER = "other-notifications",
  PUBLIC_SERVICE_ANNOUNCEMENT = "public-service-announcement",

  OTP = "otp",
  REGISTER = "registration",
  VERIFICATION_EMAIL = "verification-email",
  // Add more categories as required by your implementation
}

export enum ENotifCategoryDetails {
  EVENT_CREATED = "event_created",
  EVENT_APPROVED = "event_approved",
  EVENT_REJECTED = "event_rejected",
  TICKET_PURCHASED = "ticket_purchased",
  NEW_MESSAGE = "new_message",
  NEW_GROUP_MESSAGE = "new_group_message",
  ESCROW_RELEASE_REQUEST = "escrow_payment_release_request",
  ESCROW_RELEASED = "escrow_payment_released",
  ESCROW_REFUNDED = "escrow_payment_refunded",
  WITHDRAWAL_REQUEST = "withdrawal_request",
  WITHDRAWAL_REQUEST_APPROVED = "withdrawal_request_approved",
  WITHDRAWAL_REQUEST_DECLINED = "withdrawal_request_declined",
  WITHDRAWAL_REQUEST_FAILED = "withdrawal_request_failed",
  WITHDRWAL_REQUEST_COMPLETED = "withdrawal_request_completed",

  OTP_GENERATED = "otp_generated",
  // Add more subcategories as required by your implementation
}

export enum ENotifStatus {
  PENDING = "pending",
  SENT = "sent",
}

export enum ENotifChannel {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
}

export enum EWalletType {
  ESCROW = "EscrowWallet",
  MAIN = "MainWallet",
  REFERRAL = "ReferralWallet",
}

export enum EPaymentMethod {
  "USSD" = "ussd",
  "CARD" = "card",
  "BANK_TRANSFER" = "bank_transfer",
  "MOBILE_MONEY" = "mobile money",
  "MAIN_WALLET" = "main_wallet",
  "CRYPTO_WALLET" = "crypto_wallet",
  "AUTHORIZATION_CODE" = "authorization_code",
  "ONE_TIME_LINK" = "one_time_link",
  "REFERRAL_WALLET" = "referral_wallet",
}

export enum ETransactionType {
  "FUND_WALLET" = "fund_wallet",
  "WITHDRAWAL" = "withdrawal",
  "ESCROW" = "escrow",
  "REFERRAL" = "referral",
  "REGULAR" = "regular",
  "SUBSCRIPTION" = "subscription",
  "TRANSACTION_FEE" = "transaction_fee",
}

export enum ETransactionDesignation {
  "TICKET_SALES" = "ticket_sales",
  "VENDOR_SERVICE_BOOKING" = "vendor_service_booking",
  "VENDOR_VENUE_BOOKING" = "vendor_venue booking",
  "OTHER_PRODUCT_SALES" = "other_product sales",
  "DAILY_SUBSCRIPTION" = "daily_subscription",
  "WEEKLY_SUBSCRIPTION" = "weekly_subscription",
  "MONTHLY_SUBSCRIPTION" = "monthly_subscription",
  "YEARLY_SUBSCRIPTION" = "yearly_subscription",
  "WITHDRAWAL_CHARGE" = "withdrawal_charge",
  "ESROW_TRANSACTION_CHARGE" = "escrow_transaction_charge",
}

export enum ETransactionStatus {
  "ESCROW_PENDING" = "escrow_pending",
  "ESCROW_RELEASE_REQUESTED" = "escrow_release_requested",
  "ESCROW_RELEASED" = "escrow_released",
  "ESCROW_REFUNDED" = "escrow_refunded",
  "FAILED" = "failed",
  "PENDING" = "pending",
  "PROCESSING" = "processing",
  "COMPLETED" = "completed",
  "DECLINED" = "declined",
  "REJECTED" = "rejected",
  "REFUND_REQUESTED" = "refund_requested",
  "REFUNDED" = "refunded",
}

export enum EChargeType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
}

export enum ERequestFileTypes {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  OTHER = "other",
}

export enum ERequestFileQuality {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum ERequestFileQuantity {
  SINGLE = "single",
  MULTIPLE = "multiple",
}
