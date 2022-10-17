import { App } from "./app"


const app = new App().express

app.listen(process.env.PORT, () => console.log("http://localhost:4000"))
