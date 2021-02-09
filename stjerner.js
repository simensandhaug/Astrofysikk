document.getElementById("headerContainer").addEventListener("click", () => {
    location.href = 'index.html';
});

const content = document.getElementById("contentContainer");
const stars = [
    {
        name: 'Betelgeuse',
        age: '~ 7.3 x 10<sup>6</sup>',
        kelvin: '3140–3641 K',
        distance: '643 ± 146 lysår',
        img: '/images/betelgeuse.jpeg',
        fact: 'Betelgeuse er kul'
    }
];

const showInfo = (el) => {
    console.log(el);
}

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
        contents.push(`<img id="${this.name}" src="${this.img}" alt="${this.name}" width="600px" height="600px" class="starIMG" onmouseover="showInfo(this)">`);
        contents.push(`</div>`);
        contents.push(`<div class="starInfo" id="${this.name}Info">`);
        contents.push(`<h4>Navn: ${this.name}</h4><h5>Alder: ${this.age} år</h5><h5>Overflate-Temp: ${this.kelvin}</h5><h5>Avstand: ${this.distance}</h5>`);
        contents.push(`<p class="fact">${this.fact}</p>`);
        contents.push(`</div>`);
        content.innerHTML += contents.join("");
    }
}

stars.forEach(star => {
    let c = new Star(star.name, star.age, star.kelvin, star.distance, star.img, star.fact);
    c.create();
});