const app = require("./server/express");
const port = app.get("port");

app.listen(port, () => {
    console.log(`Servidor rodando. http://127.0.0.1:${port}`)
});
