/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("show");

    menuBtn.classList.toggle("open");

});


/* Close mobile menu after clicking a link */

document.querySelectorAll(".navbar a").forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("show");
        menuBtn.classList.remove("open");

    });

});


/* =========================
   DARK MODE
========================= */

const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("schoolTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "schoolTheme",
        isDark ? "dark" : "light"
    );

    themeBtn.textContent =
        isDark ? "☀️" : "🌙";

});


/* =========================
   CURRENT YEAR
========================= */

const yearElement =
    document.getElementById("year");

if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}


/* =========================
   STATISTICS COUNTER
========================= */

const counters =
    document.querySelectorAll("[data-count]");

if (counters.length > 0) {

    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    const counter = entry.target;

                    const target =
                        Number(counter.dataset.count);

                    let current = 0;

                    const increment =
                        Math.max(
                            1,
                            Math.ceil(target / 60)
                        );

                    const updateCounter = () => {

                        current += increment;

                        if (current >= target) {

                            counter.textContent =
                                target;

                            return;
                        }

                        counter.textContent =
                            current;

                        requestAnimationFrame(
                            updateCounter
                        );
                    };

                    updateCounter();

                    counterObserver.unobserve(
                        counter
                    );

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

}


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name =
                document.getElementById(
                    "name"
                ).value.trim();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const subject =
                document.getElementById(
                    "subject"
                ).value.trim();

            const message =
                document.getElementById(
                    "message"
                ).value.trim();


            const messages =
                JSON.parse(
                    localStorage.getItem(
                        "schoolMessages"
                    )
                ) || [];


            messages.push({

                id: Date.now(),

                name,
                email,
                subject,
                message,

                date:
                    new Date().toISOString()

            });


            localStorage.setItem(
                "schoolMessages",
                JSON.stringify(messages)
            );


            alert(
                "Thank you! Your message has been received."
            );


            contactForm.reset();

        }
    );

}