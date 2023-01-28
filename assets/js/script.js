let nowDate = dayjs();
let lastTime = dayjs().get('h');
let lastDay = dayjs().get('d');
// This is set with the 24 hour clock. 1pm is 13.
let workStart = 9;
let workEnd = 17;
// Run this to set the date on the page
function setDate() {
    $('#currentDay').text(nowDate.format('dddd DD MMMM YYYY'))
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
function addEarlierTimeslot() {
    if (workStart > 0) {
        workStart--;
        createCalendar();
        return true;
    }
    createCalendar();
    return false;
}
function removeEarlierTimeslot() {
    if (workStart < workEnd) {
        workStart++;
        createCalendar();
        return true;
    }
    createCalendar()
    return false;
}
function addLaterTimeslot() {
    if (workEnd < 24) {
        workEnd++;
        createCalendar();
        return true;
    }
    createCalendar()
    return false;
}
function removeLaterTimeslot() {
    if (workEnd > workStart) {
        workEnd--;
        createCalendar();
        return true;
    }
    createCalendar()
    return false;
}
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
    for (let i = workStart; i < workEnd; i++) {
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
        if (localStorage.getItem(`${i}`) !== null) {
            note = JSON.parse(localStorage.getItem(`${i}`))
            if (dayjs() > note[1]) {
                localStorage.removeItem(`${i}`)
            } else {
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

function saveNote(event) {
    id = $(this).attr("data-hour");
    value = $(`#${id}-note`).val();
    localStorage.setItem(`${id}`, JSON.stringify([value, dayjs().endOf('day')]))
    console.log(value);
}

setDate()
createCalendar();