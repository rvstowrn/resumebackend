const handleResize = () => {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    $("html, body").css({"width":w,"height":h});
}
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
handleResize();
// window.onresize = (e) => { handleResize(); }; 
