import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie un email de bienvenue au nouvel abonné
 * @param {string} email — l'adresse du nouvel inscrit
 */
export async function sendWelcomeEmail(email) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️  RESEND_API_KEY manquante — email non envoyé');
        return;
    }

    const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM || 'La Missive <onboarding@resend.dev>',
        to: email,
        subject: 'Bienvenue dans La Missive ✨',
        html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f5f3ef; font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ef; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e); padding:40px 40px 30px; text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif; font-size:32px; font-weight:bold; color:#d4a853; letter-spacing:-1px;">LM</div>
              <p style="color:rgba(255,255,255,0.6); font-size:12px; text-transform:uppercase; letter-spacing:3px; margin:12px 0 0;">Newsletter Premium</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="font-family:Georgia,'Times New Roman',serif; font-size:24px; color:#1a1a2e; margin:0 0 16px;">Bienvenue dans La Missive&nbsp;!</h1>
              <p style="font-size:16px; line-height:26px; color:#444; margin:0 0 20px;">
                Merci de nous avoir rejoint. Chaque semaine, vous recevrez une sélection exigeante d'analyses, de tendances et d'inspirations — directement dans votre boîte mail.
              </p>
              <p style="font-size:16px; line-height:26px; color:#444; margin:0 0 24px;">
                En attendant la prochaine édition, découvrez nos derniers articles sur le site&nbsp;:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#e8622a; border-radius:8px; padding:14px 32px;">
                    <a href="${process.env.SITE_URL || 'https://la-missive.vercel.app'}/actualites"
                       style="color:#fff; text-decoration:none; font-size:15px; font-weight:600;">
                      Lire les actualités →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; border-top:1px solid #eee; text-align:center;">
              <p style="font-size:12px; color:#999; margin:0;">
                © ${new Date().getFullYear()} La Missive — Des idées qui méritent votre attention.
              </p>
              <p style="font-size:11px; color:#bbb; margin:8px 0 0;">
                Vous recevez cet email car vous vous êtes inscrit sur la-missive.vercel.app
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    });

    if (error) {
        console.error('❌ Erreur envoi email:', error.message);
    } else {
        console.log(`📧 Email de bienvenue envoyé à ${email}`);
    }
}
