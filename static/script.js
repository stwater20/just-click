// script.js
document.getElementById('counter-button').addEventListener('click', function() {
    const counter = document.getElementById('counter-value');
    let count = parseInt(counter.innerText);
    count++;
    counter.innerText = count;

    // Add animation class and remove after the animation completes
    counter.classList.add('bump');
    setTimeout(() => {
        counter.classList.remove('bump');
    }, 300); // Matches the animation duration
});
