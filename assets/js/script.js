

nowDate = dayjs();


$('#currentDay').text(nowDate.format('dddd DD MMMM YYYY'))

for (let i = 0; i < 24; i++) {
    let timeblock = $('<div>');
    let div = $('<div>');
    div.text(`${String(i).padStart(2,'0')}:00`);
    div.addClass("hour");
    let input = $('<input>');
    if (dayjs().get('h') > i) {
        input.addClass("future");
    } else if (dayjs().get('h') < i) {
        input.addClass("past");
    } else {
        input.addClass("present");
    }
    
    let button = $('<button>');
    button.addClass("saveBtn");
    let logo = $('<i>');
    logo.addClass("fa-regular fa-floppy-disk")
    button.append(logo);
    timeblock.append(div);
    timeblock.append(input);
    timeblock.append(button);
    timeblock.addClass('time-block row');
    $('.container').append(timeblock);
}