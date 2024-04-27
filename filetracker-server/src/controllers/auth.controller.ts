import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { createUser } from "../services/user.services";
import config from '../config';
import { LoginUserRequest, LoginUserResponse, RegisterUserRequestBody, RegisterUserResponse } from '../interface/auth.interface';

/**
 * Register a new user with the provided information.
 *
 * @param {Request} req - The request object containing user data.
 * @param {Response} res - The response object for sending back the result.
 * @param {NextFunction} next - The next function to call in case of an error.
 * @return {Promise<void>} A promise that resolves after user registration.
 */
export const registerUser = async (
  req: Request<{}, {}, RegisterUserRequestBody>,
  res: Response<RegisterUserResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, device_id } =
      req.body;

    const user = await createUser(
      name,
      email,
      password,
      role,
      device_id
    );

    if (!user) {
       res.status(400).send({
        success: false,
        message: "User email already exists.",
      });
    }

     res.status(200).send({
       success: true,
       message: "User created successfully.",
     });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates a user by checking the provided email and password.
 *
 * @param {Request} req - The request object containing the user's email and password.
 * @param {Response} res - The response object used to send the login result.
 * @param {NextFunction} next - The next function to be called in the middleware chain.
 * @return {Promise<void>} - A promise that resolves when the login is successful or rejects with an error.
 */
export const loginUser = async (
  req: Request<{}, {}, LoginUserRequest>,
  res: Response<LoginUserResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find the user with the given verification token
    const user  = await User.findOne({ email }).lean();

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password.",
        token: null,
        user: null,
      });
    }

    const payload = {
      user_id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.secretKey, {
      expiresIn: "100h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: token,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
