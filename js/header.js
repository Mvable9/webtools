fetch("header.html")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Header could not be loaded.");
        }

        return response.text();
    })
    .then(function(data) {

        document.getElementById("header").innerHTML = data;

        // INITIALIZE MOBILE MENU
        setupHeaderMenu();

    })
    .catch(function() {
        document.getElementById("header").innerHTML = "";
    });


// =====================================
// HEADER MENU FUNCTION
// =====================================

function setupHeaderMenu() {

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    const categoryBtn =
        document.getElementById("mobileCategoryBtn");

    const categories =
        document.getElementById("mobileCategories");


    // Stop if an element is missing
    if (!menuBtn || !mobileMenu) {
        return;
    }


    // OPEN AND CLOSE MOBILE MENU
    menuBtn.addEventListener("click", function() {

        mobileMenu.classList.toggle("show");

        const icon = menuBtn.querySelector("i");

        if (icon) {

            if (mobileMenu.classList.contains("show")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });


    // OPEN AND CLOSE MOBILE CATEGORIES
    if (categoryBtn && categories) {

        categoryBtn.addEventListener("click", function() {

            categories.classList.toggle("show");

        });

    }


    // CLOSE MENU WHEN A LINK IS CLICKED
    const mobileLinks = mobileMenu.querySelectorAll("a");

    for (let i = 0; i < mobileLinks.length; i++) {

        mobileLinks[i].addEventListener("click", function() {

            mobileMenu.classList.remove("show");

            if (categories) {
                categories.classList.remove("show");
            }

            const icon = menuBtn.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    }

}


// =====================================
// LOAD FOOTER
// =====================================

fetch("footer.html")
    .then(function(response) {

        if (!response.ok) {
            throw new Error("Footer could not be loaded.");
        }

        return response.text();

    })
    .then(function(data) {

        document.getElementById("footer").innerHTML = data;

    })
    .catch(function() {

        document.getElementById("footer").innerHTML = "";

    });
