const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile)

module.exports = function(app, logger) {
    app.post('/essign', async (req, res) => {

        try {
            const infos = await readFileAsync('./data.json', 'utf-8')

            if(infos && req.body && req.body["fno"]) {
                let info = JSON.parse(infos);
                logger.debug(`test data => ${info["VERIFY_INFO"][req.body["fno"]]["expires_in"]}`)
            }
        }
        catch (e) {
            logger.error(e)
        }
        finally {
            res.json({
                'message' : 'hello world'
            })
        }        
    })
    app.post('/essign/verify', (req, res) => {
        logger.debug(createLogMsg(0, 'test', req, 'test-message2'))
    })
}