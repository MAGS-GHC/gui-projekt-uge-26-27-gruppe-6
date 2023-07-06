// ---------------------------------- Klasser ----------------------------------
//Her defineres klasser til brug i brugerflade og intern funktionalitet

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
//Når siden indlæses, kører disse funktioner og kald

const sectionArray = [];
const buttonIDArray = ["sectionG", "sectionHN", "sectionIN", "sectionJN", "sectionK", "sectionL", "sectionMF", "sectionM"];


//Testfunktionalitet til ufærdigt login
let loggedIn = false;


//Her hentes sektionerne fra databasen
async function GetSections() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:4000/api/sections/", requestOptions);
    const json = await response.json();

    return json;
}


//Her hentes sæderækkerne fra databasen
async function GetSeatRows() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:4000/api/seatrows/", requestOptions);
    const json = await response.json();

    return json;
}


//Her hentes sæderne fra databasen
async function GetSeats() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:4000/api/seats/", requestOptions);
    const json = await response.json();

    return json;
}


//Tilføjer funktionalitet til test loginfunktionknap
$("#testLoginBtn").on("click", function() {
    TestLoginClick();
});


//Ditto
function TestLoginClick() {
    //Hvis ikke logget ind, logger den ind og skifter farven på knappen
    if (!loggedIn) {
        $("#testLoginBtn").removeClass("btn-danger");
        $("#testLoginBtn").addClass("btn-success");
        loggedIn = true;
    }

    //Samme men ikke helt det samme
    else {
        $("#testLoginBtn").removeClass("btn-success");
        $("#testLoginBtn").addClass("btn-danger");
        loggedIn = false;
    }
}


//Her bliver vores databasedata skrevet om til vores objektmodel
//Da vores antal af sektioner, rækker og sæder er fleksible, bør algoritmen også være fleksibel, og derfor bruges nestede foreach loops
async function BuildSections(sectionData, seatRowData, seatData) {
    sectionData.forEach(section => { //For at opfylde vores objektmodel, skal hver sektion indeholde alle relevante rækker og dem med alle relevante sæder
        let secRows = []; //midlertidigt array til at holde på hver sektions rækker
        let bookedSeatsCounter = 0; //tæller op mht hvor mange sæder er bookede, så det kan vises til brugeren

        let matchingSeatRows = seatRowData.filter(seatRow => { //finder alle rækker med passende sektion id
            return seatRow.sectionID === section._id;
        })

        matchingSeatRows.forEach(seatRow => { //Den samme proces sker egentlig for rækker
            let seatRowArray = [];

            let matchingSeats = seatData.filter(seat => {
                return seat.seatrowID === seatRow._id;
            })

            matchingSeats.forEach(seat => { //hvert passende sæde bliver tilføjet til rækken
                let newSeat = new Seat(seat._id, seat.seatnumber + 1, seat.reserved, seat.booked);

                if (seat.booked) {
                    bookedSeatsCounter++; //hvis sædet er booket, tælles der op for sektionen
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


//Nu har vi al vores data i objekterne, og kan gå i gang med at sætte brugerfladen op
function SetUpSectionButtons() {
    for (let i = 0; i < sectionArray.length; i++) {
        CreateSectionButtonTextElement(buttonIDArray[i]); //Tilføjer tekst til vores sektionsknapper
        SetSectionButtonText(buttonIDArray[i], sectionArray[i].Name); //Sætter valgte knaps tekst til sendt tekst
        SetSectionButtonColourClass(buttonIDArray[i], sectionArray[i].Reserved, sectionArray[i].Capacity); //Sætter knappens farve til at reflektere ledige pladser

        //Tilføjer mus events til sektionsknapper
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

    //Tillader at gå frem og tilbage mellem vores "sider"
    $("#returnBtn").on("click", function() {
        ReturnButtonOnClick();
    });
}


//Her bygges siden, når den indlæses
async function BuildPage() {
    $("#bookingMenu").hide(); //Gemmer vores anden side, så de kan skiftes imellem senere

    let sectionData = await GetSections(); //henter sektion JSON fra databasen
    let seatRowData = await GetSeatRows(); //henter sæderække JSON fra databasen
    let seatData = await GetSeats(); //henter sæde JSON fra databasen

    //Sorterer vores JSON efter ID, så de er nemmere at arbejde med?
    sectionData.sort((a,b) => a._id - b._id);
    seatRowData.sort((a,b) => a._id - b._id);
    seatData.sort((a,b) => a._id - b._id);

    await BuildSections(sectionData, seatRowData, seatData); //Tidligere defineret funktion, der tager vores JSON og laver det om til store sektionobjekter

    SetUpSectionButtons(); //Funktion ovenover, der laver vores UI til stadion
}

BuildPage(); //Køres, når siden er indlæst



// ---------------------------------- Knap Funktionalitet ----------------------------------
//Her bliver knappernes onclick events defineret. De er skrevet til at kalde andre metoder for at være nemmere at læse

//Hver gang musen er over en sektion ved stadion, vises ledige sæder i stedet for navn
function SectionButtonOnMouseEnter(buttonno) {
    let numberString = (sectionArray[buttonno].Capacity - sectionArray[buttonno].Reserved)+ " / " + sectionArray[buttonno].Capacity;
    SetSectionButtonText(buttonIDArray[buttonno], numberString);
}


//Modsat
function SectionButtonOnMouseLeave(buttonno) {
    SetSectionButtonText(buttonIDArray[buttonno], sectionArray[buttonno].Name);
}


//Når sektionen klikkes på, bygges og vises et detaljeret overblik over sektionen i stedet
function SectionButtonOnClick(buttonno) {
    ToggleView(0);
    SetUpBookingMenu(buttonno);
}


//Går tilbage til at vise stadion
function ReturnButtonOnClick() {
    ToggleView(1);
}


//Når man forsøger at booke et sæde
function SeatReserveButtonOnClick(seatid) {
    BookSeat(seatid);
}


//Når man ikke er logget ind og prøver at booke et sæde
function SeatLogInButtonOnClick() {
    ModalLogIn();
}


//Når man ikke har en bruger ved login
function LogInRegisterButtonOnClick() {
    ModalRegister();
}


//Går tilbage til login modal fra registrér modal
function RegisterReturnButtonOnClick() {
    ModalLogIn();
}



// ---------------------------------- Knap Funktionalitet #2 ----------------------------------
//Her bliver de fleste af knapmetoderne definerede

//Skaber et nyt tekstelement i vores sektionsknapper med ID
function CreateSectionButtonTextElement(buttonid) {
    $("#" + buttonid).append("<h5 id='" + buttonid + "Text' class='font-weight-light'>e</h5>");
}


//Sætter sektionsknappens tekst via ID
function SetSectionButtonText(buttonid, text) {
    $("#" + buttonid + "Text").text(text);
}


//Sætter sektionsknappens farve via ID
function SetSectionButtonColourClass(buttonid, current, capacity) {
    let classString;
    let percentage = current / capacity;

    if (percentage == 1) //Fuldt booket bliver sort
        classString = "btn-dark";
    else if (percentage > 0.9) //mindre end 10% tilbage bliver rød
        classString = "btn-danger";
    else if (percentage > 0.7) //mindre end 30% tilbage bliver gul
        classString = "btn-warning";
    else //30% eller over tilbage bliver grøn
        classString = "btn-success";

    $("#" + buttonid).addClass(classString);
}


//Går frem og tilbage via vores stadion og sektionsoverblik med en JQuery animation
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


//Når brugeren trykker "Køb" på et sæde. Booker og reserverer det valgte og købte sæde i databasen
function BookSeat(seatid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
        "reserved": true,
        "booked": true
    });
  
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
  
    fetch(`http://localhost:4000/api/seats/${seatid}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
    //Clientside løsning på at vise sædet som booket, ikke anbefalet til offentligt produkt
    $("#seat" + seatid).children().removeClass("clickable");
    $("#seat" + seatid).children().off("click");
    $("#seat" + seatid).children().attr("src", "/images/seat_booked.png");
    $("#pageModal").modal("hide");
}


function GetSeatInfo(seatid) {

}



// ---------------------------------- Sædebooking ----------------------------------

//Viser navn på sektion og kalder på at få bygget sektionsoverblikket
function SetUpBookingMenu(section) {
    $("#bookingMenuSectionName").text("Sektion " + sectionArray[section].Name);
    BuildSeatTable(section);
}


//Her bygges vores sektionsoverblik
function BuildSeatTable(section) {
    let tableContent = ["", ""]; //Bruger lidt magi til at sætte vores ujævne rækker ind i hvad der *ligner* én tabel, men faktisk er to
    let firstRowLength = sectionArray[section].Rows[0].Seats.length; //Sætter et loft på hvor mange sæder, der skal forventes på en række
    let activeTable = 0; //Starter med at fylde i første tabel

    for (let row = 0; row < sectionArray[section].Rows.length; row++) {
        if (sectionArray[section].Rows[row].Seats.length != firstRowLength) { //Hvis nuværende række i loopet har færre sæder end første, sættes ind i alternativ tabel
            activeTable = 1; //Begynder nu at fylde i anden tabel. Dette gøres for at få sæderne til at fylde en hel række på siden
        }

        tableContent[activeTable] += "<tr><th scope='row' class='rowborder align-middle text-center'>" + (row + 1) + "</th>"; //Rækkenr på venstre side

        for (let seat = 0; seat < sectionArray[section].Rows[row].Seats.length; seat++) { //Itererer igennem hvert sæde i række
            let currentSeat = sectionArray[section].Rows[row].Seats[seat];
            let seatPath = ActiveSeatImagePath(currentSeat); //Definerer, hvilket path et sæde skal bruge til at finde sit billede

            //Giver knapfunktionalitet hvis frit og sætter sæde ind i HTML string
            if (currentSeat.Booked || currentSeat.Reserved) {
                tableContent[activeTable] += "<td id='seat" + sectionArray[section].Rows[row].Seats[seat].SeatID + "' class='align-middle text-center'>" +
                "<img src='" + seatPath + "' class='img-fluid'></td>"; 
            }
            else {
                tableContent[activeTable] += "<td id='seat" + sectionArray[section].Rows[row].Seats[seat].SeatID + "' class='align-middle text-center'>" +
                "<img src='" + seatPath + "' class='img-fluid clickable'></td>"; 
            }
        }
        tableContent[activeTable] += "</tr>"; //Afslutter row
    }

    //Erstatter tabellernes HTML med de lange strings, så der undgås uønsket data fra andre kilder ved altid at nulstille
    $("#bookingMenuTableBody").html(tableContent[0]);
    $("#bookingMenuTableBody2").html(tableContent[1]);

    //Tilføjer onclick events til frie sæder
    AttachSeatClickEvent();
}


//Når et frit sæde klikkes på, åbnes vores modal vindue og sender sædets ID
function AttachSeatClickEvent() {
    $(".clickable").each(function() {
        $(this).on("click", function() {
            ModalSeat(($(this).parent().attr("id")).slice(4));
        });
    });
}



// ---------------------------------- Modal ----------------------------------

//Samlefunktion til anvendte header, body og footer og opdaterer dimensioner
function ModalApplyComponents(header, body, footer) {
    $("#pageModalHeader").html(header);
    $("#pageModalBody").html(body);

    if (footer != null || footer != undefined || footer != "") {
        $("#pageModalFooter").html(footer);
    }

    $('#pageModal').modal('handleUpdate');
}


//Her vises et sæde, der er klikket på
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


//Laver knapperne i bunden i sæde modal, afhængig af, om man er logget ind
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


//Loginsiden i modal. Indeholder en form
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


//Modal til registrering af ny bruger. Indeholder en form
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


//Billedefilstier
function ActiveSeatImagePath(seat) {
    let seatPath;

    if (seat.Booked) {
        seatPath = "/images/seat_booked.png";
    }
    else if (seat.Reserved) {
        seatPath = "/images/seat_reserved.png";
    }
    else {
        seatPath = "/images/seat_free.png";
    }
    
    return seatPath;
}
