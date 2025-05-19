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
  "grade": "A | B | C | D | E",
  "summary": "Short paragraph justifying the grade.",
  "highlights": [
    {
      "clause": "Quoted clause text here.",
      "type": "Pro | Con",
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

    const response = {}
    const grades = ["A", "B", "C", "D", "E"];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    response.output_text = `{"grade":"${randomGrade}","summary":"The document exhibits numerous concerning clauses, including broad license grants of user content, binding arbitration and class action waivers that limit legal rights, and insufficient transparency about data retention and third-party data sharing. While it contains some acknowledgment of user responsibility and property rights, it heavily favors the platform with little regard for user privacy or control. Overall, the policy raises significant privacy and rights issues, earning a D grade.","highlights":[{"clause":"You grant to us an irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully paid, worldwide license (with the right to sublicense) to use, copy, transmit, reproduce, adapt, modify, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), create collective works and derivative works, and distribute your User Content for any purpose, commercial, advertising, or otherwise, in any media or distribution method (now known or later developed).","type":"Con","explanation":"This broad license grants the platform extensive rights over user content without control or compensation, risking loss of user rights."},{"clause":"In the event of a dispute arising under or relating to this Agreement, either party may elect to finally and exclusively resolve the dispute by binding arbitration governed by the Federal Arbitration Act ('FAA'). Any election to arbitrate, at any time, shall be final and binding on the other party. IF EITHER PARTY CHOOSES ARBITRATION, NEITHER PARTY SHALL HAVE THE RIGHT TO LITIGATE SUCH CLAIM IN COURT OR TO HAVE A JURY TRIAL.","type":"Con","explanation":"This clause forces users into arbitration and waives their right to a court trial or class actions, limiting legal recourse, which many would find unfair."},{"clause":"You agree that any arbitration or proceeding shall be limited to the Dispute between us and you individually. To the full extent permitted by law, (i) no arbitration or proceeding shall be joined with any other; (ii) there is no right or authority for any Dispute to be arbitrated or resolved on a class action-basis or to utilize class action procedures; and (iii) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons. YOU AGREE THAT YOU MAY BRING CLAIMS AGAINST US ONLY IN YOUR INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.","type":"Con","explanation":"This class action waiver prevents users from banding together to seek collective legal remedies, limiting user rights significantly."},{"clause":"The Site contains various information in the form of data, text, graphics, and other materials from Devpost and our third party licensors (the “Devpost Content”). You acknowledge that this Site and various elements contained therein are protected by Intellectual Property Rights, and that these worldwide rights are valid and protected in all forms, media, and technologies existing now and hereinafter developed. You also acknowledge that the Devpost Content is and shall remain the property of Devpost or its licensors. You agree to comply with all intellectual property laws and you shall not encumber any interest in, or assert any rights to, the Devpost Content.","type":"Pro | Con","explanation":"While it protects proprietary content, it also emphasizes platform ownership, potentially restricting user use of platform materials."},{"clause":"Devpost will not have any ownership rights over your User Content. However, Devpost needs the following licenses to operate the Site and perform and market the Service on your behalf, on behalf of our other Users, and on our own behalf. ... You grant to us an irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully paid, worldwide license (with the right to sublicense) to use, copy, transmit, reproduce, adapt, modify, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), create collective works and derivative works, and distribute your User Content for any purpose, commercial, advertising, or otherwise, in any media or distribution method (now known or later developed).","type":"Con","explanation":"This license grants the platform extensive rights over user content, with limited scope for user control over their own data and creations."},{"clause":"This Agreement shall be governed by the internal substantive laws of the State of New York, without respect to its conflict of laws principles. Disputes shall be resolved exclusively by courts located in New York County, New York.","type":"Con","explanation":"The choice of jurisdiction may be burdensome for international users, limiting their ability to seek redress under local laws."}]}`

    
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