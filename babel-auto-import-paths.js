const config = require('./tsconfig.json')
function autoImportPaths () {
  const { paths, rootDir } = config.compilerOptions
  let objPath;     
	let result = [];
  let autoPath = {}
	for(objPath = paths; objPath !== null; objPath = Object.getPrototypeOf(objPath)){  
    let resultPaths = result.concat(Object.getOwnPropertyNames(objPath));
    for(const path of resultPaths){
      if(path.indexOf('@', 0) === 0){
        let value = paths[path][0].replace(/[.]+/g, '')
        value = value.replace(/[*]+/g, '')
        value = `./${rootDir}${value}`
        let index = path.replace(/[*]+/g, '')
        index = index.replace(/[/]+/g, '')
        autoPath = {
          ...autoPath,
          [index]:value
        }
      }
    }
  }
  return autoPath
}

module.exports = autoImportPaths