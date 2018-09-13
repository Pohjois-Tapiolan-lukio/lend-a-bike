const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const tokenData = jwt.verify(token, JWT_KEY);
    req.tokenData = tokenData;
    return next();
  } catch (error) {
    return res.status(403)
      .json({
        message: 'Token unauthorized',
      });
  }

/*  .then((result) => {
 *    req.tokenData = result;
 *    next();
 *  })
 *  .catch((error) => {
 *    console.error(error);
 *    res.status(400).json({
 *      message: 'Token failed verification',
 *    });
 *  });
 */
};

// vim: et ts=2 sw=2 :
