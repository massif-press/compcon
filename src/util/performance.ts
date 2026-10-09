import type { Metric } from 'web-vitals'

/**
 * Reports Core Web Vitals metrics.
 *
 * In development, metrics are logged to the console for debugging.
 *
 * Tracked metrics:
 *  - CLS  (Cumulative Layout Shift)   ---- target < 0.1
 *  - INP  (Interaction to Next Paint) ---- target < 200ms
 *  - FCP  (First Contentful Paint)
 *  - LCP  (Largest Contentful Paint)  ---- target < 2.5s
 *  - TTFB (Time to First Byte)
 */
export function reportWebVitals(): void {
  if (typeof window === 'undefined') return

  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    const report = (metric: Metric): void => {
      if (import.meta.env.DEV) {
        console.info(`[Web Vitals] ${metric.name}: ${metric.value}`)
      }
    }

    onCLS(report)
    onINP(report)
    onFCP(report)
    onLCP(report)
    onTTFB(report)
  })
}
