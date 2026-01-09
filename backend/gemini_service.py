import os
import google.generativeai as genai
import json

# Configure Gemini
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
    - "root_cause": Possible reasons for this defect (2-3 sentences).
    - "severity": MUST be EXACTLY one of: "Low", "High", or "Critical" (nothing else).
    - "immediate_action": What needs to be done immediately? (1-2 sentences)
    - "resolution_steps": Step-by-step maintenance/repair instructions (3-5 steps).
    - "preventive_recommendations": How to prevent this in the future (2-3 points).
    
    IMPORTANT: For severity, use ONLY these exact values: "Low", "High", or "Critical"
    - Use "Critical" for: Major structural damage, complete rail breaks, severe track misalignment
    - Use "High" for: Significant wear, partial damage, safety concerns requiring prompt attention
    - Use "Low" for: Minor wear, cosmetic issues, routine maintenance items
    
    Do not output markdown code blocks, just raw JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        # Basic cleanup for json
        text = response.text.strip()
        
        # Remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        
        if text.endswith("```"):
            text = text[:-3]
            
        text = text.strip()
        
        # Parse JSON
        analysis = json.loads(text)
        
        # Normalize severity to ensure it's one of the expected values
        severity = analysis.get("severity", "Medium").strip()
        
        # Map various possible responses to our standard values
        severity_lower = severity.lower()
        if severity_lower in ["critical", "severe", "very high", "urgent"]:
            analysis["severity"] = "Critical"
        elif severity_lower in ["high", "significant", "medium-high"]:
            analysis["severity"] = "High"
        elif severity_lower in ["low", "minor", "minimal"]:
            analysis["severity"] = "Low"
        elif severity_lower in ["medium", "moderate"]:
            # Default medium to High for safety
            analysis["severity"] = "High"
        else:
            # If we get something unexpected, default to High for safety
            analysis["severity"] = "High"
        
        return analysis
        
    except json.JSONDecodeError as je:
        print(f"JSON parsing error: {je}")
        print(f"Raw response: {text}")
        return {
            "root_cause": "Unable to parse Gemini response",
            "severity": "High",
            "immediate_action": "Manual inspection required",
            "resolution_steps": "Contact railway maintenance team for detailed assessment",
            "preventive_recommendations": "Regular track inspections recommended"
        }
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return {
            "root_cause": "Analysis failed due to API error",
            "severity": "High",
            "immediate_action": "Inspect manually as precaution",
            "resolution_steps": "Contact railway maintenance team immediately",
            "preventive_recommendations": "Ensure monitoring system is functioning correctly"
        }