setTimeout(() => {
    const txt = 'Portfolio Creator welcomes you. Download our apk to get started on your android application.';
    const element = document.getElementById("mobile");
    let i = 0;
    function typeWriter() {
        if (i < txt.length) {
            element.innerHTML += txt.charAt(i++);
            setTimeout(typeWriter, 60);
        }
        else {
            element.innerHTML += `<br><br><a class='btn amber' download='Portfolio_Creator.apk' 
        href='public/apk/Portfolio_Creator.apk'> <i class="fa fa-download"></i> Download </a>`;
        }
    }
    typeWriter();

}, 500);