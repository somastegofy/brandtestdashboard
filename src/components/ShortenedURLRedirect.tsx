/**
 * Shortened URL Redirect Component
 * 
 * This component handles redirects from stego.fyi/{shortCode} URLs.
 * It looks up the original URL in Supabase and redirects the user.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShortenedURL, incrementShortenedURLClicks } from '../api/shortenedUrls';

export default function ShortenedURLRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setLoading(false);
        return;
      }

      try {
        // Get the original URL
        const originalUrl = await getShortenedURL(shortCode);

        if (!originalUrl) {
          setError('Shortened URL not found or expired');
          setLoading(false);
          return;
        }

        // Increment click count (don't wait for it)
        incrementShortenedURLClicks(shortCode).catch(err => {
          console.error('Failed to increment click count:', err);
        });

        // Redirect to the original URL
        window.location.replace(originalUrl);
      } catch (err: any) {
        console.error('Error redirecting:', err);
        setError(err.message || 'Failed to redirect');
        setLoading(false);
      }
    };

    redirect();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirect Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return null;
}

