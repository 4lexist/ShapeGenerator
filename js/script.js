document.onclick = clickAction;

let dots = [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}]
let nbDots = 0;
const dotSize = 11;

let dragId = null;
let clickType = '';


function clickAction(event) {
    switch (clickType) {
        case 'showAbout':
            document.getElementById(`about`).onclick = hideAbout;
            break;
        case 'hideAbout':
            document.getElementById(`about`).onclick = showAbout;
            clickType = '';
            break;
        default: if(nbDots < 3) {
            nbDots += 1;
            createDot(nbDots, event);
            nbDots === 3 && drawShapes();
        }
        break;
    }
}

function createDot(index, event) {
    const dotStyle = `
        position:absolute;
        left:${dotPosition(event).x}px;
        top:${dotPosition(event).y}px
    `
    const dot = `
        <div
            class="dot",
            id="dot${index}",
            style="${dotStyle}",
            draggable="true",,
            ondragstart="onDrag(${index})",
            ondragend="onDragEnd()"
        >
        </div>
    `
    dots[index - 1].x = dotPosition(event).x;
    dots[index - 1].y = dotPosition(event).y;
    document.getElementById('container').innerHTML += dot;
    updateDotList(index, event);
}

function dotPosition(event) {
    const x = event.pageX - dotSize / 2;
    const y = event.pageY - dotSize / 2;
    return {x, y}
}

function updateDotList(index, event) {
    const li = `
        <li id="dot${index}coordinate">
            Dot ${index} coordinate : {x:${dots[index-1].x}, y:${dots[index-1].y}}
        </li>
    `
    document.getElementById('dotsInfo').innerHTML += li;
}

function drawShapes() {
    const x1 = dots[0].x + dotSize / 2;
    const x2 = dots[1].x + dotSize / 2;
    const x3 = dots[2].x + dotSize / 2;
    const x4 = dots[0].x + (dots[2].x - dots[1].x) + dotSize / 2;
    const y1 = dots[0].y + dotSize / 2;
    const y2 = dots[1].y + dotSize / 2;
    const y3 = dots[2].y + dotSize / 2;
    const y4 = dots[0].y + (dots[2].y - dots[1].y) + dotSize / 2;
    drawParallelogram(x1, x2, x3, x4, y1, y2, y3, y4);
    drawCircle(x1, x2, x3, y1, y2, y3);

    /* Non blocking test, print errors in console if tests fail */
    testParallelogram(x1, x2, x3, x4, y1, y2, y3, y4);
}

function drawParallelogram(x1, x2, x3, x4, y1, y2, y3, y4) {
  let lines = [];
  lines.push(createLine(x1,y1, x2,y2));
  lines.push(createLine(x2,y2, x3,y3));
  lines.push(createLine(x3,y3, x4,y4));
  lines.push(createLine(x4,y4, x1,y1));
  document.getElementById('parallelogram').innerHTML = lines.join("");
}

function createLine(x1,y1, x2,y2){
    const length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    const angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const lineStyle = `
        position:absolute;
        left:${x1}px;
        top:${y1}px;
        width:${length}px;
        transform:rotate(${angle}deg);
    `
    const line = `
        <div
            class="line"
            style="${lineStyle}"
        >
        </div>
    `
    return line;
}

function testParallelogram(x1, x2, x3, x4, y1, y2, y3, y4) {
    const length1 = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    const angle1  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    const length2 = Math.sqrt((x2-x3)*(x2-x3) + (y2-y3)*(y2-y3));
    const angle2  = Math.atan2(y3 - y2, x3 - x2) * 180 / Math.PI;

    const length3 = Math.sqrt((x3-x4)*(x3-x4) + (y3-y4)*(y3-y4));
    const angle3  = Math.atan2(y4 - y3, x4 - x3) * 180 / Math.PI;

    const length4 = Math.sqrt((x4-x1)*(x4-x1) + (y4-y1)*(y4-y1));
    const angle4  = Math.atan2(y1 - y4, x1 - x4) * 180 / Math.PI;

    console.assert(Math.round(length1) === Math.round(length3), `Lines are not the same length`);
    console.assert(Math.round(Math.abs(angle1 - angle3)) === 180, `Lines are not parallel`);
    console.assert(Math.round(length2) === Math.round(length4), `Lines are not the same length`);
    console.assert(Math.round(Math.abs(angle2 - angle4)) === 180, `Lines are not parallel`);
}

function drawCircle(x1, x2, x3, y1, y2, y3) {
    const areaParallelogram = Math.abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1));
    const radius = Math.sqrt(areaParallelogram / Math.PI);
    const diameter = 2 * radius;
    xCircle = (x1 + x3) / 2 - radius;
    yCircle = (y1 + y3) / 2 - radius;
    const circleStyle = `
        position:absolute;
        left:${xCircle}px;
        top:${yCircle}px;
        width:${diameter}px;
        height:${diameter}px;
    `
    const circle = `
        <div
            class="circle"
            style="${circleStyle}"
        >
        </div>
    `
    document.getElementById('circle').innerHTML = circle;

    const areaCircle = Math.PI * radius * radius;
    const lis = `
        <li>
            Parallelogram area : ${areaParallelogram} square px
        </li>
        <li>
            Circle area : ${Math.round(areaCircle)} square px
        </li>
    `
    document.getElementById('areasInfo').innerHTML = lis;
}

// TODO: Remove ghost image
function onDrag(index) {
    document.ondragover = function(event) {
        dots[index - 1].x = dotPosition(event).x;
        dots[index - 1].y = dotPosition(event).y;
        const dotStyle = `
            position:absolute;
            left:${dots[index-1].x}px;
            top:${dots[index-1].y}px
        `
        document.getElementById(`dot${index}`).style = dotStyle; // TODO: fix issues with Safari
        document.getElementById(`dot${index}coordinate`).innerHTML = `Dot ${index} coordinate : {x:${dots[index-1].x}, y:${dots[index-1].y}}`;
        drawShapes();
    }
}

function onDragEnd() {
    clearInterval(dragId);
}

document.getElementById(`reset`).onclick = reset;
function reset() {
    setTimeout(function(){ // setTimeout needed to erase the dot created onclick
        dots = [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}]
        nbDots = 0;

        document.getElementById('dotsInfo').innerHTML = '';
        document.getElementById('areasInfo').innerHTML = '';
        document.getElementById('container').innerHTML = `
            <div id='parallelogram'></div>
            <div id='circle'></div>
        `
    }, 10);
}

document.getElementById(`about`).onclick = showAbout;
function showAbout() {
    clickType = 'showAbout';
    document.getElementById('about-details').style = 'display:block';
}

function hideAbout() {
    clickType = 'hideAbout';
    document.getElementById('about-details').style = '';
}
