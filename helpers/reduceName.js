const reduceName = (word = "") => {
	word = word.split(" ");
	const name = word[0];
	const middleName = word[word.length - 1];
	return `${name} ${middleName}`;
};
module.exports = {
	reduceName,
};
