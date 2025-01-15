export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f0f3f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background-color: #fff;
      margin: 0 auto;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #4CAF50, #2e8b57);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .verification-code {
      font-size: 36px;
      font-weight: bold;
      color: #4CAF50;
      text-align: center;
      letter-spacing: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 0.8em;
      padding: 15px;
      background-color: #f0f3f5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up! Your verification code is:</p>
      <div class="verification-code">{verificationCode}</div>
      <p>Enter this code on the verification page to complete your registration.</p>
      <p>This code will expire in 15 minutes for security reasons.</p>
      <p>If you didn’t create an account with us, please ignore this email.</p>
      <p>Best regards,<br>Your App Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message; please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f0f3f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background-color: #fff;
      margin: 0 auto;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #4CAF50, #2e8b57);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .success-icon {
      font-size: 30px;
      color: white;
      background-color: #4CAF50;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-radius: 50%;
      margin: 20px auto;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 0.8em;
      padding: 15px;
      background-color: #f0f3f5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Successful</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We’re writing to confirm that your password has been successfully reset.</p>
      <div class="success-icon">✓</div>
      <p>If you did not initiate this password reset, please contact our support team immediately.</p>
      <p>For security reasons, we recommend that you:</p>
      <ul>
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication if available</li>
        <li>Avoid using the same password across multiple sites</li>
      </ul>
      <p>Thank you for helping us keep your account secure.</p>
      <p>Best regards,<br>Your App Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message; please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f0f3f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background-color: #fff;
      margin: 0 auto;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #4CAF50, #2e8b57);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .reset-button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 0.8em;
      padding: 15px;
      background-color: #f0f3f5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. If you didn’t make this request, please ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      <a href="{resetURL}" class="reset-button">Reset Password</a>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>Best regards,<br>Your App Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message; please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;
