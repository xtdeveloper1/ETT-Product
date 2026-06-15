import React from "react";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  amount: number;
  customerEmail: string;
}

export const CustomerOrderConfirmationEmail: React.FC<
  OrderConfirmationEmailProps
> = ({ customerName, orderNumber, amount, customerEmail }) => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #f8f8f8;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .order-info {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .label {
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 10px;
            margin-bottom: 5px;
          }
          .value {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
            margin-top: 20px;
          }
          .amount-highlight {
            font-size: 28px;
            color: #667eea;
            font-weight: bold;
            margin: 20px 0;
          }
          .thank-you {
            text-align: center;
            color: #667eea;
            font-size: 18px;
            font-weight: 600;
            margin: 20px 0;
          }
        `}
      </style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <h1 style={{ margin: 0 }}>Order Confirmed! ✓</h1>
          <p style={{ margin: "10px 0 0 0", opacity: 0.9 }}>
            Thank you for your purchase
          </p>
        </div>

        <div className="content">
          <p>Hi {customerName},</p>

          <div className="thank-you">Thank You for Your Order!</div>

          <p>
            We're excited to process your order and get your products shipped to
            you as soon as possible.
          </p>

          <div className="order-info">
            <div className="label">Order Number</div>
            <div className="value">{orderNumber}</div>

            <div className="label">Total Amount</div>
            <div className="amount-highlight">₹{amount.toLocaleString()}</div>

            <div className="label">Order Status</div>
            <div className="value">✓ Confirmed</div>
          </div>

          <p>
            You will receive tracking information via email once your order
            ships. If you have any questions, please don't hesitate to contact
            us.
          </p>

          <p style={{ marginTop: 30, fontWeight: 600 }}>
            Warm regards,
            <br />
            <span style={{ color: "#667eea" }}>Enviro Tech Technologies</span>
          </p>

          <div className="footer">
            <p style={{ margin: 0, marginBottom: 10 }}>
              © 2024 Enviro Tech Technologies. All rights reserved.
            </p>
            <p style={{ margin: 0 }}>
              This is an automated email. Please do not reply directly.
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
);

interface AdminNotificationEmailProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderNumber: string;
  amount: number;
}

export const AdminNotificationEmail: React.FC<AdminNotificationEmailProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  orderNumber,
  amount,
}) => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #f8f8f8;
            padding: 20px;
          }
          .header {
            background: #1f2937;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .customer-info {
            background: #f0f4ff;
            border-left: 4px solid #dc2626;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            color: #666;
            font-weight: 600;
          }
          .value {
            color: #333;
            text-align: right;
          }
          .amount-row {
            background: #fef2f2;
            padding: 15px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-top: 10px;
            font-size: 18px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
            margin-top: 20px;
          }
        `}
      </style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <h1 style={{ margin: 0 }}>🎉 New Order Received</h1>
          <p style={{ margin: "10px 0 0 0", opacity: 0.9 }}>
            Order ID: {orderNumber}
          </p>
        </div>

        <div className="content">
          <p>
            A new order has been placed on your ecommerce platform. Please see
            the details below:
          </p>

          <div className="customer-info">
            <div className="info-row">
              <span className="label">Customer Name</span>
              <span className="value">{customerName}</span>
            </div>

            <div className="info-row">
              <span className="label">Email</span>
              <span className="value" style={{ wordBreak: "break-all" }}>
                {customerEmail}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Phone</span>
              <span className="value">{customerPhone}</span>
            </div>

            <div className="info-row">
              <span className="label">Order Number</span>
              <span className="value">{orderNumber}</span>
            </div>

            <div className="amount-row">
              <span>Total Amount</span>
              <span>₹{amount.toLocaleString()}</span>
            </div>
          </div>

          <p style={{ marginTop: 20, color: "#666" }}>
            Please process this order and ensure timely shipment. Contact the
            customer at {customerPhone} or {customerEmail} if needed.
          </p>

          <p style={{ marginTop: 30, color: "#999", fontSize: "12px" }}>
            This is an automated notification from your order management system.
          </p>
        </div>
      </div>
    </body>
  </html>
);
