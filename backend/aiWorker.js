const { OpenAI } = require("openai");
const fs = require('fs');
require("dotenv").config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const prompt = `You are an expert in digital privacy, trained to analyze Terms of Service and Privacy Policies.

Your job is to:
1. Read and assess the following text of a Terms of Service or Privacy Policy.
2. Assign a grade using the ToS;DR system. Remember to err towards being harsh. If something has the potential to be big, treat it as such:
   - A = Very good (transparent, respects user rights)
   - B = Good (minor issues, mostly user-friendly)
   - C = Average (common but mildly problematic clauses)
   - D = Poor (many concerning clauses)
   - E = Very poor (major rights or privacy concerns)

Here are some possible checklist:


Before we assign a class to a service, we should check whether the following topics have been covered:

    Does the service use first-party and/or third-party cookies?
    Can they change the terms at any time?
    Do they claim copyright (or what sort of license) over your content (where applicable)?
    Do you have a right to leave the service?
    Can you export your data (where applicable)?
    How do they work with third parties (contractors they use)?
    How do they work with government requests?
    How do they handle decisions about suspension of your account when they feel you breached the terms?
    Do they (try to) prohibit you from going to court against them?
    What happens to your data when they get acquired or when they shut down the service?
    How long do they keep your private data and what do they use it for?

3. Extract up to 5 key clauses and label each as a “Pro” or “Con”, with a short explanation.

Respond ONLY in the following JSON format in plaintext with exactly these keys:

{
  "Grade": "A | B | C | D | E",
  "Summary": "Short paragraph justifying the grade.",
  "Highlights": [
    {
      "Clause": "Quoted clause text here.",
      "Type": "Pro | Con",
      "Explanation": "Why this clause is notable."
    }
  ]
}
`;

module.exports= {
    runAI: async function(tos) {
    // const response = await client.responses.create({
    //     model: "gpt-4.1-nano",
    //     input: prompt + tos
    // });

    const response = {}
    response.output_text = `{ "Grade": "B", "Summary": "The policy provides a generally transparent overview of its services and user responsibilities, with clear consent clauses and enforcement rights. However, some clauses could be more explicit about data privacy practices and user rights, especially regarding the handling of user content and personal data. Overall, it is mostly user-friendly but leaves certain areas, such as data sharing and rights management, mildly ambiguous.", "Highlights": [ { "Clause": "You grant to us an irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully paid, worldwide license (with the right to sublicense) to use, copy, transmit, reproduce, adapt, modify, publicly perform, publicly display, reformat, translate, excerpt (in whole or or in part), create collective works and derivative works, and distribute your User Content for any purpose, commercial, advertising, or otherwise, in any media or distribution method (now known or later developed).", "Type": "Con", "Explanation": "This clause grants broad, indefinite rights to Devpost over user content, which could potentially undermine user control without explicit opt-out options." }, { "Clause": "Devpost will not have any ownership rights over your User Content. However, Devpost needs the... licenses to operate the Site and perform and market the Service on your behalf, on behalf of our other Users, and on our own behalf.", "Type": "Pro", "Explanation": "Clearly states user retention of ownership while granting necessary licenses, which supports transparency regarding rights over user content." }, { "Clause": "Devpost reserves the right to suspend or terminate any User account, and to reclaim or re-assign usernames without any liability to you.", "Type": "Pro", "Explanation": "Provides essential rights for account management, with a transparent approach to username reclamation and account suspension." }, { "Clause": "We reserve the right to revise this Agreement at any time by posting an update to the Site. Your continued use indicates acceptance of changes.", "Type": "Pro", "Explanation": "Clarifies the process and implication of policy updates, ensuring users are aware that their ongoing use constitutes acceptance." }, { "Clause": "We disclaim all warranties, including, without limitation, warranties of title, merchantability, fitness for a particular purpose, non-infringement of third parties’ rights and any warranties arising from a course of dealing, course of performance, or usage of trade.", "Type": "D", "Explanation": "Limits liability broadly and may be concerning for users seeking remedies, as it minimizes Devpost's accountability for content and service issues." } ] }`
    
    console.log(response.output_text);
    return(response)
    },

    getTextTos: function(){
      fs.readFile('testTos.txt', 'utf8', (err, data) => {
        if (err) {
          console.error("An error occurred:", err);
          return;
        }
        const fileContents = data;
        // console.log(fileContents);
        return(fileContents)
      });
    }
}