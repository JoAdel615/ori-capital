/**
 * Official eCrypt / NMI-style test values (Payment API — Testing Information).
 * @see https://ecrypt.transactiongateway.com/merchants/resources/integration/integration_portal.php
 */

export const ECRYPT_SANDBOX_TEST_CARD = {
  /** Visa — use with expiration 10/25 (MMYY 1025) for test_mode=enabled */
  visa: "4111111111111111",
  mastercard: "5431111111111111",
  discover: "6011000991300009",
  americanExpress: "341111111111111",
  /** Per gateway docs: one-off test_mode + listed test cards use this expiration */
  expirationDisplay: "10/25",
  expirationMMYY: "1025",
  /** Doc: CVV 999 simulates CVV match in test */
  cvv: "999",
} as const;
