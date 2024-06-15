// train.js
const { NlpManager } = require('node-nlp');
const fs = require('fs');

const manager = new NlpManager({ languages: ['en'] });

const files = fs.readdirSync('./intents');
for (const file of files) {
    const data = JSON.parse(fs.readFileSync(`./intents/${file}`));
    const intent = file.replace('.json', '');
    for (const question of data.questions) {
        manager.addDocument('en', question, intent);
    }
    for (const answer of data.answers) {
        manager.addAnswer('en', intent, answer);
    }
}

async function train_save() {
    await manager.train();
    manager.save();  // Save the model to model.nlp
}

train_save();
