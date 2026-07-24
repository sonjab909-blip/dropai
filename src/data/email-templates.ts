// ── Email Template Types ─────────────────────────────────────────────────────────

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  placeholders: string[];
  category: "welcome" | "abandoned-cart" | "newsletter" | "order-confirmation";
}

// ── Welcome Email ────────────────────────────────────────────────────────────────

const welcomeEmail: EmailTemplate = {
  id: "welcome",
  name: "Welcome Email",
  description: "Sent to new subscribers — introduces them to DropAI and offers a discount.",
  subject: "Welcome to DropAI! 🎉 Here's 10% off your first order",
  body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #7c3aed);">
        <div style="color: white; font-size: 24px; line-height: 48px; text-align: center;">⚡</div>
      </div>
      <h1 style="color: #111827; font-size: 28px; margin-top: 16px; margin-bottom: 8px;">Welcome to DropAI! 🎉</h1>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Thanks for joining {{email}} — you're now part of the AI-powered dropshipping revolution!</p>
    </div>

    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Here's what you get:</h2>
      <ul style="color: #374151; font-size: 15px; line-height: 1.8; padding-left: 20px;">
        <li><strong>🚀 Exclusive Deals</strong> — Early access to new products and limited-time offers</li>
        <li><strong>🤖 AI-Powered Tips</strong> — Smart dropshipping strategies delivered to your inbox</li>
        <li><strong>📦 Free Shipping</strong> — On orders over $50</li>
        <li><strong>🔒 Secure Shopping</strong> — 100% encrypted checkout</li>
      </ul>

      <div style="text-align: center; margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #eef2ff, #ede9fe); border-radius: 12px;">
        <p style="color: #4f46e5; font-size: 14px; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Your Welcome Discount</p>
        <p style="color: #111827; font-size: 36px; font-weight: 800; margin: 8px 0;">WELCOME10</p>
        <p style="color: #6b7280; font-size: 14px; margin: 0;">Use code <strong style="color: #4f46e5;">WELCOME10</strong> at checkout to save 10%</p>
      </div>

      <div style="text-align: center;">
        <a href="{{shopUrl}}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;">Start Shopping Now →</a>
      </div>
    </div>

    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p>You received this email because you subscribed to DropAI.</p>
      <p><a href="{{unsubscribeUrl}}" style="color: #6b7280;">Unsubscribe</a> anytime.</p>
      <p style="margin-top: 8px;">&copy; 2026 DropAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
  placeholders: ["email", "shopUrl", "unsubscribeUrl", "discountCode"],
  category: "welcome",
};

// ── Abandoned Cart Email ─────────────────────────────────────────────────────────

const abandonedCartEmail: EmailTemplate = {
  id: "abandoned-cart",
  name: "Abandoned Cart Recovery",
  description: "Sent when a customer leaves items in their cart without checking out.",
  subject: "You left something behind! 🛒 Your cart is waiting",
  body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b, #d97706);">
        <div style="color: white; font-size: 24px; line-height: 48px; text-align: center;">🛒</div>
      </div>
      <h1 style="color: #111827; font-size: 28px; margin-top: 16px; margin-bottom: 8px;">Hey, you forgot something! 👋</h1>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">We noticed you left some items in your cart. They're still waiting for you!</p>
    </div>

    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="color: #111827; font-size: 18px; margin-top: 0;">Your Cart Items:</h2>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
        {{cartItems}}
      </div>
      <div style="border-top: 1px solid #e5e7eb; margin-top: 16px; padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; font-size: 16px;">
          <span style="color: #6b7280;">Total:</span>
          <span style="font-weight: 700; color: #111827; font-size: 20px;">{{cartTotal}}</span>
        </div>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="{{cartUrl}}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;">Complete Your Order →</a>
      </div>

      {{#if discountCode}}
      <div style="text-align: center; padding: 16px; background: #fef3c7; border-radius: 12px;">
        <p style="color: #92400e; font-size: 14px; margin: 0;">Here's a little nudge — use code <strong style="color: #d97706;">{{discountCode}}</strong> for {{discountValue}} off!</p>
      </div>
      {{/if}}
    </div>

    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p>You received this email because you started a checkout at DropAI.</p>
      <p><a href="{{unsubscribeUrl}}" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
  placeholders: ["email", "cartItems", "cartTotal", "cartUrl", "discountCode", "discountValue", "unsubscribeUrl"],
  category: "abandoned-cart",
};

// ── Weekly Newsletter ────────────────────────────────────────────────────────────

const weeklyNewsletter: EmailTemplate = {
  id: "weekly-newsletter",
  name: "Weekly Newsletter",
  description: "Weekly digest with product highlights, featured deals, and AI dropshipping tips.",
  subject: "{{date}} — This Week's Top Picks from DropAI 📬",
  body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #7c3aed);">
        <div style="color: white; font-size: 24px; line-height: 48px; text-align: center;">📬</div>
      </div>
      <h1 style="color: #111827; font-size: 24px; margin-top: 12px; margin-bottom: 4px;">Weekly DropAI Digest</h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">{{date}} · Issue #{{issueNumber}}</p>
    </div>

    <!-- Featured Product -->
    <div style="background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">🌟 Featured Product</div>
      <h2 style="color: #111827; font-size: 20px; margin: 12px 0 8px;">{{featuredProductName}}</h2>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">{{featuredProductDescription}}</p>
      <div style="display: flex; align-items: center; gap: 12px; margin-top: 16px;">
        <span style="font-size: 24px; font-weight: 700; color: #4f46e5;">{{featuredProductPrice}}</span>
        <a href="{{featuredProductUrl}}" style="background: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">Shop Now →</a>
      </div>
    </div>

    <!-- Deals Section -->
    <div style="background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="color: #111827; font-size: 18px; margin-top: 0;">🔥 Hot Deals This Week</h2>
      {{dealsHtml}}
      <div style="text-align: center; margin-top: 16px;">
        <a href="{{shopUrl}}" style="color: #4f46e5; font-size: 14px; font-weight: 600;">View All Deals →</a>
      </div>
    </div>

    <!-- AI Tip Section -->
    <div style="background: linear-gradient(135deg, #eef2ff, #ede9fe); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
      <div style="display: inline-block; background: #4f46e5; color: white; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">🤖 AI Tip</div>
      <h2 style="color: #111827; font-size: 18px; margin: 12px 0 8px;">Dropshipping Tip of the Week</h2>
      <p style="color: #374151; font-size: 14px; line-height: 1.6;">{{aiTip}}</p>
    </div>

    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p>You received this email because you're subscribed to the DropAI newsletter.</p>
      <p><a href="{{unsubscribeUrl}}" style="color: #6b7280;">Unsubscribe</a> · <a href="{{shopUrl}}" style="color: #6b7280;">Visit Store</a></p>
      <p style="margin-top: 8px;">&copy; 2026 DropAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
  placeholders: ["date", "issueNumber", "featuredProductName", "featuredProductDescription", "featuredProductPrice", "featuredProductUrl", "dealsHtml", "shopUrl", "aiTip", "unsubscribeUrl"],
  category: "newsletter",
};

// ── Order Confirmation Email ─────────────────────────────────────────────────────

const orderConfirmationEmail: EmailTemplate = {
  id: "order-confirmation",
  name: "Order Confirmation",
  description: "Sent immediately after a customer completes a purchase.",
  subject: "Your order is confirmed! 🎉 Order #{{orderId}}",
  body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #10b981, #059669);">
        <div style="color: white; font-size: 24px; line-height: 48px; text-align: center;">✅</div>
      </div>
      <h1 style="color: #111827; font-size: 28px; margin-top: 16px; margin-bottom: 8px;">Order Confirmed! 🎉</h1>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Thank you for your order, {{customerName}}!</p>
    </div>

    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
          <p style="color: #111827; font-size: 18px; font-weight: 700; margin: 4px 0;">#{{orderId}}</p>
        </div>
        <div style="text-align: right;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Order Date</p>
          <p style="color: #111827; font-size: 14px; margin: 4px 0;">{{orderDate}}</p>
        </div>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
        <h3 style="color: #111827; font-size: 16px; margin-top: 0;">Items Ordered</h3>
        {{orderItemsHtml}}
      </div>

      <div style="border-top: 1px solid #e5e7eb; margin-top: 16px; padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
          <span style="color: #6b7280;">Subtotal</span>
          <span style="color: #111827;">{{subtotal}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
          <span style="color: #6b7280;">Shipping</span>
          <span style="color: #111827;">{{shippingCost}}</span>
        </div>
        {{#if discountApplied}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
          <span style="color: #6b7280;">Discount</span>
          <span style="color: #059669;">-{{discountAmount}}</span>
        </div>
        {{/if}}
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; border-top: 2px solid #111827; padding-top: 12px; margin-top: 12px;">
          <span style="color: #111827;">Total</span>
          <span style="color: #4f46e5;">{{total}}</span>
        </div>
      </div>
    </div>

    <!-- Shipping Info -->
    <div style="background: white; border-radius: 16px; padding: 32px; margin-top: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h3 style="color: #111827; font-size: 16px; margin-top: 0;">🚚 Shipping Information</h3>
      <p style="color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-line;">{{shippingAddress}}</p>
      <p style="color: #6b7280; font-size: 13px; margin-top: 8px;">Estimated delivery: <strong>{{estimatedDelivery}}</strong></p>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="{{orderUrl}}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;">Track Your Order →</a>
    </div>

    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p>Need help? <a href="mailto:{{supportEmail}}" style="color: #4f46e5;">Contact Support</a></p>
      <p>&copy; 2026 DropAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
  placeholders: ["customerName", "orderId", "orderDate", "orderItemsHtml", "subtotal", "shippingCost", "discountApplied", "discountAmount", "total", "shippingAddress", "estimatedDelivery", "orderUrl", "supportEmail"],
  category: "order-confirmation",
};

// ── Exports ──────────────────────────────────────────────────────────────────────

export const emailTemplates: EmailTemplate[] = [
  welcomeEmail,
  abandonedCartEmail,
  weeklyNewsletter,
  orderConfirmationEmail,
];

export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: EmailTemplate["category"]): EmailTemplate[] {
  return emailTemplates.filter((t) => t.category === category);
}