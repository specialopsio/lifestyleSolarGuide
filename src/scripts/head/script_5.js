document.addEventListener('DOMContentLoaded', () => {
    const countUpElements = document.querySelectorAll('.count-up');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.textContent, 10); // Convert the text to a float
                element.textContent = '0'; // Reset the text to 0 without affecting the unit
                animateCountUp(element, 0, target, 2000); // Duration of 2000 ms
                observer.unobserve(element); // Stop observing after animating
            }
        });
    }, {
        threshold: 0.5 // Configure this value based on when you want the animation to start
    });

    countUpElements.forEach(element => {
        observer.observe(element);
    });

    function animateCountUp(elem, start, end, duration) {
        let startTime = null;
        const decimalPlaces = Math.max(
            (start.toString().split('.')[1] || '').length,
            (end.toString().split('.')[1] || '').length
        );

        // Easing function: easeOutQuad
        const easeOutQuad = t => t * (2 - t);

        const tick = currentTime => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutQuad(progress);

            const current = start + (end - start) * easedProgress;
            elem.textContent = current.toFixed(decimalPlaces); // Formats to fixed decimal places

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                elem.textContent = end.toFixed(decimalPlaces); // Ensure it ends on the exact target number
            }
        };

        requestAnimationFrame(tick);
    }
});