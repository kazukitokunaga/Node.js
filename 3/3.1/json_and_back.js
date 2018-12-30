var profiles = require('./profiles'); // .js拡張子はオプション

// JSON.stringifyは、JSONを文字列に変換する
profiles = JSON.stringify(profiles).replace(/name/g, 'fullname');

// JSON.parseは文字列をオブジェクトに変換する
profiles = JSON.parse(profiles);
profiles.felix.fullname = "Felix Geisendörfer"
console.log(profiles.felix);

