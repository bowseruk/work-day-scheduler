let nowDate = dayjs();
let lastime = dayjs().get('h');
let lastDay = dayjs().get('d');
// true is 24 hour clock, false is 12 hour clock
let twentyFourHr = false;
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
    createCalendar()
}
// Run this to render the calendar
function createCalendar() {
    clearCalendar()
    for (let i = workStart; i < workEnd; i++) {
        // This area displays the time
        let div = $('<div>');
        // Display for blockin 24 or 12 hour format
        if (localStorage.getItem(`twentyFourHr`)) {
            // Pad with a zero for 24 hour clock
            div.text(`${String(i).padStart(2, '0')}:00`);
        } else {
            // If it dvides by 12, display 12. If the hour si greater than or equal to 12, it is pm.
            div.text(`${String((i%12 === 0) ? 12 : (i%12)).padStart(2, ' ')} ${(i >= 12 ? 'PM' : 'AM')}`);
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
}

function saveNote(event) {
    id = $(this).attr("data-hour");
    value = $(`#${id}-note`).val();
    localStorage.setItem(`${id}`, JSON.stringify([value, dayjs().endOf('day')]))
    console.log(value);
}

setDate()
createCalendar();