const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx, next) => {
    const id = ctx.request.query.r;
    subscribers[id] = new Object();

    ctx.res.on('close', () => {
        delete subscribers[id];
    });

    await new Promise((resolve, reject) => {
        subscribers[id].resolve = resolve;
    }).then(message => {
        ctx.response.body = message;
        ctx.status = 200;
        ctx.message = 'Message recieved';
    })
});

router.post('/publish', async (ctx, next) => {
    if(!ctx.request.body.message) {
        ctx.status = 204;
        ctx.message = 'Empty message';

        return
    }   

    for(let id in subscribers) {
        subscribers[id].resolve(ctx.request.body.message);
    }

    ctx.status = 200;
    ctx.message = 'Message published';
});

app.use(router.routes());

module.exports = app;
