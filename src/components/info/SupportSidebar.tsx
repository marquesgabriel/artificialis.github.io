import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CONSENT_STORAGE_KEY = 'artificialis.github.io:cookie-consent';
const ADSENSE_PUBLISHER_ID = import.meta.env.REACT_APP_ADSENSE_PUBLISHER_ID;

type Consent = 'accepted' | 'declined' | null;

function loadConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === 'accepted' || stored === 'declined' ? stored : null;
  } catch {
    return null;
  }
}

// AdSense's script must only load after the user consents (legal
// requirement, not just a nicety) - same pattern as mtg/portfolio's
// SupportSidebar.
function AdSlot() {
  useEffect(() => {
    if (!ADSENSE_PUBLISHER_ID) return;

    if (!document.querySelector('script[data-adsbygoogle-loader]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-adsbygoogle-loader', 'true');
      document.head.appendChild(script);
    }

    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // AdSense script failed to initialize the slot - nothing to recover here
    }
  }, []);

  return (
    <Box>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Box>
  );
}

export const SupportSidebar = () => {
  const { t } = useTranslation();
  // No Publisher ID configured (e.g. local dev without the build var set) -
  // render nothing rather than showing a consent prompt for ads that can't load.
  const [consent, setConsent] = useState<Consent>(() => loadConsent());

  if (!ADSENSE_PUBLISHER_ID) return null;

  const handleConsent = (value: 'accepted' | 'declined') => {
    setConsent(value);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // localStorage unavailable - consent choice just won't persist across reloads
    }
  };

  return (
    <Box sx={{ maxWidth: 1420, mx: 'auto', mt: 3 }}>
      {consent === 'accepted' && <AdSlot />}

      {consent === null && (
        <Paper sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Typography variant="body2" color="text.secondary">
              {t('adsConsentPrompt')}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={() => handleConsent('accepted')}>
                {t('adsAccept')}
              </Button>
              <Button size="small" variant="outlined" onClick={() => handleConsent('declined')}>
                {t('adsDecline')}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};
