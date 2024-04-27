import { User } from "../models/User";
import { ROLES } from "../constants/role_permissions";
import config from "../config";
import bcrypt from "bcrypt";
/**
 *
 * Get user by filter
 *
 * @param { any } filter
 * @returns { any }
 */
export const getUser = async (filter: any): Promise<any> => {
  return await User.findOne(filter).lean().exec();
};

/**
 * Get user role
 *
 * @param { any } role
 * @param { any } account_type
 * @returns { string }
 */
export const getUserRole = (role: any): string => {
  if (role === "admin") {
    return ROLES.ADMIN;
  } else if (role === "editor") {
    return ROLES.EDITOR;
  } else if (role === "viewer") {
    return ROLES.VIEWER;
  }
};

/**
 * Creates a new user with the provided information.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} role - The role of the user.
 * @param {string} first_name - The first name of the user.
 * @param {string} last_name - The last name of the user.
 * @param {string} device_id - The device ID of the user.
 * @return {Promise<User>} The newly created user.
 */
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  device_id: string
) => {
  try {

    const userExists = await User.exists({ email });

    if (userExists) {
      throw new Error("User already exists");
    }

    const salt = config.salt;

    const hashPassword = await bcrypt.hash(password, Number(salt));

    const user = await User.create({
      name,
      email,
      role,
      password: hashPassword,
      device_id
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Checks if the given email is valid according to the RFC 5322 standard.
 *
 * @param {string} email - The email to be validated.
 * @return {Promise<boolean>} A promise that resolves to true if the email is valid, false otherwise.
 * @throws {Error} If there is an error during the validation process.
 */
export const checkValidEmail = async (email: string) => {
  try {
    const emailRegex =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (email.length > 254) return false;

    if (!emailRegex.test(email)) return false;

    const parts = email.split("@");

    if (parts[0].length > 64) return false;

    const domainParts = parts[1].split(".");

    if (domainParts.some((part) => part.length > 63)) return false;

    return true;
  } catch (error) {
    throw error;
  }
};
