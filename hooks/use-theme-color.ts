import { Colors } from '@/constants/theme';

export function useThemeColor(
  _props: { light?: string; dark?: string },
  _colorName: keyof typeof Colors
): string {
  return Colors.textPrimary;
}
