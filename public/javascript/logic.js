function formattedDate(d = new Date()) {
	let month = String(d.getMonth() + 1);
	let day = String(d.getDate());
	const year = String(d.getFullYear());
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return `${month}/${day}/${year}`;
}

$(function () {
	$('.form_date').datetimepicker({
		viewMode: "years",
		weekStart: 1,
		todayBtn: 0,
		autoclose: 2,
		startView: 2,
		minView: 2,
		disableTouchKeyboard: true,
		readonly: true,

		forceParse: 1,
		endDate: formattedDate(new Date(Date.now() - 12 * 365.25 * 24 * 60 * 60 * 1000)),
		startDate: formattedDate(new Date(Date.now() - 90 * 365.25 * 24 * 60 * 60 * 1000)),
		/*beforeShow: function(input,obj){
			$('input#dob').prop('readonly', 'readonly');
		},
		onClose: function(){
            $('input#dob').prop('readonly', false);
		}*/
	}).attr("readonly", "readonly");


	//login through XHR ajax request
	$('button#login').click(function (event) {
		$(".input-group").removeClass("has-error");

		var loginData = {
			"username": $("input[name=username]").val(),
			"password": $("input[name=password]").val()
		}
		$.ajax({
			type: 'POST',
			url: 'auth/login',
			data: loginData,
			encode: true
		})
			.done(function (data) {
				if (!data.success || data.success === false) {
					$('.error-log').text(data.message || "Authentication failed");
					$(".input-group").addClass("has-error");
				} else {
					if (data.success == true) {
						window.location.href = '/dashboard';
					} else {
						window.location.href = "/login";
					}
				}

			})
			.fail(function (error) {
				console.log(error)
			})
		event.preventDefault();
	})

	$('form#register').validate({
		rules: {
			name: {
				required: true,
				minlength: 3
			},
			gender: {
				required: true,
			},
			county: {
				required: true,
			},
			Email: {
				required: true,
				minlength: 12,
				email: true,
			},
			password: {
				required: true,
				minlength: 6,
			},
			confPass: {
				required: true,
				minlength: 6,
				equalTo: "#password"
			},
			education: {
				required: true,
			},
			agree: {
				required: true
			},
			dob: {
				required: true
			},
			mobile: {
				required: true,
				minlength: 10,
				maxlength: 10,
				number: true
			},
			role: {
				required: true
			}
		},
		messages: {
			role: {
				required: "Please specify account type"
			},
			mobile: {
				required: " Mobile Phone number is required",
				minlength: "Mobile Number must be exactly ten digits",
				maxlength: "Mobile Number must exactly ten digits",
				number: "Number must be made upof digits only"
			},
			name: {
				required: "Name is required",
				minlength: "Name must be at least 3 characters"
			},
			gender: {
				required: "Gender is required"
			},
			county: {
				required: "Your current location is required"
			},
			Email: {
				required: "Email is required as it will be used to login",
				minlength: "Email not of logical Length",
				email: "The email entered is invalid"
			},
			password: {
				required: "Password is required as it will be used to login",
				minlength: "Password is too short",
			},
			confPass: {
				required: "You must confirm your Password",
				minlength: "Password do not match",
				equalTo: "Password do not match"
			},
			education: {
				required: "Education level is required"
			},
			agree: {
				required: "You must agree to our terms of service"
			},
			dob: {
				required: "Date of birth is required"
			}

		},
		highlight: function (element) {
			$(element).closest('.input-group').removeClass('has-success ').addClass('has-error');
		},
		unhighlight: function (element) {
			$(element).closest('.input-group').removeClass('has-error').addClass('has-success');
			$(element).closest('.input-group').removeClass('has-warning').addClass('has-success');


		},

		onkeyup: function (element, event) {
			if (event.which === 9 && this.elementValue(element) === "") {
				return;
			} else if (element.name in this.submitted || element === this.lastElement) {
				this.element(element);
			}
			this.checkForm();
			if (this.valid()) {// checks form for validity
				$('#button#register').removeClass('btn-danger').addClass('btn-sucess');
				$('button#register').prop("disabled", false)
				// enables button
			} else {
				$('#button#register').removeClass('btn-sucess').addClass('btn-danger');
				$('button#register').prop("disabled", 'disabled')
				// disables button
			}
		},
		onclick: function (element) {// click on selects, radiobuttons and checkboxes
			if (element.name in this.submitted) {
				this.element(element);
				// or option elements, check parent select in that case
			} else if (element.parentNode.name in this.submitted) {
				this.element(element.parentNode);
			}
			this.checkForm();
			if (this.valid()) {// checks form for validity
				$('#button#register').removeClass('btn-danger').addClass('btn-sucess');
				$('button#register').prop("disabled", false)
				// enables button
			} else {
				$('#button#register').removeClass('').addClass('btn-danger');
				$('button#register').prop("disabled", 'disabled')// disables button
			}
		}
	});

	$('button#register').click(function (event) {
		event.preventDefault();
		if ($('#email-taken') && $('#erro-m')) {
			$('#email-taken').remove();
			$('#error-m').remove();

		}
		var value = $("select[name=education]").val();
		var birth = new Date($("input[name=dob]").val()).getTime();
		var age = Math.floor((Date.now() - birth) / 1000 / 60 / 60 / 24 / 365.25)
		var educationLevel;

		if (value == "No Education") {
			educationLevel = 0
		}
		else if (value == "Primary Education") {
			educationLevel = 1
		}
		else if (value == "Secondary Education") {
			educationLevel = 2
		}
		else if (value == "Tertiary Education") {
			educationLevel = 3
		}
		else {
			educationLevel = null
		}
		var registerData = {
			"firstName": $("input[name=name]").val(),
			"sex": $("select[name=gender]").val(),
			"county": $("select[name=county]").val(),
			"email": $("input[name=email]").val(),
			"password": $("input[name=password]").val(),
			"age": age,
			"educationLevel": educationLevel,
			"phoneNumber": $("input[name=phone]").val(),
			"role": $("select[name=role]").val()
		}
		$.ajax({
			type: "POST",
			url: "auth/register",
			data: registerData,
			encode: true
		})
			.done(function (data) {
				console.log(data);
				var Message;
				$('#error-register').text(Message);
				if (!data) {
					Message = `There was an error. Please try again later`
					$('#error-register').text(Message);
				}
				else if (data.success === false && data.message === 'Your EMAIL is already registered with another account') {
					Message = data.message;
					$('#error-register').append(`<div id="error-m"><span> ${Message} Click <a href="/login">here</a> to recover you account</span></div>`);
					$(".input-group.email").removeClass('has-sucess').addClass("has-error");
					$('#email-error').append(`<label class="error" id="email-taken"> Email had been registered with before </label>`);

				} else if (data.success == true) {
					window.location.href = '/verify';
					window.localStorage.pollinstantEmail = data.email;
				}
			})
			.fail(function (jqXHR, textstatus, error) {
				console.log(`${textstatus}- ${error}`)
			})
	});

	$('button#verify').click(function (event) {
		$(".input-group").removeClass("has-error");
        console.log(window.localStorage.pollinstantEmail)
		var verifyData = {
			"email": window.localStorage.pollinstantEmail,
			"code": $("input[name=verify]").val()
		}
		$.ajax({
			type: 'POST',
			url: 'auth/verify',
			data: verifyData,
			encode: true
		})
			.done(function (data) {
				if (!data.success || data.success === false) {
					$('.error-log').text(data.message || "Account verification failed");
					$(".input-group").addClass("has-error");
				} else {
					if (data.success === true) {
						window.location.href = '/login';
					} else {
						window.location.href = "/verify";
					}
				}

			})
			.fail(function (error) {
				console.log(error)
			})
		event.preventDefault();
	})
});
