// ---------------------------------- Klasser? ----------------------------------

class Seat {
    SeatID;
    SeatNo;
    Reserved;
    Booked;

    constructor(seatid, seatno, reserved, booked) {
        this.SeatID = seatid;
        this.SeatNo = seatno;
        this.Reserved = reserved;
        this.Booked = booked;
    }
}

class SeatRow {
    RowNo;
    Seats;

    constructor(rowno, seats) {
        this.RowNo = rowno;
        this.Seats = seats;
    }
}

class Section {
    Name;
    Reserved;
    Capacity;
    Available;
    Rows;

    constructor(name, reserved, capacity, available, rows) {
        this.Name = name;
        this.Reserved = reserved;
        this.Capacity = capacity;
        this.Available = available;
        this.Rows = rows;
    }
}


// ---------------------------------- TEST METODER ----------------------------------

const seatFreePath = "/images/seat_free.png";
const seatReservedPath = "/images/seat_reserved.png";
const seatBookedPath = "/images/seat_booked.png";

const sectionArray = [];
const sectionCapacity = [280, 150, 150, 150, 230, 600, 300, 600];
const sectionRowNoArray = [18, 6, 6, 6, 18, 18, 18, 18];
const sectionNameArray = ["G", "H - Nedre", "I - Nedre", "J - Nedre", "K", "L", "M", "M - Fan"];
const buttonIDArray = ["sectionG", "sectionHN", "sectionIN", "sectionJN", "sectionK", "sectionL", "sectionMF", "sectionM"];


function GenerateTestSeats() { //Danner testsæder og sæderækker til sektion G
	let seatIDCounter = 0;

    for (let section = 0; section < sectionCapacity.length; section++) {
        let seatsPerRow = Math.floor(sectionCapacity[section] / sectionRowNoArray[section]);
        let seatsLeftOver = sectionCapacity[section] % sectionRowNoArray[section];
        let secRows = [];
        let seatNumberCounter = 1;
        let bookedSeatsCounter = 0;

        let bookingRange = Math.floor(Math.random() * 13);
        
        console.log("Sektion: " + sectionNameArray[section] + ", bookingRange: " + bookingRange);
        

        for (let row = 0; row < sectionRowNoArray[section]; row++) {
            let seatRowArray = [];
            let totalRowSeats;
            
            if (seatsLeftOver > 0) {
                totalRowSeats = seatsPerRow + 1;
            }
            else {
                totalRowSeats = seatsPerRow;
            }

            for (let seat = 0; seat < totalRowSeats; seat++) {
                let booked = false;
                
                let bookingChance = Math.floor(Math.random() * 13);
                if ((12 - bookingRange) <= bookingChance) { //tilfældig rate af booking per sektion
                    booked = true;
                    bookedSeatsCounter++;
                }

                let newSeat = new Seat(seatIDCounter, seatNumberCounter, false, booked);
                seatRowArray.push(newSeat);
                seatNumberCounter++;
                seatIDCounter++;
            }

            if (seatsLeftOver > 0) {
                seatsLeftOver--;
            }

            let newSeatRow = new SeatRow(row, seatRowArray);
            secRows.push(newSeatRow);
        }

        let newSection = new Section(sectionNameArray[section], bookedSeatsCounter, sectionCapacity[section], true, secRows);
        sectionArray.push(newSection);
    }
}

GenerateTestSeats();




// ---------------------------------- Opsætning ----------------------------------

$("#bookingMenu").hide();
SetUpSectionButtons();

function SetUpSectionButtons() {
    for (let i = 0; i < sectionArray.length; i++) {
        CreateSectionButtonTextElement(buttonIDArray[i]);
        SetSectionButtonText(buttonIDArray[i], sectionArray[i].Name);
        SetSectionButtonColourClass(buttonIDArray[i], sectionArray[i].Reserved, sectionArray[i].Capacity);

        $("#" + buttonIDArray[i]).on("mouseenter", function() {
            SectionButtonOnMouseEnter(i);
        });
        $("#" + buttonIDArray[i]).on("mouseleave", function() {
            SectionButtonOnMouseLeave(i);
        });
        $("#" + buttonIDArray[i]).on("click", function() {
            SectionButtonOnClick(i);
        });
    }
    $("#returnBtn").on("click", function() {
        ReturnButtonOnClick();
    });
}


// ---------------------------------- Knap Funktionalitet ----------------------------------

function SectionButtonOnMouseEnter(buttonno) {
    let numberString = sectionArray[buttonno].Reserved + " / " + sectionArray[buttonno].Capacity;
    SetSectionButtonText(buttonIDArray[buttonno], numberString);
}

function SectionButtonOnMouseLeave(buttonno) {
    SetSectionButtonText(buttonIDArray[buttonno], sectionArray[buttonno].Name);
}

function SectionButtonOnClick(buttonno) {
    ToggleView(0);
    SetUpBookingMenu(buttonno);
}

function ReturnButtonOnClick() {
    ToggleView(1);
}


// ---------------------------------- Knap Funktionalitet #2 ----------------------------------

function CreateSectionButtonTextElement(buttonid) {
    $("#" + buttonid).append("<h5 id='" + buttonid + "Text' class='font-weight-light'>e</h5>");
}

function SetSectionButtonText(buttonid, text) {
    $("#" + buttonid + "Text").text(text);
}

function SetSectionButtonColourClass(buttonid, current, capacity) {
    let classString;
    let percentage = current / capacity;

    if (percentage == 1)
        classString = "btn-dark";
    else if (percentage > 0.9)
        classString = "btn-danger";
    else if (percentage > 0.7)
        classString = "btn-warning";
    else
        classString = "btn-success";

    $("#" + buttonid).addClass(classString);
}

function ToggleView(state) {
    if (state === 0) {
        $("#bookingMap").fadeOut("fast", function() {
            $("#bookingMenu").fadeIn("fast");
        });
    }
    else {
        $("#bookingMenu").fadeOut("fast", function() {
            $("#bookingMap").fadeIn("fast");
        });
    }
}


// ---------------------------------- Sædebooking ----------------------------------

function SetUpBookingMenu(section) {
    $("#bookingMenuSectionName").text("Sektion " + sectionArray[section].Name);
    BuildSeatTable(section);
}

function BuildSeatTable(section) {
    let tableContent = ["", ""];
    let firstRowLength = sectionArray[section].Rows[0].Seats.length;
    let activeTable = 0;

    for (let row = 0; row < sectionArray[section].Rows.length; row++) { 
        if (sectionArray[section].Rows[row].Seats.length != firstRowLength) {
            activeTable = 1;
        }

        tableContent[activeTable] += "<tr><th scope='row' class='rowborder align-middle text-center'>" + (row + 1) + "</th>";

        for (let seat = 0; seat < sectionArray[section].Rows[row].Seats.length; seat++) { //totalRowSeats
            let currentSeat = sectionArray[section].Rows[row].Seats[seat];
            let seatPath;
            let clickable;

            if (currentSeat.Booked) {
                seatPath = seatBookedPath;
                clickable = false;
            }
            else if (currentSeat.Reserved) {
                seatPath = seatReservedPath;
                clickable = false;
            }
            else {
                seatPath = seatFreePath;
                clickable = true;
            }

            if (clickable) {
                tableContent[activeTable] += "<td id='seat" + sectionArray[section].Rows[row].Seats[seat].SeatID + "' class='align-middle text-center'>" +
                "<img src='" + seatPath + "' class='img-fluid clickable'></td>"; //style='height: 32px; width: 32px;' class='img-fluid'   
            }
            else {
                tableContent[activeTable] += "<td id='seat" + sectionArray[section].Rows[row].Seats[seat].SeatID + "' class='align-middle text-center'>" +
                "<img src='" + seatPath + "' class='img-fluid'></td>"; 
            }
        }
        tableContent[activeTable] += "</tr>";
    }

    $("#bookingMenuTableBody").html(tableContent[0]);
    $("#bookingMenuTableBody2").html(tableContent[1]);

    AttachSeatClickEvent();
}

function AttachSeatClickEvent() {
    $(".clickable").each(function() {
        $(this).on("click", function() {
            Jesus(($(this).parent().attr("id")).slice(4));
        });
    });
}

function Jesus(seatid) {
    alert(seatid);
    /*
    $("seatModalBodyText").text(seatid);
    $("seatModal").modal('toggle');
    */
    
}

function ActiveSeatImagePath(seat) {
    let seatPath;

    if (seat.Booked) {
        seatPath = seatBookedPath;
    }
    else if (seat.Reserved) {
        seatPath = seatReservedPath;
    }
    else {
        seatPath = seatFreePath;
    }
    
    return seatPath;
}
