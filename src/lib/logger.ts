/**
 * Logger para monitorar eventos da aplicação
 */

interface LogOptions {
    type: 'info' | 'warning' | 'error' | 'success';
    module: string;
    details?: Record<string, any>;
}

/**
 * Registra um evento no console e, em produção, potencialmente em um serviço de monitoramento
 */
export function log(message: string, options: LogOptions) {
    const timestamp = new Date().toISOString();
    const logData = {
        timestamp,
        message,
        ...options,
    };

    // Em desenvolvimento, mostra no console com cores
    if (process.env.NODE_ENV !== 'production') {
        const color = getConsoleColor(options.type);
        console.log(
            `%c[${timestamp}] [${options.type.toUpperCase()}] [${options.module}] ${message}`,
            `color: ${color}; font-weight: bold;`,
            options.details || ''
        );
        return;
    }

    // Em produção, poderia enviar para um serviço de monitoramento
    // como Sentry, Datadog, etc.
    console.log(JSON.stringify(logData));
}

/**
 * Obtém a cor apropriada para o tipo de log
 */
function getConsoleColor(type: LogOptions['type']): string {
    switch (type) {
        case 'info':
            return '#3498db'; // Azul
        case 'warning':
            return '#f39c12'; // Laranja
        case 'error':
            return '#e74c3c'; // Vermelho
        case 'success':
            return '#2ecc71'; // Verde
        default:
            return '#3498db'; // Azul padrão
    }
}

/**
 * Atalhos para tipos específicos de log
 */
export const logger = {
    info: (message: string, module: string, details?: Record<string, any>) =>
        log(message, { type: 'info', module, details }),

    warning: (message: string, module: string, details?: Record<string, any>) =>
        log(message, { type: 'warning', module, details }),

    error: (message: string, module: string, details?: Record<string, any>) =>
        log(message, { type: 'error', module, details }),

    success: (message: string, module: string, details?: Record<string, any>) =>
        log(message, { type: 'success', module, details }),

    auth: {
        login: (userId: string, email: string) =>
            log('Usuário fez login', {
                type: 'info',
                module: 'auth',
                details: { userId, email, action: 'login' }
            }),

        logout: (userId: string, email: string) =>
            log('Usuário fez logout', {
                type: 'info',
                module: 'auth',
                details: { userId, email, action: 'logout' }
            }),

        signup: (userId: string, email: string) =>
            log('Novo usuário registrado', {
                type: 'success',
                module: 'auth',
                details: { userId, email, action: 'signup' }
            }),
    }
}; 