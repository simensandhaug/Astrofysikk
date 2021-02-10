document.getElementById("headerContainer").addEventListener("click", () => {
    location.href = 'index.html';
});

let currentStar = 0;

const content = document.getElementById("starImages");
const stars = [{
        name: 'Betelgeuse',
        age: '~7.3 ⋅ 10<sup>6</sup>',
        kelvin: '3140–3641 K',
        distance: '643 ± 146 lysår',
        img: '/images/betelgeuse.jpeg',
        fact: 'Betelgeuse er en rød supergigant. Betelgeuse er en enormt variabel stjerne som endres i størrelse fra mellom 700 ganger til 1000 større enn solen. Når en stjerne blir eldre, brenner den raskt ut hydrogendrivstoffet, og bytter deretter til helium og andre elementer. I løpet av dette utvides og avkjøles den. Under fusjonen oppstår tyngre og tyngre atomer helt til kjernen er jern og ikke får fusjonert mer, og går tom for drivstoff. Hvis stjernen er tilstrekkelig massiv, slik som Betelgeuse, kollapser hele stjernen og eksploderer som en supernova.'
    },
    {
        name: 'Proxima Centauri',
        age: '~4.8 ⋅ 10<sup>9</sup>',
        kelvin: '3042 ± 117 K',
        distance: '4.2465 ± 0.0003 lysår',
        img: '/images/proxima-centauri.jpeg',
        fact: 'Proxima Centauri er den stjernen som ligger nærmest solen. Den tilhører stjernebildet Kentauren, derav navnet Centauri. Den ligger i trippelstjernesystemet Alfa Centauri der den kretser rundt hovedstjernen Alfra Centauri med en omløpstid på ca. én million år. Den er en rød dverg, noe som betyr at den er relativt liten og "kjølig. Bildet over ble tatt av Hubble Teleskopet i 2013.'
    },
];

const showInfo = (el) => document.getElementById(`${el.id}Info`).style.visibility = "visible";
const hideInfo = (el) => document.getElementById(`${el.id}Info`).style.visibility = "hidden";

class Star {
    constructor(name, age, kelvin, distance, img, fact) {
        this.name = name;
        this.age = age;
        this.kelvin = kelvin;
        this.distance = distance;
        this.img = img;
        this.fact = fact;
    }

    create() {
        let contents = [];
        contents.push(`<div id="${this.name}Container">`);
        contents.push(`<img id="${this.name}" src="${this.img}" alt="${this.name}" width="500px" height="500px" class="starIMG" onmouseover="showInfo(this)" onmouseleave="hideInfo(this)">`);
        contents.push(`</div>`);
        contents.push(`<div class="starInfo" id="${this.name}Info">`);
        contents.push(`<h5>Navn: ${this.name}</h5><h5>Alder: ${this.age} år</h5><h5>Overflate-Temp: ${this.kelvin}</h5><h5>Avstand: ${this.distance}</h5>`);
        contents.push(`<p class="fact">Fun Facts:<br>${this.fact}</p>`);
        contents.push(`</div>`);
        content.innerHTML = contents.join("");

        document.getElementById(`${this.name}Info`).style.visibility = "hidden";
    }
}

const showStar = (currentStar) => {
    let c = new Star(stars[currentStar].name, stars[currentStar].age, stars[currentStar].kelvin, stars[currentStar].distance, stars[currentStar].img, stars[currentStar].fact);
    c.create();
}

document.onkeydown = (e) => {
    switch (e.keyCode) {
        case 37:
            if (stars[currentStar - 1]) currentStar--;
            break;
        case 39:
            if (stars[currentStar + 1]) currentStar++;
            break;
    }
    showStar(currentStar);
}
showStar(currentStar);