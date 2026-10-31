/**
 * Nagad Payment Gateway Integration Skeleton
 * Direct Merchant Checkout API Architecture
 */

export class NagadGateway {
  private merchantId: string;
  private merchantPrivateKey: string;
  private nagadPublicKey: string;

  constructor() {
    this.merchantId = process.env.NAGAD_MERCHANT_ID || "MOCK_NAGAD_68201";
    this.merchantPrivateKey = process.env.NAGAD_PRIVATE_KEY || "dummy_private_key";
    this.nagadPublicKey = process.env.NAGAD_PUBLIC_KEY || "dummy_public_key";
  }

  async initializePayment(params: {
    orderId: string;
    amount: number;
    customerPhone: string;
    callbackUrl: string;
  }) {
    // 1. Generate encrypted sensitive data using RSA private key
    // 2. POST to /check-out/initialize/{merchantId}/{orderId}
    // 3. Return callback redirect URL to user
    return {
      status: "Success",
      orderId: params.orderId,
      callBackUrl: `https://sandbox.mynagad.com/remote-payment-gateway/checkout.html?payment_ref_id=NGD_${Date.now()}`,
    };
  }

  async verifyPayment(paymentRefId: string) {
    return {
      status: "Success",
      statusCode: "000",
      issuerPaymentRefNo: paymentRefId,
      amount: "3050",
    };
  }
}

export const nagadGateway = new NagadGateway();
