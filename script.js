var ctx = document.getElementById("graph").getContext("2d")

var data = null;
var chart = null;

function getData() {
    let start = document.getElementById("start").valueAsDate;
    let end   = document.getElementById("end")  .valueAsDate;

    let url = new URL("https://www.cbussuper.com.au/cbus-services/cbussuper/crediting-rates-display");
    let params = {
        fundType: "a",
        startDate: start.getDate().toString().padStart(2, '0') + "-" + (start.getMonth()+1).toString().padStart(2, '0') + "-" + start.getFullYear(),
        endDate:   end  .getDate().toString().padStart(2, '0') + "-" + (end  .getMonth()+1).toString().padStart(2, '0') + "-" + end  .getFullYear(),
        _: Date.now(),
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return fetch("https://cors-anywhere.herokuapp.com/" + url.href)
        .then(res => res.json())
        .then(json => json.reverse());
}

async function updateGraph() {
    if (chart != null) {
        chart.destroy();
    }

    ctx.font = "32px Poppins"
    ctx.fillText("Loading...", 10, 50);

    data = await getData();

    graphData = {
        labels: data.map(x => x["DAILY"] || x["WEEKLY"]),
        datasets: []
    }

    for (key in data[0]) {
        if (key != "DAILY" && key != "WEEKLY") {
            let temp = 0;
            graphData.datasets.push({
                label: key,
                data: data.map(x => temp += Number(x[key].slice(0, -1)))
            });
        }
    }

    chart = new Chart(ctx, {
        type: "line",
        data: graphData,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "% Increase (Cumulative)"
                    }
                }
            }
        }
    });
}
