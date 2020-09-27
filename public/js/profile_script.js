const logoutHandler = () => {
    document.cookie = 'token=none';
    window.location.href = './login'
}