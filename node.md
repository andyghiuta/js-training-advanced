# What is Node.js
Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside the browser.

	- Runs on Chrome's V8 JavaScript engine
	- Uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.
	- JavaScript is single thread and so is Node.

## cluster
https://nodejs.org/api/cluster.html#cluster_how_it_works

# Package manager
[NPM](https://www.npmjs.com/)	- "world's largest software registry"

	- When you install Node.js, npm is installed too. 
	- You can update npm independently of node


# Node Event Loop
![node-event-loop](https://cdn-images-1.medium.com/max/2000/1*fBOm10njasRdooZsSHXkGw.png)

# Releases
![node-releases](https://raw.githubusercontent.com/nodejs/Release/master/schedule.png)

# Common commands

	- `npm init` - Initialize a new project
	- `npm install package-name [--save|--save-dev]` - Install a package. Optionally save it in `package.json`
	- `npm start` - Runs the `main` script (from `package.json`)
	- `npm run script-name` - Execute a script defined in `scripts` (from `package.json`)

# Frameworks

	- Express
	- hapi

# Testing

	- Mocha
	- Chai
	- Jest

### Resources 
- [1](https://codeburst.io/the-only-nodejs-introduction-youll-ever-need-d969a47ef219)
- [2](https://medium.freecodecamp.org/what-exactly-is-node-js-ae36e97449f5)
- [Best Practices](https://devcenter.heroku.com/articles/node-best-practices#use-a-smart-npmrc)
- [Web Developer Roadmap](https://codeburst.io/the-2018-web-developer-roadmap-826b1b806e8d)
- https://www.sitepoint.com/understanding-module-exports-exports-node-js/
