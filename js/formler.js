const tbodyEL = document.getElementById("tbody");
const equations = [{
        name: 'Stefan-Boltzmanns lov',
        equation: 'U = σ ⋅ T<sup>4</sup>',
        variableMeanings: ['U = Utsrålingstetthet', 'σ = Konstant(5.67 ⋅ 10<sup>-8</sup>)', 'T = Temperatur'],
        units: ['U = W/m<sup>2</sup>', 'σ = W/m<sup>2</sup>K<sup>4</sup>', 'T = K'],
        info: 'Utstrålingstettheten fra en svart gjenstand er proporsjonal med fjerde potens av temperaturen på overflaten av gjenstanden.',
    },
    {
        name: 'Wiens forkyvningslov',
        equation: 'λ<sub>topp</sub> ⋅ T = a',
        variableMeanings: ['λ<sub>topp</sub> = Bølgelengdetopp', 'T = Temperatur', 'a = Konstant(2.90 ⋅ 10<sup>-3</sup>)'],
        units: ['λ<sub>topp</sub> = m', 'T = K', 'a = Km'],
        info: 'Bølgelengden for energimaksimum i termisk stråling er omvendt proporsjonal med temperaturen i gjenstanden som stråler',
    },
    {
        name: 'Dopplerformelen',
        equation: `<span class="fractionConstant">v = </span><span class="fraction"><span class="top">λ - λ<sub>0</sub></span><span class="bottom">λ<sub>0</sub></span></span><span class="fractionConstant"> ⋅ c</span>`,
        variableMeanings: ['v = Farten til objektet', 'λ = Observert bølgelengde til en spektrallinje', 'λ<sub>0</sub> = Bølgelengden til den observerte bølgelengden λ i laboratoriet', 'c = Konstant(3 ⋅ 10<sup>8</sup>)'],
        units: ['v = m/s', 'λ = m', 'λ<sub>0</sub> = m', 'c = m/s'],
        info: 'Sammenheng mellom bølgelengde-forskyvningen og farten til lyskilden i forhold til oss.',
    },
    {
        name: 'Hubbles lov',
        equation: `v = H ⋅ r`,
        variableMeanings: ['v = Radialfarten til galaksen', 'H = Konstant(~21.7 ± 1.0)', 'r = Avstanden fra jorda til galaksen'],
        units: ['v = m/s', 'H = (km/s) / 10<sup>6</sup> l.y', 'r = m'],
        info: 'Galakser har en radialfart som er større jo større avstanden er fra jorda. H er Hubbles konstant og blir bestemt med stadig større nøyaktighet.',
    },
];
tbodyEL.innerHTML = `<tr><th>Navn</th><th>Formel</th><th>Variabler</th><th>Enheter</th><th>Info</th><th>Kalkulator</th></tr>`;
for (let i = 0; i < equations.length; i++) tbodyEL.innerHTML += `<tr><td>${equations[i].name}</td><td class="formel">${equations[i].equation}</td><td>${equations[i].variableMeanings.join('<div class="break"></div>')}</td><td>${equations[i].units.join('<div class="break"></div>')}</td><td class="info">${equations[i].info}</td><td><button class="regnut" onclick="calculate(${equations[i].name})">Regn Ut</button></td></tr>`;

const calculate = name => {
    switch(name) {
        case 'Stefan-Boltzmanns lov':
            console.log("hei")
    }
}