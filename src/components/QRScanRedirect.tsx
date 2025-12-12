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

        // 1. First check if linked to a Studio Page (Internal)
        const pageLink = await getPageByQRCodeId(qrId);

        // Increment scan count regardless of destination
        incrementQRCodeScans(qrId).catch(err => {
          console.error('Error incrementing QR code scans:', err);
        });

        if (pageLink && pageLink.studio_page_id) {
          // Load the published page by ID to get the slug
          const pageData = await loadStudioPageById(pageLink.studio_page_id);

          if (pageData && pageData.status === 'published') {
            navigate(`/published-product/${pageData.slug}`, { replace: true });
            return;
          }
        }

        // 2. Fallback: Check for generic destination URL in qr_codes table (Dynamic External)
        const { loadQRCodeById } = await import('../api/qrCodes'); // Lazy load to avoid circular deps if any
        const qrData = await loadQRCodeById(qrId);

        if (qrData && qrData.url) {
          // Validate URL to prevent XSS/bad redirects
          let targetUrl = qrData.url;
          if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
          }

          // External redirect
          window.location.replace(targetUrl);
          return;
        }

        setError('QR code not linked to any active page or URL');
        setLoading(false);
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

