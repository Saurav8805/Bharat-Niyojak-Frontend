'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Define the init function
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
        console.log('Google Translate initialized successfully');
      }
    };

    // Load Google Translate script if not already loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Add CSS to hide Google branding
    if (!document.getElementById('google-translate-styles')) {
      const style = document.createElement('style');
      style.id = 'google-translate-styles';
      style.innerHTML = `
        /* Hide Google Translate banner and branding */
        .goog-te-banner-frame.skiptranslate { 
          display: none !important; 
        }
        body { 
          top: 0 !important; 
        }
        #google_translate_element { 
          display: none !important; 
        }
        .goog-te-gadget { 
          display: none !important; 
        }
        .skiptranslate iframe { 
          display: none !important; 
        }
        .goog-logo-link { 
          display: none !important; 
        }
        .goog-te-balloon-frame { 
          display: none !important; 
        }
        .goog-te-gadget span {
          display: none !important;
        }
        body.translated-ltr { 
          top: 0 !important; 
        }
        
        /* Hide Google Translate feedback popup */
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
          display: none !important;
        }
        .VIpgJd-ZVi9od-aZ2wEe-OiiCO {
          display: none !important;
        }
        .goog-te-spinner-pos {
          display: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        .goog-te-ftab {
          display: none !important;
        }
        .goog-te-menu-value {
          display: none !important;
        }
        .goog-te-menu-frame {
          display: none !important;
        }
        
        /* Hide all Google Translate iframes and popups */
        iframe[id^="goog-gt-"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return <div id="google_translate_element"></div>;
}
