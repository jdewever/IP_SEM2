window.createBarChart = (title, data, el) => {
    return new Chart(el, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: title,
                data: data.datasetData,
                backgroundColor: data.backgroundcolors,
                barPercentage: 0.9
            }]
        },
        options: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
        }

    });
}

/*!
 * @param  {Array} data History data
 * @param  {String} sensor  sensor to pull data from
 * @return {Array}     Sensor data array for chart
 */
window.convertBarData = (data, sensor) => {
    const newData = {
        labels: [],
        datasetData: [],
        backgroundcolors: []
    }

    if (data.length > 5)
        data = data.slice(Math.max(data.length - 5, 1))

    data.reverse().forEach(reading => {
        const time = new Date(reading.time.seconds * 1000)

        newData.labels.push(time.toLocaleTimeString())
        newData.labels.push(time.toLocaleTimeString())
        newData.labels.push("")

        const clean = parseFloat(reading.sensors.clean[sensor])
        const raw = parseFloat(reading.sensors.raw[sensor])

        newData.datasetData.push(raw)
        newData.datasetData.push(clean)
        newData.datasetData.push("")

        newData.backgroundcolors.push(window.getColor(raw, sensor))
        newData.backgroundcolors.push(window.getColor(clean, sensor))
        newData.backgroundcolors.push("none")
    });

    return newData

}

window.getColor = (value, sensor) => {
    if (sensor == "salt") {
        if (value < 300) return "green"
        else if (value < 750) return "yellow"
        else if (value < 1200) return "orange"
        else return "red"
    }
    else if (sensor == "turbidity") {
        if (value < 1) return "green"
        else if (value < 5) return "yellow"
        else if (value < 10) return "orange"
        else return "red"
    }
}

window.defaultChart = el => {
    new Chart(el, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', "", 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, , 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

window.createLineChart = (title1, data1, title2, data2, labels, el) => {
    return new Chart(el, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title1,
                data: data1,
                borderColor: "red"
            }, {
                label: title2,
                data: data2,
                borderColor: "green"
            }]
        },
        options: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: 'time',
                time: {
                    unit: "second"
                }
            }]
        }

    });
}

window.convertLineData = (data, sensor) => {
    const raw = [], clean = [], labels = []
    if (data.length > 5)
        data = data.slice(Math.max(data.length - 5, 1))
    data.reverse().forEach(reading => {
        raw.push(parseFloat(reading.sensors.raw[sensor]))
        clean.push(parseFloat(reading.sensors.clean[sensor]))
        const time = new Date(reading.time.seconds * 1000)
        labels.push(time.toLocaleTimeString())

    });
    return { raw: raw, clean: clean, labels: labels }
}