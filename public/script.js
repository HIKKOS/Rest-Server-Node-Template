async function postData(url = "") {
	const response = await fetch(url, {
		method: "GET", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
			"x-token":
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwiaWF0IjoxNjc0NTgwMDc1LCJleHAiOjE2NzQ1OTQ0NzV9.JXWiTUVMAEqKc97maiwoGs44EFelbi9AHwg0DHsPvhk",
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
	const imgPhats = servicios[0].ImgIds
	console.log(servicios[0].Nombre	)
	console.log(imgPhats)	
	imgPhats.map(pt =>{
		
		const p = document.createElement('p')
		p.innerText = pt
		document.body.appendChild(p) 
		const img = document.createElement('img')
		img.style = 'height:100px'
		const src = `http://localhost:8080/api/uploads/${servicios[0].Nombre}/${pt}`
		img.src = src
		console.log(src)
		document.body.appendChild(img)
	})
	
})
