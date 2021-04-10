import Express from 'express';
import cors from 'cors';

const app = Express();
app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }))
const port = 3200;

app.listen(port, () => console.log(`node server is running on port :${port}`));