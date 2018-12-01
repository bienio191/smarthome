
var strMapToObj = (strMap) => {
    var obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
};

module.exports = {
    strMapToObj
}