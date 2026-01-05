import { useEffect } from 'react';

/**
 * Hook to update document title and meta tags dynamically
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    
    // Update title
    document.title = title;
    
    // Update meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);
    
    // Update Open Graph description if provided
    if (description) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', description);
    }
    
    // Cleanup: restore previous title on unmount
    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}

