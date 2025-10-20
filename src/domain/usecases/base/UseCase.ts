/**
 * Base interface for all use cases
 * Defines the contract for business logic operations
 */
export interface UseCase<TParams, TResult> {
  /**
   * Execute the use case with given parameters
   * @param params Input parameters for the use case
   * @returns Promise resolving to the use case result
   */
  execute(params: TParams): Promise<TResult>;
}

/**
 * Base interface for use cases without parameters
 */
export interface NoParamsUseCase<TResult> {
  /**
   * Execute the use case without parameters
   * @returns Promise resolving to the use case result
   */
  execute(): Promise<TResult>;
}

/**
 * Base interface for use cases without return value
 */
export interface VoidUseCase<TParams> {
  /**
   * Execute the use case with given parameters
   * @param params Input parameters for the use case
   * @returns Promise resolving when the operation completes
   */
  execute(params: TParams): Promise<void>;
}

/**
 * Base interface for use cases without parameters and return value
 */
export interface NoParamsVoidUseCase {
  /**
   * Execute the use case without parameters
   * @returns Promise resolving when the operation completes
   */
  execute(): Promise<void>;
}