var apiKey= process.env.API_KEY;
var options={
	apiKey: apiKey,
	username: "wambui",
	format: "json"
}
var africasTalking=require ("africastalking")(options);

exports.sms= function (recepients,message,callback){
	let sms=africasTalking.SMS;
	sms.send({
		to: recepients,
		message: message
	})
	.then((response)=>callback(null,response))
	.catch(error=>callback(error, null));
}

exports.credit= function(recepients,message,callback){
	let credit=africasTalking.AIRTIME;
	credit.send({
		recepients: recepients.map(recepient => {
			return {phoneNumber: recepient, amount: 10}
		})
	})
	.then((response)=>callback(null,response))
	.catch(error=>callback(error, null));
}
