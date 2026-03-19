const rings = [
    { id: 'j1', n: 1, color: '#0085C7' },
    { id: 'j2', n: 2, color: '#1a1a1a' },
    { id: 'j3', n: 3, color: '#DF0024' },
    { id: 'j4', n: 4, color: '#F4A900' },
    { id: 'j5', n: 5, color: '#009F6B' },
];

let selected = null;

function draw(ring, isSelected) {
    const canvas = document.getElementById(ring.id);
    const ctx = canvas.getContext('2d');
    const cx = 45, cy = 45, r = 34;

    ctx.clearRect(0, 0, 90, 90);

    if (isSelected) {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = ring.color + '22';
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = isSelected ? 9 : 7;
    ctx.stroke();

    ctx.font = `${isSelected ? '600' : '400'} 26px sans-serif`;
    ctx.fillStyle = ring.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ring.n, cx, cy);
}

function select(ring) {
    selected = ring.n;
    rings.forEach(r => draw(r, r.n === selected));
    
    localStorage.setItem('temp_nb_joueurs', selected);
    
    setTimeout(() => {
        window.location.href = "joueurs.php";
    }, 300);
}

rings.forEach(ring => {
    draw(ring, false);
    document.getElementById(ring.id).addEventListener('click', () => select(ring));
});

function getPlayerCount() {
    return selected;
}