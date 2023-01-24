async function postData(url = '',) {
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'x-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwiaWF0IjoxNjc0NDk4ODMyLCJleHAiOjE2NzQ1MTMyMzJ9.q12Zhs3EFOwEsu2GQntPG94AAiX8FpXpaU2S1tpXpSo'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
    const img = []
    postData('http://localhost:8080/api/Transporte')
      .then((data) => {
        console.log(data.servicios[0]);
        ImgIds = data.servicios[0].ImgIds
        ImgIds.map(i => {
          const img = document.createElement('img')
            img.style= 'height: 200px'
            img.src = `http://localhost:8080/api/uploads/servicios/${i}`
            document.body.appendChild(img)
    
        })
      });
    