const isBool = (data) => {
	if (isNaN(data)) {
		switch (data) {
			case "true":
				return true;
			case "1":
				return true;			
		}
	}
	switch (Number(data)){
		case 1: return true
	}
	return false
};

module.exports = {
   isBool,
}