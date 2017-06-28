document.onclick = clickAction;

let nbDots = 0;

function clickAction(event) {
    if(nbDots < 3) {
        nbDots += 1;
        createDot(nbDots, event);
    }
}

function createDot(index, event) {
    const dotStyle = `
        position:absolute;
        left:${dotPosition(event).x}px;
        top:${dotPosition(event).y}px
    `
    const dot =
        `<div
            class="dot",
            id="dot${index}",
            style="${dotStyle}"
        >
        </div>
        `
    document.getElementById('container').innerHTML += dot;
}

function dotPosition(event) {
    const dotSize = 11;
    const x = event.pageX - dotSize / 2;
    const y = event.pageY - dotSize / 2;
    return {x, y}
}
