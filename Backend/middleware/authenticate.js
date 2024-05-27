const authenticate = (req, res, next) => {
    const apiSecretKey = process.env.API_SECRET_KEY;
    const userApiKey = req.headers['x-api-key'];
  
    if (!userApiKey || userApiKey !== apiSecretKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    next();
  };
  
  module.exports = authenticate;