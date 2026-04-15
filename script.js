const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const parallaxRoot = document.querySelector("[data-parallax-root]");
const parallaxLayers = document.querySelectorAll("[data-parallax-layer]");

let rafId = null;

if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        siteNav.classList.toggle("is-open", !expanded);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            siteNav.classList.remove("is-open");
        });
    });
}

const updateHeader = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.16,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

if (parallaxRoot && parallaxLayers.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const moveLayers = (event) => {
        const bounds = parallaxRoot.getBoundingClientRect();
        const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            parallaxLayers.forEach((layer) => {
                const depth = Number(layer.dataset.depth || 0);
                const offsetX = relativeX * depth;
                const offsetY = relativeY * depth;
                layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            });
        });
    };

    const resetLayers = () => {
        parallaxLayers.forEach((layer) => {
            layer.style.transform = "translate3d(0, 0, 0)";
        });
    };

    parallaxRoot.addEventListener("mousemove", moveLayers);
    parallaxRoot.addEventListener("mouseleave", resetLayers);
}
