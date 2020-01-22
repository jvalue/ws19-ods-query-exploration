const testJson = {
  uuid: "47174d8f-1b8e-4599-8a59-b580dd55bc87",
  number: "48900237",
  shortname: "EITZE",
  longname: "EITZE",
  km: 9.56,
  agency: "WSA VERDEN",
  longitude: 9.27676943537587,
  latitude: 52.90406541008721,
  water: {
    shortname: "ALLER",
    longname: "ALLER"
  }
};

extractOntologyFromObject({ name: "root" }, testJson);

function extractOntologyFromObject(node, data) {
  var keys = Object.keys(data);
  keys.forEach(element => {
    console.log(typeof data[element]);
  });
}
