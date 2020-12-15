function onSubmit(f) {
	if(f.userid.value.trim() == '') {
		alert('아이디를 입력하세요');
		f.userid.focus();
		return false;
	}
	if(f.userpw.value.trim() == '') {
		alert('비밀번호를 입력하세요');
		f.userpw.focus();
		return false;
	}
}

Kakao.init('68a825cbbb160e4dfad863afdbc2efd1');

function kakaoLogin(){
	Kakao.Auth.authorize({
	redirectUri: 'http://localhost:3000/user/login/kakao/oauth'
  });
Kakao.Auth.setAccessToken(USER_ACCESS_TOKEN);
} 
