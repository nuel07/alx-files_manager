import express from 'express';
import controllerRouting from './routes/index';

const myPort = process.env.PORT || 5000;
const app = express();
app.use(express.json());

controllerRouting(app);
app.listen(myPort, () => {
  console.log(`Server running on port ${myPort}`);
});
