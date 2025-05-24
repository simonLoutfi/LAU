const { OpenAI } = require('openai');

// Replace with your actual API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // or put your key directly here (not recommended)
});

async function fetchDiseaseInfo(diseaseName) {
  let messages;

  if (diseaseName.toLowerCase().includes('healthy')) {
    messages = [
      { role: "system", content: "You are a helpful assistant who provides detailed information about plant health." },
      { role: "user", content: `Provide one paragraph of general information about the ${diseaseName} plant. Start the paragraph with the title 'General Information:'.` },
      { role: "user", content: `Provide one paragraph with tips and advice on how to optimize the growth and health of the ${diseaseName} plant, presented as bullet points. Start the paragraph with the title 'Growth Optimization Tips:'.` }
    ];
  } else {
    messages = [
      { role: "system", content: "You are a helpful assistant who provides detailed information about plant diseases." },
      { role: "user", content: `Provide one paragraph explaining what ${diseaseName} is and detailed information about this disease. Start the paragraph with the title 'Disease Overview:'.` },
      { role: "user", content: `Provide one paragraph discussing the reasons why ${diseaseName} manifests in plants. Start the paragraph with the title 'Causes:'.` },
      { role: "user", content: `Provide one paragraph with solutions or treatments to address ${diseaseName} in plants, presented as bullet points. Start the paragraph with the title 'Treatment and Management:'.` }
    ];
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-4o-mini" if enabled
      messages: messages
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Failed to fetch disease info.";
  }
}

module.exports = fetchDiseaseInfo;
