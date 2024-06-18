import winston from 'winston'

const errorLogger = winston.createLogger({
    level : 'info',
    format : winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    ), 
    transports : [
        new winston.transports.Console(),
        new winston.transports.File({filename : 'vendor_micorserive.logger'})
    ]
})

export { errorLogger }