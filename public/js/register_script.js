const handleResize = () => {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    $("html, body").css({"width":w,"height":h});
}

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
handleResize();
// window.onresize = (e) => { handleResize(); }; 

