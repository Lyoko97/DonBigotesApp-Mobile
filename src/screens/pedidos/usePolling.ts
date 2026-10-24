import { useEffect, useRef } from "react";
import { AppState } from "react-native";

// Cada cuánto se sincronizan los pedidos (igual que la web).
export const INTERVALO_SONDEO_MS = 10_000;

// Sondeo (polling): ejecuta `callback` al activarse, luego cada `intervaloMs`
// mientras la app esté en primer plano, y otra vez al volver a la app. Si la
// pantalla deja de estar visible (`activo = false`) o se desmonta, se limpia
// el intervalo para no gastar datos ni batería.
//
// Versión móvil de src/hooks/usePolling.ts de la web: allá se usa
// document.visibilityState; aquí, AppState de React Native.
export function usePolling(callback: () => unknown, intervaloMs = INTERVALO_SONDEO_MS, activo = true): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!activo) return;

    const ejecutarSiActiva = () => {
      if (AppState.currentState === "active") void callbackRef.current();
    };

    void callbackRef.current();
    const id = setInterval(ejecutarSiActiva, intervaloMs);
    const suscripcion = AppState.addEventListener("change", (estado) => {
      if (estado === "active") void callbackRef.current();
    });

    return () => {
      clearInterval(id);
      suscripcion.remove();
    };
  }, [intervaloMs, activo]);
}
