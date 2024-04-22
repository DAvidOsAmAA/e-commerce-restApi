import nodemailer from "nodemailer"

export const sendEmail = async({ to, subject, html, attachments=[] })=>{
  const transporter = nodemailer.createTransport({
    host:"localhost",
    service:"gmail",
    port:456,
    secure:true,
    auth:{
      user:process.env.EMAIL,
      pass:process.env.PASS
    }
  })

  const info = await transporter.sendMail({
    from:`"Ecommerce Application" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    attachments
  })
  if(info.rejected.length > 0 ) return false;
  return true
}



