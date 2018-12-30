module.exports = {
  ryan:{
    name: "Ryan Dahl",
    irc: "rhah",
    twitter: "ryah",
    github: "ry",
    location:{'$': {city: 'San Francisco',country: 'USA' }},
    description: "Creator of node.js"
  }, isaac:{
    name: "Isaac Schlueter",
    irc:"isaacs",
    twitter: "izs",
    github: "isaacs",
    location:{'$': {city: 'San Francisco',country: 'USA' }},
    description: "Author of npm, core contributor"
  }, bert:{
    name: "Bert Belder",
    irc:"piscisaureus",
    twitter: "piscisaureus",
    github: "piscisaureus",
    location:{'$': { country: 'Netherlands' }},
    description: "Windows support, overall contributor"
  }, tj:{
    name: "TJ Holowaychuk",
    irc:"tjholowaychuk",
    twitter: "tjholowaychuk",
    github: "visionmedia",
    location:{'$': {city: 'Victoria',country: 'Canada' }},
    description: "Author of express, jade and other popular modules",
    region: {'_':'British Columbia', '$':{type: 'province'}}
  }, felix:{
    name: "Felix Geisendorfer",
    irc:"felixge",
    twitter: "felixge",
    github: "felixge",
    location:{'$': {city: 'Berlin',country: 'Germany' }},
    description: "Author of formidable, active core developer"
  },
};