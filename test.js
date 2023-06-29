let sectionCapacity = [280, 150, 150, 150, 230, 600, 300, 600];
let sectionRowNoArray = [18, 6, 6, 6, 18, 18, 18, 18];

class SeatRow {
	ID;
    SectionID;
	RowNo;

    constructor(id, sectionid, rowno) {
        this.ID = id;
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


function TotalCapacity() {
    let cap = 0;

    for (let i = 0; i < sectionCapacity.length; i++) {
        cap += sectionCapacity[i];
    }

    console.log(cap);
}

TotalCapacity();


function GenerateSeatRows() {
	let seatRowIDCounter = 0;
	let seatRowArray = [];

	for (let sectionid = 0; sectionid < sectionRowNoArray.length; sectionid++) {
		for (let row = 0; row < sectionRowNoArray[sectionid]; row++) {
			let newSeatRow = new SeatRow(seatRowIDCounter, sectionid, row);
			seatRowArray.push(newSeatRow);
            console.log(`ID: ${newSeatRow.ID}   SectionID: ${newSeatRow.SectionID}   RowNo: ${newSeatRow.RowNo}`);
			seatRowIDCounter++;
            
		}
	}
}

//GenerateSeatRows();


function GenerateSeats() {
	let seatIDCounter = 0;
	let seatArray = [];
	for (let section = 0; section < sectionCapacity.length; section++) {
        let seatsPerRow = Math.floor(sectionCapacity[section] / sectionRowNoArray[section]);
        let seatsLeftOver = sectionCapacity[section] % sectionRowNoArray[section];
        
        let counter = 0;

		for (let row = 0; row < sectionRowNoArray[section]; row++) {
			
			
			let totalRowSeats;
			
			if (seatsLeftOver > 0) {
				totalRowSeats = seatsPerRow + 1;
			}
			else {
				totalRowSeats = seatsPerRow;
			}

			for (let seat = 0; seat < totalRowSeats; seat++) {
				let newSeat = new Seat(seatIDCounter, row, false, false, seat);
				seatArray.push(newSeat);
                //console.log(`ID: ${newSeat.ID}   RowID: ${newSeat.SeatRowID}   SeatNo: ${newSeat.SeatNo}`);
				seatIDCounter++;

                counter++;
			}

			if (seatsLeftOver > 0) {
				seatsLeftOver--;
			}

            console.log(`Sæder per række: ${seatsPerRow}   Sæder til overs: ${seatsLeftOver}`);
		}

        console.log(counter + " / " + sectionCapacity[section]);
        
	}
}

GenerateSeats();