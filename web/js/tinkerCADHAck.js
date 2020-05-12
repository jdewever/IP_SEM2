/*
*
*   Created by Jonas De Wever
*   Repo: https://github.com/jdewever/IP_SEM2
*   Github Account: https://github.com/jdewever
*
*/

// Start hack
const hack = () => {

    //Firebase Initialization
    const db = firebase.firestore()
    const col = db.collection("gekkeWaterton")
    const latest = col.doc("latest")
    const history = col.doc("history")

    window.hack_allow = true

    // The HTML element where the serial monitor content is located
    const el = document.getElementsByClassName("js-code_editor__serial-monitor__content")[0]
    let prev = ""

    // Reads serial monitor every 100ms
    setInterval(() => {
        if (!window.hack_allow) return
        // Trim whitespace and line endings not needed 
        const content = el.innerHTML.replace(/^\s+|\s+$/g, '').replace(/\r\n|\r|\n/, '')
        // Complete data starts with [, and end with ]
        if (!content.startsWith("[") || !content.endsWith("],")) return
        if (content == prev) return

        const timest = firebase.firestore.Timestamp.now()       // Current timeStamp in Firestore format

        const lastStart = content.lastIndexOf("[");     // Latest data start
        const lastEnd = content.lastIndexOf("]")        // end

        const last = content.substring(lastStart, lastEnd + 1)      // Get latest data
        const arr = last.replace("[", "").replace("]", "").split(",")       // Remove brackets in the string, split into array

        const obj = {               // Sensor format convention
            raw: {
                turbidity: arr[0],
                salt: arr[1],
                temperature: arr[2],
                volume: arr[3]
            },
            clean: {
                turbidity: arr[4],
                salt: arr[5],
                temperature: arr[6],
                volume: arr[7]
            }
        }

        const data = { sensors: obj, time: timest }     // Create dataObject, representing a reading, to upload, including timestamp of the reading
        latest.set(data)                                // Update the latest data with this data
        history.update({                                // Add this data to historyArray
            readings: firebase.firestore.FieldValue.arrayUnion(data)
        })

        console.dir(data)                               // Show data in the console
        prev = content                                  // Save content to compare
    }, 100)

    return "STARTED"

}

// Stop hack
const stopHack = () => {
    window.hack_allow = false
    return "STOPPED"
}

// ENV variables
window.hack_allow = false
window.hack = hack
window.stophack = stopHack