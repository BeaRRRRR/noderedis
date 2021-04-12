import express from 'express';
import fetch from 'node-fetch';
import redisCache from 'express-redis-cache';

const cache = redisCache();

const app = express();
const port = 8080;

app.get('/test/ping', (req, res) => {
    res.send({ data: 'pong' });
});

app.get('/gitlab/projects', cache.route(), async (req, res) => {
    const userResp = await fetch(`https://gitlab.com/api/v4/users?username=${req.query.user}`);
    const { id } = (await userResp.json())[0];
    const projectResp = await fetch(`https://gitlab.com/api/v4/users/${id}/projects`);
    const json = await projectResp.json();
    //@ts-ignore
    res.json(json.map(({ name, description, http_url_to_repo, readme_url }) => ({ name, description, http_url_to_repo, readme_url })));
})

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
