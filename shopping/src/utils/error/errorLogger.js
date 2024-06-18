import winston from 'winston'

const errorLogger = winston.createLogger({
    level : 'info',
    format : winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
    transports : [
        new winston.transports.Console(),
        new winston.transports.File({filename : 'shooping_ms.logger'})
    ]
})

export { errorLogger }