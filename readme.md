Keep2Miro
-

*Introduction*

Keep 2 miro is a small fastify based webserver
designed to proxy requests for Google keep notes
made for Keep.py My flask wrapper around google keep.

In it's current state Keep.py is incredibly rudimentary.
It has a single endpoint that serves _all_ of my keep notes.
That's about 20MB of JSON.

I don't want to hit up MIRO with a 20MB request,
thus Keep2Miro is here to cache the result of that 20MB request and filter it
down to the most relevant bits.

Usage
--
```npm install```


