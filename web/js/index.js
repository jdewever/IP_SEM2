// Firebase dingetjes
const db = firebase.firestore()
const ref = db.collection("gekkeWaterton")

const graphs = {
    temp: document.getElementById("tempGraph"),
    turb: document.getElementById("turbGraph"),
    vol: document.getElementById("volGraph"),
    salt: document.getElementById("saltGraph"),
    default: document.getElementById("defaultGraph")
}

// Wanneer data veranderen zou
ref.doc("latest").onSnapshot(doc => {
    const data = doc.data()
    const el = document.getElementById("latestData")
    let content = ""

    content += "<table>"
    content += `<tr><th>Time</th><td><span id=time>${data.time.toDate().toLocaleString()}</span></td></tr>`
    content += `<tr><th>Temperature</th><td><span id=RAW_temp>RAW: ${data.sensors.raw.temperature}<span class=unit>°C</span></span> | <span id=CLEAN_temp>CLEAN: ${data.sensors.clean.temperature}<span class=unit>°C</span></span></td></tr>`
    content += `<tr><th>Turbidity</th><td><span id=RAW_turbidity>RAW: ${data.sensors.raw.turbidity}<span class=unit>%</span></span> | <span id=CLEAN_turbidity>CLEAN: ${data.sensors.clean.turbidity}<span class=unit>%</span></span></td></tr>`
    content += `<tr><th>Salt</th><td><span id=RAW_salt>RAW: ${data.sensors.raw.salt}<span class=unit>PPM</span></span> | <span id=CLEAN_salt>CLEAN: ${data.sensors.clean.salt}<span class=unit>PPM</span></span></td></tr>`
    content += `<tr><th>Volume</th><td><span id=RAW_volume>RAW: ${data.sensors.raw.volume}<span class=unit>L</span></span> | <span id=CLEAN_volume>CLEAN: ${data.sensors.clean.volume}<span class=unit>L</span></span></td></tr>`
    content += "</table>"

    el.innerHTML = content
    markValues(data);
})

ref.doc("history").get().then(doc => {
    const data = doc.data().readings
    createCharts(data)
})

const markValues = data => {
    const els = {
        time: document.getElementById("time"),
        clean: {
            temp: document.getElementById("CLEAN_temp"),
            turbidity: document.getElementById("CLEAN_turbidity"),
            salt: document.getElementById("CLEAN_salt"),
            volume: document.getElementById("CLEAN_volume")
        },
        raw: {
            temp: document.getElementById("RAW_temp"),
            turbidity: document.getElementById("RAW_turbidity"),
            salt: document.getElementById("RAW_salt"),
            volume: document.getElementById("RAW_volume")
        }
    }

    if (data.sensors.raw.salt < 300) els.raw.salt.style.color = "green"
    else if (data.sensors.raw.salt < 750) els.raw.salt.style.color = "yellow"
    else if (data.sensors.raw.salt < 1200) els.raw.salt.style.color = "orange"
    else els.raw.salt.style.color = "red"

    if (data.sensors.clean.salt < 300) els.clean.salt.style.color = "green"
    else if (data.sensors.clean.salt < 750) els.clean.salt.style.color = "yellow"
    else if (data.sensors.clean.salt < 1200) els.clean.salt.style.color = "orange"
    else els.clean.salt.style.color = "red"

    if (data.sensors.raw.turbidity < 1) els.raw.turbidity.style.color = "green"
    else if (data.sensors.raw.turbidity < 5) els.raw.turbidity.style.color = "yellow"
    else if (data.sensors.raw.turbidity < 10) els.raw.turbidity.style.color = "orange"
    else els.raw.turbidity.style.color = "red"

    if (data.sensors.clean.turbidity < 1) els.clean.turbidity.style.color = "green"
    else if (data.sensors.clean.turbidity < 5) els.clean.turbidity.style.color = "yellow"
    else if (data.sensors.clean.turbidity < 10) els.clean.turbidity.style.color = "orange"
    else els.clean.turbidity.style.color = "red"

}

const createCharts = history => {
    const turbData = window.convertBarData(history, "turbidity")
    const saltData = window.convertBarData(history, "salt")
    const volData = window.convertLineData(history, "volume")
    const tempData = window.convertLineData(history, "temperature")

    //console.dir({ turbData, saltData, volData, tempData })

    //window.defaultChart(graphs.default)
    window.createBarChart("Turbidity (%)", turbData, graphs.turb)
    window.createBarChart("TDS (ppm)", saltData, graphs.salt)
    window.createLineChart("RAW Volume (L)", volData.raw, "CLEAN Volume (L)", volData.clean, volData.labels, graphs.vol)
    window.createLineChart("RAW Temperature (°C)", tempData.raw, "CLEAN Temperature (°C)", tempData.clean, tempData.labels, graphs.temp)
}

/*!
 * @param  {Object} obj1 original object
 * @param  {Object} obj2 object to compare
 * @return {Object}      Differences
 */
let diff = function (obj1, obj2) {

    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
        return obj1;
    }

    //
    // Variables
    //

    let diffs = {};
    let key;


    //
    // Methods
    //

    /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
    let arraysMatch = function (arr1, arr2) {

        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }

        // Otherwise, return true
        return true;

    };

    /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
    let compare = function (item1, item2, key) {

        // Get the object type
        let type1 = Object.prototype.toString.call(item1);
        let type2 = Object.prototype.toString.call(item2);

        // If type2 is undefined it has been removed
        if (type2 === '[object Undefined]') {
            diffs[key] = null;
            return;
        }

        // If items are different types
        if (type1 !== type2) {
            diffs[key] = item2;
            return;
        }

        // If an object, compare recursively
        if (type1 === '[object Object]') {
            let objDiff = diff(item1, item2);
            if (Object.keys(objDiff).length > 0) {
                diffs[key] = objDiff;
            }
            return;
        }

        // If an array, compare
        if (type1 === '[object Array]') {
            if (!arraysMatch(item1, item2)) {
                diffs[key] = item2;
            }
            return;
        }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (type1 === '[object Function]') {
            if (item1.toString() !== item2.toString()) {
                diffs[key] = item2;
            }
        } else {
            if (item1 !== item2) {
                diffs[key] = item2;
            }
        }

    };


    //
    // Compare our objects
    //

    // Loop through the first object
    for (key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            compare(obj1[key], obj2[key], key);
        }
    }

    // Loop through the second object and find missing items
    for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (!obj1[key] && obj1[key] !== obj2[key]) {
                diffs[key] = obj2[key];
            }
        }
    }

    // Return the object of differences
    return diffs;

};