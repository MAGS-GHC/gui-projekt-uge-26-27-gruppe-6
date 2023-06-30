var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://localhost:4000/api/sections/", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    // var requestOptionsSeats = {
    //   method: 'GET',
    //   redirect: 'follow'
    // };
    
    // fetch("http://localhost:4000/api/seats/", requestOptionsSeats)
    //   .then(response => response.json())
    //   .then(resultSeats => console.log(resultSeats))
    //   .catch(error => console.log('error', error));

    const ApiFetch = () => {
      const url = `http://localhost:4000/api/seats/`;
      const fetchApi = new Promise((resolve, reject) => {
        fetch(url)
          .then((response) => response.text())
          .then((result) => resolve(result))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
      fetchApi.then((apiData) => {
          let data = JSON.parse(apiData)
          let seats = data.map( (seat) => seat);
      
          let sortedSeats = seats.sort((p1, p2) => (p1.id < p2.id) ? 1 : (p1.id > p2.id) ? -1 : 0);
          console.log(sortedSeats)
      });
    };
  ApiFetch()