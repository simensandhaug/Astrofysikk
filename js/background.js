let backgrounds = ['background1.jpeg', 'background8.jpg', 'background4.jpg', 'background5.jpg', 'background6.jpg', 'background7.jpg', 'background9.jpg'];
document.querySelector(".container").style.backgroundImage = `url(../images/${backgrounds[Math.floor(Math.random() * backgrounds.length)]})`;

const writeHeader = (header, output) => {
    document.getElementById("title").innerHTML = "";
    let i = 0;
    setInterval(() => {
        if (i < header.length) output.innerHTML += header.charAt(i);
        else {
            if (i % 2 == 0) output.innerHTML += "_";
            else output.innerHTML = output.innerHTML.replace("_", "");
        }
        i++
    }, 300);
}
writeHeader(document.getElementById("title").innerHTML, document.getElementById("title"));