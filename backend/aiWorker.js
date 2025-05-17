const { OpenAI } = require("openai");
require("dotenv").config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

module.exports= {
    runAI: async function(input="Write a one-sentence bedtime story about a unicorn.") {
    const response = await client.responses.create({
        model: "gpt-4.1-nano",
        input: input
    });
    
    console.log(response.output_text);
    return(response)
}}