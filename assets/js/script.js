

nowDate = dayjs();


$('#currentDay').text(nowDate.format('dddd DD MMMM YYYY'))

for (let i = 0; i < 24; i++) {
    let timeblock = $('<div>');
    let div = $('<div>');
    div.text(`${String(i).padStart(2,'0')}:00`);
    div.addClass("hour");
    let input = $('<textarea>');
    if (dayjs().get('h') > i) {
        input.addClass("past");
    } else if (dayjs().get('h') < i) {
        input.addClass("future");
    } else {
        input.addClass("present");
    }
    input.attr("data-hour", i)
    input.attr("id", `${i}-note`)
    let button = $('<button>');
    button.addClass("saveBtn");
    button.attr("data-hour", i);
    button.on("click", saveNote)
    let logo = $('<i>');
    logo.addClass("fa-regular fa-floppy-disk")
    button.append(logo);
    timeblock.append(div);
    timeblock.append(input);
    timeblock.append(button);
    timeblock.addClass('time-block row');
    $('.container').append(timeblock);
}

function saveNote(event) {
    console.log($(this).attr("data-hour"));
    id = $(this).attr("data-hour");
    value = $(`#${id}-note`).val();
    console.log(value);
}