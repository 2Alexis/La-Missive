import { useEffect, useRef } from 'react';
import './AdSense.css';

/**
 * Composant Google AdSense réutilisable
 * 
 * Props :
 * - adSlot     : ton ID d'emplacement AdSense (ex: "1234567890")
 * - adFormat   : format de la pub ("auto", "horizontal", "rectangle", "vertical")
 * - adLayout   : layout optionnel (ex: "in-article")
 * - className  : classe CSS supplémentaire
 * - style      : style inline optionnel (pour contrôler la taille)
 */
export default function AdSense({
    adSlot,
    adFormat = 'auto',
    adLayout = '',
    className = '',
    style = { display: 'block' }
}) {
    const adRef = useRef(null);
    const pushed = useRef(false);

    useEffect(() => {
        // Évite de push la même pub deux fois (React StrictMode)
        if (pushed.current) return;

        try {
            if (window.adsbygoogle && adRef.current) {
                window.adsbygoogle.push({});
                pushed.current = true;
            }
        } catch (e) {
            console.warn('AdSense:', e.message);
        }
    }, []);

    return (
        <div className={`adsense-wrapper ${className}`}>
            <span className="adsense-label">Publicité</span>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-8721500275070460'}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-ad-layout={adLayout || undefined}
                data-full-width-responsive="true"
            />
        </div>
    );
}
