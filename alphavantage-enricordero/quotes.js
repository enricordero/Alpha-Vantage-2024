"use strict"

function getGlobalQuotes(symbol) {
    let url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    $.getJSON(url,
        function (data) {
            let globalQuoteData = data["Global Quote"];
            $("#symbol").text(globalQuoteData["01. symbol"]);
            $("#open").text(globalQuoteData["02. open"]);
            $("#daysHigh").text(globalQuoteData["03. high"]);
            $("#daysLow").text(globalQuoteData["04. low"]);
            $("#lastTrade").text(globalQuoteData["05. price"]);
            $("#volume").text(globalQuoteData["06. volume"]);
            $("#lastTradeTime").text(globalQuoteData["07. latest trading day"]);
            $("#previousClose").text(globalQuoteData["08. previous close"]);
            $("#change").text(globalQuoteData["09. change"]);
        }
    );
}

function symbolSearch(keyword) {
    let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${API_KEY}`
    $.getJSON(url,
        function (data) {
/*            let p = $("<p>").text("MSFT")
                .css({
                    "width": "300px",
                    "font-weight": "bold",
                    "border-radius": "5px",
                    "margin": "5px auto",
                    "padding": "6px",
                })
            p.on("click", function () {
                $("#searchBox").val($(this).text())
                $("#quoteDetails").text($(this).text())
                getData($(this).text())
            })
            p.on("mouseover", function () {
                $(this).css("cursor", "pointer")
            })
            p.appendTo("#bestMatches")
            if (light) {
                p.css({
                    "color": "#222",
                    "background": "rgb(244, 244 ,244)",
                })
            }
            else if (!light) {
                p.css({
                    "color": "white",
                    "background": "#444",
                })
            }
*/
            data["bestMatches"].forEach(function (element) {
                let p = $("<p>").text(element["2. name"])
                    .css({
                        "width": "300px",
                        "color": "#222",
                        "font-weight": "bold",
                        "background": "rgb(244, 244 ,244)",
                        "border": "1px solid transparent",
                        "border-radius": "5px",
                        "margin": "5px auto",
                        "padding": "6px"

                    })
                p.on("click", function () {
                    $("#searchBox").val($(this).text())
                    getGlobalQuotes(element["1. symbol"])
                    $("#quoteDetails").text(element["2. name"])
                    getData($(this).text())
                })
                p.on("mouseover", function () {
                    $(this).css({
                        "cursor": "pointer",
                        "border": "1px solid grey"
                    })
                })
                p.on("mouseout", function () {
                    $(this).css({
                        "border": "0px"
                    })
                })
                p.appendTo($("#bestMatches")).appendTo("#bestMatches")
                if (light) {
                    p.css({
                        "color": "#222",
                        "background": "rgb(244, 244 ,244)",
                    })
                }
                else if (!light) {
                    p.css({
                        "color": "white",
                        "background": "#444",
                    })
                }
            });
        }
    );
}

function getData(symbol) {
    symbol = "IBM"
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`
    $.getJSON(url,
        function (data) {
            let vet = []
            let vetClose = []
            let vetLabels = []
            for (const key in data["Monthly Time Series"]) {
                if (!vet.includes(key.substring(0, 4))) {
                    vet.push(key.substring(0, 4))
                }
            }

            for (const item of vet) {
                $("<option>").text(item).appendTo(".comboDate")
            }

            $(".comboDate").on("change", function () {
                $("#divGraph").css("visibility", "visible")
                $.getJSON(url, function (data) {
                    vetClose = []
                    vetLabels = []
                    for (const key in data["Monthly Time Series"]) {
                        if (key.substring(0, 4) == $(".comboDate").val()) {
                            vetClose.push(data["Monthly Time Series"][key]["4. close"])
                            vetLabels.push(key)
                        }
                    }

                    $.getJSON("http://localhost:3000/chart", function (data) {
                        data["data"]["labels"] = vetLabels
                        data["data"]["datasets"][0]["label"] = $("#quoteDetails").text() + " QUOTE GRAPH"
                        data["data"]["datasets"][0]["data"] = vetClose
                        let divGraph = document.getElementById("myChart")
                        let myChart = new Chart(divGraph, data)
                    })
                })
            })

            $(".comboDate").prop("selectedIndex", -1)
        }
    )
}
