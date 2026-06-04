import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export const authService = {
  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = nanoid(32);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        verificationToken,
        isVerified: false,
      },
    });

    // Send verification email (async)
    // await sendVerificationEmail(email, verificationToken);

    return { id: user.id, email: user.email, verificationSent: true };
  },

  async verifyEmail(verificationToken: string) {
    const user = await prisma.user.findUnique({
      where: { verificationToken },
    });

    if (!user || user.isVerified) {
      throw new Error('Invalid or expired token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    return { verified: true };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'jwt-secret-key-123',
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret-key-123',
      { expiresIn: '30d' }
    );

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        deviceFingerprint: 'browser',
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
      },
    };
  },

  async refreshToken(token: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken) {
      throw new Error('Invalid or missing refresh token');
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret-key-123'
      ) as { id: string };

      if (decoded.id !== storedToken.userId) {
        throw new Error('Token verification failed: Owner mismatch');
      }

      const accessToken = jwt.sign(
        { id: storedToken.user.id, email: storedToken.user.email },
        process.env.JWT_SECRET || 'jwt-secret-key-123',
        { expiresIn: '15m' }
      );
      const newRefreshToken = jwt.sign(
        { id: storedToken.user.id },
        process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret-key-123',
        { expiresIn: '30d' }
      );

      // Rotate refresh token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: storedToken.user.id,
          deviceFingerprint: 'browser',
        },
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      // Invalidate token on error
      await prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => {});
      throw new Error('Invalid token or verification expired');
    }
  },

  async logout(token: string) {
    await prisma.refreshToken.delete({
      where: { token },
    }).catch(() => {});
    return { success: true };
  }
};
