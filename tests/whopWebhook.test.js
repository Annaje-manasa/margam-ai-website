/**
 * tests/whopWebhook.test.js
 * 
 * Comprehensive automated test suite for Whop Webhook Amount Restriction ($130.00 - $149.00 USD).
 * Verifies all 11 required business and security scenarios.
 */

import crypto from 'node:crypto';
import {
  handleWhopWebhook,
  parseMoneyToCents,
  verifyWhopSignature,
  evaluatePaymentEmailEligibility,
  resetIdempotencyCache
} from '../server/whopWebhook.js';

const TEST_SECRET = 'ws_test_secret_key_1234567890';

function generateWhopSignature(rawBody, secret, msgId = 'msg_test_123', timestamp = Math.floor(Date.now() / 1000)) {
  const toSign = `${msgId}.${timestamp}.${rawBody}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(toSign, 'utf8');
  const base64Sig = hmac.digest('base64');
  return {
    headers: {
      'webhook-id': msgId,
      'webhook-timestamp': String(timestamp),
      'webhook-signature': `v1,${base64Sig}`
    }
  };
}

function createPaymentEvent({ amount, currency = 'usd', status = 'paid', action = 'payment.succeeded', id = 'pay_' + Math.random().toString(36).substring(7) }) {
  return {
    action,
    data: {
      id,
      status,
      currency,
      total: {
        amount: String(amount),
        currency: currency
      },
      amount: amount,
      user: {
        email: 'customer@example.com',
        name: 'John Doe'
      }
    }
  };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('--- RUNNING WHOP WEBHOOK AMOUNT RESTRICTION TESTS ---');
  console.log('======================================================\n');

  resetIdempotencyCache();

  // Test 1: Successful payment of $129.99 — email not sent
  console.log('Test 1: Successful payment of $129.99');
  {
    const event = createPaymentEvent({ amount: '129.99' });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.status === 200, 'Status code is 200');
    assert(res.body.emailSent === false, 'Email is NOT sent for $129.99');
    assert(res.body.reason.includes('outside the allowed'), 'Proper boundary rejection reason returned');
  }

  // Test 2: Successful payment of $130.00 — email sent
  console.log('\nTest 2: Successful payment of $130.00');
  {
    const event = createPaymentEvent({ amount: '130.00' });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.status === 200, 'Status code is 200');
    assert(res.body.emailSent === true, 'Email IS sent for $130.00 (inclusive lower bound)');
  }

  // Test 3: Successful payment of $135.00 — email sent
  console.log('\nTest 3: Successful payment of $135.00');
  {
    const event = createPaymentEvent({ amount: '135.00' });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.status === 200, 'Status code is 200');
    assert(res.body.emailSent === true, 'Email IS sent for $135.00 (mid-range)');
  }

  // Test 4: Successful payment of $149.00 — email sent
  console.log('\nTest 4: Successful payment of $149.00');
  {
    const event = createPaymentEvent({ amount: '149.00' });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.status === 200, 'Status code is 200');
    assert(res.body.emailSent === true, 'Email IS sent for $149.00 (inclusive upper bound)');
  }

  // Test 5: Successful payment of $149.01 — email not sent
  console.log('\nTest 5: Successful payment of $149.01');
  {
    const event = createPaymentEvent({ amount: '149.01' });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.status === 200, 'Status code is 200');
    assert(res.body.emailSent === false, 'Email is NOT sent for $149.01');
  }

  // Test 6: Successful payment of $150.00 — email not sent
  console.log('\nTest 6: Successful payment of $150.00');
  {
    const event = createPaymentEvent({ amount: '150.00' });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.status === 200, 'Status code is 200');
    assert(res.body.emailSent === false, 'Email is NOT sent for $150.00');
  }

  // Test 7: Successful payment of ₹135 or non-USD currency — email not sent
  console.log('\nTest 7: Successful payment of 135 in non-USD currency (INR & EUR)');
  {
    const eventINR = createPaymentEvent({ amount: '135.00', currency: 'inr' });
    const rawINR = JSON.stringify(eventINR);
    const { headers: headersINR } = generateWhopSignature(rawINR, TEST_SECRET);
    const resINR = await handleWhopWebhook(rawINR, headersINR, { secret: TEST_SECRET });

    assert(resINR.body.emailSent === false, 'Email is NOT sent for INR payment');
    assert(resINR.body.reason.includes('not USD'), 'Currency rejection reason returned');

    const eventEUR = createPaymentEvent({ amount: '140.00', currency: 'eur' });
    const rawEUR = JSON.stringify(eventEUR);
    const { headers: headersEUR } = generateWhopSignature(rawEUR, TEST_SECRET);
    const resEUR = await handleWhopWebhook(rawEUR, headersEUR, { secret: TEST_SECRET });

    assert(resEUR.body.emailSent === false, 'Email is NOT sent for EUR payment');
  }

  // Test 8: Failed payment of $135.00 — email not sent
  console.log('\nTest 8: Failed payment of $135.00');
  {
    const event = createPaymentEvent({ amount: '135.00', status: 'failed' });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.body.emailSent === false, 'Email is NOT sent for failed status');

    const failedAction = createPaymentEvent({ amount: '135.00', action: 'payment.failed' });
    const rawFailedAction = JSON.stringify(failedAction);
    const { headers: headersFailed } = generateWhopSignature(rawFailedAction, TEST_SECRET);
    const resFailed = await handleWhopWebhook(rawFailedAction, headersFailed, { secret: TEST_SECRET });

    assert(resFailed.body.emailSent === false, 'Email is NOT sent for payment.failed action');
  }

  // Test 9: Duplicate webhook for an eligible payment — email sent only once
  console.log('\nTest 9: Duplicate webhook for eligible payment ($149.00)');
  {
    const paymentId = 'pay_duplicate_test_' + Date.now();
    const event = createPaymentEvent({ amount: '149.00', id: paymentId });
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET, 'msg_dup_1');

    // First attempt
    const res1 = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });
    assert(res1.body.emailSent === true, 'First attempt sends email');

    // Second retry attempt (exact same paymentId)
    const res2 = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });
    assert(res2.body.emailSent === false, 'Second attempt DOES NOT send duplicate email');
    assert(res2.body.reason.includes('already processed'), 'Idempotency reason logged');
  }

  // Test 10: Missing amount or currency — email not sent
  console.log('\nTest 10: Missing amount or currency');
  {
    const missingAmount = {
      action: 'payment.succeeded',
      data: { id: 'pay_no_amt', status: 'paid', currency: 'usd' }
    };
    const rawNoAmt = JSON.stringify(missingAmount);
    const { headers: hNoAmt } = generateWhopSignature(rawNoAmt, TEST_SECRET);
    const resNoAmt = await handleWhopWebhook(rawNoAmt, hNoAmt, { secret: TEST_SECRET });
    assert(resNoAmt.body.emailSent === false, 'Email is NOT sent when amount is missing');

    const missingCurr = {
      action: 'payment.succeeded',
      data: { id: 'pay_no_curr', status: 'paid', amount: '135.00' }
    };
    const rawNoCurr = JSON.stringify(missingCurr);
    const { headers: hNoCurr } = generateWhopSignature(rawNoCurr, TEST_SECRET);
    const resNoCurr = await handleWhopWebhook(rawNoCurr, hNoCurr, { secret: TEST_SECRET });
    assert(resNoCurr.body.emailSent === false, 'Email is NOT sent when currency is missing');
  }

  // Test 11: Invalid webhook signature — rejected with 401
  console.log('\nTest 11: Invalid webhook signature');
  {
    const event = createPaymentEvent({ amount: '149.00' });
    const rawBody = JSON.stringify(event);
    const badHeaders = {
      'webhook-id': 'msg_invalid',
      'webhook-timestamp': String(Math.floor(Date.now() / 1000)),
      'webhook-signature': 'v1,INVALID_BASE64_SIGNATURE_STRING'
    };
    const res = await handleWhopWebhook(rawBody, badHeaders, { secret: TEST_SECRET });

    assert(res.status === 401, 'Status code is 401 Unauthorized for invalid signature');
    assert(res.body.error === 'Invalid webhook signature', 'Invalid signature error returned');
  }

  // Additional Helper Test: Integer cents parsing precision
  console.log('\nTest 12: Integer cents parsing unit tests');
  {
    assert(parseMoneyToCents('129.99') === 12999, 'parseMoneyToCents("129.99") === 12999');
    assert(parseMoneyToCents('130.00') === 13000, 'parseMoneyToCents("130.00") === 13000');
    assert(parseMoneyToCents('130.50') === 13050, 'parseMoneyToCents("130.50") === 13050');
    assert(parseMoneyToCents('135.00') === 13500, 'parseMoneyToCents("135.00") === 13500');
    assert(parseMoneyToCents('149.00') === 14900, 'parseMoneyToCents("149.00") === 14900');
    assert(parseMoneyToCents('149.01') === 14901, 'parseMoneyToCents("149.01") === 14901');
    assert(parseMoneyToCents('150.00') === 15000, 'parseMoneyToCents("150.00") === 15000');
    assert(parseMoneyToCents(14900) === 14900, 'parseMoneyToCents(14900) === 14900 (cents format)');
    assert(parseMoneyToCents(149.00) === 14900, 'parseMoneyToCents(149.00) === 14900 (numeric)');
    assert(parseMoneyToCents(null) === null, 'parseMoneyToCents(null) === null');
    assert(parseMoneyToCents('invalid') === null, 'parseMoneyToCents("invalid") === null');
  }

  // Test 13: Dynamic Whop Product/Plan ID (allows coupons & price updates from Whop directly)
  console.log('\nTest 13: Dynamic Whop Product pricing for coupons (e.g. $74.50 or $199.00)');
  {
    const event = createPaymentEvent({ amount: '74.50' });
    event.data.product_id = 'prod_kTZnTlPjQOm5P';
    const rawBody = JSON.stringify(event);
    const { headers } = generateWhopSignature(rawBody, TEST_SECRET);
    const res = await handleWhopWebhook(rawBody, headers, { secret: TEST_SECRET });

    assert(res.status === 200, 'Status code is 200');
    assert(res.body.emailSent === true, 'Email IS sent for $74.50 when matched with Whop product ID');
  }

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
