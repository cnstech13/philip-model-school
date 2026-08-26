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

/* =========================
   FAQ ACCORDION
========================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");

faqQuestions.forEach(button => {

    button.addEventListener("click", function () {

        const faqItem =
            this.closest(".faq-item");

        const isOpen =
            faqItem.classList.contains("active");


        // Close all other FAQ items
        document
            .querySelectorAll(".faq-item")
            .forEach(item => {

                item.classList.remove("active");

                const icon =
                    item.querySelector(
                        ".faq-question span:last-child"
                    );

                if (icon) {
                    icon.textContent = "+";
                }

            });


        // Open the clicked item
        if (!isOpen) {

            faqItem.classList.add("active");

            const icon =
                this.querySelector(
                    "span:last-child"
                );

            if (icon) {
                icon.textContent = "−";
            }

        }

    });

});