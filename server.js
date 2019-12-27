const ics = require('ics');
const Koa = require('koa');
const app = module.exports = new Koa();
const bodyParser = require('koa-bodyparser');

function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

app.use(bodyParser());

app.use( async function(ctx) {
    const startDate = new Date(ctx.request.body.date);
    const endDate = addDays(startDate, 1);
    const event = await ics.createEvent({
            title: ctx.request.body.title,
            description: ctx.request.body.description,
            start: [startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDay(), startDate.getUTCHours(), startDate.getUTCMinutes()],
            end: [endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDay()]
        });
    ctx.body = event.value;
    ctx.type = 'ics';
    ctx.set('Content-disposition', 'attachment; filename="event.ics"')
    ctx.status = 200;
});

app.listen(3000);
