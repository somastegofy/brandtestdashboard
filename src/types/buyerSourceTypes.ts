export interface Submission {
  id: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  purchaseSource: 'Amazon' | 'Flipkart' | 'Zepto' | 'Dmart' | 'BigBasket' | 'Swiggy Instamart' | 'Blinkit' | 'JioMart' | 'Other';
  productScanned: string;
  productId: string;
  invoiceUpload: string | null; // URL or file path
  scanSource: 'QR Code' | 'Barcode' | 'Manual Entry';
  rewardStatus: 'Approved' | 'Rejected' | 'Pending';
  rewardSent: string | null; // Coupon code, points, etc.
  submissionTimestamp: string;
  location?: string;
  campaignId?: string;
  invoiceAmount?: number;
  approvalComment?: string;
  rejectionReason?: string;
}

export interface PurchaseVerificationConfig {
  title: string;
  description: string;
  rewardType: 'Points' | 'Coupon' | 'Voucher' | 'Gift';
  purchaseSourceOptions: string[];
  requireInvoiceUpload: boolean;
  fieldsToCollect: ('Name' | 'Age' | 'Mobile' | 'Email' | 'Location')[];
  autoCaptureLocation: boolean;
  ctaButtonText: string;
  postSubmissionMessage: string;
  linkToCampaign?: string;
  visibilityRule: 'Always' | 'Post-scan' | 'Post-validation';
  showScanTypeToBrand: boolean;
}