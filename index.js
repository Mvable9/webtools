const heroSearch =
            document.getElementById("heroSearch");

        const heroSearchBtn =
            document.getElementById("heroSearchBtn");


        function searchTool() {

            const searchValue =
                heroSearch.value.trim();

            if (searchValue === "") {

                heroSearch.focus();

                return;
            }

            /*
                Later we will connect this to the
                real tools search system.

                For now it simply sends the user
                to the tools page.
            */

            window.location.href =
                "tools.html?search=" +
                encodeURIComponent(searchValue);

        }


        heroSearchBtn.addEventListener(
            "click",
            searchTool
        );


        heroSearch.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    searchTool();

                }

            }
        );

    
