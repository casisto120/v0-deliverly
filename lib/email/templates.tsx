export function generateOrderNotificationEmail(shopName: string, orderCount: number): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .stat-box { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Store Activity Summary</h2>
          <p>Hi from ${shopName},</p>
          <p>You've had <strong>${orderCount} new order(s)</strong> today.</p>
          <div class="stats">
            <div class="stat-box">
              <div class="stat-number">${orderCount}</div>
              <div>New Orders</div>
            </div>
          </div>
          <p>Log in to your dashboard to manage file deliveries.</p>
        </div>
      </body>
    </html>
  `
}

export function generateWelcomeEmail(shopName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .steps { margin: 30px 0; }
          .step { margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #667eea; }
          .step-number { font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Deliverly!</h1>
          </div>
          <div class="steps">
            <p>Your Shopify store is now connected. Here's how to get started:</p>
            <div class="step">
              <div class="step-number">1. Upload Files</div>
              <p>Go to Files and upload the digital products you want to deliver.</p>
            </div>
            <div class="step">
              <div class="step-number">2. Link Products</div>
              <p>Connect your uploaded files to specific Shopify products.</p>
            </div>
            <div class="step">
              <div class="step-number">3. Automatic Delivery</div>
              <p>Customers automatically receive files after purchase!</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}
