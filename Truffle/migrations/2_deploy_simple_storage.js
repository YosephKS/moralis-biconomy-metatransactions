const SimpleStorage = artifacts.require("SimpleStorage");
const biconomyForwarder = require("../list/biconomyForwarder.json");

module.exports = function (deployer, network) {
  const getBiconomyForwarderByNetwork = biconomyForwarder[network];
  if (getBiconomyForwarderByNetwork) {
    deployer.deploy(SimpleStorage, getBiconomyForwarderByNetwork);
  } else {
    console.log("No Biconomy Forwarder Found in the desired network!");
  }
};
