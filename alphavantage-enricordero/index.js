const API_KEY = "Q2C0C9DO4I0V9QIP"

let light = true

window.onload = async function () {
    await caricaGoogleMaps()

    let symbol = ""
    const comboBox = $(".comboBox")
    const searchBox = $("#searchBox")
    const body = $("body")
    $("#alert").hide()

    comboBox.prop("selectedIndex", -1)
    $("select").eq(0).on("change", function () {
        symbol = $(this).val()
        getGlobalQuotes(symbol);
        $("#quoteDetails").text(symbol)
        searchBox.val("")
        $("#bestMatches").empty()
        $("#alert").hide()
    })

    searchBox.on("keyup", function () {
        let keyword = searchBox.val()
        if (searchBox.val().length >= 2) {
            comboBox.prop("selectedIndex", -1)
            $("#bestMatches").empty()
            symbolSearch(keyword)
        }
    })

    $("#divGraph").css("visibility", "hidden")

    $("#dark-light").on("click", function () {
        if (body.hasClass("light")) {
            body.removeClass("light")
            body.addClass("dark")
            light = false
            $(this).children("i").removeClass("fa-solid fa-moon")
            $(this).children("i").addClass("fa-solid fa-sun")
            $("#title").css("color", "#fff")
            $("#title").css("background-image", "url(img/candlestick.jpg)")
            $("h3").css("color", "#fff")
            $("p").css("color", "#fff")
            $("p").css("background-color", "#444")
            $("span").css("color", "#fff")
            comboBox.css("background-color", "#444")
            comboBox.css("color", "#fff")
            $("#btnSee").css("color", "#fff")
            $("#btnSee").css("border-color", "#fff")
            searchBox.css("background-color", "#444")
            searchBox.css("color", "#fff")
            $("#bestMatches").css("background-color", "transparent")
            $("option").css("color", "#fff")
            $(".camp").css("background-color", "#444")
            $(".camp").css("color", "#fff")
            $("#divGraph").children("div").css("color", "white")
        }
        else {
            body.removeClass("dark")
            body.addClass("light")
            light = true
            $(this).children("i").removeClass("fa-solid fa-sun")
            $(this).children("i").addClass("fa-solid fa-moon")
            $("#title").css("color", "#000")
            $("#title").css("background-image", "url(img/white-candlestick.jpg)")
            $("h3").css("color", "#222")
            $("p").css("color", "#222")
            $("p").css("background-color", "rgb(244, 244, 244)")
            $("span").css("color", "#222")
            comboBox.css("background-color", "rgb(244, 244, 244)")
            comboBox.css("color", "#222")
            $("#btnSee").css("color", "#222")
            $("#btnSee").css("border-color", "#222")
            searchBox.css("background-color", "rgb(244, 244, 244)")
            searchBox.css("color", "#222")
            $("#bestMatches").css("background-color", "transparent")
            $("option").css("color", "#222")
            $(".camp").css("background-color", "rgb(244, 244, 244)")
            $(".camp").css("color", "#222")
            $("#divGraph").children("div").css("color", "black")
        }
    })

    $("#btnSee").on("click", function () {
        let coloreSfondo = "white"
        let coloreTesto = "black"
        if (light) {
            coloreSfondo = "white"
            coloreTesto = "black"
        }
        else if (!light) {
            coloreSfondo = "#222"
            coloreTesto = "white"
        }
        if (comboBox.val() == null)
            $("#alert").show("fast")
        else {     
            let url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
            $.getJSON(url,
                function (data) {
                    let length = JSON.stringify(data)
                    if(length.length != 2){
                        Swal.fire({
                            title: `<h4>${data["Symbol"]} SITE LOCATION</h4>`,
                            showCloseButton: true,
                            showConfirmButton: false,
                            width: '600px',
                            html: `
                            <div><b>INDUSTRY:</b> ${data["Industry"]}</div>
                            <div><b>SECTOR:</b> ${data["Sector"]}</div>
                            <div><b>ADDRESS: </b>${data["Address"]}</div>
                            <br>
                            <div id='divMap' width='500' height='500' style='margin: 0 auto;'></div>
                            `,
                            didOpen: function(){
                                let mapContainer = document.getElementById("divMap");
                                mapContainer.style.width = '500px';
                                mapContainer.style.height = '500px';
                            
                                let geocoder = new google.maps.Geocoder();
                                geocoder.geocode({ address: data["Address"] }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        let pos = results[0]["geometry"]["location"];
                                        let mapOptions = {
                                            center: pos,
                                            zoom: 14
                                        };
                                        if (mapContainer.offsetWidth > 0 && mapContainer.offsetHeight > 0) {
                                            let map = new google.maps.Map(mapContainer, mapOptions);
                                        } else {
                                            console.error('Map container is not visible or has zero size.');
                                        }
                                    } else {
                                        alert("Error: address not found");
                                    }
                                });
                            },
                            background: coloreSfondo,
                            color: coloreTesto
                        })
                    }
                    else{
                        Swal.fire({
                            title: `<h4>ERROR OCCURRED</h4>`,
                            showCloseButton: true,
                            showConfirmButton: false,
                            width: '500px',
                            html: `
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/34/ErrorMessage.png" width="150px">
                                <div>${comboBox.val()} data not found</div>
                            `,
                            background: coloreSfondo,
                            color: coloreTesto
                        })
                    }
                }
            )
        }
    })
}
