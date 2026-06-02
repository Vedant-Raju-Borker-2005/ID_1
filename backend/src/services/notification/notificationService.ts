import { prisma } from '../../lib/prisma';

export const notificationService = {
  async createNotification(userId: string, title: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info', actionUrl?: string) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        actionUrl,
        read: false,
      },
    });

    // In a real-world application, here you would push this notification to connected WebSockets
    // e.g. wssServer.sendToUser(userId, 'notification', notification);
    console.log(`[Notification Created for User ${userId}]: ${title} - ${message}`);

    return notification;
  },

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  },

  async markAsRead(id: string, userId: string) {
    return prisma.notification.update({
      where: { id, userId },
      data: { read: true },
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },

  async dismiss(id: string, userId: string) {
    return prisma.notification.delete({
      where: { id, userId },
    });
  },

  async sendEmail(to: string, subject: string, body: string) {
    // Simulated email service
    console.log(`[EMAIL DISPATCH] To: ${to} | Subject: ${subject} | Body: ${body.substring(0, 100)}...`);
    return { success: true };
  },
};
