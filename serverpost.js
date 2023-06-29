
function createSeats(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "id": "19210",
      "seatrowID": "1",
      "reserved": "false",
      "booked": "false",
      "seatnumber": "1"
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:4000/api/seats/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}

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

let sectionArray = [];
let secG = new Section(0, "G", 280, true, false, 0);
sectionArray.push(secG);
let secHN = new Section(1, "H - Nedre", 150, true, false, 0);
sectionArray.push(secHN);
let secIN = new Section(2, "I - Nedre", 150, true, false, 0);
sectionArray.push(secIN);
let secJN = new Section(3, "J - Nedre", 150, true, false, 0);
sectionArray.push(secJN);
let secK = new Section(4, "K", 230, true, false, 0);
sectionArray.push(secK);
let secL = new Section(5, "L", 600, true, false, 0);
sectionArray.push(secL);
let secMF = new Section(6, "M - Fan", 300, true, true, 0);
sectionArray.push(secMF);
let secM = new Section(7, "M", 600, true, false, 0);
sectionArray.push(secM);


sectionArray.forEach(section => {
	createSection(section)
});

function createSection(section){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "id": section.ID,
      "name": section.Name,
      "capacity": section.Capacity,
      "available": section.Available,
      "standing": section.Standing,
      "venueID": section.VenueID
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:4000/api/sections/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}



