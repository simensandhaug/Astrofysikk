const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const infoEl = document.getElementById("infoOutput");

let slideCounter = 0;

class Slide {
    constructor(info) {
        this.info = info;
    }
    showInfo = () => infoEl.innerHTML = this.info;
}


const slideInfo = [{
        info: "Info for slide 1"
    },
    {
        info: "Info for slide 2"
    }
];

const drawContentForSlide = (counter) => {
    console.log(counter)
    switch(counter) {
        case 0:
            console.log("Tegner for slide 1");
            break;
        case 1:
            console.log("Tegner for slide 2");
            break;
    }
}

const nextSlide = () => {
    if (slideInfo[slideCounter]) {
        new Slide(slideInfo[slideCounter + 1].info).showInfo();
        slideCounter++;
        drawContentForSlide(slideCounter);
    }
}

const previousSlide = () => {
    if (slideInfo[slideCounter - 1]) {
        new Slide(slideInfo[slideCounter - 1].info).showInfo();
        slideCounter--;
        drawContentForSlide(slideCounter);
    }
}

new Slide(slideInfo[slideCounter].info).showInfo();