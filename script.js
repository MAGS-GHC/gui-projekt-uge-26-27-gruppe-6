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
    RowID;
    RowNo;
    Seats;

    constructor(rowid, rowno, seats) {
        this.RowID = rowid;
        this.RowNo = rowno;
        this.Seats = seats;
    }
}

class Section {
    SectionID;
    Name;
    Reserved;
    Capacity;
    Standing;
    Available;
    Rows;

    constructor(sectionid, name, reserved, capacity, standing, available, rows) {
        this.SectionID = sectionid;
        this.Name = name;
        this.Reserved = reserved;
        this.Capacity = capacity;
        this.Standing = standing;
        this.Available = available;
        this.Rows = rows;
    }
}


// ---------------------------------- Opsætning ----------------------------------

const seatFreePath = "/images/seat_free.png";
const seatReservedPath = "/images/seat_reserved.png";
const seatBookedPath = "/images/seat_booked.png";

const sectionArray = [];
const buttonIDArray = ["sectionG", "sectionHN", "sectionIN", "sectionJN", "sectionK", "sectionL", "sectionMF", "sectionM"];

let loggedIn = false;


async function GetSections() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:4000/api/sections/", requestOptions);
    const json = await response.json();

    return json;
}

async function GetSeatRows() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:4000/api/seatrows/", requestOptions);
    const json = await response.json();

    return json;
}

async function GetSeats() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:4000/api/seats/", requestOptions);
    const json = await response.json();

    return json;
}


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



async function BuildSections(sectionData, seatRowData, seatData) {
    sectionData.forEach(section => {
        let secRows = [];
        let bookedSeatsCounter = 0;

        let matchingSeatRows = seatRowData.filter(seatRow => {
            return seatRow.sectionID === section._id;
        })
        //console.log(matchingSeatRows);

        matchingSeatRows.forEach(seatRow => {
            let seatRowArray = [];

            let matchingSeats = seatData.filter(seat => {
                return seat.seatrowID === seatRow._id;
            })

            matchingSeats.forEach(seat => {
                let newSeat = new Seat(seat._id, seat.seatnumber + 1, seat.reserved, seat.booked);

                if (seat.booked) {
                    bookedSeatsCounter++;
                }

                seatRowArray.push(newSeat);
            });

            let newSeatRow = new SeatRow(seatRow._id, seatRow.rownumber + 1, seatRowArray);
            secRows.push(newSeatRow);
        });

        let newSection = new Section(section._id, section.name, bookedSeatsCounter, section.capacity, section.standing, section.available, secRows);
        sectionArray.push(newSection);
    });
}

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


async function BuildPage() {
    $("#bookingMenu").hide();

    let sectionData = await GetSections();
    let seatRowData = await GetSeatRows();
    let seatData = await GetSeats();

    sectionData.sort((a,b) => a._id - b._id);
    seatRowData.sort((a,b) => a._id - b._id);
    seatData.sort((a,b) => a._id - b._id);

    await BuildSections(sectionData, seatRowData, seatData);

    console.log(sectionArray);



    SetUpSectionButtons();
}



BuildPage();

// ---------------------------------- Knap Funktionalitet ----------------------------------

function SectionButtonOnMouseEnter(buttonno) {
    let numberString = (sectionArray[buttonno].Capacity - sectionArray[buttonno].Reserved)+ " / " + sectionArray[buttonno].Capacity;
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


function SeatReserveButtonOnClick(seatid) {
    BookSeat(seatid);
}


function SeatLogInButtonOnClick() {
    ModalLogIn();
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
    ModalSeatButtonsHTML(seatid);

    $("#pageModalBodyText").text(`Sæde ID: ${seatid}`); //Må gerne ændres til sædedata som fx rækkenr, sædenr, osv
    
    $("#pageModal").modal("show");
}


function ModalSeatButtonsHTML(seatid) {
    let footerhtml = "";

    if (loggedIn) {
        footerhtml = 
            "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Tilbage</button>" +
            "<button id='seatReserveBtn' type='button' class='btn btn-success'>Køb</button>";

        $("#pageModalFooter").html(footerhtml);

        $("#seatReserveBtn").on("click", function() {
            SeatReserveButtonOnClick(seatid);
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
            //"<div class='checkbox mb-3 text-center'>" +
            //    "<label>" +
            //        "<input type='checkbox' value='remember-me'> Husk mig" +
            //    "</label>" +
            //"</div>" +
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



function BookSeat(seatid) {

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
