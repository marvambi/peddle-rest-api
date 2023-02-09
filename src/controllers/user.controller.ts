import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config();
import { User, UserInput } from '../models/user.model';
import Token from '../models/token.model';
// eslint-disable-next-line max-len
const secretz: any = !process.env.JWT_SECRET === undefined ? process.env.JWT_SECRET : '5ytjjfbPK8ZJ';
// Generate Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, secretz, { expiresIn: '1d' });
};
let salt;
const hashPassword = (password: string) => {
  salt = crypto.randomBytes(16).toString('hex');

  // Hashing salt & password with 100 iterations, 64 length and sha512 digest
  return crypto.pbkdf2Sync(password, salt, 100, 64, `sha512`).toString(`hex`);
};

const createUser = asyncHandler(async (req: any, res: any) => {
  const { email, enabled, fullName, password, role } = req.body;

  // Validation
  if (!email || !fullName || !password || !role) {
    return res.status(422).json({
      message: 'The fields email, fullName, password and role are required',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be up to 6 characters',
    });
  }

  // check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: 'Email has already been registered',
    });
  }

  const userInput: UserInput = {
    fullName,
    email,
    password: hashPassword(password),
    enabled,
    role,
    salt,
  };

  const userCreated = await User.create(userInput);

  //   Generate Token
  const token = generateToken(userCreated._id);
  // Send HTTP-only cookie

  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: 'none',
    secure: true,
  });
  if (userCreated) {
    const { _id, email, enabled, fullName, role } = userCreated;

    return res.status(201).json({
      data: {
        _id,
        fullName,
        email,
        enabled,
        role,
        token,
      },
    });
  } else {
    res.status(400).json({
      message: 'Invalid user data',
    });
  }
});

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().populate('role').sort('-createdAt').exec();

  if (!users.length) {
    return res.status(400).json({
      message: 'No users found',
    });
  }

  const data = users.map((us) => {
    const { _id, email, enabled, fullName, role } = us;

    return { _id, email, enabled, fullName, user_role: role['name'] };
  });

  return res.status(200).json({ data });
};

const getUser = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).populate('role').exec();

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }
  const { _id, email, enabled, fullName, role } = user;

  return res.status(200).json({
    data: {
      _id,
      fullName,
      email,
      enabled,
      role,
    },
  });
});

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { enabled, fullName, role } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  if (!fullName || !role) {
    // eslint-disable-next-line max-len
    return res.status(422).json({ message: 'The fields fullName and role are required' });
  }

  await User.updateOne({ _id: id }, { enabled, fullName, role });

  const userUpdated = await User.findById(id);

  return res.status(200).json({ data: userUpdated });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).json({ message: 'User deleted successfully.' });
};

// Login User
const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error('Please add email and password');
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: 'User not found, please signup',
    });
  }

  // User exists, check if password is correct
  // eslint-disable-next-line max-len
  const { salt } = user;
  // eslint-disable-next-line max-len
  const hash = crypto.pbkdf2Sync(password, salt, 100, 64, `sha512`).toString(`hex`);
  const passwordIsCorrect = hash === user.password ? true : false;

  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: 'none',
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, email, enabled, fullName, role } = user;

    return res.status(200).json({
      data: {
        _id,
        email,
        enabled,
        fullName,
        role,
        token,
      },
    });
  } else {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
});

// Logout User
const logout = asyncHandler(async (req: any, res: any) => {
  res.cookie('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).json({ message: 'Successfully Logged Out' });
});

// Get Login Status
const loginStatus = asyncHandler(async (req: any, res: any) => {
  const { token } = req.cookies;

  console.log('Cookies: ', token);
  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(404).json({ message: 'User does not exist' });
//   }

//   // Delete token if it exists in DB
//   const token = await Token.findOne({ userId: user?.id });

//   if (token) {
//     await token.deleteOne();
//   }

//   // Create Reset Token
//   const resetToken = crypto.randomBytes(32).toString('hex') + user._id;

//   console.log(resetToken);

//   // Hash token before saving to DB
//   // eslint-disable-next-line max-len
//   const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//   // Save Token to DB
//   await new Token({
//     userId: user?._id,
//     token: hashedToken,
//     createdAt: Date.now(),
//     expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
//   }).save();

//   // Construct Reset Url
//   const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

//   // Reset Email
//   const message = `
//       <h2>Hello ${user?.fullName}</h2>
//       <p>Please use the url below to reset your password</p>  
//       <p>This reset link is valid for only 30minutes.</p>
//       <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
//       <p>Regards...</p>
//       <p>Pinvent Team</p>
//     `;
//   const subject = 'Password Reset Request';
//   const send_to = user?.email;
//   const sent_from = process.env.EMAIL_USER;

//   try {
//     await sendEmail(subject, message, send_to, sent_from);
//     res.status(200).json({ success: true, message: 'Reset Email Sent' });
//   } catch (error) {
//     res.status(500);
//     throw new Error('Email not sent, please try again');
//   }
// });

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token, then compare to Token in DB
  // eslint-disable-next-line max-len
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // fIND tOKEN in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error('Invalid or Expired Token');
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userId });

  if (user) {
    user.password = hashPassword(password);
  }

  await user?.save();
  res.status(200).json({
    message: 'Password Reset Successful, Please Login',
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error('User not found, please signup');
  }
  //Validate
  if (!oldPassword || !password) {
    res.status(400).json({ message: 'Please add old and new password' });
  }

  const { salt } = user;
  // check if old password matches password in DB

  // eslint-disable-next-line max-len
  const oldhash = crypto.pbkdf2Sync(oldPassword, salt, 100, 64, `sha512`).toString(`hex`);
  const passwordIsCorrect = oldhash === user.password ? true : false;

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = hashPassword(password);
    await user.save();
    res.status(200).send('Password change successful');
  } else {
    res.status(400).json({ message: 'Your old password is incorrect' });
  }
});

// eslint-disable-next-line max-len
export { createUser, deleteUser, getAllUsers, getUser, updateUser, loginUser, logout, loginStatus, changePassword, resetPassword };
