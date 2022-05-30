/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

var W = 1280;
var H = 720;

canvas.width = W;
canvas.height = H;

const A = {}; //ART OBJECT
A.mode = 'circle';
A.modes = ['circle', 'square'];

var x = 0;

// https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}

function CircleArt(amt) {
    for (var i = 0; i < amt; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const r = Math.random() * 20 + 10;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.fillStyle = `hsl(${((x + y) / (W + H)) * 360}, 100%, 50%)`;
        ctx.fill();
    }
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToRGB(h) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }

    return [+r, +g, +b];
}

function SquareArt(color1, color2, rows, columns, rgb=false) {
    if (rgb) {
        c1 = hexToRGB(color1);
        c2 = hexToRGB(color2);
    } else {
        c1 = hexToHSL(color1);
        c2 = hexToHSL(color2);
    }
    adif = c2[0] - c1[0];
    bdif = c2[1] - c1[1];
    cdif = c2[2] - c1[2];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            const x = (j / columns) * W;
            const y = (i / rows) * H;
            if (rgb) {
                ctx.fillStyle = `rgb(
                    ${c1[0] + (adif * ((i + j) / (parseInt(columns) + parseInt(rows))))}, 
                    ${c1[1] + (bdif * ((i + j) / (parseInt(columns) + parseInt(rows))))}, 
                    ${c1[2] + (cdif * ((i + j) / (parseInt(columns) + parseInt(rows))))})`;
            } else {
                ctx.fillStyle = `hsl(
                    ${c1[0] + (adif * ((i + j) / (parseInt(columns) + parseInt(rows))))}, 
                    ${c1[1] + (bdif * ((i + j) / (parseInt(columns) + parseInt(rows))))}%, 
                    ${c1[2] + (cdif * ((i + j) / (parseInt(columns) + parseInt(rows))))}%)`;
            }
            ctx.fillRect(x, y, W / columns, H / rows);
        }
    }
}

function Run() {
    ctx.clearRect(0, 0, W, H);
    switch (A.mode) {
        case 'circle':
            CircleArt(document.getElementById('circleiterations').value);
            break;
        case 'square':
            rgb = false;
            if (document.getElementById('squaregradient').value == 'rgb') rgb = true;
            SquareArt(
                document.getElementById('squarecolor1').value,
                document.getElementById('squarecolor2').value,
                document.getElementById('squarerows').value,
                document.getElementById('squarecolumns').value,
                rgb);
            break;
    }
    document.getElementById('output').src = canvas.toDataURL();
}

document.getElementById('mode').addEventListener('change', () => {
    A.mode = document.getElementById('mode').value;
    for (var i = 0; i < A.modes.length; i++) {
        if (A.modes[i] == A.mode) {
            document.getElementById(A.modes[i]).style.display = 'inline-block';
        } else {
            document.getElementById(A.modes[i]).style.display = 'none';
        }
    }
});

A.mode = document.getElementById('mode').value;
for (var i = 0; i < A.modes.length; i++) {
    if (A.modes[i] == A.mode) {
        document.getElementById(A.modes[i]).style.display = 'inline-block';
    } else {
        document.getElementById(A.modes[i]).style.display = 'none';
    }
}

document.getElementById('width').addEventListener('change', () => {
    W = parseInt(document.getElementById('width').value);
    canvas.width = W;
});

document.getElementById('height').addEventListener('change', () => {
    H = parseInt(document.getElementById('height').value);
    canvas.height = H;
});