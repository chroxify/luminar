import { useCallback } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';

type QueryParam = [string, string];

const useQueryParamRouter = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: ReadonlyURLSearchParams
) =>
  useCallback(
    (nameOrParams: string | QueryParam[], value?: string): void => {
      const params = new URLSearchParams(searchParams);

      const updateParam = (name: string, value: string) => {
        if (!value) {
          params.delete(name.toLowerCase());
        } else {
          params.set(name.toLowerCase(), value.toLowerCase());
        }
      };

      if (Array.isArray(nameOrParams)) {
        nameOrParams.forEach(([name, value]) => {
          updateParam(name, value);
        });
      } else if (typeof nameOrParams === 'string' && value !== undefined) {
        updateParam(nameOrParams, value);
      } else {
        return;
      }

      // Push the new query string to the router
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

export default useQueryParamRouter;
