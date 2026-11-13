# 06 - API routes

Thin Express routes: query -> shared business rule -> JSON. Calculations never live in routes or the frontend.
Every async handler is wrapped in try/catch so one failed request (e.g. a connection-pool hiccup) can't take the server down.
