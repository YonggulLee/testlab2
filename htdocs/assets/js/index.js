async function loginTset() {
    const userEmail = document.getElementById('userEmail').value;
    const userPassword = document.getElementById('userPassword').value;

    if (userEmail == '') {
        alert('Email을 입력해 주세요');
    } else if (userPassword == '') {
        alert('비밀번호를 입력하여 주세요');
    } else {
        console.log(userEmail);
        console.log(userPassword);
        const {
            data: { token },
        } = await axios.post('https://dongsung.farota.com/api/auth/login', {
            username: userEmail,
            password: userPassword,
            // username: 'manager@smarf.kr',
            // password: 'uiop90-=',
        });
        console.log(token);
        if (token === undefined) {
            alert('Email과 비밀번호를 확인해주세요');
        } else {
            alert('정상적으로 로그인 되었습니다');
            localStorage.setItem('access_token', token);
            location.href = 'dashboard.html';
            // const farota = axios.create({
            //     baseURL: 'https://dongsung.farota.com/api/',
            //     headers: { 'X-Authorization': 'Bearer ' + token },
            // });
        }
    }
}
