const submitHandler = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    $.post("/api/login_user", {username,password}, function(res){
        if(res.msg=='success'){
            document.cookie=`token=${res.token}`;
            window.location.href='./profile';
        }
    });
};