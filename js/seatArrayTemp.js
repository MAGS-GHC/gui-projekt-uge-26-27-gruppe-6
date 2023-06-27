
class Seat {
    constructor(section, num, price, booking, img) {
      this.section = section;
      this.num = num;
      this.price = price;
      this.booking = booking;
      this.img = img;
    }
}

class Section {
    constructor() {
      this.seats = [];
      this.sections = ['D', 'J', 'M', 'N'];

      for (let section of this.sections) {
        for (let seatnum = 1; seatnum < 60; seatnum++) {
          let price = 200;
          let booking = false;  
          let img = `./images/seat.png`;
          this.seats.push(new Seat(section, seatnum, price, booking, img));
        }
      }
    }
}

const newsection = new Section();
console.log(newsection)

let root = document.querySelector('.root');   
for(let i = 0; i < 60; i++){
  root.innerHTML += `
  <div class="container-content">
  <img class="container-content-img" src="../images/seat.png" alt="">
  </div>
  ` 
}