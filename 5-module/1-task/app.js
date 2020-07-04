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
    subscribers[id] = {
        ctx,
        done: false
    }

    ctx.res.on('close', () => {
        delete subscribers[id];
    });

    await new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            if(subscribers[id] && subscribers[id].done) {
                clearInterval(intervalId);
                resolve();
            } else if(!subscribers[id]) {
                clearInterval(intervalId);
            }
        }, 300);
    })
});

router.post('/publish', async (ctx, next) => {
    if(!ctx.request.body.message) {
        ctx.response.status = 204;
        ctx.response.message = 'Empty message';

        return
    }   

    for(let id in subscribers) {
        let subscriberContext = subscribers[id].ctx;
        
        subscriberContext.response.status = 200;
        subscriberContext.body = ctx.request.body.message;

        subscribers[id].done = true;
    }

    ctx.response.status = 200;
    ctx.response.message = 'Message published';
});

app.use(router.routes());

module.exports = app;
