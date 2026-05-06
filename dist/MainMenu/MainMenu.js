const firefliesContainer = document.getElementById('fireflies');
const numFireflies = 50;
let fireflies = [];
let mousPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let scatterMode = false;
function createFirefly() {
    const firefly = document.createElement("div");
    firefly.classList.add("firefly");
    firefly.style.left = `${Math.random() * window.innerWidth}px`;
    firefly.style.top = `${Math.random() * window.innerHeight}px`;
    firefly.style.animationDuration = `${Math.random() * 2 + 1}s`;
    firefly.speedX = (Math.random() - 0.5) * 2;
    firefly.speedY = (Math.random() - 0.5) * 2;
    firefly.trailDuration = Math.random() * 1 + 1;
    fireflies.push(firefly);
    firefliesContainer.appendChild(firefly);
    return firefly;
}
function generatedFireflies() {
    for (let i = 0; i < numFireflies; i++) {
        createFirefly();
    }
}
function updateFireflies() {
    fireflies.forEach(firefly => {
        if (!scatterMode) {
            firefly.style.left = `${parseFloat(firefly.style.left) + firefly.speedX}px`;
            firefly.style.top = `${parseFloat(firefly.style.top) + firefly.speedy}px`;
        }
        else {
            const targetX = mousPosition.x + (Math.random() - 0.5) * 300;
            const targetY = mousPosition.y + (Math.random() - 0.5) * 300;
            const dx = targetX - parseFloat(firefly.style.left);
            const dy = targetY - parseFloat(firefly.style.top);
            firefly.style.left = `${parseFloat(firefly.style.left) + dx * 0.1}px`;
            firefly.style.top = `${parseFloat(firefly.style.top) + dy * 0.1}px`;
        }
        const trail = document.createElement("div");
        trail.classList.add("trail");
        trail.style.left = `${parseFloat(firefly.style.left) - 3}px`;
        trail.style.top = `${parseFloat(firefly.style.top) - 3}px`;
        firefliesContainer.appendChild(trail);
        setTimeout(() => {
            firefliesContainer.removeChild(trail);
        }, firefly.trailDuration + 1000);
    });
}
function onMouseMove(event) {
    mousPosition.x = event.pageX;
    mousPosition.y = event.pageY;
}
function onMouseClick() {
    scatterMode = !scatterMode;
    if (!scatterMode) {
        setTimeout(() => {
            fireflies.forEach(firefly => {
                firefly.style.left = `${Math.random() * window.innerWidth}px`;
                firefly.style.top = `${Math.random() * window.innerHeight}px`;
            });
        }, 500);
    }
}
function animate() {
    updateFireflies();
    requestAnimationFrame(animate);
}
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onMouseClick);
generatedFireflies();
animate();
document.querySelector(".play-button").addEventListener("click", function () {
    window.location.href = "????"; // Tilføj siden vi bruger til at lave selve spillet
});
export {};
//# sourceMappingURL=MainMenu.js.map