export interface LoadingGlobal {
  isLoading: Ref<boolean>;
  setLoading: (state: boolean) => void;
}

export const LoadingGlobalKey = Symbol() as InjectionKey<LoadingGlobal>;
