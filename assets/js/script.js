let lastHour = dayjs().subtract(1, 'd').get('h');
let lastDay = dayjs().subtract(1, 'd').get('d');
let timerInterval;
// Run this to set the date on the page
function setDate() {
    $('#currentDay').text(dayjs())
}
// Run this to clear the Calendar
function clearCalendar() {
    $('.container').empty()
}
// Run this to toggle date format in a persistent way
function toggleTimeSystem() {
    if (localStorage.getItem(`twentyFourHr`)) {
        localStorage.removeItem(`twentyFourHr`);
    } else {
        localStorage.setItem(`twentyFourHr`, true);
    }
    // Redraw the calendar when the change happens
    createCalendar()
}
// This function 
function changeSlots(amount, target) {
    let targetsName = ["workStart", "workEnd"]
    let targets = [parseInt(localStorage.getItem("workStart")), parseInt(localStorage.getItem("workEnd"))]
    if ((targets[0] < 1 && target === 0 && amount < 0) || (targets[1] >= 24 && target === 1 && amount > 0)) {
        return false;
    } else if ((targets[0] + 1 >= targets[1]) && (((target === 1) && (amount < 0)) || ((target === 0) && (amount > 0)))) {
        return false
    } else {
        localStorage.setItem(targetsName[target], (targets[target] + amount));
    }
    createCalendar();
    return true;
}
// Functions called by the buttons to modify the timeslots
function addEarlierTimeslot() { return changeSlots(-1, 0) }
function removeEarlierTimeslot() { return changeSlots(1, 0) }
function addLaterTimeslot() { return changeSlots(1, 1) }
function removeLaterTimeslot() { return changeSlots(-1, 1) }

// Run this to render the calendar
function createCalendar() {
    clearCalendar();
    // Add buttons to adjust number of rows
    // Create a button and add classes and attributes
    let removePreButton = $('<button>');
    removePreButton.addClass("minus-btn");
    removePreButton.on("click", removeEarlierTimeslot)
    // Use font awesome for a save (floppy disk) icon
    let removePreLogo = $('<i>');
    removePreLogo.addClass("fa-solid fa-minus")
    removePreButton.append(removePreLogo);
    // Create a button and add classes and attributes
    let addPreButton = $('<button>');
    addPreButton.addClass("plus-btn");
    addPreButton.on("click", addEarlierTimeslot)
    // Use font awesome for a save (floppy disk) icon
    let addPreLogo = $('<i>');
    addPreLogo.addClass("fa-solid fa-plus")
    addPreButton.append(addPreLogo);
    let preBlock = $('<div>');
    preBlock.addClass('button-row');
    preBlock.append(removePreButton);
    preBlock.append(addPreButton);
    $('.container').append(preBlock);
    for (let i = parseInt(localStorage.getItem("workStart")); i < parseInt(localStorage.getItem("workEnd")); i++) {
        // This area displays the time
        let div = $('<div>');
        // Display for blockin 24 or 12 hour format
        if (localStorage.getItem(`twentyFourHr`)) {
            // Pad with a zero for 24 hour clock
            div.text(`${String(i).padStart(2, '0')}:00`);
        } else {
            // If it dvides by 12, display 12. If the hour si greater than or equal to 12, it is pm.
            div.text(`${String((i % 12 === 0) ? 12 : (i % 12)).padStart(2, ' ')} ${(i >= 12 ? 'PM' : 'AM')}`);
        }
        div.addClass("hour");
        div.on("click", toggleTimeSystem)
        let input = $('<textarea>');
        if (dayjs().get('h') > i) {
            input.addClass("past");
        } else if (dayjs().get('h') < i) {
            input.addClass("future");
        } else {
            input.addClass("present");
        }
        input.attr("data-hour", i);
        input.attr("id", `${i}-note`);
        // If there is stored data, retrieve the data
        if (localStorage.getItem(`${i}`) !== null) {
            note = JSON.parse(localStorage.getItem(`${i}`))
            // If it was from a previous day, discard the note
            if (dayjs() > dayjs(note[1])) {
                localStorage.removeItem(`${i}`)
            } else {
                // Output the note
                input.val(note[0]);
            }
        }
        // Create a button and add classes and attributes
        let button = $('<button>');
        button.addClass("saveBtn");
        button.attr("data-hour", i);
        button.on("click", saveNote)
        // Use font awesome for a save (floppy disk) icon
        let logo = $('<i>');
        logo.addClass("fa-regular fa-floppy-disk")
        button.append(logo);
        // This block will be the row for each hour
        let timeblock = $('<div>');
        timeblock.append(div);
        timeblock.append(input);
        timeblock.append(button);
        timeblock.addClass('time-block row');
        $('.container').append(timeblock);
    }
    // Add buttons to adjust number of rows
    // Create a button and add classes and attributes
    let removePostButton = $('<button>');
    removePostButton.addClass("minus-btn");
    removePostButton.on("click", removeLaterTimeslot)
    // Use font awesome for a save (floppy disk) icon
    let removePostLogo = $('<i>');
    removePostLogo.addClass("fa-solid fa-minus")
    removePostButton.append(removePostLogo);
    // Create a button and add classes and attributes
    let addPostButton = $('<button>');
    addPostButton.addClass("plus-btn");
    addPostButton.on("click", addLaterTimeslot)
    // Use font awesome for a save (floppy disk) icon
    let addPostLogo = $('<i>');
    addPostLogo.addClass("fa-solid fa-plus")
    addPostButton.append(addPostLogo);
    let postBlock = $('<div>');
    postBlock.addClass('button-row');
    postBlock.append(removePostButton);
    postBlock.append(addPostButton);
    $('.container').append(postBlock);
}
// This saves the content of the note
function saveNote(event) {
    id = $(this).attr("data-hour");
    value = $(`#${id}-note`).val();
    // remove empty notes from local storage
    if (value === "") {
        localStorage.removeItem(`${id}`)
    } else {
        // Save to local storage, with an expiration for the end of the day
        localStorage.setItem(`${id}`, JSON.stringify([value, dayjs().endOf('day')]));
    }
}

function checkUpdate() {
    if (lastDay < dayjs().get('d')) {
        lastDay = dayjs().get('d');
        createCalendar();
    } else if (lastHour < dayjs().get('h')) {
        lastHour = dayjs().get('h');
        createCalendar();
    }
    setDate();
}
// Keeps the date and the highlight on the calendar in sync with the time
function init() {
    // If no number of time blocks has been set, default it to 9 am - 5 pm (5 pm doesn't show as that would be 5 pm - 6 pm)
    if (!localStorage.getItem("workStart")) {
        localStorage.setItem("workStart", 9);
    }
    if (!localStorage.getItem("workEnd")) {
        localStorage.setItem("workEnd", 17);
    }
    setDate()
    createCalendar();
    // Sets interval in variable
    timerInterval = setInterval(checkUpdate, 1000);
}

init()