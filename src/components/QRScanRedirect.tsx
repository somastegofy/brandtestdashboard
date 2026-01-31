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
 * 
 * Supports URL formats:
 * - /qr/:qrId (legacy)
 * - /:brandname/:type/:qrId (new format)
 */
const QRScanRedirect: React.FC = () => {
  const { qrId, brandname, type } = useParams<{ 
    qrId?: string; 
    brandname?: string; 
    type?: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Prevent infinite loops - only run once
    if (hasRedirected) {
      return;
    }

    const handleRedirect = async () => {
      // QR ID is available in both old (/qr/:qrId) and new (/:brandname/:type/:qrId) formats
      if (!qrId) {
        setError('No QR code ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setHasRedirected(true); // Mark as redirected to prevent re-running

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
          // Validate URL to prevent XSS/bad redirects and infinite loops
          let targetUrl = qrData.url;
          
          // If URL is internal (starts with /), make it absolute
          if (targetUrl.startsWith('/')) {
            targetUrl = window.location.origin + targetUrl;
          } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
          }

          // CRITICAL: Prevent infinite loop - check if target URL matches QR redirect pattern
          const currentUrl = window.location.href;
          const targetUrlObj = new URL(targetUrl);
          const currentUrlObj = new URL(currentUrl);
          
          // Check if target URL is a QR redirect URL
          const pathParts = targetUrlObj.pathname.split('/').filter(Boolean);
          const isQRRedirectUrl = targetUrlObj.pathname.startsWith('/qr/') || 
                                  (pathParts.length === 3 && pathParts[2]); // /brandname/type/qrId
          
          // Check if it's pointing to THIS specific QR code (actual loop)
          const isPointingToSelf = isQRRedirectUrl && 
                                   targetUrlObj.origin === currentUrlObj.origin &&
                                   (targetUrlObj.pathname === currentUrlObj.pathname || 
                                    (pathParts.length === 3 && pathParts[2] === qrId));
          
          if (isPointingToSelf) {
            // This QR code is pointing to itself - this is a real loop
            // This happens when the database has the redirect URL stored instead of destination URL
            console.error('QR code loop detected - database has redirect URL stored:', {
              qrId,
              storedUrl: qrData.url,
              targetUrl,
              currentUrl
            });
            setError(`QR code configuration error: The stored URL (${qrData.url}) is a redirect URL, not a destination URL. This QR code was likely created before the fix. Please edit this QR code and update the destination URL to the actual target (e.g., https://stegofy.com) instead of the redirect URL.`);
            setLoading(false);
            return;
          }
          
          // If it's a QR redirect URL but not pointing to self, it might be an old format
          // or pointing to another QR code (which is allowed)
          if (isQRRedirectUrl && targetUrlObj.origin === currentUrlObj.origin) {
            console.warn('QR code points to another QR redirect URL:', targetUrl);
            // Still redirect - might be intentional chaining
          }

          // External redirect using window.location.replace to prevent history issues
          window.location.replace(targetUrl);
          return;
        }

        setError('QR code not linked to any active page or URL');
        setLoading(false);
      } catch (err: any) {
        console.error('Error redirecting from QR code:', err);
        setError(err.message || 'Failed to redirect');
        setLoading(false);
        setHasRedirected(false); // Allow retry on error
      }
    };

    handleRedirect();
  }, [qrId, brandname, type, navigate, hasRedirected]);

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

