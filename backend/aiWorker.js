const { OpenAI } = require("openai");
const fs = require('fs');
require("dotenv").config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const prompt = `You are Gandalf the Lawyer, expert in digital privacy in middle earth, trained to analyze Terms of Service and Privacy Policies.

Your job is to:
1. Read and assess the following text of a Terms of Service or Privacy Policy.
2. Return all your explanations as if you were in middle earth. But ensure they are still understandable
3. Assign a grade using the ToS;DR system. Remember to err towards being harsh. If something has the potential to be big, treat it as such:
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
  "grade": "A | B | C | D | E",
  "summary": "Short paragraph justifying the grade.",
  "highlights": [
    {
      "clause": "Quoted clause text here.",
      "type": "Pro | Con", (ONLY ONE. NOT BOTH)
      "explanation": "Why this clause is notable."
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

    // if (response.output_text.startsWith("```json")) {
    //   response.output_text = response.output_text.slice(7, -4).trim();
    // }

    const response = {}
    const grades = ["A", "B", "C", "D", "E"];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    response.output_text = `{"grade":"${randomGrade}","highlights":[{"clause":"We may use session cookies (which expire once you close your web browser) and persistent cookies (which stay on your computer/device until you delete them) to better understand how you interact with the Site and our Services, to monitor aggregate usage by our users and web traffic routing on the Site, and to improve the Site and our Services.","explanation":"The service is clear about their use of cookies to improve user experience and understand site usage, showing a measure of transparency.","type":"Pro"},{"clause":"We will retain your personal information in a form that identifies you only for as long as it serves the purposes for which it was initially collected as stated in this Privacy Policy, subsequently authorized, or as allowed under applicable law.","explanation":"The policy lacks specific durations for how long personal data is kept, which leaves ambiguity—a true danger in privacy matters.","type":"Con"},{"clause":"In the event of a merger, dissolution, or similar corporate event or the sale of all or substantially all of our assets, we expect that the information that we have collected and/or received, including personal information, would be transferred to the surviving entity in a merger or to the acquiring entity.","explanation":"It is upfront about data transfer during corporate changes, a sign of transparency—though transfer itself can be perilous if not properly safeguarded.","type":"Pro"},{"clause":"Devpost is not directed at children under thirteen years of age, the Site does not knowingly accept registrations from children under thirteen years of age and we do not intend to collect any personal information from children under thirteen years of age.","explanation":"The policy states protections for children, aligning with Middle-earth laws to prevent harm to the young.","type":"Pro"},{"clause":"We may share and/or receive information with third-party analytics services, advertising providers, and remarketers, which may use cookies and other technologies to track your activity visits across the realms.","explanation":"It admits to sharing data with many third parties for analytics and advertising, a potential risk for privacy, especially because opt-out options are complicated and not fully clear.","type":"Con"}],"summary":"In the realm of Middle earth, this scrolls’ words reveal a service that is somewhat transparent in its dealings but harbors shadows that could threaten the rights of its users. While it mentions data collection, third-party sharing, and security measures, the provisions are common and carry potential risks, especially regarding data transfer and privacy shields. The threats and uncertainties, especially around data handling and third-party analytics, place this scroll firmly in the average zone, with room for improvement to truly respect the privacy of those who venture into its domain.","url":"https://info.devpost.com/legal/privacy-policy"}`

    
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