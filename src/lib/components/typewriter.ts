// typewriter.ts

export function typewriter(node: HTMLElement, initialSpeed = 80): {
    update: (newSpeed: number) => void;
    destroy: () => void;
} {
    const words = (node.textContent || "").split(" ");
    node.textContent = "";

    let i = 0;
    let speed = initialSpeed;

    function type() {
        if (i < words.length) {
            node.textContent += words[i++] + " ";  // Add a space after each word
            setTimeout(type, speed);
        }
    }

    type();

    return {
        update(newSpeed: number) {
            speed = newSpeed;
        },
        destroy() {
            // any cleanup logic if necessary
        }
    };
}
