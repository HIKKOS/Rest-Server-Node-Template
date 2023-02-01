async function postData(url = "") {
	const response = await fetch(url, {
		method: "GET", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
			"x-token":
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwicm9sIjoiJDJhJDEwJFhUd1p5am1WZjYxdy5jZ05UZFF6NWVSdGV5aTZsQllsWjJ5dWM4dlliTkt3dFozVkxwTnFxIiwiaWF0IjoxNjc1MDk0MTQwLCJleHAiOjE2NzUxMDg1NDB9.KN_vvEUuGjT4d1bigShjFuWfabdCE8DWk16n2BEDXWA",
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	});
	return response.json(); // parses JSON response into native JavaScript objects
}
const img = [];
postData("http://localhost:8080/api/servicios").then((data) => {
	const { servicios } = data
	console.log(servicios);
	servicios.map( s =>{
		const imgPhats = s.ImgIds
		const h1 = document.createElement('h1')
		const h2 = document.createElement('h2')
		const par = document.createElement('p')
		h1.innerText = s.Nombre
		h2.innerText = `Id: ${s.Id}`
		par.innerText = s.Descripcion
		document.body.appendChild(h1)
		document.body.appendChild(h2)
    const h3 = document.createElement('h3')
    h3.innerText=s.Precio
		document.body.appendChild(h3)
		document.body.appendChild(par)
		console.log(s.Nombre	)
		console.log(imgPhats)	
		imgPhats.map(pt =>{
			
			const p = document.createElement('p')
			p.innerText = pt
			document.body.appendChild(p) 
			const img = document.createElement('img')
			img.style = 'height:100px'
			const src = `http://localhost:8080/api/uploads/${s.Nombre}/${pt}`
			img.src = src
			console.log(src)
			document.body.appendChild(img)
		})
	})
		
})