import "reflect-metadata";
import { App } from "./app";

App.build().then(app => {
  app.listen();
});
