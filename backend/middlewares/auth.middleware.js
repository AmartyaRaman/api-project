import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

/**
 * Middleware to protect routes via JWT verification
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied',
      });
    }

    // 2. Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Attach user data to request
      req.user = decoded;
      next();
    } catch (err) {
      logger.error('JWT Verification Error', err);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    logger.error('Auth Middleware Error', error);
    next(error);
  }
};

/**
 * Middleware to restrict access to admin users only
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required',
    });
  }
};