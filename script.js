// ---------------------------------- Klasser? ----------------------------------

class Seat {
    SeatNo;

    constructor(seatno) {
        this.SeatNo = seatno;
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
  Rows;

  constructor(name, reserved, capacity, rows) {
    this.Name = name;
    this.Reserved = reserved;
    this.Capacity = capacity;
    this.Rows = rows;
  }
}


JSON.get("http://localhost:4000/api/seats", function (response) {
  if (response && response.data) {
    const seatData = response.data;

    const secGRow1Seats = [];
    for (let i = 0; i < seatData.row1.length; i++) {
      let testSeat = new Seat(seatData.row1[i]);
      secGRow1Seats.push(testSeat);
    }

    const secGRow2Seats = [];
    for (let i = 0; i < seatData.row2.length; i++) {
      let testSeat = new Seat(seatData.row2[i]);
      secGRow2Seats.push(testSeat);
    }

    const secGRows = [];
    let row1 = new SeatRow(1, secGRow1Seats);
    secGRows.push(row1);
    let row2 = new SeatRow(2, secGRow2Seats);
    secGRows.push(row2);

    const sectionArray = [];
    let secG = new Section("G", 160, 280, secGRows);
    sectionArray.push(secG);
    let secHN = new Section("H - Nedre", 40, 150, 6);
    sectionArray.push(secHN);
    let secIN = new Section("I - Nedre", 140, 150, 6);
    sectionArray.push(secIN);
    let secJN = new Section("J - Nedre", 35, 150, 6);
    sectionArray.push(secJN);
    let secK = new Section("K", 230, 230, 18);
    sectionArray.push(secK);
    let secL = new Section("L", 50, 600, 18);
    sectionArray.push(secL);
    let secMF = new Section("M - Fan", 230, 300, 18);
    sectionArray.push(secMF);
    let secM = new Section("M", 350, 600, 18);
    sectionArray.push(secM);

    SetUpSectionButtons();
    
  }
});

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
    else if (percentage > 0.6)
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
    let tableContent;

    for (let row = 0; row < sectionArray[section].Rows.length; row++) {
        
        tableContent += "<tr><th scope'row'>" + (row + 1) + "</th>";
        
        for (let seat = 0; seat < sectionArray[section].Rows[row].Seats.length; seat++) { //totalRowSeats
            tableContent += "<td>" + sectionArray[section].Rows[row].Seats[seat].SeatNo + "</td>"
            
        }
        tableContent += "</tr>";
    }

    $("#bookingMenuTableHead").append("<tr><th colspan='" + (sectionArray[section].Rows[0].Seats.length + 1) +"' scope='col'>Række</th></tr>");
    $("#bookingMenuTableBody").append(tableContent);
}



