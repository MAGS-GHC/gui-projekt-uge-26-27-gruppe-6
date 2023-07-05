let sectionCapacity = [280, 150, 150, 150, 230, 600, 300, 600];
let sectionRowNoArray = [18, 6, 6, 6, 18, 18, 18, 18];

class Section {
  ID;
  Name;
  Capacity;
  Available;
  Standing;
  VenueID;

  constructor(id, name, capacity, available, standing, venueid) {
    this.ID = id;
    this.Name = name;
    this.Capacity = capacity;
    this.Available = available;
    this.Standing = standing;
    this.VenueID = venueid;
  }
}

class SeatRow {
  ID;
  SectionID;
  RowNo;

  constructor(_id, sectionid, rowno) {
    this.ID = _id;
    this.SectionID = sectionid;
    this.RowNo = rowno;
  }
}

class Seat {
  ID;
  SeatRowID;
  Reserved;
  Booked;
  SeatNo;

  constructor(id, seatrowid, reserved, booked, seatno) {
    this.ID = id;
    this.SeatRowID = seatrowid;
    this.Reserved = reserved;
    this.Booked = booked;
    this.SeatNo = seatno;
  }
}

function GenerateSections() {
  let sectionArray = [];
  let secG = new Section(0, "G", sectionCapacity[0], true, false, 0);
  sectionArray.push(secG);
  let secHN = new Section(1, "H - Nedre", sectionCapacity[1], true, false, 0);
  sectionArray.push(secHN);
  let secIN = new Section(2, "I - Nedre", sectionCapacity[2], true, false, 0);
  sectionArray.push(secIN);
  let secJN = new Section(3, "J - Nedre", sectionCapacity[3], true, false, 0);
  sectionArray.push(secJN);
  let secK = new Section(4, "K", sectionCapacity[4], true, false, 0);
  sectionArray.push(secK);
  let secL = new Section(5, "L", sectionCapacity[5], true, false, 0);
  sectionArray.push(secL);
  let secMF = new Section(6, "M - Fan", sectionCapacity[6], true, true, 0);
  sectionArray.push(secMF);
  let secM = new Section(7, "M", sectionCapacity[7], true, false, 0);
  sectionArray.push(secM);

  sectionArray.forEach((section) => {
    createSection(section);
  });
}
//GenerateSections();

function createSection(section) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    _id: section.ID,
    name: section.Name,
    capacity: section.Capacity,
    available: section.Available,
    standing: section.Standing,
    venueID: section.VenueID,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:4000/api/sections/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function GenerateSeatRows() {
  let seatRowIDCounter = 0;
  let seatRowArray = [];

  for (let sectionid = 0; sectionid < sectionRowNoArray.length; sectionid++) {
    for (let row = 0; row < sectionRowNoArray[sectionid]; row++) {
      let newSeatRow = new SeatRow(seatRowIDCounter, sectionid, row);
      seatRowArray.push(newSeatRow);
      seatRowIDCounter++;
    }
  }

  seatRowArray.forEach((seatRow) => {
    createSeatRow(seatRow);
  });
}
//GenerateSeatRows();

function createSeatRow(seatRow) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    _id: seatRow.ID,
    sectionID: seatRow.SectionID,
    rownumber: seatRow.RowNo,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:4000/api/seatrows/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function GenerateSeats() {
  let seatIDCounter = 0;
  let seatArray = [];

  for (let section = 0; section < sectionCapacity.length; section++) {
    let seatsPerRow = Math.floor(
      sectionCapacity[section] / sectionRowNoArray[section]
    );
    let seatsLeftOver = sectionCapacity[section] % sectionRowNoArray[section];

    for (let row = 0; row < sectionRowNoArray[section]; row++) {
      let totalRowSeats;

      if (seatsLeftOver > 0) {
        //Algoritme virker, så længe rest > antal rækker
        totalRowSeats = seatsPerRow + 1;
      } else {
        totalRowSeats = seatsPerRow;
      }

      for (let seat = 0; seat < totalRowSeats; seat++) {
        let newSeat = new Seat(seatIDCounter, row, false, false, seat);
        seatArray.push(newSeat);
        seatIDCounter++;
      }

      if (seatsLeftOver > 0) {
        seatsLeftOver--;
      }
    }
  }

  seatArray.forEach((seat) => {
    setTimeout(function () {
      createSeat(seat);
    }, 1500);
  });
}

//GenerateSeats();

function createSeat(seat) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    id: seat.ID,
    seatrowID: seat.SeatRowID,
    reserved: seat.Reserved,
    booked: seat.Booked,
    seatnumber: seat.SeatNo,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:4000/api/seats/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

//createSeat();
