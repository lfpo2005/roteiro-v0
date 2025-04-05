import { logger } from './logger';

/**
 * Função para enviar logs para a Vercel em produção
 * Integra com nosso sistema de logs existente
 */
export function setupVercelProductionLogs() {
    // Só execute em ambiente de produção na Vercel
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        return;
    }

    // Substitui o método de log original para incluir envio para a Vercel
    const originalError = logger.error;
    const originalInfo = logger.info;
    const originalWarning = logger.warning;
    const originalSuccess = logger.success;

    // Sobrescreve o método de erro
    logger.error = function (message: string, module?: string, details?: any) {
        // Chama o método original
        originalError.call(logger, message, module, details);

        // Log para console que a Vercel captura automaticamente
        console.error(
            JSON.stringify({
                level: 'error',
                message,
                module,
                details,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                vercel: true
            })
        );
    };

    // Sobrescreve o método de info
    logger.info = function (message: string, module?: string, details?: any) {
        // Chama o método original
        originalInfo.call(logger, message, module, details);

        // Log para console que a Vercel captura automaticamente
        console.log(
            JSON.stringify({
                level: 'info',
                message,
                module,
                details,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                vercel: true
            })
        );
    };

    // Sobrescreve o método de warning
    logger.warning = function (message: string, module?: string, details?: any) {
        // Chama o método original
        originalWarning.call(logger, message, module, details);

        // Log para console que a Vercel captura automaticamente
        console.warn(
            JSON.stringify({
                level: 'warning',
                message,
                module,
                details,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                vercel: true
            })
        );
    };

    // Sobrescreve o método de success
    logger.success = function (message: string, module?: string, details?: any) {
        // Chama o método original
        originalSuccess.call(logger, message, module, details);

        // Log para console que a Vercel captura automaticamente
        console.log(
            JSON.stringify({
                level: 'success',
                message,
                module,
                details,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                vercel: true
            })
        );
    };

    // Log indicando que a integração foi ativada
    logger.info('Vercel Production Logging ativado', 'vercel-logger');
}

/**
 * Função para registrar erros não capturados em produção
 */
export function setupUncaughtErrorLogger() {
    if (typeof window !== 'undefined') {
        // Captura erros não tratados no navegador
        window.addEventListener('error', (event) => {
            logger.error('Erro não capturado no frontend', 'global', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event?.error?.stack,
            });
        });

        // Captura promessas rejeitadas não tratadas
        window.addEventListener('unhandledrejection', (event) => {
            logger.error('Promessa rejeitada não tratada', 'global', {
                reason: event.reason?.message || event.reason,
                stack: event.reason?.stack,
            });
        });
    }
} 