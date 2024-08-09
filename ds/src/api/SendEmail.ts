import nodemailer from 'nodemailer';

const generateRandomCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationCode = async (email: string): Promise<string> => {
    const code = generateRandomCode();
  
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'montgomery_gator.123@mail.ru',
        pass: 'vpF5UGC66wx2rKXs6HbH'
      }
    });
  
    const mailOptions = {
      from: 'montgomery_gator.123@mail.ru',
      to: email,
      subject: `Код подтверждения: ${code}`,
      text: `Ваш код подтверждения: ${code}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return code;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Email could not be sent');
    }
};
