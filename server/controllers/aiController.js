import axios from "axios";

export const processQuery = async (req, res) => {
  try {
    const {query} = req.body;
    if (!query) {
      return res.status(400).json({error: "Query text is required."});
    }

    // Call Mistral via OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free", // You can also try `mistralai/mixtral-8x7b-instruct`
        messages: [
          {
            role: "system",
            content:
              "You are a business intelligence analyst. Provide concise actionable insights based on business data queries.",
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${String(
            process.env.OPENROUTER_API_KEY
          ).trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // optional attribution
          "X-Title": "My Business Insights App", // optional attribution
        },
      }
    );

    // Extract response
    const insight =
      response.data.choices[0]?.message?.content?.trim() ||
      "No response received";

    res.json({insight});
  } catch (error) {
    console.error(
      "Mistral API error:",
      error.response?.status,
      error.response?.data
    );
    res.status(500).json({error: "Failed to process query"});
  }
};
