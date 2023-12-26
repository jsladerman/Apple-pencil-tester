# Apple Pencil Tester

This is a simple (not super pretty) app to test the Apple Pencil on an iPad. Should theoretically work with other similar styluses/tablets but I've only tested this setup so far.

The circle grows as more force is applied. The line acts as the pencil's shadow. Actual values displayed on the side.

To run:

1. Compile TypeScript: `tsc --watch`

2. Start a local server (I've been using live-server for hot reloading but any simple server will do):

   - Install with: `npm i -g live-server`
   - Run with: `live-server`

3. Go to computer's local IP:port in the tablet browser (e.g. `http://192.168.1.254:8080`) assuming they are on the same network
