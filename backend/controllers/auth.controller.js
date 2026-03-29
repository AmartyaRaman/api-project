import logger from '../config/logger.js';
import { signupSchema, signinSchema } from '../validations/auth.validation.js';
import bcrypt from 'bcrypt';
import db from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';


export const signup = async (req, res, next) => {
  try {
    // Validate the input in req.body
    const validationResult = signupSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: validationResult.error.errors,
      });
    }
    
    // Destructure the validated data
    const { name, email, password, role } = validationResult.data;

    const exisitingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (exisitingUser.length > 0)
      throw new Error('User with this email already exists');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a user in the database
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role})
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at
      });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      maxAge: 4 * 60 * 60 * 1000
    });

    logger.info(`Successfully created user with ID: ${newUser.id}`);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
      token
    });
  
  } catch (error) {
      logger.error("Sign-up error", error);

      if (error.message === 'User with this email already exists') {
        return res.status(409).json({
          message: 'User with this email already exists',
        });
      }

      next(error);
  }
}

export const signin = async (req, res, next) => {
  try {
    const validatedResult = signinSchema.safeParse(req.body);

    if (!validatedResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: validatedResult.error.errors,
      });
    }

    const { email, password } = validatedResult.data;

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email,
        role: user[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.cookie('token', token, {
      maxAge: 4 * 60 * 60 * 1000
    });

    logger.info(`Successfully logged in user with ID: ${user[0].id}`);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: user[0],
      token
    });
  } catch (error) {
    logger.error("Login failed", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('token');

    logger.info("Successfully logged out user");

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error("Logout failed!", error);

    next(error);
  }
}