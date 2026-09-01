import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { Window } from '../chrome';

export const AboutPage = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
    await i18n.changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 1420, mx: 'auto', mb: 4 }}>
      <Window title={t('appTitle')}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={3}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, maxWidth: 760 }}>
              {t('introDescription')}
            </Typography>
          </Box>

          <Stack spacing={1.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="language-select-label-top">{t('langLabel')}</InputLabel>
              <Select
                labelId="language-select-label-top"
                value={i18n.language}
                label={t('langLabel')}
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="pt">PT</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Window>
    </Box>
  );
};
