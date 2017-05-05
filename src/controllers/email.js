const nodemailer=require("nodemailer");

var pass=process.env.E_PASS;
var transporter=nodemailer.createTransport({
	service: "gmail",
	auth:{
		user: "vinmugambi17@gmail.com",
		pass: pass
	}
})

module.exports= function(recepients,message,callback){
	let mailOptions= {
		from: `"Vincent Mugambi", <vinmugambi17@gmail.com>`,
		to: recepients,
		subject: message.subject,
		text: message.text,
		html: `<b>${message.subject}</b><br/>
		         <p>${message.text}</p>`
	}
	transporter.sendMail(mailOptions, (error, info)=>{
		if (error) callback(error,null)
		else callback(null,info)
	})
}
