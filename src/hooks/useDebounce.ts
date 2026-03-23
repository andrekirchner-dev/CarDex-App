import { useState, useEffect } from "react";

/**
 * Adia a atualização de um valor por `delay` ms.
 * Ideal para evitar chamadas de API a cada tecla digitada.
 *
 * Exemplo:
 *   const debouncedSearch = useDebounce(searchInput, 400);
 *   // debouncedSearch só muda 400ms após o usuário parar de digitar
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
