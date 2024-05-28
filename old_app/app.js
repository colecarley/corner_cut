
async function foobar() {
    const response = await fetch("http://localhost:3000/");
    const foo = await response.text();
}

function createTimeElement(time) {
    const listItem = document.createElement('div');
    listItem.innerHTML = `<p> ${time} </p>`;
    return listItem;
}

function addScramble() {
    const scrambleElement = document.getElementById('scramble');
    scrambleElement.innerText = generateScramble();
}

let start;
let interval;
const results = [];
function toggleTime() {
    const currentTimeElement = document.getElementById('currentTime');
    currentTimeElement.innerText = 0;
    const timeButton = document.getElementById('timer-button');

    if (timeButton.innerText == 'start') {
        timeButton.innerText = 'end'
        start = Date.now();
        interval = setInterval(() => {
            currentTimeElement.innerText = parseInt(currentTimeElement.innerText) + 1;
        }, 1000);
    } else {
        timeButton.innerText = 'start';
        clearInterval(interval);
        const dateTime = new Date(Date.now() - start) ;
        const result = `${dateTime.getSeconds()}.${dateTime.getMilliseconds()}`;
        currentTimeElement.innerText = result;
        results.push(parseFloat(result));
        addScramble();
        updateStats();
    }
}

function updateStats() {
    const ao5 = document.getElementById('ao5');
    const ao3 = document.getElementById('ao3');
    const ao12 = document.getElementById('ao12');
    const best = document.getElementById('best');
    
    if (results.length >= 3) {
        const slice = results.slice(results.length - 3, results.length);
        console.log(slice, results.length);
        ao3.innerText = slice.reduce((previous, current) => {
            return previous + current;
        }, 0) / 3;
    } else {
        ao3.innerText = 0;
    }

    if (results.length >= 5) {
        const slice = results.slice(results.length - 5, results.length);
        ao5.innerText = slice.reduce((previous, current) => {
            return previous + current;
        }, 0) / 5;
    } else  {
        ao5.innerText = 0;
    }

    if (results.length >= 12) {
        const slice = results.slice(results.length - 12, results.length);
        ao12.innerText = slice.reduce((previous, current) => {
            return previous + current;
        }, 0) / 12;
    } else {
        ao12.innerText = 0;
    }

    best.innerText = Math.min(...results);

    const all = document.getElementById('all');
    all.innerHTML = "";
    for(const time of results.reverse()) {
        const el = createTimeElement(time);
        all.appendChild(el);
    }
}


const groups = {
    L: {
        valid: ["L", "L'", "L2"],
        next: ["R", "D", "U", "B", "F"]
    },
    R: {
        valid: ["R", "R'", "R2"],
        next: ["L", "D", "U", "B", "F"]
    },
    U: {
        valid: ["U", "U'", "U2"],
        next: ["L", "D", "B", "R", "F"]
    },
    D: {
        valid: ["D", "D'", "D2"],
        next: ["L", "R", "B", "U", "F"]
    },
    F: {
        valid: ["F", "F'", "F2"],
        next: ["L", "D", "B", "U", "R"]
    },
    B: {
        valid: ["B", "B'", "B2"],
        next: ["L", "D", "F", "U", "R"]
    }
}
        

function generateScramble() {
    const temp = [];
    const keys = Object.keys(groups);
    const startIndex = keys[Math.floor(Math.random() * (keys.length - 1))];
    temp.push(groups[startIndex]);
    for(let i = 1; i < 20; i++) {
        const last = temp[temp.length - 1];
        const nextIndex = Math.floor(Math.random() * last.next.length);
        const nextGroup = last.next[nextIndex];
        const next = groups[nextGroup];
        temp.push(next);
    }

    const scramble = temp.map((group) => {
        return group.valid[Math.floor(Math.random() * group.valid.length)];
    })

    return scramble.join(" ");
}
