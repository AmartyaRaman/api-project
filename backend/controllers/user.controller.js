import db from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Admin function to fetch all users and their associated tasks
 */
export const getAllUsersAndTasks = async (req, res, next) => {
  try {
    const results = await db.query.users.findMany({
      where: (users, { ne }) => ne(users.role, 'admin'),
      with: {
        tasks: true,
      },
      // Optionally exclude sensitive fields like password
      columns: {
        password: false,
      }
    });

    logger.info(`Admin ${req.user.email} fetched all users and tasks`);

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    logger.error('Error fetching all users and tasks', error);
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, req.user.id),
      columns: {
        password: false,
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Error fetching user profile', error);
    next(error);
  }
};
