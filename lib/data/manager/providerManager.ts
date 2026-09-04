import { dataEnv } from '@/lib/data/config/env';
import { dataHealthMonitor } from '@/lib/data/health/dataHealthMonitor';
import { dataLogger } from '@/lib/data/logs/dataLogger';
import { dataStatsTracker } from '@/lib/data/stats/dataStats';
import type { Sport } from '@/lib/data/types/domain';

export interface ProviderExecution<T> {
  id: string;
  enabled: boolean;
  timeoutMs?: number;
  execute: () => Promise<T>;
  isValid?: (value: T) => boolean;
}

export interface ProviderExecutionContext {
  sport: Sport;
  operation: string;
}

export interface ProviderExecutionResult<T> {
  data: T;
  providerId: string;
  usedFallback: boolean;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (timeoutMs <= 0) {
    return promise;
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Provider timeout after ${timeoutMs}ms`)), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export class ProviderManager {
  async executeWithFailover<T>(
    context: ProviderExecutionContext,
    providers: ProviderExecution<T>[],
  ): Promise<ProviderExecutionResult<T>> {
    const availableProviders = providers.filter((provider) => provider.enabled);

    let lastError: unknown = null;

    for (let index = 0; index < availableProviders.length; index += 1) {
      const provider = availableProviders[index];
      const startedAt = performance.now();

      try {
        const timeoutMs = provider.timeoutMs ?? dataEnv.providerTimeoutMs;
        const data = await withTimeout(provider.execute(), timeoutMs);
        const durationMs = Math.round(performance.now() - startedAt);

        if (provider.isValid && !provider.isValid(data)) {
          throw new Error('Provider returned invalid/empty data');
        }

        dataHealthMonitor.markSuccess(context.sport, provider.id, durationMs);
        dataStatsTracker.trackProviderSuccess(durationMs);

        const usedFallback = index > 0;
        if (usedFallback) {
          dataStatsTracker.trackFallbackActivation();
          dataHealthMonitor.markFallback(context.sport, provider.id);
          dataLogger.warn('Provider switched via failover', {
            provider: provider.id,
            operation: context.operation,
            durationMs,
            fallback: true,
          });
        } else {
          dataLogger.info('Provider resolved request', {
            provider: provider.id,
            operation: context.operation,
            durationMs,
            fallback: false,
          });
        }

        return {
          data,
          providerId: provider.id,
          usedFallback,
        };
      } catch (error) {
        const durationMs = Math.round(performance.now() - startedAt);
        lastError = error;
        dataHealthMonitor.markFailure(context.sport, provider.id, durationMs, error);
        dataStatsTracker.trackProviderFailure(durationMs);
        dataLogger.warn('Provider failed, trying next', {
          provider: provider.id,
          operation: context.operation,
          durationMs,
          fallback: true,
          error,
        });
      }
    }

    dataLogger.error('All providers failed', {
      operation: context.operation,
      fallback: true,
      error: lastError,
    });

    throw (lastError instanceof Error ? lastError : new Error('No providers available'));
  }
}

export const providerManager = new ProviderManager();
