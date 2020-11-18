function onSubmit(f){
	var $validUserid = $("input[name='validUserid']").val();
	var $validUserpw = $("input[name='validUserpw']").val();
	var $validUsername = $("input[name='validUsername']").val();
	var $validUsermail = $("input[name='validUsermail']").val();
	if($validUserid == ""){
		$(f.userid).next().removeClass("active").text('아이디를 확인하세요');
		f.userid.focus();
		return false;
	}
	if($validUserpw == ""){
		$(f.userpw).next().removeClass("active").text('비밀번호를 확인하세요');
		f.userpw.focus();
		return false;
	}
	if($validUsername == ""){
		$(f.username).next().removeClass("active").text('이름을 확인하세요');
		f.username.focus();
		return false;
	}
	if($validUsermail == ""){
		$(f.usermail).next().removeClass("active").text('메일을 확인하세요');
		f.usermail.focus();
		return false;
	}
	return true;
}

function onBlur(){
	var $userid = $(this);
	var userid = $userid.val().trim();
	var $validUserid = $("input[name='validUserid']");
	function onRes(v){	
		if(v.code == 200){
			if(v.isUsed) {
				$userid.next().text('이미 사용중인 아이디입니다').removeClass("active");
				$validUserid.val("");
			}
			else {
				$userid.next().text('사용가능한 아이디입니다').addClass("active");
				$validUserid.val("valid");
			}
		}
		else {
		console.log(v);
		$validUserid.val("");
	}}
	
	if(userid.length < 8 || userid.length > 24){
		$userid.next().text('아이디는 8자 이상 24자 이하로 생성하셔야 합니다').removeClass("active");
		$validUserid.val("");
	}
	else 
		$.get('/user/idcheck/'+userid, onRes);
	
};

function onBlurPass(){
	var $userpw = $(this);
	var userpw = $userpw.val().trim();
	var $validUserpw = $("input[name='validUserpw']");
	if(userpw.length < 8 || userpw.length > 24){
		$userpw.next().text('비밀번호는 8자 이상 24자 이하로 생성하셔야 합니다').removeClass("active");
		$validUserpw.val("");
	}
	else {
		$userpw.next().text('사용가능한 비밀번호 입니다').addClass("active");
		$validUserpw.val("valid");
	}
}

function onBlurName(){
	var $username = $(this);
	var username = $username.val().trim();
	var $validUsername = $("input[name='validUsername']");
	if(username == ""){
		$username.next().text('이름을 입력하세요').removeClass("active");
		$validUsername.val("");
	}
	else {
		$username.next().text('').addClass("active");
		$validUsername.val("valid");
	}
}

function onBlurMail(){
	var $usermail = $(this);
	var usermail = $usermail.val().trim();
	var $validUsermail = $("input[name='validUsermail']");

	var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	
	if(usermail == "" || usermail.match(regExp) == null){
		$usermail.next().text('메일을 확인해주세요').removeClass("active");
		$validUsermail.val("");
		return false;
	}
	else {
		$usermail.next().text('').addClass("active");
		$validUsermail.val("valid");
		return true;
	}
}



$("input[name='userid']").on('blur', onBlur);
$("input[name='userpw']").on('blur', onBlurPass);
$("input[name='username']").on('blur', onBlurName);
$("input[name='usermail']").on('keyup', onBlurMail);