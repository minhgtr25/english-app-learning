const { createApp, createHttpServer } = require('../app');

const app = createApp();
const { server, io } = createHttpServer(app);

const routes = [];
app._router?.stack?.forEach(layer => {
  if (layer.route?.path) {
    routes.push(layer.route.path);
  }
});

if (!app || !server || !io) {
  throw new Error('App, HTTP server, or Socket.io failed to initialize');
}

console.log('Backend app initialized');

io.close();
server.close();
