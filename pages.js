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


                    const counter =
                        entry.target;


                    const target =
                        Number(
                            counter.dataset.count
                        );


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

        counterObserver.observe(
            counter
        );

    });

}


/* =========================
   FAQ ACCORDION
========================= */

const faqQuestions =
    document.querySelectorAll(
        ".faq-question"
    );


faqQuestions.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const faqItem =
                this.closest(
                    ".faq-item"
                );


            const isOpen =
                faqItem.classList.contains(
                    "active"
                );


            /*
             * Close all other FAQ items
             */

            document
                .querySelectorAll(
                    ".faq-item"
                )
                .forEach(item => {

                    item.classList.remove(
                        "active"
                    );


                    const icon =
                        item.querySelector(
                            ".faq-question span:last-child"
                        );


                    if (icon) {

                        icon.textContent =
                            "+";

                    }

                });


            /*
             * Open clicked FAQ
             */

            if (!isOpen) {

                faqItem.classList.add(
                    "active"
                );


                const icon =
                    this.querySelector(
                        "span:last-child"
                    );


                if (icon) {

                    icon.textContent =
                        "−";

                }

            }

        }
    );

});


/* ============================================================
   CONTACT FORM - WEB3FORMS
   Philip Model School

   No localStorage
   No Firebase
============================================================ */

const contactForm =
    document.getElementById(
        "contactForm"
    );


if (contactForm) {

    const submitBtn =
        document.getElementById(
            "contactSubmitBtn"
        );


    const buttonText =
        submitBtn
            ? submitBtn.querySelector(
                ".button-text"
            )
            : null;


    const spinner =
        document.getElementById(
            "contactSpinner"
        );


    const formMessage =
        document.getElementById(
            "contactFormMessage"
        );


    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =========================================
               CHECK REQUIRED ELEMENTS
            ========================================= */

            if (!submitBtn) {

                console.error(
                    "contactSubmitBtn was not found."
                );

                return;

            }


            /* =========================================
               SHOW LOADING
            ========================================= */

            submitBtn.disabled =
                true;


            if (buttonText) {

                buttonText.textContent =
                    "Sending...";

            }


            if (spinner) {

                spinner.style.display =
                    "inline-block";

            }


            if (formMessage) {

                formMessage.style.display =
                    "none";

                formMessage.textContent =
                    "";

                formMessage.className =
                    "form-message";

            }


            try {

                /* =====================================
                   GET FORM DATA
                ===================================== */

                const formData =
                    new FormData(
                        contactForm
                    );


                /* =====================================
                   SEND TO WEB3FORMS
                ===================================== */

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {

                            method: "POST",

                            body: formData

                        }
                    );


                const result =
                    await response.json();


                /* =====================================
                   SUCCESS
                ===================================== */

                if (
                    response.ok &&
                    result.success
                ) {

                    if (formMessage) {

                        formMessage.textContent =
                            "✓ Message sent successfully! We will get back to you soon.";


                        formMessage.className =
                            "form-message success";


                        formMessage.style.display =
                            "block";

                    }


                    /* Clear form */

                    contactForm.reset();

                }


                /* =====================================
                   WEB3FORMS FAILURE
                ===================================== */

                else {

                    if (formMessage) {

                        formMessage.textContent =
                            "✕ Message could not be sent. Please try again.";


                        formMessage.className =
                            "form-message error";


                        formMessage.style.display =
                            "block";

                    }

                }

            }


            /* =========================================
               CONNECTION / JAVASCRIPT ERROR
            ========================================= */

            catch (error) {

                console.error(
                    "Web3Forms Error:",
                    error
                );


                if (formMessage) {

                    formMessage.textContent =
                        "✕ Unable to send message. Please check your internet connection and try again.";


                    formMessage.className =
                        "form-message error";


                    formMessage.style.display =
                        "block";

                }

            }


            /* =========================================
               STOP LOADING
            ========================================= */

            submitBtn.disabled =
                false;


            if (buttonText) {

                buttonText.textContent =
                    "Send Message";

            }


            if (spinner) {

                spinner.style.display =
                    "none";

            }

        }
    );

}