
(function () {
    const headerContainer = document.getElementById("header");

    if (!headerContainer) {
        console.warn('header.js: No element with id="header" found on the page.');
        return;
    }

    // Change this path if your header.html is in a different location
    const headerPath = "header.html";

    fetch(headerPath)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load header.html (status " + response.status + ")");
            }
            return response.text();
        })
        .then(function (html) {
            // 1. Inject the header HTML
            headerContainer.innerHTML = html;

            // 2. Find all <script> tags that were just injected
            const scripts = headerContainer.querySelectorAll("script");

            scripts.forEach(function (oldScript) {
                // Create a new script element
                const newScript = document.createElement("script");

                // Copy the code from the old script
                if (oldScript.src) {
                    // External script
                    newScript.src = oldScript.src;
                } else {
                    // Inline script
                    newScript.textContent = oldScript.textContent;
                }

                // Add it to the page so the browser actually runs it
                document.body.appendChild(newScript);

                // Remove the original (non-executed) script
                oldScript.remove();
            });
        })
        .catch(function (error) {
            console.error("header.js error:", error);
            headerContainer.innerHTML = "<!-- Header failed to load -->";
        });
})();










// =====================================
// LOAD HEADER
// =====================================

// fetch("header.html")
//     .then(function(response) {
//         if (!response.ok) {
//             throw new Error("Header could not be loaded.");
//         }

//         return response.text();
//     })
//     .then(function(data) {

//         document.getElementById("header").innerHTML = data;

//         // INITIALIZE MOBILE MENU
//         setupHeaderMenu();

//     })
//     .catch(function() {
//         document.getElementById("header").innerHTML = "";
//     });


// =====================================
// HEADER MENU FUNCTION
// =====================================

// function setupHeaderMenu() {

//     const menuBtn = document.getElementById("menuBtn");
//     const mobileMenu = document.getElementById("mobileMenu");

//     const categoryBtn =
//         document.getElementById("mobileCategoryBtn");

//     const categories =
//         document.getElementById("mobileCategories");


//     // Stop if an element is missing
//     if (!menuBtn || !mobileMenu) {
//         return;
//     }


//     // OPEN AND CLOSE MOBILE MENU
//     menuBtn.addEventListener("click", function() {

//         mobileMenu.classList.toggle("show");

//         const icon = menuBtn.querySelector("i");

//         if (icon) {

//             if (mobileMenu.classList.contains("show")) {

//                 icon.classList.remove("fa-bars");
//                 icon.classList.add("fa-xmark");

//             } else {

//                 icon.classList.remove("fa-xmark");
//                 icon.classList.add("fa-bars");

//             }

//         }

//     });


//     // OPEN AND CLOSE MOBILE CATEGORIES
//     if (categoryBtn && categories) {

//         categoryBtn.addEventListener("click", function() {

//             categories.classList.toggle("show");

//         });

//     }


    // CLOSE MENU WHEN A LINK IS CLICKED
//     const mobileLinks = mobileMenu.querySelectorAll("a");

//     for (let i = 0; i < mobileLinks.length; i++) {

//         mobileLinks[i].addEventListener("click", function() {

//             mobileMenu.classList.remove("show");

//             if (categories) {
//                 categories.classList.remove("show");
//             }

//             const icon = menuBtn.querySelector("i");

//             if (icon) {
//                 icon.classList.remove("fa-xmark");
//                 icon.classList.add("fa-bars");
//             }

//         });

//     }

// }


// // =====================================
// // LOAD FOOTER
// // =====================================

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
