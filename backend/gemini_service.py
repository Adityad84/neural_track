import os
import google.generativeai as genai
import json

# Configure Gemini
# Ensure GEMINI_API_KEY is set in environment variables
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-pro')

def analyze_defect(defect_type, confidence, location_info):
    """
    Uses Gemini to analyze the defect and provide resolution steps.
    """
    prompt = f"""
    You are a Railway Safety Expert. A defect has been detected on the track.
    
    Details:
    - Defect Type: {defect_type}
    - Confidence: {confidence}%
    - Location: {location_info}
    
    Please provide a strict JSON response with the following keys:
    - "root_cause": Possible reasons for this defect.
    - "severity": "Low", "High", or "Critical".
    - "immediate_action": What needs to be done immediately?
    - "resolution_steps": Step-by-step maintenance/repair instructions.
    - "preventive_recommendations": How to prevent this in the future.
    
    Do not output markdown code blocks, just raw JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        # basic cleanup for json
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return {
            "root_cause": "Analysis failed",
            "severity": "Unknown",
            "immediate_action": "Inspect manually",
            "resolution_steps": "N/A",
            "preventive_recommendations": "N/A"
        }
