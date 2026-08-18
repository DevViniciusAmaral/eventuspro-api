import { app } from "./app";
import { env } from "./config/env";

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
    console.log(`Server is running on port ${env.PORT}`);
}).catch((err) => { console.error(err) });
