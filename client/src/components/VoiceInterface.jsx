import React, {useState} from "react";
import {Box, Button, TextField, Typography, Paper} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import {useSpeechSynthesis, useSpeechRecognition} from "react-speech-kit";

const VoiceInterface = ({onInsightReceived}) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const {speak} = useSpeechSynthesis();
  const {listen, stop} = useSpeechRecognition({
    onResult: (result) => {
      setQuery(result);
      setIsListening(false);
    },
  });

  const processQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/ai/query`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({query}),
        }
      );

      const data = await response.json();
      setResponse(data);

      if (onInsightReceived && data.insight) {
        onInsightReceived(data.insight);
      }

      // Speak the response
      if (data.insight) {
        speak({text: data.insight});
      }
    } catch (error) {
      console.error("Query processing error:", error);
      const errorMessage =
        "Sorry, I encountered an error processing your query.";
      setResponse({insight: errorMessage});

      if (onInsightReceived) {
        onInsightReceived(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stop();
      setIsListening(false);
    } else {
      listen();
      setIsListening(true);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        m: 2,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "0.75rem",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        🎤 Ask DataWhisper Anything
      </Typography>

      {/* Quick Suggestions */}
      <Box sx={{mb: 3}}>
        <Typography variant="subtitle2" sx={{color: "#aaa", mb: 1}}>
          💡 Try asking:
        </Typography>
        <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
          {[
            "What are our top selling products?",
            "Show me sales trends",
            "Which region performs best?",
            "How can we improve revenue?",
          ].map((suggestion, idx) => (
            <Button
              key={idx}
              variant="outlined"
              size="small"
              onClick={() => setQuery(suggestion)}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {suggestion}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{display: "flex", gap: 2, mb: 2}}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about your business data..."
          variant="outlined"
          onKeyPress={(e) => e.key === "Enter" && processQuery()}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2196F3",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.6)",
              opacity: 1,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleVoiceInput}
          disabled={loading}
          sx={{
            minWidth: "60px",
            backgroundColor: isListening ? "#f44336" : "#2196F3",
            "&:hover": {
              backgroundColor: isListening ? "#d32f2f" : "#1976d2",
            },
            animation: isListening ? "pulse 1s infinite" : "none",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0 0 0 0 rgba(33, 150, 243, 0.7)",
              },
              "70%": {
                boxShadow: "0 0 0 10px rgba(33, 150, 243, 0)",
              },
              "100%": {
                boxShadow: "0 0 0 0 rgba(33, 150, 243, 0)",
              },
            },
          }}
        >
          <MicIcon />
        </Button>
        <Button
          variant="contained"
          onClick={processQuery}
          disabled={loading}
          sx={{
            minWidth: "60px",
            backgroundColor: "#4caf50",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
        >
          {loading ? "..." : <SendIcon />}
        </Button>
      </Box>

      {response && (
        <Paper
          sx={{
            p: 2.5,
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            borderRadius: "0.55rem",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#4caf50",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
          </Typography>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.6,
            }}
          >
            {response.insight}
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default VoiceInterface;
