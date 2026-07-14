import {
  Box,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = '2026'
  return (
    <Box component="footer" sx={{ maxWidth: 1420, mx: 'auto', mt: 6, pt: 3, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
      <Typography variant="body2" color="text.secondary">
        © {currentYear} Marques Gabriel
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
        <Link href="https://www.instagram.com/artificialis_" target="_blank" rel="noreferrer" underline="hover" color="text.secondary">
          {t('socialInstagram')}
        </Link>
        <Link href="https://www.printables.com/@artificialis" target="_blank" rel="noreferrer" underline="hover" color="text.secondary">
          {t('socialPrintables')}
        </Link>
        <Link href="https://buymeacoffee.com/marquesgabriel" target="_blank" rel="noreferrer" underline="hover" color="text.secondary">
          {t('socialBuyMeCoffee')}
        </Link>
      </Stack>
      <Link href="https://marquesgabriel.com.br" target="_blank" rel="noreferrer" underline="hover" color="text.secondary">
        marquesgabriel.com.br
      </Link>
    </Box>
  )
}