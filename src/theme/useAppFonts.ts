import { useFonts } from 'expo-font';
import { Archivo_800ExtraBold } from '@expo-google-fonts/archivo';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import { IBMPlexMono_400Regular, IBMPlexMono_700Bold } from '@expo-google-fonts/ibm-plex-mono';

// Debe cargar exactamente los pesos usados por src/theme/tokens.ts
// (fontFamilies) — ni más ni menos, para no inflar el bundle con pesos que
// ningún estilo de texto referencia todavía.
export function useAppFonts() {
  return useFonts({
    Archivo_800ExtraBold,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_700Bold,
  });
}
