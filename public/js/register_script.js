const submitHandler = () => {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    $.post("/api/register_user", {name,username,password}, function(res){
        console.log(res);
        if(res.msg=='success'){
            window.location.href='./login';
        }
    });
};
