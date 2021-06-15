const app = require('./dist/app.js');
const port = process.env.PORT || 443;

app.listen(port, () => {
	if (process.env.ENV === 'development') {
		console.log(`Example app listening at http://localhost:${port}`);
	}
});
