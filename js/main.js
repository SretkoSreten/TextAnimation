const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

const mouse =
{
    x : null,
    y : null,
    radius: 150,
}

window.addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
})

ctx.fillStyle = "white";
ctx.font = "40px Verdana";
ctx.fillText('A', 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
    }
    update()
    {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius)
        {
            this.x -= directionX;
            this.y -= directionY;
        }else{
            if (this.x != this.baseX)
            {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y != this.baseY)
            {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

const init = () => {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128)
            {
                let posX = x * 30;
                let posY = y * 30;
                particleArray.push(new Particle(posX, posY));
            }
        }
    }
}
init();

const connect = () => {
    let opacityValue = 0.5;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){

            let x = particleArray[a].x - particleArray[b].x;
            let y = particleArray[a].y - particleArray[b].y;

            let distance = Math.sqrt(x * x + y * y);

            opacityValue = 1 - (distance / 75)

            ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;

            if (distance < 50){
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}


const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    connect();

    for (let i = 0; i < particleArray.length; i++)
    {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}
animate();