export const dailyQuestion = (subject: string, metaInfo: any) => {
  const info = {
    subject,
    html: `
        <!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New DSA Question</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:20px 0;">
    <tr>
      <td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

      <!-- Header -->
      <tr>
        <td style="background:#0f172a; color:#ffffff; text-align:center; padding:30px;">
          <h1 style="margin:0; font-size:24px;">New DSA Challenge 🚀</h1>
          <p style="margin:10px 0 0; font-size:14px;">Level up your problem-solving skills</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; color:#333333;">
          <h2 style="margin-top:0;">Hey Coder's,</h2>

          <p style="line-height:1.6;">
            A new <strong>Data Structures & Algorithms</strong> question has just been published.
          </p>

          <!-- Question Card -->
          <div style="background:#f9fafb; padding:20px; border-radius:8px; margin:20px 0;">
            <h3 style="margin:0 0 10px;">${metaInfo.questionName}</h3>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin:30px 0;">
            <a href=${metaInfo.link} 
               style="background:#4f46e5; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:14px;">
              Solve Now
            </a>
          </div>

          <p style="line-height:1.6;">
            Keep practicing consistently — that’s the key to cracking top tech interviews.
          </p>

          <p style="margin-top:30px;">
            Happy Coding 💻,<br/>
            <strong>Team Let's Code</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f4f4f7; padding:20px; text-align:center; font-size:12px; color:#888;">
          <p style="margin:0;">
            © 2026 Let's Code. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
  </table>
</body>
</html>
        `,
  };

  return info;
};
