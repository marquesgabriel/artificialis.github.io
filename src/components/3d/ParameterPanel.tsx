import {
  Box,
  TextField,
  Slider,
  Typography,
  InputAdornment,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import type { PrintObject } from '../../types';

interface Props<T extends Record<string, number>> {
  object: PrintObject<T>;
  raw: Record<string, string>;
  values: T;
  errors: Record<string, string>;
  onChange: (name: keyof T, value: string) => void;
  onBlur: (name: keyof T) => void;
}

export const ParameterPanel = <T extends Record<string, number>>({
  object,
  raw,
  values,
  errors,
  onChange,
  onBlur,
}: Props<T>) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      {object.fields.map((field) => {
        const key = field.name as string;
        const numVal = values[field.name] ?? field.min;
        const hasError = Boolean(errors[key]);

        return (
          <Box key={key}>
            {/* Label row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.75}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', fontWeight: 500 }}>
                  {t(field.labelKey)}
                </Typography>
                <Tooltip title={t('wallWarning')} placement="top" arrow>
                  <InfoOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary', opacity: 0.5, cursor: 'help' }} />
                </Tooltip>
              </Stack>
              <Chip
                label={`${field.unit}`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.65rem' }}
              />
            </Stack>

            {/* Slider + text field in a row */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Slider
                value={isNaN(numVal) ? field.min : Math.min(field.max, Math.max(field.min, numVal))}
                min={field.min}
                max={field.max}
                step={field.step}
                onChange={(_, v) => onChange(field.name, String(v as number))}
                sx={{ flex: 1 }}
                size="small"
              />
              <TextField
                value={raw[key] ?? ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                onBlur={() => onBlur(field.name)}
                error={hasError}
                helperText={hasError ? errors[key] : undefined}
                size="small"
                inputProps={{
                  min: field.min,
                  max: field.max,
                  step: field.step,
                  style: { textAlign: 'right', fontSize: '0.82rem', width: 54 },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption" color="text.secondary">
                        {field.unit}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{
                  sx: { fontSize: '0.65rem', mx: 0, mt: 0.5, lineHeight: 1.2 },
                }}
                sx={{ width: 110, flexShrink: 0 }}
              />
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};