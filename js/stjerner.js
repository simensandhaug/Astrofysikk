const body = document.querySelector(".container");
let stars;
class Star {
    constructor(name, age, kelvin, distance, img, fact) {
        this.name = name;
        this.age = age;
        this.kelvin = kelvin,
            this.distance = distance,
            this.img = img,
            this.fact = fact;
    }

    showInfo() {
        document.querySelector("body").style.overflow = "visible";
        body.innerHTML += `<div id="contentContainer"></div>`
        document.getElementById("contentContainer").innerHTML = ``;
        document.getElementById("contentContainer").innerHTML += `<div class="starInfoHeader"><h1>Info om ${this.name}</h1><br></div>`;
        document.getElementById("contentContainer").innerHTML += `<div class="starInfo"><h2>Alder: ${this.age} år</h2><h2>Fargetemperatur: ${this.kelvin} K</h2><h2>Avstand: ${this.distance}</h2><br><h2>λ<sub>topp:</sub> <br>2.9 ⋅ 10<sup>-3</sup> / ${this.kelvin} = ${Math.floor(((2.9*0.01)/this.kelvin)*Math.pow(10, 8))} nm<br><h2>Utstrålingstetthet:<br> 5.67 ⋅ 10<sup>-8</sup> ⋅ ${this.kelvin}<sup>4</sup> = ${Math.floor((Math.pow(5.67, -8) * Math.pow(this.kelvin,4))).toExponential(1).replace(/e\+?/, ' ⋅ 10<sup>')}</sup> W/m<sup>2</sup></h2><h2>Bilde</h2></h2><br><img class="starIMG" src="${this.img}"<br></div>`;
        document.getElementById("contentContainer").innerHTML += `<div class="starFact"><p>Funfacts</p><p>${this.fact}</p></div>`;
    }
}
const writeHeader = (header, output) => {
    let i = 0;
    setInterval(() => {
        if(i < header.length) output.innerHTML += header.charAt(i);
        else {
            if(i%2 == 0) output.innerHTML += "_";
            else output.innerHTML = output.innerHTML.replace("_", "");
        }
        i++
    }, 300);
}
const showStar = id => {
    stars.forEach(star => {
        if (id == star.name) {
            let temporary = new Star(star.name, star.age, star.kelvin, star.distance, star.img, star.fact);
            temporary.showInfo();
        }
    });
}
const loadPage = () => {
    document.querySelector("body").style.overflow = "hidden";
    stars = [{
            name: 'Betelgeuse',
            age: '~7.3 ⋅ 10<sup>6</sup>',
            kelvin: 3300,
            distance: '643 ± 146 lysår',
            img: '/images/betelgeuse.jpeg',
            fact: 'Betelgeuse er en rød supergigant. Betelgeuse er en enormt variabel stjerne som endres i størrelse fra mellom 700 ganger til 1000 større enn solen. Når en stjerne blir eldre, brenner den raskt ut hydrogendrivstoffet, og bytter deretter til helium og andre elementer. I løpet av dette utvides og avkjøles den. Under fusjonen oppstår tyngre og tyngre atomer helt til kjernen er jern og ikke får fusjonert mer, og går tom for drivstoff. Hvis stjernen er tilstrekkelig massiv, slik som Betelgeuse, kollapser hele stjernen og eksploderer som en supernova.'
        },
        {
            name: 'Proxima Centauri',
            age: '~4.8 ⋅ 10<sup>9</sup>',
            kelvin: 3000,
            distance: '4.2465 ± 0.0003 lysår',
            img: '/images/proxima-centauri.jpeg',
            fact: 'Proxima Centauri er den stjernen som ligger nærmest solen. Den tilhører stjernebildet Kentauren, derav navnet Centauri. Den ligger i trippelstjernesystemet Alfa Centauri der den kretser rundt hovedstjernen Alfa Centauri med en omløpstid på ca. én million år. Den er en rød dverg, noe som betyr at den er relativt liten og "kjølig". Bildet over ble tatt av Hubble Teleskopet i 2013.'
        },
    ];
    body.innerHTML += `<img class="arrowBack" src="images/arrowback.png" alt="Tilbake til hovedmeny"  width="50px" height="50px" onclick=location.href='index.html'>`
    body.innerHTML += `<div id="contentContainer"><h1 id="title"></h1></div>`
    body.innerHTML += `<canvas id="panCanvas" width="1200px" height="1000px"></canvas>`
    document.getElementById("contentContainer").innerHTML += `<div id="starList"></div>`;
    stars.forEach(star => {
        document.getElementById("starList").innerHTML += `<button class="button" id="${star.name}" onclick="showStar(this.id)">${star.name}</button><br>`;
    });
    writeHeader('Stjerner', document.getElementById("title"));
}
loadPage();