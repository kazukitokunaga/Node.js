module.exports = {
  ryan:{
    name: "Ryan Dahl",
    irc: "rhah",
    twitter: "ryah",
    github: ["ry", "joyent"],
    location: "San Francisco, USA",
    description: "Creator of node.js"
  }, isaac:{
    name: "Isaac Schlueter",
    irc:"isaacs",
    twitter: "izs",
    github: "isaacs",
    location: "San Francisco, USA",
    description: "Author of npm, core contributor"
  }, bert:{
    name: "Bert Belder",
    irc:function (){ return this.github },
    twitter: function (){ return this.github },
    github: "piscisaureus",
    location: "Netherlands",
    description: "Windows support, overall contributor"
  }, tj:{
    name: "TJ Holowaychuk",
    irc:"tjholowaychuk",
    twitter: "tjholowaychuk",
    github: "visionmedia",
    location: "Victoria, BC, Canada",
    description: "Author of express, jade and other popular modules"
  }, felix:{
    name: "Felix Geisendorfer",
    irc:"felixge",
    twitter: "felixge",
    github: "felixge",
    location: "Berlin, Germany",
    description: "Author of formidable, active core developer"
  },
};