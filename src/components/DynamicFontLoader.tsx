import React, { useEffect } from 'react';
import { useAppText } from '../lib/store';

export default function DynamicFontLoader() {
  const [titleFontFamily] = useAppText('titleFontFamily', 'DM Serif Display');
  const [titleFontUrl] = useAppText('titleFontUrl', '');
  const [subtitleFontFamily] = useAppText('subtitleFontFamily', 'Great Vibes');
  const [subtitleFontUrl] = useAppText('subtitleFontUrl', '');
  const [contentFontFamily] = useAppText('contentFontFamily', 'Inter');
  const [contentFontUrl] = useAppText('contentFontUrl', '');

  useEffect(() => {
    const styleId = 'dynamic-fonts-style';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    let css = '';

    if (titleFontUrl && titleFontFamily) {
      css += `
        @font-face {
          font-family: '${titleFontFamily}';
          src: url('${titleFontUrl}');
        }
      `;
    }

    if (subtitleFontUrl && subtitleFontFamily) {
      css += `
        @font-face {
          font-family: '${subtitleFontFamily}';
          src: url('${subtitleFontUrl}');
        }
      `;
    }

    if (contentFontUrl && contentFontFamily) {
      css += `
        @font-face {
          font-family: '${contentFontFamily}';
          src: url('${contentFontUrl}');
        }
      `;
    }

    // Apply to variables
    css += `
      :root {
        --font-title: '${titleFontFamily}', serif;
        --font-subtitle: '${subtitleFontFamily}', cursive;
        --font-content: '${contentFontFamily}', sans-serif;
      }
    `;

    styleElement.innerHTML = css;
  }, [titleFontFamily, titleFontUrl, subtitleFontFamily, subtitleFontUrl, contentFontFamily, contentFontUrl]);

  return null;
}
