//Install express server
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/page-manager-webapp-frontend'));
app.get('/*', function (req, res) {
  res.sendFile('index.html', {root: 'dist/page-manager-webapp-frontend/'}
  );
});
app.listen(process.env.PORT || 8080);
