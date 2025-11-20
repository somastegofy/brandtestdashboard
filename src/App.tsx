import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductsTab from './components/ProductsTab';
import StudioTab from './components/StudioTab';
import DashboardOverview from './components/DashboardOverview';
import RewardsCampaignsTab from './components/RewardsCampaignsTab';
import SmartTriggersTab from './components/SmartTriggersTab';
import AnalyticsTab from './components/AnalyticsTab';
import ConsumersTab from './components/ConsumersTab';
import BuyerSourceProofTab from './components/BuyerSourceProofTab';
import ReviewsManagerTab from './components/ReviewsManagerTab';
import SubmissionDetailsModal from './components/SubmissionDetailsModal';
import PublishedPageViewer from './components/PublishedPageViewer';
import SettingsTab from './components/SettingsTab';
import QrCodeManagerTab from './components/QrCodeManagerTab';
import SupportInboxTab from './components/SupportInboxTab';
import FileManagerTab from './components/FileManagerTab';
import { Submission } from './types/buyerSourceTypes';
import { Product, SAMPLE_CATEGORIES, CategoryHierarchy } from './types/productTypes';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Products state - moved from ProductsTab
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Organic Honey 500g',
      shortDescription: 'Pure, raw organic honey sourced from local beekeepers',
      longDescription: 'Our premium organic honey is carefully harvested from pesticide-free environments, ensuring the highest quality and natural taste. Rich in antioxidants and natural enzymes.',
      mrp: 450,
      categoryId: 'food',
      subcategoryId: 'honey',
      images: ['/images/honey-1.jpg', '/images/honey-2.jpg'],
      videos: [],
      productBanner: '/images/honey-banner.jpg',
      status: 'published',
      qrStatus: 'generated',
      qrCodeUrl: '/product/organic-honey-500g-123456',
      studioPageLinked: true,
      barcode: '8901234567890',
      enableBarcodeLinking: true,
      createdAt: '2024-01-15T10:30:00Z',
      ingredients: ['100% Pure Organic Honey'],
      ingredientsTableFormat: [],
      ingredientsFormat: 'paragraph',
      nutritionInfo: [
        { nutrientName: 'Calories', contains: '304', measurementUnit: 'kcal', perServeQuantity: '100g', rdaPercentage: '15%' },
        { nutrientName: 'Carbohydrates', contains: '82.4', measurementUnit: 'g', perServeQuantity: '100g', rdaPercentage: '27%' },
        { nutrientName: 'Sugars', contains: '82.1', measurementUnit: 'g', perServeQuantity: '100g', rdaPercentage: '91%' }
      ],
      keyBenefits: ['Natural energy booster', 'Rich in antioxidants', 'Supports immune system'],
      usageInstructions: ['Take 1-2 teaspoons daily', 'Can be mixed with warm water', 'Store in cool, dry place'],
      technicalSpecs: [
        { label: 'Moisture Content', value: '< 20%' },
        { label: 'pH Level', value: '3.4 - 6.1' }
      ],
      weight: '500g',
      dimensions: '8x8x12 cm',
      sustainabilityFlags: {
        recyclable: true,
        compostable: false,
        carbonNeutral: true
      },
      certifications: ['FSSAI', 'Organic India', 'ISO 9001'],
      manufacturingAddress: 'ABC Organic Foods, Village Kumharia, Dist. Udaipur, Rajasthan - 313001',
      expiryDate: '2025-12-31',
      warrantyDurationMonths: null,
      barcodeNumber: '8901234567890',
      skuCode: 'HON-ORG-500',
      productCode: 'organic-honey-500g-123456',
      autoGenerateQr: true,
      studioPageStatus: 'linked',
      lastUpdated: '2024-01-20T14:30:00Z',
      pageViews: 1247
    },
    {
      id: '2',
      name: 'Premium Green Tea 250g',
      shortDescription: 'Hand-picked premium green tea leaves with natural antioxidants',
      longDescription: 'Carefully selected green tea leaves from the hills of Darjeeling, processed using traditional methods to preserve natural flavors and health benefits.',
      mrp: 320,
      categoryId: 'food',
      subcategoryId: 'tea',
      images: ['/images/tea-1.jpg'],
      videos: [],
      productBanner: '/images/tea-banner.jpg',
      status: 'published',
      qrStatus: 'generated',
      qrCodeUrl: '/product/premium-green-tea-250g-789012',
      studioPageLinked: false,
      barcode: '8901234567891',
      enableBarcodeLinking: true,
      createdAt: '2024-01-18T09:15:00Z',
      ingredients: ['100% Green Tea Leaves'],
      ingredientsTableFormat: [],
      ingredientsFormat: 'paragraph',
      nutritionInfo: [
        { nutrientName: 'Calories', contains: '2', measurementUnit: 'kcal', perServeQuantity: '1 cup', rdaPercentage: '0%' },
        { nutrientName: 'Caffeine', contains: '25-50', measurementUnit: 'mg', perServeQuantity: '1 cup', rdaPercentage: '0%' }
      ],
      keyBenefits: ['Rich in antioxidants', 'Boosts metabolism', 'Supports heart health'],
      usageInstructions: ['Steep 1 tsp in hot water for 3-5 minutes', 'Best consumed without milk', 'Can be taken 2-3 times daily'],
      technicalSpecs: [
        { label: 'Grade', value: 'FTGFOP1' },
        { label: 'Origin', value: 'Darjeeling, India' }
      ],
      weight: '250g',
      dimensions: '15x10x5 cm',
      sustainabilityFlags: {
        recyclable: true,
        compostable: true,
        carbonNeutral: false
      },
      certifications: ['FSSAI', 'Fair Trade', 'Organic'],
      manufacturingAddress: 'Tea Gardens Ltd., Darjeeling, West Bengal - 734101',
      expiryDate: '2025-06-30',
      warrantyDurationMonths: null,
      barcodeNumber: '8901234567891',
      skuCode: 'TEA-GRN-250',
      productCode: 'premium-green-tea-250g-789012',
      autoGenerateQr: true,
      studioPageStatus: 'default',
      lastUpdated: '2024-01-18T09:15:00Z',
      pageViews: 892
    },
    {
      id: '3',
      name: 'Natural Handmade Soap Pack',
      shortDescription: 'Chemical-free handmade soap with natural ingredients',
      longDescription: 'Artisanal soap made with natural oils and herbs, free from harmful chemicals. Gentle on skin and environmentally friendly.',
      mrp: 180,
      categoryId: 'personal-care',
      subcategoryId: 'soap',
      images: ['/images/soap-1.jpg', '/images/soap-2.jpg'],
      videos: [],
      productBanner: '/images/soap-banner.jpg',
      status: 'draft',
      qrStatus: 'not-generated',
      qrCodeUrl: '',
      studioPageLinked: false,
      barcode: '',
      enableBarcodeLinking: true,
      createdAt: '2024-01-22T16:45:00Z',
      ingredients: ['Coconut Oil', 'Olive Oil', 'Shea Butter', 'Essential Oils', 'Natural Herbs'],
      ingredientsTableFormat: [],
      ingredientsFormat: 'paragraph',
      nutritionInfo: [],
      keyBenefits: ['Chemical-free', 'Moisturizing', 'Suitable for all skin types', 'Eco-friendly'],
      usageInstructions: ['Wet hands and soap', 'Lather gently', 'Rinse thoroughly', 'Store in dry place'],
      technicalSpecs: [
        { label: 'pH Level', value: '9-10' },
        { label: 'Saponification Value', value: '190-250' }
      ],
      weight: '100g x 3 pieces',
      dimensions: '8x5x3 cm each',
      sustainabilityFlags: {
        recyclable: true,
        compostable: true,
        carbonNeutral: true
      },
      certifications: ['Cruelty Free', 'Vegan Certified', 'Organic'],
      manufacturingAddress: 'Natural Care Products, Jaipur, Rajasthan - 302001',
      expiryDate: '2026-01-22',
      warrantyDurationMonths: null,
      barcodeNumber: '',
      skuCode: 'SOAP-NAT-PACK',
      productCode: 'natural-handmade-soap-pack-345678',
      autoGenerateQr: false,
      studioPageStatus: 'default',
      lastUpdated: '2024-01-22T16:45:00Z',
      pageViews: 0
    }
  ]);

  // Categories state
  const [categoriesState, setCategoriesState] = useState<CategoryHierarchy[]>(SAMPLE_CATEGORIES);

  // Selected product for Studio
  const [selectedProductForStudio, setSelectedProductForStudio] = useState<Product | null>(null);

  // Shared submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 'SUB-001',
      customerName: 'Priya Sharma',
      mobileNumber: '9876543210',
      email: 'priya.sharma@gmail.com',
      purchaseSource: 'Amazon',
      productScanned: 'Organic Honey 500g',
      productId: 'prod-001',
      invoiceUpload: '/uploads/invoice-001.pdf',
      scanSource: 'QR Code',
      rewardStatus: 'Pending',
      rewardSent: null,
      submissionTimestamp: '2024-01-20T14:30:00Z',
      location: 'Mumbai, Maharashtra',
      invoiceAmount: 450,
      campaignId: 'camp-001'
    },
    {
      id: 'SUB-002',
      customerName: 'Rahul Kumar',
      mobileNumber: '9123456789',
      email: 'rahul.k@yahoo.com',
      purchaseSource: 'Flipkart',
      productScanned: 'Premium Tea 250g',
      productId: 'prod-002',
      invoiceUpload: '/uploads/invoice-002.jpg',
      scanSource: 'Barcode',
      rewardStatus: 'Approved',
      rewardSent: 'SAVE20OFF',
      submissionTimestamp: '2024-01-19T16:45:00Z',
      location: 'Delhi, NCR',
      invoiceAmount: 320,
      approvalComment: 'Valid purchase verified'
    },
    {
      id: 'SUB-003',
      customerName: 'Anita Patel',
      mobileNumber: '9988776655',
      email: 'anita.patel@hotmail.com',
      purchaseSource: 'Zepto',
      productScanned: 'Handmade Soap Pack',
      productId: 'prod-003',
      invoiceUpload: null,
      scanSource: 'Manual Entry',
      rewardStatus: 'Rejected',
      rewardSent: null,
      submissionTimestamp: '2024-01-18T11:20:00Z',
      location: 'Bangalore, Karnataka',
      rejectionReason: 'Invoice not uploaded'
    },
    {
      id: 'SUB-004',
      customerName: 'Vikram Singh',
      mobileNumber: '9445566778',
      email: 'vikram.singh@gmail.com',
      purchaseSource: 'Dmart',
      productScanned: 'Natural Shampoo 400ml',
      productId: 'prod-004',
      invoiceUpload: '/uploads/invoice-004.png',
      scanSource: 'QR Code',
      rewardStatus: 'Approved',
      rewardSent: '100 Points',
      submissionTimestamp: '2024-01-17T09:15:00Z',
      location: 'Chennai, Tamil Nadu',
      invoiceAmount: 280,
      approvalComment: 'Verified purchase from authorized retailer'
    },
    {
      id: 'SUB-005',
      customerName: 'Meera Gupta',
      mobileNumber: '9876512345',
      email: 'meera.g@outlook.com',
      purchaseSource: 'BigBasket',
      productScanned: 'Organic Honey 500g',
      productId: 'prod-001',
      invoiceUpload: '/uploads/invoice-005.pdf',
      scanSource: 'QR Code',
      rewardStatus: 'Pending',
      rewardSent: null,
      submissionTimestamp: '2024-01-21T10:30:00Z',
      location: 'Pune, Maharashtra',
      invoiceAmount: 450,
      campaignId: 'camp-001'
    },
    {
      id: 'SUB-006',
      customerName: 'Arjun Reddy',
      mobileNumber: '9123987654',
      email: 'arjun.reddy@gmail.com',
      purchaseSource: 'Swiggy Instamart',
      productScanned: 'Premium Tea 250g',
      productId: 'prod-002',
      invoiceUpload: '/uploads/invoice-006.jpg',
      scanSource: 'Barcode',
      rewardStatus: 'Rejected',
      rewardSent: null,
      submissionTimestamp: '2024-01-16T14:20:00Z',
      location: 'Hyderabad, Telangana',
      invoiceAmount: 320,
      rejectionReason: 'Invoice appears to be tampered'
    }
  ]);

  // Shared modal state
  const [showSharedSubmissionDetailsModal, setShowSharedSubmissionDetailsModal] = useState(false);
  const [selectedSubmissionForModal, setSelectedSubmissionForModal] = useState<Submission | null>(null);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(-1);
  const [filteredSubmissionsForModal, setFilteredSubmissionsForModal] = useState<Submission[]>([]);

  // Modal control functions
  const openSharedSubmissionDetailsModal = (submission: Submission, filteredList?: Submission[]) => {
    setSelectedSubmissionForModal(submission);
    setShowSharedSubmissionDetailsModal(true);
    
    if (filteredList) {
      setFilteredSubmissionsForModal(filteredList);
      const index = filteredList.findIndex(s => s.id === submission.id);
      setCurrentSubmissionIndex(index);
    } else {
      setFilteredSubmissionsForModal([submission]);
      setCurrentSubmissionIndex(0);
    }
  };

  const closeSharedSubmissionDetailsModal = () => {
    setShowSharedSubmissionDetailsModal(false);
    setSelectedSubmissionForModal(null);
    setCurrentSubmissionIndex(-1);
    setFilteredSubmissionsForModal([]);
  };

  const navigateSubmission = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentSubmissionIndex - 1 : currentSubmissionIndex + 1;
    if (newIndex >= 0 && newIndex < filteredSubmissionsForModal.length) {
      setCurrentSubmissionIndex(newIndex);
      setSelectedSubmissionForModal(filteredSubmissionsForModal[newIndex]);
    }
  };

  const handleApproveSubmission = (submissionId: string, comment: string) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(sub =>
        sub.id === submissionId
          ? {
              ...sub,
              rewardStatus: 'Approved' as const,
              rewardSent: 'REWARD20OFF',
              approvalComment: comment
            }
          : sub
      )
    );
  };

  const handleRejectSubmission = (submissionId: string, reason: string) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(sub =>
        sub.id === submissionId
          ? {
              ...sub,
              rewardStatus: 'Rejected' as const,
              rewardSent: null,
              rejectionReason: reason
            }
          : sub
      )
    );
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'products':
        return (
          <ProductsTab 
            onTabChange={setActiveTab}
            products={products}
            setProducts={setProducts}
            categoriesState={categoriesState}
            setCategoriesState={setCategoriesState}
            onRedirectToStudio={(product) => {
              setSelectedProductForStudio(product);
              setActiveTab('studio');
            }}
          />
        );
      case 'studio':
        return (
          <StudioTab 
            products={products}
            selectedProductForStudio={selectedProductForStudio}
            setSelectedProductForStudio={setSelectedProductForStudio}
            onCollapseSidebar={() => setIsSidebarCollapsed(true)}
          />
        );
      case 'rewards-campaigns':
        return <RewardsCampaignsTab />;
      case 'smart-triggers':
        return <SmartTriggersTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'buyer-source-proof':
        return (
          <BuyerSourceProofTab 
            submissions={submissions}
            setSubmissions={setSubmissions}
            openSharedSubmissionDetailsModal={openSharedSubmissionDetailsModal}
            closeSharedSubmissionDetailsModal={closeSharedSubmissionDetailsModal}
          />
        );
      case 'qr-codes':
        return (
          <QrCodeManagerTab 
            products={products}
          />
        );
      case 'consumers':
        return (
          <ConsumersTab 
            submissions={submissions}
            openSharedSubmissionDetailsModal={openSharedSubmissionDetailsModal}
            closeSharedSubmissionDetailsModal={closeSharedSubmissionDetailsModal}
            onTabChange={setActiveTab}
          />
        );
      case 'reviews-manager':
        return (
          <ReviewsManagerTab />
        );
      case 'support':
        return (
          <SupportInboxTab />
        );
      case 'files':
        return (
          <FileManagerTab />
        );
      case 'settings':
        return (
          <SettingsTab />
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Published Page Route */}
        <Route path="/published-product/:slug" element={<PublishedPageViewer />} />
        
        {/* Main Application Route */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gray-50">
            <Sidebar 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebar}
            />
            
            <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
              <main className="min-h-screen">
                {renderContent()}
              </main>
            </div>
            
            {/* Shared Submission Details Modal */}
            <SubmissionDetailsModal
              submission={selectedSubmissionForModal}
              isOpen={showSharedSubmissionDetailsModal}
              onClose={closeSharedSubmissionDetailsModal}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
              onNavigate={navigateSubmission}
              currentIndex={currentSubmissionIndex}
              totalCount={filteredSubmissionsForModal.length}
              canNavigate={filteredSubmissionsForModal.length > 1}
            />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;