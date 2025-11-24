// This is a mock payment function to simulate a payment process.
// In a real application, this would be an integration with a payment provider like Stripe or PayPal.

export const processPayment = (paymentDetails) => {
  console.log("Processing payment with details:", paymentDetails);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 90% success rate
      if (Math.random() < 0.9) {
        console.log("Payment successful!");
        resolve({
          success: true,
          transactionId: `txn_${Date.now()}`,
          amount: paymentDetails.totalAmount,
        });
      } else {
        console.error("Payment failed!");
        reject({
          success: false,
          message: "Payment failed. Please try again.",
        });
      }
    }, 2000); // Simulate a 2-second delay
  });
};
