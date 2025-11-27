import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { getPageByQRCodeId, incrementQRCodeScans } from '../api/qrCodes';
import { loadStudioPageById } from '../api/studioPages';

/**
 * QR Scan Redirect Component
 * 
 * When a QR code is scanned, this component:
 * 1. Looks up the QR code and linked studio page
 * 2. Increments the scan count
 * 3. Redirects to the published landing page
 */
const QRScanRedirect: React.FC = () => {
  const { qrId } = useParams<{ qrId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!qrId) {
        setError('No QR code ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get the linked studio page from QR code
        const pageLink = await getPageByQRCodeId(qrId);
        
        if (!pageLink || !pageLink.studio_page_id) {
          setError('QR code not linked to any page');
          setLoading(false);
          return;
        }

        // Increment scan count (fire and forget - don't wait for it)
        incrementQRCodeScans(qrId).catch(err => {
          console.error('Error incrementing QR code scans:', err);
        });

        // Load the published page by ID to get the slug
        const pageData = await loadStudioPageById(pageLink.studio_page_id);
        
        if (!pageData || pageData.status !== 'published') {
          setError('Linked page not found or not published');
          setLoading(false);
          return;
        }

        // Redirect to published page using slug
        navigate(`/published-product/${pageData.slug}`, { replace: true });
      } catch (err: any) {
        console.error('Error redirecting from QR code:', err);
        setError(err.message || 'Failed to redirect');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [qrId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirect Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return null; // Should redirect before rendering
};

export default QRScanRedirect;

