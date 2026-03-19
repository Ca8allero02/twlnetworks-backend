const rateLimit = require('express-rate-limit');

//Limite Global - protege toda la api
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 solicitudes por IP
    standardHeaders: true, // Devuelve información de límite en los encabezados `RateLimit-*`
    legacyHeaders: false, // Desactiva los encabezados `X-RateLimit-*`
    message: {ERROR: 'ES: Demasiadas peticiones. espera un momento por favor.//EN: Too many requests. Please wait a moment.'}
});

// lIMITE ESCRITO- solo para login y registro
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Limite de 10 solicitudes por IP
    standardHeaders: true, // Devuelve información de límite en los encabezados `RateLimit-*`
    legacyHeaders: false, // Desactiva los encabezados `X-RateLimit-*`
    message: {ERROR: 'ES: Demasiadas peticiones. espera un momento por favor.//EN: Too many requests. Please wait a moment.'}
});

// LIMITE PARA POSTULACIONES
const applicationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 5 solicitudes por IP
    standardHeaders: true, // Devuelve información de límite en los encabezados `RateLimit-*`
    legacyHeaders: false, // Desactiva los encabezados `X-RateLimit-*`
    message: {ERROR: 'ES: Demasiadas peticiones. espera un momento por favor.//EN: Too many requests. Please wait a moment.'}
});

module.exports = { globalLimiter, authLimiter, applicationLimiter };