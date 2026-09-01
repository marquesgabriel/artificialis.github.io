import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { OBJECTS } from './objects';
import { useParamForm } from './hooks/useParamForm';
import { Viewer3D, downloadSTL, ParameterPanel, Footer, AboutPage, SupportSidebar, Window } from './components';
import theme from './theme';
import type { PrintObject } from './types';

export function App() {
  const { t } = useTranslation();
  const [selectedObjectId, setSelectedObjectId] = useState(OBJECTS[0].id);

  const object = useMemo<PrintObject<Record<string, number>>>(() => {
    return OBJECTS.find((item) => item.id === selectedObjectId) ?? OBJECTS[0];
  }, [selectedObjectId]);

  const { values, raw, errors, isValid, handleChange, handleBlur, reset } = useParamForm(object);

  const handleObjectChange = (event: SelectChangeEvent<string>) => {
    setSelectedObjectId(event.target.value);
  };

  const handleDownload = () => {
    const geometry = object.buildGeometry(values, 80);
    downloadSTL(geometry, `${object.id}.stl`);
    geometry.dispose();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', color: 'text.primary', px: 2, py: 3 }}>
        <AboutPage />

        <Box
          component="header"
          sx={{ maxWidth: 1420, mx: 'auto', pb: 3, mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            {t('appTitle')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('appSubtitle')}
          </Typography>
        </Box>

        <Box
          sx={{
            maxWidth: 1420,
            mx: 'auto',
            display: 'grid',
            gap: 6,
            gridTemplateColumns: { xs: '1fr', lg: '720px 1fr' },
          }}
        >
          <Window title={t('parameters')}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="subtitle2">{t('objectSelector')}</Typography>
                  <Typography variant="h6">{t(object.labelKey)}</Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="object-select-label">{t('objectSelector')}</InputLabel>
                  <Select
                    labelId="object-select-label"
                    value={selectedObjectId}
                    label={t('objectSelector')}
                    onChange={handleObjectChange}
                  >
                    {OBJECTS.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {t(item.labelKey)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                  <Button variant="outlined" onClick={reset}>
                    {t('resetDefaults')}
                  </Button>
                  <Button variant="contained" disabled={!isValid} onClick={handleDownload}>
                    {t('downloadSTL')}
                  </Button>
                </Stack>
              </Stack>

              <ParameterPanel
                object={object}
                raw={raw}
                values={values}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Box>
          </Window>

          <Window title={t('preview')}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 560 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Typography variant="h6">{t('sectionDiagram')}</Typography>
                <Typography variant="caption">{t('dragToRotate')}</Typography>
              </Stack>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 460,
                  overflow: 'hidden',
                  backgroundColor: 'background.default',
                }}
              >
                <Viewer3D object={object} params={values} />
              </Box>
            </Box>
          </Window>
        </Box>

        <SupportSidebar />

        <Footer />
      </Box>
    </ThemeProvider>
  );
}
