import crypto from 'crypto';

export const webhookService = {
  /**
   * Dispatches a webhook request to a destination URL with an HMAC-SHA256 signature header.
   */
  async dispatch(url: string, payload: any, secret: string) {
    const payloadString = JSON.stringify(payload);
    
    // Generate signature using SHA256
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature-sha256': signature,
          'User-Agent': 'InteriorDesignPlatform-Webhook-Dispatcher/1.0',
        },
        body: payloadString,
      });

      if (!response.ok) {
        throw new Error(`Webhook endpoint returned HTTP ${response.status}`);
      }

      console.log(`[Webhook Success] Payload dispatched to ${url}`);
      return { success: true, status: response.status };
    } catch (error: any) {
      console.error(`[Webhook Failed] Error sending payload to ${url}:`, error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Helper to verify inbound webhook signatures (if we receive hooks).
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  },
};
