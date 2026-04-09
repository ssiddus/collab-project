import app from './app';
import dotenv from 'dotenv'
dotenv.config()

const PORT = 9322;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})
