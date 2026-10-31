/**
 * Twilio & Bangladeshi SMS Gateway Webhook Integration Skeleton
 * Sends instant ticket booking confirmation and departure alerts
 */

export interface BookingSMSPayload {
  passengerPhone: string;
  passengerName: string;
  pnrNumber: string;
  operatorName: string;
  seats: string[];
  route: string;
  departureTime: string;
  boardingPoint: string;
}

export class NotificationService {
  /**
   * Send booking confirmation SMS via Twilio or Bangladeshi Bulk SMS Provider
   */
  async sendBookingConfirmationSMS(payload: BookingSMSPayload): Promise<{ success: boolean; messageId: string }> {
    const textBody = 
      `[Sohoj Jatra] Dear ${payload.passengerName}, your ticket for ${payload.operatorName} is CONFIRMED! ` +
      `PNR: ${payload.pnrNumber} | Seats: ${payload.seats.join(", ")} | Route: ${payload.route} | ` +
      `Boarding: ${payload.boardingPoint} @ ${payload.departureTime}. Show SMS at counter to board.`;

    console.log(`[SMS Gateway Dispatch] To: ${payload.passengerPhone} -> Content: ${textBody}`);

    // In production, execute Twilio REST API:
    // client.messages.create({ body: textBody, from: process.env.TWILIO_PHONE, to: payload.passengerPhone })
    // OR BD Local Gateway (Greenweb / ElitBuzz / BulkSMSBD):
    // fetch(`https://api.greenweb.com.bd/api.php?token=${TOKEN}&to=${payload.passengerPhone}&message=${encodeURIComponent(textBody)}`)

    return {
      success: true,
      messageId: `SM_MSG_${Date.now()}`,
    };
  }

  /**
   * Send OTP for passenger ticket retrieval
   */
  async sendVerificationOTP(phone: string, otp: string): Promise<boolean> {
    console.log(`[SMS OTP Dispatch] To: ${phone} -> OTP Code: ${otp} (Valid for 5 minutes)`);
    return true;
  }
}

export const notificationService = new NotificationService();
