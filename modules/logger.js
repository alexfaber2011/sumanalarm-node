/**
 * Created by alexfaber on 4/20/15.
 */
winston = require('winston');
require('winston-papertrail').Papertrail;

var logger = new winston.Logger({
    transports: [
        new winston.transports.Papertrail({
            host: 'logs2.papertrailapp.com',
            port: 53195,
            logFormat: function(level, message) {
                return '<<<SumanAlarm>>> ' + message;
            }
        })
    ]
});

exports.log = function(app) {
    return app.use(function(req, res, next) {
        logger.info('============ REQUEST ============');
        logger.info('headers: ' + JSON.stringify(req.headers));
        logger.info('params: ' + JSON.stringify(req.params));
        logger.info('query: ' + JSON.stringify(req.query));
        logger.info('body: ' + JSON.stringify(req.body));
        logger.info('url: ' + req.url);
        logger.info('method: ' + req.method.toString());
        logger.info('============   END   ============');
        logger.info();
        return next();
    });
};