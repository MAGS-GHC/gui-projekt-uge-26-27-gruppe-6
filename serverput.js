

function updateSeat(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "id": "1210",
      "seatrowID": "1",
      "reserved": "false",
      "booked": "true",
      "seatnumber": "1"
    });
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:4000/api/seats/649ebb241b68c8b007651caf", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}