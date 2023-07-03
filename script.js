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

let loggedIn = false;


function GenerateTestSeats() { //Danner testsæder og sæderækker til sektion G
	let seatIDCounter = 0;

    for (let section = 0; section < sectionCapacity.length; section++) {
        let seatsPerRow = Math.floor(sectionCapacity[section] / sectionRowNoArray[section]);
        let seatsLeftOver = sectionCapacity[section] % sectionRowNoArray[section];
        let secRows = [];
        //let seatNumberCounter = 1;
        let bookedSeatsCounter = 0;

        let bookingRange = Math.floor(Math.random() * 13);
        
        //console.log("Sektion: " + sectionNameArray[section] + ", bookingRange: " + bookingRange);
        

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

                //let newSeat = new Seat(seatIDCounter, seatNumberCounter, false, booked);
                let newSeat = new Seat(seatIDCounter, seat + 1, false, booked);
                seatRowArray.push(newSeat);
                //seatNumberCounter++;
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


$("#testLoginBtn").on("click", function() {
    TestLoginClick();
});

function TestLoginClick() {
    if (!loggedIn) {
        $("#testLoginBtn").removeClass("btn-danger");
        $("#testLoginBtn").addClass("btn-success");
        loggedIn = true;
    }

    else {
        $("#testLoginBtn").removeClass("btn-success");
        $("#testLoginBtn").addClass("btn-danger");
        loggedIn = false;
    }
}


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


function SeatReserveButtonOnClick() {
    alert("Wew");
}


function SeatLogInButtonOnClick() {
    ModalLogIn();
    //alert("Log Ind, tak");
}


function LogInRegisterButtonOnClick() {
    ModalRegister();
}


function RegisterReturnButtonOnClick() {
    ModalLogIn();
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
            ModalSeat(($(this).parent().attr("id")).slice(4));
        });
    });
}


// ---------------------------------- Modal ----------------------------------

// Det ville være forfærdeligt meget nemmere her, hvis vi bare returnerede alle sæder her i en sektion, så sæder kan opdateres
// Derudover et API endpoint, der returnerer et enkelt sæde til denne funktion


function ModalApplyComponents(header, body, footer) {
    $("#pageModalHeader").html(header);
    $("#pageModalBody").html(body);

    if (footer != null || footer != undefined || footer != "") {
        $("#pageModalFooter").html(footer);
    }

    $('#pageModal').modal('handleUpdate');
}


function ModalCloseButtonHTML() {
    let buttonhtml = 
        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
        "<span aria-hidden='true'>&times;</span>" +
        "</button>";

    return buttonhtml;
}


function ModalSeat(seatid) {
    let headerhtml = 
        "<h5 id='pageModalHeaderTitle' class='modal-title'>Bestilling af sæde</h5>";

    let bodyhtml = 
        "<p id='pageModalBodyText'></p>";

    ModalApplyComponents(headerhtml, bodyhtml);
    ModalSeatButtonsHTML();

    $("#pageModalBodyText").text(`Sæde ID: ${seatid}`); //Må gerne ændres til sædedata som fx rækkenr, sædenr, osv
    
    $("#pageModal").modal("show");
}


function ModalSeatButtonsHTML() {
    let footerhtml = "";

    if (loggedIn) {
        footerhtml = 
            "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Tilbage</button>" +
            "<button id='seatReserveBtn' type='button' class='btn btn-success'>Køb</button>";

        $("#pageModalFooter").html(footerhtml);

        $("#seatReserveBtn").on("click", function() {
            SeatReserveButtonOnClick();
        });
    }

    else {
        footerhtml = 
            "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Tilbage</button>" +
            "<button id='seatLoginBtn' type='button' class='btn btn-info'>Log Ind</button>";

        $("#pageModalFooter").html(footerhtml);
        
        $("#seatLoginBtn").on("click", function() {
            SeatLogInButtonOnClick();
        });
    }
}


function ModalLogIn() {
    let headerhtml = 
        "<h1 id='pageModalHeaderTitle' class='h3 font-weight-normal text-center w-100'>Log venligst ind</h1>";

    let bodyhtml = 
        "<form class='form-signin'>" +
            "<label for='inputEmail' class='sr-only'>E-mail adresse</label>" +
            "<input type='email' id='inputEmail' class='form-control' placeholder='E-mail adresse' required autofocus>" +
            "<label for='inputPassword' class='sr-only'>Adgangskode</label>" +
            "<input type='password' id='inputPassword' class='form-control' placeholder='Adgangskode' required>" +
            "<div class='checkbox mb-3 text-center'>" +
                "<label>" +
                    "<input type='checkbox' value='remember-me'> Husk mig" +
                "</label>" +
            "</div>" +
            "<button class='btn btn-lg btn-primary btn-block' type='submit'>Log Ind</button>" +
        "</form>" +
        "<button id='loginRegisterBtn' type='button' class='btn no-user-btn shadow-none d-block mx-auto mt-3'>" +
            "<span class='no-user-text text-info'>Jeg har ikke en bruger</span>" +
        "</button>";
    
    let footerhtml = 
        "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Luk</button>";

    ModalApplyComponents(headerhtml, bodyhtml, footerhtml);

    $("#loginRegisterBtn").on("click", function() {
        LogInRegisterButtonOnClick();
    });
}


function ModalRegister() {
    let headerhtml = 
        "<h1 id='pageModalHeaderTitle' class='h3 font-weight-normal text-center w-100'>Ny bruger</h1>";

    let bodyhtml = 
        "<form class='form-signin'>" +
            "<label for='inputEmail' class='sr-only'>E-mail adresse</label>" +
            "<input type='email' id='inputEmail' class='form-control' placeholder='E-mail adresse' required autofocus>" +
            "<label for='inputPassword' class='sr-only'>Adgangskode</label>" +
            "<input type='password' id='inputPassword' class='form-control' placeholder='Adgangskode' required>" +
            "<button class='btn btn-lg btn-primary btn-block' type='submit'>Opret</button>" +
        "</form>";
    
    let footerhtml = 
        "<button id='registerReturnBtn' type='button' class='btn btn-outline-info'>Tilbage</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Luk</button>";

    ModalApplyComponents(headerhtml, bodyhtml, footerhtml);

    $("#registerReturnBtn").on("click", function() {
        RegisterReturnButtonOnClick();
    });
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
