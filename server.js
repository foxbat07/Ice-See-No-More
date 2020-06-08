const express = require('express');
const compression = require('compression');
const helmet = require('helmet')

const app = express();

const PORT = process.env.PORT || 3333;

app.use(helmet());
app.use(compression({
    level: 8
}));

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('ICE starting off');
});

app.listen(PORT, () => console.log('Ice Cant see is listening on port 3333 on local!'));