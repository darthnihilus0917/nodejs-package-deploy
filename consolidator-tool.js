const readline = require("readline");

const { chains, processes, salesType } = require('./lib/options/options.js');
const { loadTitle } = require('./lib/utils/utils.js');
const { appLabels } = require('./lib/contants/contants.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question, options) {
  return new Promise((resolve, reject) => {
    const numberedOptions = options.map(
      (option, index) => `[${index + 1}] ${option}`
    );
    rl.question(question + "\n" + numberedOptions.join("\n") + "\n", (answer) => {
            const selectedOption = options[parseInt(answer) - 1];
            if (selectedOption) {
                resolve(selectedOption.toUpperCase());
            } else {
                console.log(appLabels.invalidAnswer);
                askQuestion(question, options).then(resolve).catch(reject);
            }
        }
    );
  });
}

async function main() {
  try {
    let store = "";

    while (store !== "EXIT") {
        const storeOptions = chains;

        loadTitle();
        
        store = await askQuestion("Select A Concessionaire:", storeOptions);

        if (store === "EXIT") {
            const confirmation = await askQuestion(appLabels.confirmExit,["Yes", "No"]);
            if (confirmation === "NO") {
                store = ""; // Reset store to continue the loop
                continue;
            }
            console.log(appLabels.closingApp);
            rl.close();
            return;
        }

        console.log('\nYou selected:', store);

        let actions = processes;

        if (store === "ROBINSON") {
            actions = actions.filter((action) => action !== "BUILD RAW DATA");
        }

        let action = "";
        while (action !== "EXIT") {
            action = await askQuestion("\nWhat do you want to do?", actions);

            if (action === "EXIT") {
                const confirmation = await askQuestion(appLabels.confirmExit, ["Yes", "No"]);
                if (confirmation === "NO") {
                    action = ""; // Reset action to continue the loop
                    continue;
                }
                console.log(appLabels.closingApp);
                rl.close();
                return;
            }
            console.log('\nYou selected:', action);

            if (action === "CANCEL") {
                break; // break to go back to store selection
            }

            if (action === "CONSOLIDATE") {
                console.log(appLabels.consolidationMsg);
                break; // break to go back to store selection
            }

            if (action === "BUILD RAW DATA") {
                console.log(appLabels.rawDataMsg);
                const continueProcessing = await askQuestion(`\n${appLabels.confirmProcessing}`, ['Yes', 'No']);
                if (continueProcessing === 'YES') {
                    break; // break to go back to store selection
                } else {
                    console.log(appLabels.closingApp);
                    rl.close();
                    return;
                }
            }

            if (action === "GENERATE CHAIN OUTPUT DATA" && store !== "ROBINSON") {
                console.log(`${store} - ${appLabels.chainMsg}`);
            }

            if (action === "GENERATE CHAIN OUTPUT DATA" && store === "ROBINSON") {
                const salesTypeOptions = salesType;
                const salesTypeOutput = await askQuestion("Select Sales Type:", salesTypeOptions);
                if (salesTypeOutput === "RETAIL" || salesTypeOutput === "E-COMM") {
                    console.log("\nYou selected:", salesTypeOutput);
                    console.log(`${store}: ${salesTypeOutput} - ${appLabels.chainMsg}`);
                    break;
                } else if (salesType === "CANCEL") {
                    console.log("You selected:", salesType);
                    break;
                }                
            }
      }
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    rl.close();
  }
}

main();
