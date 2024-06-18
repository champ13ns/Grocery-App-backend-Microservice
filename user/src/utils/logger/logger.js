import winston from 'winston'

const logger = winston.createLogger({
    level : 'info',
    format : winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports : [
        new winston.transports.Console(),
        new winston.transports.File({ filename :'user-microservie.log'}),
    ]

})

export { logger }